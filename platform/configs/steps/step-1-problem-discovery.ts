import type { StepConfig } from "@/types/step-config";

export const step1Config: StepConfig = {
  stepNumber: 1,
  title: "问题发现",
  description: "从真实生活中发现一个值得解决的问题",
  icon: "Lightbulb",
  nodes: [
    {
      nodeId: "1.1",
      title: "生活观察",
      type: "form",
      aiConfig: {
        systemPrompt: `你是一位科创教育引导老师，正在帮助一位小学/初中学生从生活中发现问题。

你的角色：
- 你是引导者，不是解答者
- 用鼓励的、好奇的语气和学生对话
- 语言要简单易懂，适合9-15岁的孩子
- 绝不替学生想问题，只帮助他们深入思考自己发现的问题

当前任务：引导学生观察生活中的不便之处，写下至少3个候选问题。

如果学生写的问题太笼统（如"环境污染"），追问让他具体化：
- "你在哪里遇到了这个问题？"
- "能描述一个具体的场景吗？"
- "这个问题多久会出现一次？"

如果学生写的问题太小（如"橡皮老是掉地上"），不要否定，但引导他思考：
- "这个问题除了你，还有别人也会遇到吗？"
- "有没有更让你困扰的事情？"

如果学生完全想不出来，按以下顺序给出启发（不要一次性全给）：
1. "想想你在学校里有什么不方便的事？"
2. "家里的老人有没有什么困难是你想帮他们解决的？"
3. "上下学的路上有没有什么让你觉得可以改进的？"`,
        maxTurns: 15,
        evaluationCriteria: [
          {
            dimension: "specificity",
            description: "问题描述是否具体，有明确的场景、人物和痛点",
            weight: 0.3,
          },
          {
            dimension: "authenticity",
            description: "是否来自真实的生活体验而非凭空想象",
            weight: 0.3,
          },
          {
            dimension: "solvability",
            description: "问题是否在学生能力范围内有改善空间",
            weight: 0.2,
          },
          {
            dimension: "originality",
            description: "是否有一定的独特视角，不是最常见的老生常谈",
            weight: 0.2,
          },
        ],
        hintLevels: [
          {
            level: 1,
            trigger: "学生沉默超过3分钟或表示想不出来",
            type: "ai_hint",
            content: "给出一个生活场景方向（如学校、家庭、出行）",
          },
          {
            level: 2,
            trigger: "给出场景提示后仍然无法产出",
            type: "example",
            content: "展示一个同龄学生的选题过程（脱敏案例）",
          },
          {
            level: 3,
            trigger: "尝试2轮提示后仍无进展",
            type: "human_intervention",
            content: "标记需要老师介入，发送通知",
          },
        ],
        escalationTrigger: "连续3轮对话无实质性进展",
      },
      formConfig: {
        fields: [
          {
            name: "observations",
            type: "array",
            minItems: 3,
            maxItems: 5,
            itemFields: [
              { name: "scene", label: "在哪里（场景）", type: "text", required: true },
              { name: "who", label: "谁遇到了这个问题", type: "text", required: true },
              { name: "problem", label: "具体是什么问题", type: "textarea", required: true },
              { name: "current_solution", label: "现在怎么解决的", type: "textarea", required: true },
            ],
          },
        ],
        validationRules: [
          { rule: "minItems", value: 3, message: "请至少写下3个生活中的问题" },
        ],
      },
      deliverable: {
        type: "life_observations",
        template: "life-observation-template",
        autoGenerate: false,
      },
      completionCriteria: {
        type: "form_complete",
      },
    },
    {
      nodeId: "1.2",
      title: "问题筛选",
      type: "conversation",
      aiConfig: {
        systemPrompt: `你是科创教育引导老师。学生已经写下了几个生活中发现的问题，现在需要帮助他选择一个最适合做成科创项目的问题。

你需要做的：
1. 逐个分析学生提出的每个问题，从以下维度给出你的看法：
   - 真实性：这个问题是否真实存在？
   - 普遍性：有多少人会遇到类似问题？
   - 可行性：以学生的水平能做出解决方案吗？
   - 创新空间：现有解决方案是否有明显不足？

2. 给出你的建议排序，但一定要说明理由
3. 最终让学生自己决定选哪个，尊重他的选择
4. 如果学生选了你不太看好的那个，不要否定，而是提醒他可能遇到的挑战

语气：像一个友善的学长在和学弟学妹讨论，不是老师在打分。`,
        maxTurns: 10,
        evaluationCriteria: [
          {
            dimension: "selection_quality",
            description: "最终选定的问题是否具有足够的项目潜力",
            weight: 0.5,
          },
          {
            dimension: "reasoning",
            description: "学生是否能说出选择这个问题的理由",
            weight: 0.5,
          },
        ],
        hintLevels: [
          {
            level: 1,
            trigger: "学生在多个选项间犹豫不决",
            type: "ai_hint",
            content: "引导学生思考'哪个问题你最想解决、最有动力去做'",
          },
        ],
        escalationTrigger: "学生对所有选项都不满意，要重新开始",
      },
      deliverable: {
        type: "problem_selection",
        template: "problem-selection-template",
        autoGenerate: true,
      },
      completionCriteria: {
        type: "ai_evaluation",
        threshold: 0.6,
      },
    },
    {
      nodeId: "1.3",
      title: "问题深化",
      type: "conversation",
      aiConfig: {
        systemPrompt: `你是科创教育引导老师。学生已经选定了一个问题，现在需要帮助他深入理解这个问题。

通过对话引导学生思考：
1. 这个问题影响了哪些人？大概有多少人？
2. 如果不解决这个问题，会有什么后果？
3. 你觉得最理想的解决方案应该是什么样的？
4. 你为什么特别想解决这个问题？（个人动机）

每次只问一个问题，等学生回答后再继续。不要一次性把所有问题抛出来。

最终目标：帮助学生写出一段300-500字的问题描述，包含问题的背景、影响、现状和他的思考。

注意：这段描述必须是学生自己的语言，你可以帮他理清思路，但不要替他写。如果学生的表达不够好，鼓励他用自己的话说，不要追求"完美的表达"。`,
        maxTurns: 15,
        evaluationCriteria: [
          {
            dimension: "depth",
            description: "问题分析是否有深度，不停留在表面",
            weight: 0.3,
          },
          {
            dimension: "completeness",
            description: "是否覆盖了问题的背景、影响、现状",
            weight: 0.3,
          },
          {
            dimension: "student_voice",
            description: "是否保持了学生自己的语言风格",
            weight: 0.4,
          },
        ],
        hintLevels: [],
        escalationTrigger: "学生无法深入分析问题",
      },
      deliverable: {
        type: "problem_description",
        template: "problem-description-template",
        autoGenerate: true,
      },
      completionCriteria: {
        type: "ai_evaluation",
        threshold: 0.7,
      },
    },
  ],
};
