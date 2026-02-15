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
        systemPrompt: `引导学生创建目标用户画像。帮助学生具体地描述他们想帮助的人。

引导思路（每次问1-2个）：
1. 你的解决方案主要帮助什么样的人？给他/她取个名字吧。
2. 他/她多大年纪？做什么的？（学生/上班族/老人...）
3. 他/她平时在什么场景下会遇到这个问题？
4. 这个问题给他/她带来了什么困扰？（时间浪费？身体不便？花钱多？）
5. 他/她最期望的解决效果是什么？

语言要温暖，像朋友之间聊天。帮学生用"讲故事"的方式描述用户。`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "specificity", description: "用户画像是否具体，有名字、年龄、场景", weight: 0.4 },
          { dimension: "empathy", description: "是否体现了对用户痛点的理解", weight: 0.3 },
          { dimension: "relevance", description: "画像是否与要解决的问题相关", weight: 0.3 },
        ],
        hintLevels: [
          { level: 1, trigger: "学生不知道怎么描述用户", type: "ai_hint", content: "引导学生想想身边谁最需要这个解决方案" },
        ],
        escalationTrigger: "",
      },
      formConfig: {
        fields: [
          { name: "user_name", label: "典型用户（给他/她取个名字）", type: "text", required: true },
          { name: "user_age", label: "年龄/身份（几岁？做什么的？）", type: "text", required: true },
          { name: "user_scenario", label: "使用场景（什么时候、什么地方会遇到问题？）", type: "textarea", required: true },
          { name: "pain_points", label: "主要困扰（问题带来了什么具体困难？）", type: "textarea", required: true },
          { name: "expectations", label: "期望效果（理想情况下，问题解决后会怎样？）", type: "textarea", required: true },
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
        systemPrompt: `帮助学生列出解决方案需要具备的功能。

引导步骤：
1. 先问学生"你的解决方案最核心的功能是什么？如果只能做一个功能，你会做哪个？"
2. 然后问"除了核心功能，还有哪些功能会让它更好用？"
3. 帮学生把功能分成两类：
   - 必须有（没有这个就不能用）
   - 最好有（有了更好，但不影响核心功能）
4. 针对每个功能，引导学生简单描述它"做什么"和"为什么需要"

注意：学生可能会想到很多功能，帮助他聚焦在最重要的3-5个，不要贪多。`,
        maxTurns: 12,
        evaluationCriteria: [
          { dimension: "completeness", description: "核心功能需求是否完整", weight: 0.4 },
          { dimension: "prioritization", description: "是否合理区分了必须有和最好有", weight: 0.3 },
          { dimension: "clarity", description: "每个功能描述是否清晰", weight: 0.3 },
        ],
        hintLevels: [
          { level: 1, trigger: "学生想不出功能", type: "ai_hint", content: "引导学生回顾用户画像中的痛点，每个痛点对应什么解决功能" },
        ],
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
        systemPrompt: `引导学生定义项目的成功标准。

用简单的方式引导：
1. "你觉得做到什么程度算成功？"
2. "怎么判断你的方案确实帮到了用户？"
3. 帮学生把模糊的标准变具体：
   - 不好："让老人更方便" → 好："老人能在30秒内找到正确的药"
   - 不好："减少排队" → 好："排队时间从15分钟减少到5分钟"
4. 建议学生设2-3个可量化的成功标准

注意适合学生年龄，不要太复杂。`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "measurability", description: "标准是否可量化、可验证", weight: 0.5 },
          { dimension: "relevance", description: "标准是否与用户需求相关", weight: 0.3 },
          { dimension: "achievability", description: "标准对学生来说是否可达成", weight: 0.2 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      deliverable: { type: "success_criteria", template: "success-criteria-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
  ],
};
