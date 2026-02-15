import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { STEP_TITLES } from "@/types/project";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function StepPage({
  params,
}: {
  params: Promise<{ id: string; step: string }>;
}) {
  const { id, step } = await params;
  const stepNumber = parseInt(step);
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  const stepInfo = STEP_TITLES[stepNumber];
  if (!stepInfo) {
    notFound();
  }

  // Fetch step progress
  const { data: progress } = await supabase
    .from("step_progress")
    .select("*")
    .eq("project_id", id)
    .eq("step_number", stepNumber)
    .order("node_id");

  // Fetch conversations for this step
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .eq("project_id", id)
    .eq("step_number", stepNumber)
    .order("created_at");

  const isCurrentStep = stepNumber === project.current_step;
  const isLocked = stepNumber > project.current_step;

  // Node titles for step 1
  const nodeNames: Record<string, string> = {
    "1.1": "生活观察",
    "1.2": "问题筛选",
    "1.3": "问题深化",
    "2.1": "制定调研计划",
    "2.2": "信息搜集",
    "2.3": "调研报告",
    "3.1": "用户画像",
    "3.2": "功能需求",
    "3.3": "成功标准",
    "4.1": "技术选型",
    "4.2": "架构设计",
    "4.3": "开发计划",
  };

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Step Header */}
      <div className="border-b px-6 py-4 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <Link href={`/project/${id}`}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">
                第{stepNumber}步：{stepInfo.title}
              </h1>
              {isCurrentStep && (
                <Badge variant="default" className="text-xs">
                  进行中
                </Badge>
              )}
              {isLocked && (
                <Badge variant="outline" className="text-xs">
                  未解锁
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {stepInfo.description}
            </p>
          </div>
        </div>

        {/* Node tabs */}
        {progress && progress.length > 0 && (
          <div className="flex gap-1">
            {progress.map((p) => (
              <div
                key={p.node_id}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  p.status === "completed"
                    ? "bg-success/10 text-success"
                    : p.status === "in_progress"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {nodeNames[p.node_id] || p.node_id}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Content: Chat + Side panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ChatWindow
            projectId={id}
            stepNumber={stepNumber}
            nodeId={project.current_node || `${stepNumber}.1`}
            initialMessages={
              conversations?.map((c) => ({
                id: c.id,
                role: c.role as "user" | "assistant",
                content: c.content,
                createdAt: c.created_at,
              })) || []
            }
            disabled={isLocked}
          />
        </div>
      </div>
    </div>
  );
}
