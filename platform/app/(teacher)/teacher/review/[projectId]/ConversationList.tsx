"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronUp, Bot, UserIcon } from "lucide-react";

interface Conversation {
  id: string;
  step_number: number;
  node_id: string;
  role: string;
  content: string;
  created_at: string;
}

interface ConversationListProps {
  conversations: Conversation[];
}

export function ConversationList({ conversations }: ConversationListProps) {
  const [expanded, setExpanded] = useState(false);

  if (conversations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        暂无对话记录
      </p>
    );
  }

  // Group by step and node
  const grouped: Record<string, Conversation[]> = {};
  conversations.forEach((c) => {
    const key = `${c.step_number}-${c.node_id}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  });

  const shown = expanded ? conversations : conversations.slice(0, 10);

  return (
    <div className="space-y-3">
      {/* Summary badges */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {Object.entries(grouped).map(([key, msgs]) => (
          <Badge key={key} variant="outline" className="text-xs">
            节点{key}: {msgs.length}条
          </Badge>
        ))}
      </div>

      {/* Conversation messages */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {shown.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${
              msg.role === "assistant" ? "" : "flex-row-reverse"
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === "assistant"
                  ? "bg-primary/10"
                  : "bg-blue-500/10"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="w-3.5 h-3.5 text-primary" />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-blue-500" />
              )}
            </div>
            <div
              className={`flex-1 max-w-[85%] p-2 rounded-lg text-sm ${
                msg.role === "assistant"
                  ? "bg-muted"
                  : "bg-blue-500/10"
              }`}
            >
              <p className="whitespace-pre-wrap break-words">
                {msg.content.length > 200
                  ? msg.content.slice(0, 200) + "..."
                  : msg.content}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                {new Date(msg.created_at).toLocaleString("zh-CN")}
              </p>
            </div>
          </div>
        ))}
      </div>

      {conversations.length > 10 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? (
            <>
              收起 <ChevronUp className="w-4 h-4 ml-1" />
            </>
          ) : (
            <>
              查看全部 {conversations.length} 条对话{" "}
              <ChevronDown className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      )}
    </div>
  );
}
