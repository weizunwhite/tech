export interface StepConfig {
  stepNumber: number;
  title: string;
  description: string;
  icon: string;
  nodes: NodeConfig[];
}

export interface NodeConfig {
  nodeId: string;
  title: string;
  type: "conversation" | "form" | "review" | "generation";
  aiConfig: AIConfig;
  formConfig?: FormConfig;
  deliverable?: DeliverableConfig;
  completionCriteria: CompletionCriteria;
}

export interface AIConfig {
  systemPrompt: string;
  maxTurns: number;
  evaluationCriteria: EvaluationCriteria[];
  hintLevels: HintLevel[];
  escalationTrigger: string;
}

export interface EvaluationCriteria {
  dimension: string;
  description: string;
  weight: number;
}

export interface HintLevel {
  level: number;
  trigger: string;
  type: "ai_hint" | "example" | "human_intervention";
  content?: string;
}

export interface FormConfig {
  fields: FormField[];
  validationRules: ValidationRule[];
}

export interface FormField {
  name: string;
  label?: string;
  type: "text" | "textarea" | "select" | "number" | "array";
  required?: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  minItems?: number;
  maxItems?: number;
  itemFields?: FormField[];
}

export interface ValidationRule {
  rule: string;
  value: unknown;
  message: string;
}

export interface DeliverableConfig {
  type: string;
  template: string;
  autoGenerate: boolean;
}

export interface CompletionCriteria {
  type: "ai_evaluation" | "form_complete" | "manual_review";
  threshold?: number;
}
