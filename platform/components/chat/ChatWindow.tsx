"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

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

  const displayMessages =
    messages.length > 0
      ? messages
      : [
          {
            id: "welcome",
            role: "assistant" as const,
            content:
              "你好！我是你的科创引导助手。准备好开始探索了吗？告诉我，最近你在生活中有没有遇到什么不方便的事情？",
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
