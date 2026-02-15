"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, Send } from "lucide-react";
import { toast } from "sonner";

interface ParentCommentFormProps {
  projectId: string;
  studentName: string;
}

const quickMessages = [
  "加油！你做得很棒！",
  "看到你的进步，我很开心！",
  "继续努力，我为你骄傲！",
];

export function ParentCommentForm({ projectId, studentName }: ParentCommentFormProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSend() {
    if (!message.trim() || sending) return;
    setSending(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message.trim(), type: "parent_encouragement" }),
      });

      if (response.ok) {
        toast.success(`留言已发送给${studentName}！`);
        setMessage("");
        setSent(true);
        setTimeout(() => setSent(false), 3000);
      } else {
        toast.error("发送失败，请重试");
      }
    } catch {
      toast.error("网络错误，请重试");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Quick messages */}
      <div className="flex flex-wrap gap-2">
        {quickMessages.map((msg) => (
          <Button
            key={msg}
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => setMessage(msg)}
          >
            <Heart className="w-3 h-3 mr-1 text-red-400" />
            {msg}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Textarea
          placeholder={`写一段话鼓励${studentName}...`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="text-sm"
        />
        <Button
          onClick={handleSend}
          disabled={!message.trim() || sending}
          size="icon"
          className="shrink-0 self-end"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {sent && (
        <p className="text-xs text-success text-center">
          留言已发送！{studentName}下次登录时会看到
        </p>
      )}
    </div>
  );
}
