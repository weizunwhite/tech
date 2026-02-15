import { NextRequest, NextResponse } from "next/server";
import { getNodeConfig } from "@/configs/steps";

export async function POST(request: NextRequest) {
  try {
    const { projectId, stepNumber, nodeId, message } = await request.json();

    if (!projectId || !stepNumber || !nodeId || !message) {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      );
    }

    const nodeConfig = getNodeConfig(stepNumber, nodeId);

    // Phase 1: Return mock AI response based on step config
    // Phase 2 will integrate real Claude API
    const reply = generateMockReply(stepNumber, nodeId, message, nodeConfig?.title);

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json(
      { error: "服务器错误，请稍后再试" },
      { status: 500 }
    );
  }
}

function generateMockReply(
  stepNumber: number,
  nodeId: string,
  userMessage: string,
  nodeTitle?: string
): string {
  // Contextual mock responses based on step/node
  const responses: Record<string, string[]> = {
    "1.1": [
      `很好的观察！你提到了"${userMessage.slice(0, 20)}..."，能再具体描述一下你是在什么场景下遇到这个问题的吗？`,
      "这是一个很有意思的方向。除了你自己，还有哪些人也会遇到这个问题呢？",
      "我注意到你说的这个问题。你现在是怎么解决的？有没有什么现成的方法？",
    ],
    "1.2": [
      "让我来帮你分析一下你列出的这些问题。哪一个是你最想解决的？",
      "从可行性的角度来看，这几个问题中，你觉得哪个最有可能做出一个解决方案？",
      "你已经有了几个不错的候选问题。想想看，哪个问题让你最有动力去解决？",
    ],
    "1.3": [
      "你选的这个问题很棒！现在让我们深入了解一下。这个问题主要影响到哪些人？",
      "如果这个问题一直不解决，你觉得会有什么后果？",
      "在你的想象中，最理想的解决方案应该是什么样的？",
    ],
  };

  const nodeResponses = responses[nodeId] || [
    `关于"${nodeTitle || `第${stepNumber}步`}"，你的想法很好。让我们继续深入探讨。`,
    "说得好！你能再展开说说吗？",
    "这是一个值得探索的方向。你接下来打算怎么做？",
  ];

  return nodeResponses[Math.floor(Math.random() * nodeResponses.length)];
}
