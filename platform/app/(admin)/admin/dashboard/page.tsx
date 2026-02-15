import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  GraduationCap,
  BookOpen,
  FolderOpen,
  AlertCircle,
  ArrowRight,
  Shield,
  UserCheck,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Get user counts by role
  const { count: studentCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "student");

  const { count: teacherCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "teacher");

  const { count: parentCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("role", "parent");

  const { count: totalUsers } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true });

  // Get project stats
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true });

  const { count: activeProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  // Get help requests
  const { data: helpRequests } = await supabase
    .from("conversations")
    .select("*, projects(title, student_id)")
    .eq("role", "system")
    .like("content", "%[需要帮助]%")
    .order("created_at", { ascending: false })
    .limit(5);

  // Get recent users
  const { data: recentUsers } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(8);

  // Get deliverable count
  const { count: deliverableCount } = await supabase
    .from("deliverables")
    .select("*", { count: "exact", head: true });

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">管理后台</h1>
        </div>
        <p className="text-muted-foreground">
          平台全局数据概览和管理
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{totalUsers || 0}</p>
              <p className="text-xs text-muted-foreground">总用户数</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{studentCount || 0}</p>
              <p className="text-xs text-muted-foreground">学生</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{teacherCount || 0}</p>
              <p className="text-xs text-muted-foreground">教师</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{parentCount || 0}</p>
              <p className="text-xs text-muted-foreground">家长</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second row stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">项目总数</p>
            <p className="text-3xl font-bold mt-1">{totalProjects || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">
              其中 {activeProjects || 0} 个进行中
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">产出文档</p>
            <p className="text-3xl font-bold mt-1">{deliverableCount || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">待处理求助</p>
            <p className="text-3xl font-bold mt-1">{helpRequests?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">最新注册用户</CardTitle>
                <CardDescription>最近加入平台的用户</CardDescription>
              </div>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">
                  全部用户 <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-3">
                {recentUsers.map((u) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-primary">
                          {u.name?.slice(0, 1) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{u.name || "未知"}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        u.role === "teacher"
                          ? "text-purple-600 border-purple-300"
                          : u.role === "parent"
                          ? "text-orange-600 border-orange-300"
                          : "text-green-600 border-green-300"
                      }
                    >
                      {u.role === "teacher"
                        ? "教师"
                        : u.role === "parent"
                        ? "家长"
                        : "学生"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                暂无用户
              </p>
            )}
          </CardContent>
        </Card>

        {/* Help Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              学生求助
            </CardTitle>
            <CardDescription>需要教师介入的请求</CardDescription>
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
      </div>
    </div>
  );
}
