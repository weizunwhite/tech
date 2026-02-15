import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FolderOpen,
  AlertCircle,
  ArrowRight,
  GraduationCap,
} from "lucide-react";

export default async function TeacherDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get all students
  const { data: students, count: studentCount } = await supabase
    .from("users")
    .select("*", { count: "exact" })
    .eq("role", "student");

  // Get all projects
  const { data: projects, count: projectCount } = await supabase
    .from("projects")
    .select("*, users!projects_student_id_fkey(name, grade)")
    .order("updated_at", { ascending: false });

  // Get help requests (conversations with [需要帮助])
  const { data: helpRequests } = await supabase
    .from("conversations")
    .select("*, projects(title, student_id)")
    .eq("role", "system")
    .like("content", "%[需要帮助]%")
    .order("created_at", { ascending: false })
    .limit(10);

  // Get recent teacher feedback
  const { data: recentFeedback } = await supabase
    .from("conversations")
    .select("*, projects(title)")
    .eq("role", "system")
    .like("content", "%[教师反馈]%")
    .order("created_at", { ascending: false })
    .limit(5);

  const activeProjects = projects?.filter((p) => p.status === "active") || [];
  const teacherName = user?.user_metadata?.name || "老师";

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">你好，{teacherName}！</h1>
        <p className="text-muted-foreground mt-1">
          这里是学生科创项目的管理概览
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentCount || 0}</p>
              <p className="text-xs text-muted-foreground">注册学生</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeProjects.length}</p>
              <p className="text-xs text-muted-foreground">进行中的项目</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{helpRequests?.length || 0}</p>
              <p className="text-xs text-muted-foreground">待处理求助</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Help Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              学生求助
            </CardTitle>
            <CardDescription>需要教师介入指导的请求</CardDescription>
          </CardHeader>
          <CardContent>
            {helpRequests && helpRequests.length > 0 ? (
              <div className="space-y-3">
                {helpRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {req.projects?.title || "未命名项目"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        第{req.step_number}步 ·{" "}
                        {new Date(req.created_at).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                    <Link href={`/teacher/review/${req.project_id}`}>
                      <Button size="sm" variant="outline">
                        查看
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">暂无求助请求</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  最近活跃项目
                </CardTitle>
                <CardDescription>学生最近更新的项目</CardDescription>
              </div>
              <Link href="/teacher/students">
                <Button variant="ghost" size="sm">
                  查看全部
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {activeProjects.length > 0 ? (
              <div className="space-y-3">
                {activeProjects.slice(0, 6).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <GraduationCap className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {project.title || "未命名项目"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {project.users?.name || "学生"}{" "}
                          {project.users?.grade
                            ? `· ${project.users.grade}年级`
                            : ""}{" "}
                          · 第{project.current_step}步
                        </p>
                      </div>
                    </div>
                    <Link href={`/teacher/review/${project.id}`}>
                      <Button size="sm" variant="ghost">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">暂无活跃项目</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback */}
      {recentFeedback && recentFeedback.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">我的最近反馈</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentFeedback.map((fb) => (
                <div
                  key={fb.id}
                  className="flex items-center gap-3 p-2 rounded text-sm"
                >
                  <Badge variant="outline" className="shrink-0">
                    反馈
                  </Badge>
                  <span className="text-muted-foreground truncate">
                    {(fb.content as string).replace("[教师反馈] ", "")}
                  </span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-auto">
                    {new Date(fb.created_at).toLocaleDateString("zh-CN")}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
