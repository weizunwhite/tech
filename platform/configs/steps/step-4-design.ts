import type { StepConfig } from "@/types/step-config";

export const step4Config: StepConfig = {
  stepNumber: 4,
  title: "方案设计",
  description: "设计技术方案，规划开发计划",
  icon: "PenTool",
  nodes: [
    {
      nodeId: "4.1",
      title: "技术选型",
      type: "conversation",
      aiConfig: {
        systemPrompt: `根据学生的项目需求，引导学生选择合适的技术方案。考虑学生的年级和能力水平。

可能的技术方向：
- 硬件：Arduino、ESP32、传感器、3D打印
- 软件：Python、网页应用
- AI/ML：图像识别、数据分析

不要直接告诉学生选什么，而是分析每种方案的优缺点，让学生做决定。`,
        maxTurns: 12,
        evaluationCriteria: [
          { dimension: "feasibility", description: "技术方案是否适合学生水平", weight: 0.4 },
          { dimension: "match", description: "技术是否匹配需求", weight: 0.4 },
          { dimension: "understanding", description: "学生是否理解所选技术", weight: 0.2 },
        ],
        hintLevels: [],
        escalationTrigger: "学生完全不了解任何技术选项",
      },
      deliverable: { type: "tech_selection", template: "tech-selection-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
    {
      nodeId: "4.2",
      title: "架构设计",
      type: "conversation",
      aiConfig: {
        systemPrompt: `帮助学生设计系统架构，用简单的方式描述系统由哪些部分组成、怎么工作。不需要画专业的架构图，用文字描述清楚即可。`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "clarity", description: "架构描述是否清晰", weight: 0.5 },
          { dimension: "completeness", description: "是否覆盖了关键组成部分", weight: 0.5 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      deliverable: { type: "architecture_design", template: "architecture-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
    {
      nodeId: "4.3",
      title: "开发计划",
      type: "conversation",
      aiConfig: {
        systemPrompt: `帮助学生制定开发计划：需要哪些材料？大概需要多长时间？分几个阶段做？每个阶段做什么？`,
        maxTurns: 8,
        evaluationCriteria: [
          { dimension: "actionable", description: "计划是否可执行", weight: 0.5 },
          { dimension: "realistic", description: "时间估算是否合理", weight: 0.5 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      deliverable: { type: "development_plan", template: "dev-plan-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
  ],
};
