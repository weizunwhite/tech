import { getNodeConfig } from "@/configs/steps";
import type { NodeConfig } from "@/types/step-config";
import { chat } from "./client";

export interface AIContext {
  systemPrompt: string;
  projectInfo: {
    title: string | null;
    currentStep: number;
    currentNode: string;
    studentGrade: number | null;
  };
  previousDeliverables: Array<{ title: string; content: Record<string, unknown> }>;
  currentConversation: Array<{ role: "user" | "assistant"; content: string }>;
  nodeConfig: NodeConfig;
}

export function buildContext(params: {
  stepNumber: number;
  nodeId: string;
  projectTitle?: string | null;
  studentGrade?: number | null;
  previousDeliverables?: Array<{ title: string; content: Record<string, unknown> }>;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  previousFormData?: Record<string, unknown> | null;
  selectedProblem?: string | null;
}): AIContext | null {
  const nodeConfig = getNodeConfig(params.stepNumber, params.nodeId);
  if (!nodeConfig) return null;

  let systemPrompt = nodeConfig.aiConfig.systemPrompt;

  // Inject student grade for language adaptation
  if (params.studentGrade) {
    systemPrompt += `\n\n学生信息：${params.studentGrade}年级学生。请根据该年龄段调整你的语言复杂度。`;
  }

  // Inject previous deliverables summary
  if (params.previousDeliverables && params.previousDeliverables.length > 0) {
    systemPrompt += `\n\n该学生之前的工作成果：\n`;
    params.previousDeliverables.forEach((d) => {
      systemPrompt += `- ${d.title}: ${JSON.stringify(d.content).slice(0, 500)}\n`;
    });
  }

  // Node 1.2: inject observations from 1.1
  if (params.nodeId === "1.2" && params.previousFormData) {
    const observations = (params.previousFormData as { observations?: Array<{ scene: string; who: string; problem: string; current_solution: string }> })?.observations;
    if (observations && observations.length > 0) {
      systemPrompt += `\n\n学生在上一步"生活观察"中提交的问题列表：\n`;
      observations.forEach((obs, i) => {
        systemPrompt += `\n问题${i + 1}：\n`;
        systemPrompt += `- 场景：${obs.scene}\n`;
        systemPrompt += `- 遇到问题的人：${obs.who}\n`;
        systemPrompt += `- 具体问题：${obs.problem}\n`;
        systemPrompt += `- 现有解决方案：${obs.current_solution}\n`;
      });
      systemPrompt += `\n请逐个分析这些问题，按真实性、普遍性、可行性、创新空间四个维度给出你的看法，然后引导学生做出选择。`;
    }
  }

  // Node 1.3: inject selected problem from 1.2
  if (params.nodeId === "1.3" && params.selectedProblem) {
    systemPrompt += `\n\n学生在"问题筛选"环节选定的问题：\n${params.selectedProblem}\n`;
    systemPrompt += `\n请围绕这个问题进行深入引导对话。`;
  }

  // Context window management: summarize if conversation is too long
  let conversation = params.conversationHistory || [];
  if (conversation.length > 20) {
    conversation = compressConversation(conversation);
  }

  return {
    systemPrompt,
    projectInfo: {
      title: params.projectTitle || null,
      currentStep: params.stepNumber,
      currentNode: params.nodeId,
      studentGrade: params.studentGrade || null,
    },
    previousDeliverables: params.previousDeliverables || [],
    currentConversation: conversation,
    nodeConfig,
  };
}

/**
 * Compress long conversations: keep last 10 turns full,
 * summarize earlier turns into a brief recap.
 */
function compressConversation(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Array<{ role: "user" | "assistant"; content: string }> {
  const keepCount = 10;
  const early = messages.slice(0, messages.length - keepCount);
  const recent = messages.slice(messages.length - keepCount);

  // Build a summary of early messages
  const earlyText = early
    .map((m) => `${m.role === "user" ? "学生" : "AI"}：${m.content.slice(0, 100)}`)
    .join("\n");

  const summary: Array<{ role: "user" | "assistant"; content: string }> = [
    {
      role: "assistant",
      content: `[前面的对话摘要]\n${earlyText}\n[摘要结束，以下是最近的对话]`,
    },
    ...recent,
  ];

  return summary;
}

/**
 * Summarize conversation asynchronously using AI (for deliverable generation).
 */
export async function summarizeConversation(
  messages: Array<{ role: string; content: string }>,
  purpose: string
): Promise<string> {
  const conversationText = messages
    .map((m) => `${m.role === "user" ? "学生" : "AI"}：${m.content}`)
    .join("\n\n");

  const response = await chat({
    systemPrompt: `你是一个文档助手。请根据以下对话记录，提取学生的核心观点和内容，生成一段${purpose}。
要求：
- 保持学生自己的语言风格
- 不要添加学生没有表达的内容
- 300-500字`,
    messages: [{ role: "user", content: conversationText }],
    temperature: 0.3,
  });

  return response;
}
