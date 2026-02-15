import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Rocket, ArrowRight, FileText, MessageSquare } from "lucide-react";
import { STEP_TITLES } from "@/types/project";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userProfile } = await supabase
    .from("users")
    .select("*")
    .eq("auth_id", user?.id)
    .single();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("student_id", userProfile?.id || "")
    .order("updated_at", { ascending: false });

  // Get deliverable counts per project
  const projectIds = projects?.map((p) => p.id) || [];
  const { data: deliverables } = projectIds.length
    ? await supabase
        .from("deliverables")
        .select("project_id")
        .in("project_id", projectIds)
    : { data: [] };

  const deliverableCounts: Record<string, number> = {};
  (deliverables || []).forEach((d) => {
    deliverableCounts[d.project_id] = (deliverableCounts[d.project_id] || 0) + 1;
  });

  // Check for parent comments/encouragements
  const { data: comments } = projectIds.length
    ? await supabase
        .from("conversations")
        .select("content, created_at, project_id")
        .in("project_id", projectIds)
        .eq("node_id", "comment")
        .order("created_at", { ascending: false })
        .limit(3)
    : { data: [] };

  // Check for teacher feedback
  const { data: teacherFeedback } = projectIds.length
    ? await supabase
        .from("conversations")
        .select("content, created_at, project_id")
        .in("project_id", projectIds)
        .eq("role", "system")
        .like("content", "%[教师反馈]%")
        .order("created_at", { ascending: false })
        .limit(3)
    : { data: [] };

  const userName = userProfile?.name || user?.user_metadata?.name || "同学";

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">你好，{userName}！</h1>
          <p className="text-muted-foreground mt-1">
            准备好开始你的科创之旅了吗？
          </p>
        </div>
        <Link href="/project/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            新建项目
          </Button>
        </Link>
      </div>

      {/* Teacher feedback */}
      {teacherFeedback && teacherFeedback.length > 0 && (
        <Card className="mb-4 border-blue-500/20 bg-blue-500/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">老师的反馈</p>
                {teacherFeedback.slice(0, 2).map((fb, i) => (
                  <p key={i} className="text-sm text-muted-foreground">
                    {(fb.content as string).replace("[教师反馈] ", "")}
                  </p>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parent encouragements */}
      {comments && comments.length > 0 && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center shrink-0">
                <span className="text-sm">&#10084;&#65039;</span>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">来自家长的鼓励</p>
                <p className="text-sm text-muted-foreground">
                  {(comments[0].content as string).replace(/\[.*?\]\s*/, "")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects List */}
      {projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => {
            const stepInfo = STEP_TITLES[project.current_step] || STEP_TITLES[1];
            const progressPercent = Math.round(
              ((project.current_step - 1) / 11) * 100
            );
            const delCount = deliverableCounts[project.id] || 0;

            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {project.title || "未命名项目"}
                    </CardTitle>
                    <Badge
                      variant={
                        project.status === "active"
                          ? "default"
                          : project.status === "completed"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {project.status === "active"
                        ? "进行中"
                        : project.status === "completed"
                        ? "已完成"
                        : project.status === "paused"
                        ? "暂停"
                        : "归档"}
                    </Badge>
                  </div>
                  {project.description && (
                    <CardDescription>{project.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">
                        当前：第{project.current_step}步 · {stepInfo.title}
                      </span>
                      <span className="text-muted-foreground">
                        {progressPercent}%
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>

                  {/* Current task card */}
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shrink-0">
                        <ArrowRight className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">下一步要做的</p>
                        <p className="text-xs text-muted-foreground">
                          {stepInfo.description}
                        </p>
                      </div>
                      <Link href={`/project/${project.id}/step/${project.current_step}`}>
                        <Button size="sm">继续</Button>
                      </Link>
                    </CardContent>
                  </Card>

                  {/* Stats row */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" />
                      {delCount} 个产出物
                    </span>
                    <Link
                      href={`/project/${project.id}/deliverables`}
                      className="hover:text-primary transition-colors"
                    >
                      查看产出物
                    </Link>
                    <span className="ml-auto">
                      <Link href={`/project/${project.id}`} className="hover:text-primary transition-colors">
                        项目详情
                      </Link>
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">还没有项目</h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              创建你的第一个科创项目，AI助手会一步步引导你完成从问题发现到成果展示的全过程。
            </p>
            <Link href="/project/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                创建第一个项目
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
