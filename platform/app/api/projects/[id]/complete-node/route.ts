import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNodeConfig } from "@/configs/steps";
import { evaluateCompletion } from "@/lib/ai/evaluator";
import { summarizeConversation } from "@/lib/ai/context-builder";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { stepNumber, nodeId } = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未登录" }, { status: 401 });
    }

    const nodeConfig = getNodeConfig(stepNumber, nodeId);
    if (!nodeConfig) {
      return Response.json({ error: "节点配置不存在" }, { status: 400 });
    }

    // For conversation-type nodes, evaluate conversation quality
    let evaluation = null;

    if (nodeConfig.completionCriteria.type === "ai_evaluation") {
      // Load conversation history
      const { data: conversations } = await supabase
        .from("conversations")
        .select("role, content")
        .eq("project_id", projectId)
        .eq("step_number", stepNumber)
        .eq("node_id", nodeId)
        .order("created_at");

      const conversationText = (conversations || [])
        .map((c) => `${c.role === "user" ? "学生" : "AI"}：${c.content}`)
        .join("\n\n");

      // Get student grade
      const { data: profile } = await supabase
        .from("users")
        .select("grade")
        .eq("auth_id", user.id)
        .single();

      evaluation = await evaluateCompletion({
        content: conversationText,
        criteria: nodeConfig.aiConfig.evaluationCriteria,
        threshold: nodeConfig.completionCriteria.threshold || 0.6,
        studentGrade: profile?.grade,
      });

      if (!evaluation.passed) {
        return Response.json({
          success: false,
          evaluation,
          message: "还需要继续完善哦！" + evaluation.summary,
        });
      }
    }

    // Mark node completed
    await supabase
      .from("step_progress")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("project_id", projectId)
      .eq("step_number", stepNumber)
      .eq("node_id", nodeId);

    // Auto-generate deliverable if configured
    if (nodeConfig.deliverable?.autoGenerate) {
      const { data: conversations } = await supabase
        .from("conversations")
        .select("role, content")
        .eq("project_id", projectId)
        .eq("step_number", stepNumber)
        .eq("node_id", nodeId)
        .order("created_at");

      const convMessages = (conversations || []).map((c) => ({
        role: c.role,
        content: c.content,
      }));

      // Use AI to generate a proper deliverable document
      let generatedDoc = "";
      const purposeMap: Record<string, string> = {
        problem_selection: "问题筛选分析报告，包含对每个候选问题的分析和最终选择的理由",
        problem_description: "问题描述文档，包含问题背景、影响人群、现状分析和学生的思考",
      };

      const purpose = purposeMap[nodeConfig.deliverable.type] || "文档摘要";

      try {
        generatedDoc = await summarizeConversation(convMessages, purpose);
      } catch {
        generatedDoc = convMessages
          .filter((c) => c.role === "user")
          .map((c) => c.content)
          .join("\n");
      }

      await supabase.from("deliverables").insert({
        project_id: projectId,
        step_number: stepNumber,
        node_id: nodeId,
        type: nodeConfig.deliverable.type,
        title: nodeConfig.title,
        content: {
          document: generatedDoc,
          conversations: conversations || [],
        },
        status: "draft",
      });
    }

    // Advance to next node
    const parts = nodeId.split(".");
    const nodeNum = parseInt(parts[1]);
    const nextNodeId = `${stepNumber}.${nodeNum + 1}`;
    const nextNodeConfig = getNodeConfig(stepNumber, nextNodeId);

    if (nextNodeConfig) {
      await supabase
        .from("step_progress")
        .upsert({
          project_id: projectId,
          step_number: stepNumber,
          node_id: nextNodeId,
          status: "in_progress",
          started_at: new Date().toISOString(),
        }, { onConflict: "project_id,step_number,node_id" });

      await supabase
        .from("projects")
        .update({ current_node: nextNodeId })
        .eq("id", projectId);

      return Response.json({
        success: true,
        evaluation,
        nextNode: { stepNumber, nodeId: nextNodeId },
      });
    }

    // Advance to next step
    const nextStep = stepNumber + 1;
    if (nextStep <= 11) {
      const nextStepFirstNode = `${nextStep}.1`;
      await supabase
        .from("step_progress")
        .upsert({
          project_id: projectId,
          step_number: nextStep,
          node_id: nextStepFirstNode,
          status: "in_progress",
          started_at: new Date().toISOString(),
        }, { onConflict: "project_id,step_number,node_id" });

      await supabase
        .from("projects")
        .update({ current_step: nextStep, current_node: nextStepFirstNode })
        .eq("id", projectId);

      return Response.json({
        success: true,
        evaluation,
        nextNode: { stepNumber: nextStep, nodeId: nextStepFirstNode },
      });
    }

    // Project complete
    await supabase
      .from("projects")
      .update({ status: "completed" })
      .eq("id", projectId);

    return Response.json({
      success: true,
      evaluation,
      nextNode: null,
      projectComplete: true,
    });
  } catch {
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}
