"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send } from "lucide-react";

interface StepProgressItem {
  step_number: number;
  node_id: string;
  status: string;
}

interface TeacherFeedbackFormProps {
  projectId: string;
  currentStep: number;
  stepProgress: StepProgressItem[];
}

export function TeacherFeedbackForm({
  projectId,
  currentStep,
  stepProgress,
}: TeacherFeedbackFormProps) {
  const [feedback, setFeedback] = useState("");
  const [selectedNode, setSelectedNode] = useState("");
  const [loading, setLoading] = useState(false);

  const currentNodes = stepProgress.filter(
    (sp) => sp.step_number === currentStep
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stepNumber: currentStep,
          nodeId: selectedNode || undefined,
          feedback: feedback.trim(),
        }),
      });

      if (!res.ok) throw new Error("提交失败");

      toast.success("反馈已发送");
      setFeedback("");
      setSelectedNode("");
    } catch {
      toast.error("提交反馈失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {currentNodes.length > 0 && (
        <div className="space-y-2">
          <Label>针对节点（可选）</Label>
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">通用反馈</option>
            {currentNodes.map((node) => (
              <option key={node.node_id} value={node.node_id}>
                节点 {node.node_id} ({node.status === "needs_review" ? "待审核" : node.status})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <Label>反馈内容</Label>
        <Textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="输入你的指导意见或建议..."
          rows={4}
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !feedback.trim()}>
          <Send className="w-4 h-4 mr-2" />
          {loading ? "发送中..." : "发送反馈"}
        </Button>
      </div>
    </form>
  );
}
