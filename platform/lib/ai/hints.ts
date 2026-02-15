import type { HintLevel } from "@/types/step-config";

export interface HintResult {
  level: number;
  type: "ai_hint" | "example" | "human_intervention";
  content: string;
}

// Sample cases for Level 2 hints (anonymized student examples)
const EXAMPLE_CASES: Record<string, string> = {
  "1.1": `案例参考：一位5年级的同学注意到奶奶每次吃药都要翻很多药盒才能找到对的药，
于是他想能不能做一个"智能药盒"，到时间自动提醒并且弹出对应的药格。
这个观察来自真实生活，而且影响了很多老年人。`,
  "1.2": `案例参考：一位同学列了3个问题——食堂排队太长、书包太重、校门口接送乱。
他最后选了"校门口接送乱"，因为他觉得这个问题最普遍（每天都有几百个家长），
而且他有一个用颜色标签分区的想法。`,
  "1.3": `案例参考：一位同学深入分析"老年人用药困难"后写道：
"我奶奶每天要吃5种药，经常搞混。有一次她把降压药吃了双倍，差点出事。
据我了解，小区里很多老人都有类似的问题。如果有一个能自动分药、按时提醒的装置，
就能减少吃错药的风险。我特别想解决这个问题，因为我奶奶就是这样的人。"`,
};

/**
 * Check if a hint should be triggered based on conversation state.
 */
export function checkHintTrigger(params: {
  nodeId: string;
  hintLevels: HintLevel[];
  messageCount: number;
  lastUserMessageTime?: string;
  currentHintLevel: number;
}): HintResult | null {
  const { nodeId, hintLevels, messageCount, currentHintLevel } = params;

  if (hintLevels.length === 0) return null;

  // Level 1: Student hasn't said much (less than 2 substantive messages after 4+ turns)
  if (currentHintLevel < 1 && messageCount >= 4) {
    const level1 = hintLevels.find((h) => h.level === 1);
    if (level1) {
      return {
        level: 1,
        type: level1.type as HintResult["type"],
        content: level1.content || "",
      };
    }
  }

  // Level 2: After level 1 hint, still no progress (8+ turns)
  if (currentHintLevel < 2 && messageCount >= 8) {
    const level2 = hintLevels.find((h) => h.level === 2);
    if (level2) {
      return {
        level: 2,
        type: "example",
        content: EXAMPLE_CASES[nodeId] || level2.content || "",
      };
    }
  }

  // Level 3: After level 2 hint, still struggling (12+ turns)
  if (currentHintLevel < 3 && messageCount >= 12) {
    const level3 = hintLevels.find((h) => h.level === 3);
    if (level3) {
      return {
        level: 3,
        type: "human_intervention",
        content: level3.content || "",
      };
    }
  }

  return null;
}

/**
 * Build a hint message to inject into the AI conversation.
 */
export function buildHintPrompt(hint: HintResult): string {
  switch (hint.type) {
    case "ai_hint":
      return `[系统提示：学生似乎需要一些引导。请${hint.content}。用温和鼓励的语气，不要让学生感到压力。]`;
    case "example":
      return `[系统提示：请分享以下案例参考来帮助学生打开思路，但提醒学生要找自己的问题，不要照搬案例。]\n\n${hint.content}`;
    case "human_intervention":
      return `[系统提示：学生可能需要更多帮助。请温和地告诉学生"你可以点击'需要帮助'按钮，老师会来帮助你"，同时继续鼓励他尝试。]`;
    default:
      return "";
  }
}
