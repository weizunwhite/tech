import type { StepConfig } from "@/types/step-config";

export const step3Config: StepConfig = {
  stepNumber: 3,
  title: "需求定义",
  description: "明确用户需求，定义成功标准",
  icon: "ClipboardList",
  nodes: [
    {
      nodeId: "3.1",
      title: "用户画像",
      type: "form",
      aiConfig: {
        systemPrompt: `引导学生创建目标用户画像，思考用户是谁、有什么特点、面临什么困难。`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "specificity", description: "用户画像是否具体", weight: 0.5 },
          { dimension: "empathy", description: "是否体现了对用户的理解", weight: 0.5 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      formConfig: {
        fields: [
          { name: "user_name", label: "典型用户名字", type: "text", required: true },
          { name: "user_age", label: "年龄/年级", type: "text", required: true },
          { name: "user_scenario", label: "使用场景", type: "textarea", required: true },
          { name: "pain_points", label: "主要痛点", type: "textarea", required: true },
          { name: "expectations", label: "期望的解决效果", type: "textarea", required: true },
        ],
        validationRules: [],
      },
      deliverable: { type: "user_persona", template: "user-persona-template", autoGenerate: false },
      completionCriteria: { type: "form_complete" },
    },
    {
      nodeId: "3.2",
      title: "功能需求",
      type: "conversation",
      aiConfig: {
        systemPrompt: `帮助学生列出解决方案需要具备的功能，并按优先级排序。引导学生区分"必须有"和"最好有"的功能。`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "completeness", description: "需求是否完整", weight: 0.5 },
          { dimension: "prioritization", description: "是否合理区分了优先级", weight: 0.5 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      deliverable: { type: "requirement_list", template: "requirement-list-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
    {
      nodeId: "3.3",
      title: "成功标准",
      type: "conversation",
      aiConfig: {
        systemPrompt: `引导学生定义项目的成功标准：怎样算"做好了"？用可量化的指标来衡量。`,
        maxTurns: 8,
        evaluationCriteria: [
          { dimension: "measurability", description: "标准是否可量化", weight: 0.6 },
          { dimension: "relevance", description: "标准是否与需求相关", weight: 0.4 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      deliverable: { type: "success_criteria", template: "success-criteria-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
  ],
};
