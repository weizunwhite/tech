import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProgressMap } from "@/components/project/ProgressMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { STEP_TITLES } from "@/types/project";
import { Lightbulb, FolderOpen, FileText, MessageCircle, BarChart3 } from "lucide-react";
import { ParentDeliverableList } from "./ParentDeliverableList";
import { ParentCommentForm } from "./ParentCommentForm";

export default async function ParentViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: studentId } = await params;
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("users")
    .select("*")
    .eq("id", studentId)
    .single();

  if (!student) {
    notFound();
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("student_id", studentId)
    .order("updated_at", { ascending: false });

  const projectIds = projects?.map((p) => p.id) || [];
  const { data: deliverables } = projectIds.length
    ? await supabase
        .from("deliverables")
        .select("*")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false })
    : { data: [] };

  // Load conversation stats
  const { count: totalConversations } = projectIds.length
    ? await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .in("project_id", projectIds)
    : { count: 0 };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto max-w-4xl px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{student.name}的科创之旅</h1>
              <p className="text-sm text-muted-foreground">
                {student.grade ? `${student.grade}年级` : ""} · 零一优创
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Stats overview */}
        {projects && projects.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-xs text-muted-foreground">进行中的项目</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{deliverables?.length || 0}</p>
                  <p className="text-xs text-muted-foreground">产出文档</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 py-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalConversations || 0}</p>
                  <p className="text-xs text-muted-foreground">AI对话轮数</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {projects && projects.length > 0 ? (
          <div className="space-y-8">
            {projects.map((project) => {
              const stepInfo = STEP_TITLES[project.current_step];
              const progressPercent = Math.round(
                ((project.current_step - 1) / 11) * 100
              );
              const projectDeliverables =
                deliverables?.filter((d) => d.project_id === project.id) || [];

              return (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{project.title || "未命名项目"}</CardTitle>
                      <Badge variant="default">
                        {project.status === "active" ? "进行中" : "已完成"}
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">
                          当前：第{project.current_step}步 · {stepInfo?.title}
                        </span>
                        <span className="text-muted-foreground">
                          {progressPercent}%
                        </span>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-semibold mb-3">进度地图</h3>
                        <ProgressMap currentStep={project.current_step} />
                      </div>
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-sm font-semibold mb-3">
                            产出物 ({projectDeliverables.length})
                          </h3>
                          {projectDeliverables.length > 0 ? (
                            <ParentDeliverableList deliverables={projectDeliverables} />
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                              <p className="text-sm">暂无产出物</p>
                            </div>
                          )}
                        </div>

                        {/* Comment / encouragement */}
                        <div>
                          <h3 className="text-sm font-semibold mb-3">
                            给孩子留言鼓励
                          </h3>
                          <ParentCommentForm
                            projectId={project.id}
                            studentName={student.name || "孩子"}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">暂无项目</p>
          </div>
        )}
      </div>
    </div>
  );
}
