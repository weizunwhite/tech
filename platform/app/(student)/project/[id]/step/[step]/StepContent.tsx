"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { ObservationForm } from "@/components/forms/ObservationForm";
import { ResearchForm } from "@/components/forms/ResearchForm";
import { UserPersonaForm } from "@/components/forms/UserPersonaForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import type { Message } from "@/components/chat/ChatMessage";

interface StepContentProps {
  projectId: string;
  stepNumber: number;
  currentNode: string;
  isLocked: boolean;
  initialMessages: Message[];
  existingFormData: Record<string, unknown> | null;
}

export function StepContent({
  projectId,
  stepNumber,
  currentNode,
  isLocked,
  initialMessages,
  existingFormData,
}: StepContentProps) {
  const router = useRouter();
  const [completing, setCompleting] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    passed: boolean;
    summary: string;
  } | null>(null);

  // Determine if this is a form node
  const isFormNode = ["1.1", "2.2", "3.1"].includes(currentNode);

  async function handleFormSubmit(data: unknown) {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/submit-form`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stepNumber,
            nodeId: currentNode,
            formType: `step-${stepNumber}-form`,
            data,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("提交成功！");

        if (result.evaluation) {
          setEvaluationResult({
            passed: result.evaluation.passed,
            summary: result.evaluation.summary,
          });
        }

        // Navigate to next node
        if (result.nextNode) {
          setTimeout(() => {
            router.push(
              `/project/${projectId}/step/${result.nextNode.stepNumber}`
            );
            router.refresh();
          }, 1500);
        }
      } else {
        toast.error(result.error || "提交失败");
      }
    } catch {
      toast.error("网络错误，请重试");
    }
  }

  async function handleCompleteNode() {
    if (completing) return;
    setCompleting(true);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/complete-node`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            stepNumber,
            nodeId: currentNode,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setEvaluationResult({
          passed: true,
          summary: result.evaluation?.summary || "完成得很好！",
        });

        toast.success("节点完成！");

        if (result.nextNode) {
          setTimeout(() => {
            router.push(
              `/project/${projectId}/step/${result.nextNode.stepNumber}`
            );
            router.refresh();
          }, 1500);
        } else if (result.projectComplete) {
          toast.success("恭喜！项目全部完成！");
          setTimeout(() => {
            router.push(`/project/${projectId}`);
            router.refresh();
          }, 2000);
        }
      } else {
        // Not passed — show feedback
        setEvaluationResult({
          passed: false,
          summary: result.message || "继续加油！",
        });
        toast.info(result.message || "还需要继续完善哦");
      }
    } catch {
      toast.error("网络错误，请重试");
    } finally {
      setCompleting(false);
    }
  }

  function renderForm() {
    if (currentNode === "1.1") {
      return (
        <ObservationForm
          projectId={projectId}
          onSubmit={handleFormSubmit}
          initialData={
            existingFormData
              ? (existingFormData as { observations?: Array<{ scene: string; who: string; problem: string; current_solution: string }> })?.observations
              : undefined
          }
        />
      );
    }

    if (currentNode === "2.2") {
      return (
        <ResearchForm
          projectId={projectId}
          onSubmit={handleFormSubmit}
          initialData={existingFormData as Record<string, string> | undefined}
        />
      );
    }

    if (currentNode === "3.1") {
      return (
        <UserPersonaForm
          projectId={projectId}
          onSubmit={handleFormSubmit}
          initialData={existingFormData as Record<string, string> | undefined}
        />
      );
    }

    return null;
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-h-0">
        <ChatWindow
          projectId={projectId}
          stepNumber={stepNumber}
          nodeId={currentNode}
          initialMessages={initialMessages}
          disabled={isLocked}
        />
      </div>

      {/* Side Panel: Form or Complete Button (responsive) */}
      {!isLocked && (
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l bg-card overflow-y-auto p-4">
          {/* Form node: show the appropriate form */}
          {isFormNode && renderForm()}

          {/* Conversation node: show complete button */}
          {!isFormNode && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">对话引导中</h3>
                <p className="text-sm text-muted-foreground">
                  和AI助手充分对话后，点击下方按钮完成当前环节
                </p>
              </div>

              {evaluationResult && (
                <Card
                  className={
                    evaluationResult.passed
                      ? "border-success/30 bg-success/5"
                      : "border-primary/30 bg-primary/5"
                  }
                >
                  <CardContent className="py-4">
                    <p className="text-sm">
                      {evaluationResult.summary}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Button
                onClick={handleCompleteNode}
                disabled={completing || initialMessages.length < 2}
                className="w-full"
                size="lg"
              >
                {completing ? (
                  "评估中..."
                ) : (
                  <>
                    完成当前环节
                    {evaluationResult?.passed ? (
                      <CheckCircle className="w-4 h-4 ml-1" />
                    ) : (
                      <ArrowRight className="w-4 h-4 ml-1" />
                    )}
                  </>
                )}
              </Button>

              {initialMessages.length < 2 && (
                <p className="text-xs text-muted-foreground text-center">
                  请先和AI助手对话后再完成
                </p>
              )}
            </div>
          )}

          {/* Help request button (Level 3 hint) */}
          <Separator className="my-4" />
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground"
            onClick={async () => {
              try {
                await fetch(`/api/projects/${projectId}/help-request`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    stepNumber,
                    nodeId: currentNode,
                    reason: "学生主动请求帮助",
                  }),
                });
                toast.success("已通知老师，请继续尝试，老师会尽快来帮助你");
              } catch {
                toast.error("发送失败，请重试");
              }
            }}
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            需要老师帮助
          </Button>
        </div>
      )}
    </div>
  );
}
