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
import { Plus, Rocket, FolderOpen } from "lucide-react";
import { STEP_TITLES } from "@/types/project";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user's projects
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

  const userName = userProfile?.name || user?.user_metadata?.name || "同学";

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            你好，{userName}！
          </h1>
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

      {/* Projects List */}
      {projects && projects.length > 0 ? (
        <div className="grid gap-4">
          {projects.map((project) => {
            const stepInfo = STEP_TITLES[project.current_step] || STEP_TITLES[1];
            const progressPercent = Math.round(
              ((project.current_step - 1) / 11) * 100
            );

            return (
              <Link key={project.id} href={`/project/${project.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
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
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
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
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-16">
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Rocket className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">
              还没有项目
            </h3>
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
