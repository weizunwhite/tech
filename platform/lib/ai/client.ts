import OpenAI from "openai";

let client: OpenAI | null = null;

export function getAIClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.MINIMAX_API_KEY,
      baseURL: "https://api.minimaxi.com/v1",
    });
  }
  return client;
}

/**
 * Strip <think>...</think> blocks from MiniMax-M2.5 reasoning output.
 */
function stripThinkTags(text: string): string {
  return text.replace(/<think>[\s\S]*?<\/think>/g, "").trimStart();
}

export interface ChatRequest {
  systemPrompt: string;
  messages: { role: "user" | "assistant"; content: string }[];
  maxTokens?: number;
  temperature?: number;
}

export async function chat({
  systemPrompt,
  messages,
  maxTokens = 1024,
  temperature = 1.0,
}: ChatRequest): Promise<string> {
  const ai = getAIClient();

  const response = await ai.chat.completions.create({
    model: "MiniMax-M2.5",
    max_tokens: maxTokens,
    temperature,
    top_p: 0.95,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
  });

  return stripThinkTags(response.choices[0]?.message?.content || "");
}

export async function* chatStream({
  systemPrompt,
  messages,
  maxTokens = 1024,
  temperature = 1.0,
}: ChatRequest): AsyncGenerator<string> {
  const ai = getAIClient();

  const stream = await ai.chat.completions.create({
    model: "MiniMax-M2.5",
    max_tokens: maxTokens,
    temperature,
    top_p: 0.95,
    stream: true,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
  });

  // Track whether we are inside a <think> block
  let insideThink = false;
  let buffer = "";

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (!delta) continue;

    buffer += delta;

    // Process buffer to strip <think>...</think> blocks
    while (buffer.length > 0) {
      if (insideThink) {
        const closeIdx = buffer.indexOf("</think>");
        if (closeIdx !== -1) {
          // Skip everything up to and including </think>
          buffer = buffer.slice(closeIdx + 8);
          insideThink = false;
        } else {
          // Still inside think block, consume entire buffer
          buffer = "";
          break;
        }
      } else {
        const openIdx = buffer.indexOf("<think>");
        if (openIdx !== -1) {
          // Yield text before <think>
          const before = buffer.slice(0, openIdx);
          if (before) yield before;
          buffer = buffer.slice(openIdx + 7);
          insideThink = true;
        } else {
          // No <think> tag found — but buffer might contain a partial "<think"
          // Hold back up to 6 chars (length of "<think" minus 1) to detect partial tags
          const holdBack = 6;
          if (buffer.length > holdBack) {
            const safe = buffer.slice(0, buffer.length - holdBack);
            buffer = buffer.slice(buffer.length - holdBack);
            if (safe) yield safe;
          }
          break;
        }
      }
    }
  }

  // Flush remaining buffer
  if (!insideThink && buffer) {
    yield buffer;
  }
}
