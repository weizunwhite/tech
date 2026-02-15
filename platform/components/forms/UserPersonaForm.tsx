"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, User } from "lucide-react";

interface UserPersonaFormProps {
  projectId: string;
  onSubmit: (data: Record<string, string>) => void;
  initialData?: Record<string, string>;
  disabled?: boolean;
}

const fields = [
  { name: "user_name", label: "典型用户", placeholder: "给他/她取个名字", type: "text" },
  { name: "user_age", label: "年龄/身份", placeholder: "几岁？做什么的？学生/上班族/老人...", type: "text" },
  { name: "user_scenario", label: "使用场景", placeholder: "什么时候、什么地方会遇到问题？", type: "textarea" },
  { name: "pain_points", label: "主要困扰", placeholder: "问题带来了什么具体困难？", type: "textarea" },
  { name: "expectations", label: "期望效果", placeholder: "理想情况下，问题解决后会怎样？", type: "textarea" },
];

export function UserPersonaForm({
  onSubmit,
  initialData,
  disabled = false,
}: UserPersonaFormProps) {
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
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        <div>
          <h3 className="font-semibold">用户画像</h3>
          <p className="text-sm text-muted-foreground">
            描述你最想帮助的那个人
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">基本信息</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {fields.filter((f) => f.type === "text").map((field) => (
            <div key={field.name} className="space-y-1">
              <Label className="text-xs">{field.label}</Label>
              <Input
                placeholder={field.placeholder}
                value={data[field.name] || ""}
                onChange={(e) =>
                  setData((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                disabled={disabled}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {fields.filter((f) => f.type === "textarea").map((field) => (
        <Card key={field.name}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">{field.label}</CardTitle>
          </CardHeader>
          <CardContent>
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
          {submitting ? "提交中..." : "提交用户画像"}
          <Send className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
