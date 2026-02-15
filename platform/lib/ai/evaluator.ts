import { chat } from "./client";
import type { EvaluationCriteria } from "@/types/step-config";

export interface EvaluationResult {
  passed: boolean;
  overallScore: number;
  dimensions: {
    dimension: string;
    score: number;
    feedback: string;
  }[];
  summary: string;
}

export async function evaluateCompletion(params: {
  content: string;
  criteria: EvaluationCriteria[];
  threshold: number;
  studentGrade?: number | null;
}): Promise<EvaluationResult> {
  const { content, criteria, threshold, studentGrade } = params;

  const criteriaDesc = criteria
    .map(
      (c) =>
        `- ${c.dimension}（权重${c.weight}）：${c.description}`
    )
    .join("\n");

  const gradeContext = studentGrade
    ? `\n评估标准应适合${studentGrade}年级学生的水平。`
    : "";

  const systemPrompt = `你是科创项目评估专家。请评估学生的以下内容，按维度打分（0-1分）。

评估维度：
${criteriaDesc}
${gradeContext}

严格按以下 JSON 格式回复，不要添加任何其他文字：
{
  "dimensions": [
    {"dimension": "维度名", "score": 0.8, "feedback": "简短评价"}
  ],
  "summary": "总体评价，50字以内，用鼓励的语气"
}`;

  try {
    const response = await chat({
      systemPrompt,
      messages: [
        {
          role: "user",
          content: `请评估以下内容：\n\n${content}`,
        },
      ],
      temperature: 0.3,
    });

    // Parse AI response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return defaultResult(criteria, threshold);
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Calculate weighted score
    let totalScore = 0;
    let totalWeight = 0;

    const dimensions = (parsed.dimensions || []).map(
      (d: { dimension: string; score: number; feedback: string }) => {
        const criterion = criteria.find((c) => c.dimension === d.dimension);
        const weight = criterion?.weight || 1 / criteria.length;
        totalScore += d.score * weight;
        totalWeight += weight;
        return {
          dimension: d.dimension,
          score: Math.min(1, Math.max(0, d.score)),
          feedback: d.feedback || "",
        };
      }
    );

    const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;

    return {
      passed: overallScore >= threshold,
      overallScore: Math.round(overallScore * 100) / 100,
      dimensions,
      summary: parsed.summary || "评估完成",
    };
  } catch {
    return defaultResult(criteria, threshold);
  }
}

function defaultResult(
  criteria: EvaluationCriteria[],
  threshold: number
): EvaluationResult {
  return {
    passed: true,
    overallScore: threshold,
    dimensions: criteria.map((c) => ({
      dimension: c.dimension,
      score: threshold,
      feedback: "自动通过",
    })),
    summary: "内容已记录，继续加油！",
  };
}
