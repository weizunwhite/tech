"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

const STEP_WELCOME_MESSAGES: Record<number, string> = {
  1: "你好！让我们从生活中的观察开始。最近有没有遇到什么不方便或者想改进的地方？",
  2: "让我们一起来调查一下，你发现的这个问题，目前别人是怎么解决的？",
  3: "现在让我们明确一下，你的作品需要满足哪些具体需求？",
  4: "太好了！现在我们来设计解决方案。你觉得可以用什么方法来解决这个问题？",
  5: "接下来我们要学习实现方案需要的技术知识。你之前接触过编程或者电子元器件吗？",
  6: "动手时间到了！让我们开始搭建第一个可以运行的原型。",
  7: "原型做好了，现在让我们来测试一下它是否真的能解决问题。",
  8: "根据测试结果，让我们来看看哪些地方可以做得更好。",
  9: "项目快完成了！现在让我们把整个过程写成研究论文。",
  10: "让我们来准备竞赛展示材料，包括PPT和演讲稿。",
  11: "最后一步！让我们模拟答辩，练习如何展示你的项目。",
};

interface ChatWindowProps {
  projectId: string;
  stepNumber: number;
  nodeId: string;
  initialMessages?: Message[];
  disabled?: boolean;
}

export function ChatWindow({
  projectId,
  stepNumber,
  nodeId,
  initialMessages = [],
  disabled = false,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [streamingContent, setStreamingContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, scrollToBottom]);

  const welcomeMessage = STEP_WELCOME_MESSAGES[stepNumber] || "你好！我是你的科创引导助手，让我们开始吧！";

  const displayMessages =
    messages.length > 0
      ? messages
      : [
          {
            id: "welcome",
            role: "assistant" as const,
            content: welcomeMessage,
            createdAt: new Date().toISOString(),
          },
        ];

  async function handleSend(content: string) {
    if (!content.trim() || isLoading || disabled) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setStreamingContent("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          stepNumber,
          nodeId,
          message: content,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "请求失败");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6);
            if (!jsonStr) continue;

            try {
              const data = JSON.parse(jsonStr);

              if (data.error) {
                throw new Error(data.error);
              }

              if (data.done) {
                // Stream complete — add final message
                setMessages((prev) => [
                  ...prev,
                  {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: fullContent,
                    createdAt: new Date().toISOString(),
                  },
                ]);
                setStreamingContent("");
                break;
              }

              if (data.content) {
                fullContent += data.content;
                setStreamingContent(fullContent);
              }
            } catch (parseErr) {
              if (parseErr instanceof Error && parseErr.message !== "请求失败") {
                // Skip JSON parse errors from incomplete chunks
                continue;
              }
              throw parseErr;
            }
          }
        }
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "网络连接出现问题";
      setStreamingContent("");
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: `抱歉，${errorMsg}。请稍后再试。`,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Streaming message (typing effect) */}
        {streamingContent && (
          <ChatMessage
            message={{
              id: "streaming",
              role: "assistant",
              content: streamingContent,
              createdAt: new Date().toISOString(),
            }}
          />
        )}

        {/* Loading indicator (before stream starts) */}
        {isLoading && !streamingContent && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm pl-12">
            <div className="flex gap-1">
              <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
              <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
            AI助手正在思考...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-4 bg-card">
        <ChatInput onSend={handleSend} disabled={disabled || isLoading} />
      </div>
    </div>
  );
}
