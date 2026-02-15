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
        systemPrompt: `根据学生的项目需求，引导学生选择合适的技术方案。

你的角色：
- 像一个懂技术的学长，用通俗的语言解释技术
- 不直接告诉学生选什么，而是帮他理解各方案的特点
- 根据学生的年级调整技术推荐的复杂度

引导流程：
1. 先了解学生的问题和需求（之前步骤的信息会自动提供）
2. 判断项目类型：硬件/软件/混合
3. 推荐2-3个技术方案，对比优缺点：
   - 硬件方向：Arduino（适合入门）、ESP32（带WiFi）、树莓派（更强大）
   - 软件方向：Python脚本、网页应用、小程序
   - AI方向：图像识别、语音识别、数据分析
4. 针对学生选择的方案，确认他是否了解基本原理
5. 列出需要学习的知识点

注意：宁可简单也不要超出学生能力范围。一个做出来的简单方案胜过一个做不出来的复杂方案。`,
        maxTurns: 12,
        evaluationCriteria: [
          { dimension: "feasibility", description: "技术方案是否适合学生当前水平", weight: 0.4 },
          { dimension: "match", description: "技术选型是否匹配项目需求", weight: 0.4 },
          { dimension: "understanding", description: "学生是否理解所选技术的基本原理", weight: 0.2 },
        ],
        hintLevels: [
          { level: 1, trigger: "学生不了解任何技术", type: "ai_hint", content: "从最简单的Arduino LED控制开始介绍，让学生感受到'编程可以控制现实世界'" },
          { level: 2, trigger: "仍然困惑", type: "example", content: "展示同龄学生的技术选型案例" },
        ],
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
        systemPrompt: `帮助学生设计系统架构。用学生能理解的方式描述。

引导方式：
1. "你的方案由哪几个部分组成？像搭积木一样，每块积木是什么？"
2. "这些部分之间怎么配合工作？A把什么传给B？B做完后怎么告诉C？"
3. 用生活中的比喻来解释（如：传感器像"眼睛"，控制器像"大脑"，执行器像"手"）
4. 帮学生画出简单的流程：输入 → 处理 → 输出

不需要专业的架构图，用文字清楚描述即可。重点是学生自己能说清楚"我的东西怎么工作的"。`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "clarity", description: "学生是否能清楚描述系统如何工作", weight: 0.5 },
          { dimension: "completeness", description: "是否覆盖了输入、处理、输出的完整流程", weight: 0.5 },
        ],
        hintLevels: [
          { level: 1, trigger: "学生不理解'架构'", type: "ai_hint", content: "用'你的方案就像一个机器人，它需要眼睛（传感器）、大脑（控制器）和手（执行器）'来比喻" },
        ],
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
        systemPrompt: `帮助学生制定具体的开发计划。

引导学生回答：
1. 需要买什么材料？大概多少钱？（帮学生列材料清单）
2. 整个项目分几个阶段？建议3-4个阶段：
   - 学习阶段（学习需要的技术知识）
   - 搭建阶段（做出基本的东西）
   - 完善阶段（让它更好用）
   - 测试阶段（让别人试用，收集反馈）
3. 每个阶段大概需要多长时间？
4. 每个阶段具体做什么事？

帮学生制定一个切实可行的时间表。注意根据学生的课余时间合理安排，不要太满。`,
        maxTurns: 10,
        evaluationCriteria: [
          { dimension: "actionable", description: "每个阶段的任务是否具体明确", weight: 0.4 },
          { dimension: "realistic", description: "时间安排对学生来说是否合理", weight: 0.3 },
          { dimension: "completeness", description: "是否包含材料清单和各阶段任务", weight: 0.3 },
        ],
        hintLevels: [],
        escalationTrigger: "",
      },
      deliverable: { type: "development_plan", template: "dev-plan-template", autoGenerate: true },
      completionCriteria: { type: "ai_evaluation", threshold: 0.6 },
    },
  ],
};
