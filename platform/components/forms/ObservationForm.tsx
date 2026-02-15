"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Send } from "lucide-react";

interface Observation {
  scene: string;
  who: string;
  problem: string;
  current_solution: string;
}

interface ObservationFormProps {
  projectId: string;
  onSubmit: (data: Observation[]) => void;
  initialData?: Observation[];
  disabled?: boolean;
}

const emptyObservation: Observation = {
  scene: "",
  who: "",
  problem: "",
  current_solution: "",
};

export function ObservationForm({
  onSubmit,
  initialData,
  disabled = false,
}: ObservationFormProps) {
  const [observations, setObservations] = useState<Observation[]>(
    initialData && initialData.length > 0
      ? initialData
      : [{ ...emptyObservation }, { ...emptyObservation }, { ...emptyObservation }]
  );
  const [submitting, setSubmitting] = useState(false);

  function updateObservation(
    index: number,
    field: keyof Observation,
    value: string
  ) {
    setObservations((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  function addObservation() {
    if (observations.length >= 5) return;
    setObservations((prev) => [...prev, { ...emptyObservation }]);
  }

  function removeObservation(index: number) {
    if (observations.length <= 3) return;
    setObservations((prev) => prev.filter((_, i) => i !== index));
  }

  function isValid(): boolean {
    const filled = observations.filter(
      (o) => o.scene.trim() && o.who.trim() && o.problem.trim()
    );
    return filled.length >= 3;
  }

  async function handleSubmit() {
    if (!isValid() || submitting || disabled) return;
    setSubmitting(true);
    try {
      await onSubmit(observations.filter((o) => o.problem.trim()));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">生活观察记录</h3>
          <p className="text-sm text-muted-foreground">
            记录你在生活中发现的不方便或可以改进的地方（至少3个）
          </p>
        </div>
        {observations.length < 5 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addObservation}
            disabled={disabled}
          >
            <Plus className="w-4 h-4 mr-1" />
            添加
          </Button>
        )}
      </div>

      {observations.map((obs, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                观察 {index + 1}
              </CardTitle>
              {observations.length > 3 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={() => removeObservation(index)}
                  disabled={disabled}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">在哪里（场景）</Label>
                <Input
                  placeholder="比如：学校食堂、家里厨房..."
                  value={obs.scene}
                  onChange={(e) =>
                    updateObservation(index, "scene", e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">谁遇到了这个问题</Label>
                <Input
                  placeholder="比如：同学、爷爷奶奶..."
                  value={obs.who}
                  onChange={(e) =>
                    updateObservation(index, "who", e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">具体是什么问题</Label>
              <Textarea
                placeholder="描述你观察到的具体问题..."
                value={obs.problem}
                onChange={(e) =>
                  updateObservation(index, "problem", e.target.value)
                }
                disabled={disabled}
                rows={2}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">现在怎么解决的</Label>
              <Textarea
                placeholder="目前人们用什么办法应对这个问题..."
                value={obs.current_solution}
                onChange={(e) =>
                  updateObservation(index, "current_solution", e.target.value)
                }
                disabled={disabled}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-muted-foreground">
          {observations.filter((o) => o.problem.trim()).length}/3 个已填写（最少3个）
        </p>
        <Button onClick={handleSubmit} disabled={!isValid() || submitting || disabled}>
          {submitting ? "提交中..." : "提交观察记录"}
          <Send className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
