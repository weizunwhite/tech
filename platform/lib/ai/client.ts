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

  return response.choices[0]?.message?.content || "";
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

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      yield delta;
    }
  }
}
