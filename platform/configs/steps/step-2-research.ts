import type { StepConfig } from "@/types/step-config";

export const step2Config: StepConfig = {
  stepNumber: 2,
  title: "背景调研",
  description: "调查问题背景，了解现有解决方案",
  icon: "Search",
  nodes: [
    {
      nodeId: "2.1",
      title: "制定调研计划",
      type: "conversation",
      aiConfig: {
        systemPrompt: `你是科创教育引导老师。学生已经选定了一个问题，现在需要帮他制定调研计划。

引导学生思考：
1. 你想了解这个问题的哪些方面？
2. 你打算怎么收集信息？（网上搜索、问身边人、观察记录）
3. 有没有类似的产品或解决方案已经存在了？

帮助学生列出一个简单的调研任务清单。`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "plan_quality", description: "调研计划是否合理可行", weight: 0.5 },
          { dimension: "completeness", description: "是否覆盖了关键调研维度", weight: 0.5 },
        ],
        hintLevels: [],
        escalationTrigger: "学生不理解什么是调研",
      },
      deliverable: { type: "research_plan", template: "research-plan-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
    {
      nodeId: "2.2",
      title: "信息搜集",
      type: "form",
      aiConfig: {
        systemPrompt: `帮助学生整理搜集到的调研信息，包括现有解决方案、用户反馈、相关数据等。`,
        maxTurns: 10,
        evaluationCriteria: [],
        hintLevels: [],
        escalationTrigger: "",
      },
      formConfig: {
        fields: [
          { name: "existing_solutions", label: "现有解决方案", type: "textarea", required: true },
          { name: "user_feedback", label: "用户反馈", type: "textarea", required: true },
          { name: "key_findings", label: "关键发现", type: "textarea", required: true },
        ],
        validationRules: [],
      },
      completionCriteria: { type: "form_complete" },
    },
    {
      nodeId: "2.3",
      title: "调研报告",
      type: "generation",
      aiConfig: {
        systemPrompt: `基于学生搜集的调研信息，引导学生完成一份调研报告。`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "evidence", description: "是否基于实际数据和信息", weight: 0.5 },
          { dimension: "insight", description: "是否有有价值的发现和洞察", weight: 0.5 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      deliverable: { type: "research_report", template: "research-report-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
  ],
};
