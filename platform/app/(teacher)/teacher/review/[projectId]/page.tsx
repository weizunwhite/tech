import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { STEP_TITLES } from "@/types/project";
import {
  MessageCircle,
  FileText,
  AlertCircle,
  GraduationCap,
} from "lucide-react";
import { TeacherFeedbackForm } from "./TeacherFeedbackForm";
import { ConversationList } from "./ConversationList";

export default async function TeacherReviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();

  // Load project with student info
  const { data: project } = await supabase
    .from("projects")
    .select("*, users!projects_student_id_fkey(name, grade, email)")
    .eq("id", projectId)
    .single();

  if (!project) {
    notFound();
  }

  // Load help requests
  const { data: helpRequests } = await supabase
    .from("conversations")
    .select("*")
    .eq("project_id", projectId)
    .eq("role", "system")
    .like("content", "%[需要帮助]%")
    .order("created_at", { ascending: false });

  // Load recent conversations
  const { data: conversations } = await supabase
    .from("conversations")
    .select("*")
    .eq("project_id", projectId)
    .neq("role", "system")
    .order("created_at", { ascending: false })
    .limit(50);

  // Load step progress
  const { data: stepProgress } = await supabase
    .from("step_progress")
    .select("*")
    .eq("project_id", projectId)
    .order("step_number");

  // Load deliverables
  const { data: deliverables } = await supabase
    .from("deliverables")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  // Load teacher feedback
  const { data: feedbackHistory } = await supabase
    .from("conversations")
    .select("*")
    .eq("project_id", projectId)
    .eq("role", "system")
    .like("content", "%[教师反馈]%")
    .order("created_at", { ascending: false });

  const student = project.users;
  const stepInfo = STEP_TITLES[project.current_step] || STEP_TITLES[1];
  const progressPercent = Math.round(((project.current_step - 1) / 11) * 100);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {project.title || "未命名项目"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {student?.name || "学生"}{" "}
              {student?.grade ? `· ${student.grade}年级` : ""}{" "}
              · {student?.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                第{project.current_step}步 · {stepInfo.title}
              </span>
              <span className="text-muted-foreground">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
          <Badge
            variant={project.status === "active" ? "default" : "secondary"}
          >
            {project.status === "active" ? "进行中" : "已完成"}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Conversations & Feedback */}
        <div className="lg:col-span-2 space-y-6">
          {/* Help Requests */}
          {helpRequests && helpRequests.length > 0 && (
            <Card className="border-orange-500/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  求助请求 ({helpRequests.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {helpRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 bg-orange-50 dark:bg-orange-500/5 rounded-lg"
                  >
                    <p className="text-sm">
                      {(req.content as string).replace("[需要帮助] ", "")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      第{req.step_number}步 · 节点{req.node_id} ·{" "}
                      {new Date(req.created_at).toLocaleString("zh-CN")}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Student Conversations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                学生对话记录
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ConversationList
                conversations={conversations || []}
              />
            </CardContent>
          </Card>

          {/* Teacher Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">提交反馈</CardTitle>
            </CardHeader>
            <CardContent>
              <TeacherFeedbackForm
                projectId={projectId}
                currentStep={project.current_step}
                stepProgress={stepProgress || []}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Step Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">步骤进度</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Array.from({ length: 11 }, (_, i) => i + 1).map((step) => {
                  const info = STEP_TITLES[step];
                  const progress = stepProgress?.filter(
                    (sp) => sp.step_number === step
                  );
                  const isCompleted = progress?.every(
                    (sp) => sp.status === "completed"
                  );
                  const isCurrentStep = step === project.current_step;
                  const hasNeedsReview = progress?.some(
                    (sp) => sp.status === "needs_review"
                  );

                  return (
                    <div
                      key={step}
                      className={`flex items-center gap-2 p-2 rounded text-sm ${
                        isCurrentStep
                          ? "bg-primary/5 border border-primary/20"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${
                          isCompleted
                            ? "bg-green-500 text-white"
                            : isCurrentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step}
                      </div>
                      <span
                        className={`truncate ${
                          isCurrentStep
                            ? "font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {info?.title || `第${step}步`}
                      </span>
                      {hasNeedsReview && (
                        <Badge
                          variant="outline"
                          className="ml-auto text-[10px] text-orange-500 border-orange-500/30 shrink-0"
                        >
                          待审
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                产出物 ({deliverables?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deliverables && deliverables.length > 0 ? (
                <div className="space-y-2">
                  {deliverables.map((d) => (
                    <div key={d.id} className="p-2 border rounded-lg">
                      <p className="text-sm font-medium truncate">
                        {d.title || "未命名文档"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        第{d.step_number}步 ·{" "}
                        {new Date(d.created_at).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  暂无产出物
                </p>
              )}
            </CardContent>
          </Card>

          {/* Feedback History */}
          {feedbackHistory && feedbackHistory.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">历史反馈</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {feedbackHistory.map((fb) => (
                  <div key={fb.id} className="p-2 bg-muted/50 rounded text-sm">
                    <p>
                      {(fb.content as string).replace("[教师反馈] ", "")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(fb.created_at).toLocaleString("zh-CN")}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
