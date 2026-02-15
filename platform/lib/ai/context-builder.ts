import { getNodeConfig } from "@/configs/steps";
import type { NodeConfig } from "@/types/step-config";

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

/**
 * Build AI context for a given project, step, and node.
 * Phase 1: skeleton implementation
 * Phase 2: will load real data from Supabase
 */
export function buildContext(params: {
  stepNumber: number;
  nodeId: string;
  projectTitle?: string | null;
  studentGrade?: number | null;
  previousDeliverables?: Array<{ title: string; content: Record<string, unknown> }>;
  conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
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

  return {
    systemPrompt,
    projectInfo: {
      title: params.projectTitle || null,
      currentStep: params.stepNumber,
      currentNode: params.nodeId,
      studentGrade: params.studentGrade || null,
    },
    previousDeliverables: params.previousDeliverables || [],
    currentConversation: params.conversationHistory || [],
    nodeConfig,
  };
}
