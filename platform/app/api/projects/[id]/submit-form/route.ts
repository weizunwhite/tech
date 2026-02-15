import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getNodeConfig } from "@/configs/steps";
import { evaluateCompletion } from "@/lib/ai/evaluator";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { stepNumber, nodeId, formType, data } = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未登录" }, { status: 401 });
    }

    // Save form submission
    const { error: submitError } = await supabase
      .from("form_submissions")
      .insert({
        project_id: projectId,
        step_number: stepNumber,
        node_id: nodeId,
        form_type: formType,
        data,
      });

    if (submitError) {
      return Response.json({ error: "保存失败" }, { status: 500 });
    }

    // Get node config for evaluation
    const nodeConfig = getNodeConfig(stepNumber, nodeId);
    let evaluation = null;

    if (
      nodeConfig?.completionCriteria.type === "ai_evaluation" &&
      nodeConfig.aiConfig.evaluationCriteria.length > 0
    ) {
      // Load student grade
      const { data: profile } = await supabase
        .from("users")
        .select("grade")
        .eq("auth_id", user.id)
        .single();

      evaluation = await evaluateCompletion({
        content: JSON.stringify(data),
        criteria: nodeConfig.aiConfig.evaluationCriteria,
        threshold: nodeConfig.completionCriteria.threshold || 0.6,
        studentGrade: profile?.grade,
      });

      // Update form submission with evaluation
      await supabase
        .from("form_submissions")
        .update({ ai_evaluation: evaluation })
        .eq("project_id", projectId)
        .eq("step_number", stepNumber)
        .eq("node_id", nodeId)
        .order("created_at", { ascending: false })
        .limit(1);
    }

    // Mark node as completed
    await supabase
      .from("step_progress")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("project_id", projectId)
      .eq("step_number", stepNumber)
      .eq("node_id", nodeId);

    // Advance to next node
    const nextResult = await advanceToNextNode(
      supabase,
      projectId,
      stepNumber,
      nodeId
    );

    return Response.json({
      success: true,
      evaluation,
      nextNode: nextResult,
    });
  } catch {
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}

async function advanceToNextNode(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  currentStep: number,
  currentNodeId: string
) {
  // Parse node ID (e.g., "1.2" -> step 1, node 2)
  const parts = currentNodeId.split(".");
  const nodeNum = parseInt(parts[1]);
  const nextNodeId = `${currentStep}.${nodeNum + 1}`;

  // Check if next node exists in config
  const nextNodeConfig = getNodeConfig(currentStep, nextNodeId);

  if (nextNodeConfig) {
    // Advance to next node within same step
    await supabase
      .from("step_progress")
      .upsert({
        project_id: projectId,
        step_number: currentStep,
        node_id: nextNodeId,
        status: "in_progress",
        started_at: new Date().toISOString(),
      }, { onConflict: "project_id,step_number,node_id" });

    await supabase
      .from("projects")
      .update({ current_node: nextNodeId })
      .eq("id", projectId);

    return { type: "next_node", stepNumber: currentStep, nodeId: nextNodeId };
  }

  // No more nodes in this step — advance to next step
  const nextStep = currentStep + 1;
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

    return {
      type: "next_step",
      stepNumber: nextStep,
      nodeId: nextStepFirstNode,
    };
  }

  // All steps complete
  await supabase
    .from("projects")
    .update({ status: "completed" })
    .eq("id", projectId);

  return { type: "project_complete" };
}
