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
        systemPrompt: `你是科创教育引导老师。学生已经选定了一个问题并完成了问题深化，现在需要帮他制定调研计划。

你的角色：
- 引导者，不是替学生做调研
- 语言简单易懂，适合9-15岁学生
- 鼓励学生自己思考调研方法

引导学生思考以下内容（每次只问1-2个，不要一次性全抛出）：
1. 你想了解这个问题的哪些方面？（问题有多严重？有多少人遇到？现在人们怎么解决的？）
2. 你打算怎么收集信息？
   - 网上搜索：搜什么关键词？
   - 问身边的人：问谁？问什么问题？
   - 实地观察：去哪里看？记录什么？
3. 有没有类似的产品或解决方案已经存在了？你能找到哪些？
4. 你打算用几天完成调研？每天做什么？

帮助学生列出一个简单的调研任务清单（3-5项），每项有明确的做法和预计时间。`,
        maxTurns: 12,
        evaluationCriteria: [
          { dimension: "plan_quality", description: "调研计划是否有明确的步骤和方法", weight: 0.4 },
          { dimension: "completeness", description: "是否覆盖了多种调研渠道", weight: 0.3 },
          { dimension: "feasibility", description: "计划对学生来说是否可执行", weight: 0.3 },
        ],
        hintLevels: [
          { level: 1, trigger: "学生不知道怎么做调研", type: "ai_hint", content: "建议学生从'网上搜索类似产品'开始，这是最容易的调研方式" },
          { level: 2, trigger: "给出提示后仍无进展", type: "example", content: "展示调研计划案例" },
        ],
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
        systemPrompt: `帮助学生整理搜集到的调研信息。鼓励学生认真填写每一项，越具体越好。

如果学生填写的内容太简单，引导他补充：
- "你找到的解决方案具体是怎么工作的？"
- "用户对这些方案有什么评价？"
- "你觉得这些方案有什么不足？"`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "thoroughness", description: "信息收集是否全面", weight: 0.5 },
          { dimension: "relevance", description: "信息是否与问题相关", weight: 0.5 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      formConfig: {
        fields: [
          { name: "existing_solutions", label: "已有的解决方案（找到了哪些类似产品？它们怎么解决这个问题的？）", type: "textarea", required: true },
          { name: "user_feedback", label: "用户怎么说（问了哪些人？他们怎么评价现有方案？有什么不满意的？）", type: "textarea", required: true },
          { name: "key_findings", label: "关键发现（调研中最让你惊讶或印象深刻的发现是什么？）", type: "textarea", required: true },
          { name: "gaps", label: "差距和机会（现有方案有什么不足？你觉得可以在哪里做得更好？）", type: "textarea", required: true },
        ],
        validationRules: [],
      },
      completionCriteria: { type: "form_complete" },
    },
    {
      nodeId: "2.3",
      title: "调研报告",
      type: "conversation",
      aiConfig: {
        systemPrompt: `基于学生搜集的调研信息，引导学生总结出一份调研报告。

报告应包含：
1. 问题背景（为什么要调研这个问题）
2. 调研方法（怎么做的调研）
3. 主要发现（发现了什么）
4. 竞品分析（现有方案的优缺点）
5. 机会点（可以改进的方向）

引导学生用自己的话总结，不要替学生写。每次围绕一个方面展开讨论。`,
        maxTurns: 12,
        evaluationCriteria: [
          { dimension: "evidence", description: "是否基于实际调研数据和信息", weight: 0.4 },
          { dimension: "insight", description: "是否有有价值的发现和洞察", weight: 0.3 },
          { dimension: "student_voice", description: "是否保持学生自己的语言", weight: 0.3 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      deliverable: { type: "research_report", template: "research-report-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
  ],
};
