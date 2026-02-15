"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send } from "lucide-react";

interface ResearchFormProps {
  projectId: string;
  onSubmit: (data: Record<string, string>) => void;
  initialData?: Record<string, string>;
  disabled?: boolean;
}

const fields = [
  {
    name: "existing_solutions",
    label: "已有的解决方案",
    placeholder: "找到了哪些类似产品？它们怎么解决这个问题的？",
  },
  {
    name: "user_feedback",
    label: "用户怎么说",
    placeholder: "问了哪些人？他们怎么评价现有方案？有什么不满意的？",
  },
  {
    name: "key_findings",
    label: "关键发现",
    placeholder: "调研中最让你惊讶或印象深刻的发现是什么？",
  },
  {
    name: "gaps",
    label: "差距和机会",
    placeholder: "现有方案有什么不足？你觉得可以在哪里做得更好？",
  },
];

export function ResearchForm({
  onSubmit,
  initialData,
  disabled = false,
}: ResearchFormProps) {
  const [data, setData] = useState<Record<string, string>>(
    initialData || fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
  );
  const [submitting, setSubmitting] = useState(false);

  function isValid(): boolean {
    return fields.every((f) => (data[f.name] || "").trim().length > 0);
  }

  async function handleSubmit() {
    if (!isValid() || submitting || disabled) return;
    setSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">调研信息记录</h3>
        <p className="text-sm text-muted-foreground">
          把你调研到的信息整理在这里
        </p>
      </div>

      {fields.map((field) => (
        <Card key={field.name}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{field.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <Label className="sr-only">{field.label}</Label>
            <Textarea
              placeholder={field.placeholder}
              value={data[field.name] || ""}
              onChange={(e) =>
                setData((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
              disabled={disabled}
              rows={3}
            />
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          {fields.filter((f) => (data[f.name] || "").trim()).length}/{fields.length} 项已填写
        </p>
        <Button onClick={handleSubmit} disabled={!isValid() || submitting || disabled}>
          {submitting ? "提交中..." : "提交调研信息"}
          <Send className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
