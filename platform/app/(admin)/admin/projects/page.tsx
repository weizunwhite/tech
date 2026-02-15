import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { STEP_TITLES } from "@/types/project";
import { ArrowRight, FolderOpen } from "lucide-react";

export default async function AdminProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*, users!projects_student_id_fkey(name, grade, email)")
    .order("updated_at", { ascending: false });

  // Get deliverable counts
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

  // Get conversation counts
  const { data: convCounts } = projectIds.length
    ? await supabase
        .from("conversations")
        .select("project_id")
        .in("project_id", projectIds)
    : { data: [] };

  const conversationCounts: Record<string, number> = {};
  (convCounts || []).forEach((c) => {
    conversationCounts[c.project_id] = (conversationCounts[c.project_id] || 0) + 1;
  });

  const statusLabels: Record<string, string> = {
    active: "进行中",
    completed: "已完成",
    paused: "暂停",
    archived: "归档",
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">项目管理</h1>
          <p className="text-muted-foreground mt-1">
            查看和管理平台所有科创项目
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          共 {projects?.length || 0} 个项目
        </div>
      </div>

      {projects && projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => {
            const stepInfo = STEP_TITLES[project.current_step] || STEP_TITLES[1];
            const progressPercent = Math.round(
              ((project.current_step - 1) / 11) * 100
            );
            const student = project.users;

            return (
              <Card key={project.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium truncate">
                          {project.title || "未命名项目"}
                        </h3>
                        <Badge
                          variant={
                            project.status === "active"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs shrink-0"
                        >
                          {statusLabels[project.status] || project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {student?.name || "未知学生"}{" "}
                        {student?.grade ? `· ${student.grade}年级` : ""}{" "}
                        · {student?.email}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <Progress
                          value={progressPercent}
                          className="h-1.5 flex-1 max-w-xs"
                        />
                        <span className="text-xs text-muted-foreground">
                          第{project.current_step}步 · {stepInfo.title} · {progressPercent}%
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>{deliverableCounts[project.id] || 0} 个产出物</span>
                        <span>{conversationCounts[project.id] || 0} 条对话</span>
                        <span>
                          更新于{" "}
                          {new Date(project.updated_at).toLocaleDateString(
                            "zh-CN"
                          )}
                        </span>
                      </div>
                    </div>
                    <Link href={`/teacher/review/${project.id}`}>
                      <Button size="sm" variant="outline">
                        查看详情
                        <ArrowRight className="w-3 h-3 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <FolderOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">暂无项目</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
