import type { StepConfig, NodeConfig } from "@/types/step-config";
import { step1Config } from "./step-1-problem-discovery";
import { step2Config } from "./step-2-research";
import { step3Config } from "./step-3-requirements";
import { step4Config } from "./step-4-design";

const stepConfigs: Record<number, StepConfig> = {
  1: step1Config,
  2: step2Config,
  3: step3Config,
  4: step4Config,
};

export function getStepConfig(stepNumber: number): StepConfig | undefined {
  return stepConfigs[stepNumber];
}

export function getNodeConfig(
  stepNumber: number,
  nodeId: string
): NodeConfig | undefined {
  const step = stepConfigs[stepNumber];
  if (!step) return undefined;
  return step.nodes.find((n) => n.nodeId === nodeId);
}

export function getAllStepConfigs(): StepConfig[] {
  return Object.values(stepConfigs);
}

export { step1Config, step2Config, step3Config, step4Config };
