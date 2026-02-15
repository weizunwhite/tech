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
import { Progress } from "@/components/ui/progress";
import { STEP_TITLES } from "@/types/project";
import {
  Users,
  GraduationCap,
  FolderOpen,
  ArrowRight,
  Heart,
} from "lucide-react";
import { AddChildForm } from "./AddChildForm";

export default async function ParentDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const parentName = user?.user_metadata?.name || "家长";

  // Get children linked to this parent (stored in user_metadata.children_ids)
  const childrenIds: string[] = user?.user_metadata?.children_ids || [];

  let children: Array<{
    student: Record<string, unknown>;
    projects: Array<Record<string, unknown>>;
  }> = [];

  if (childrenIds.length > 0) {
    // Load children profiles
    const { data: childProfiles } = await supabase
      .from("users")
      .select("*")
      .in("id", childrenIds);

    // Load their projects
    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .in("student_id", childrenIds)
      .order("updated_at", { ascending: false });

    children = (childProfiles || []).map((child) => ({
      student: child,
      projects: (projects || []).filter((p) => p.student_id === child.id),
    }));
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">你好，{parentName}！</h1>
          <p className="text-muted-foreground mt-1">
            关注孩子的科创之旅，给予鼓励和支持
          </p>
        </div>
      </div>

      {/* Children List */}
      {children.length > 0 ? (
        <div className="space-y-6 mb-8">
          {children.map(({ student, projects }) => {
            const activeProjects = projects.filter(
              (p) => p.status === "active"
            );

            return (
              <Card key={student.id as string} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {(student.name as string) || "孩子"}
                        </CardTitle>
                        <CardDescription>
                          {student.grade
                            ? `${student.grade}年级`
                            : ""}
                          {" · "}
                          {activeProjects.length} 个进行中的项目
                        </CardDescription>
                      </div>
                    </div>
                    <Link href={`/parent/${student.id}`}>
                      <Button variant="outline" size="sm">
                        详细查看
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {activeProjects.length > 0 ? (
                    <div className="space-y-3">
                      {activeProjects.slice(0, 3).map((project) => {
                        const stepInfo =
                          STEP_TITLES[project.current_step as number] ||
                          STEP_TITLES[1];
                        const progressPercent = Math.round(
                          (((project.current_step as number) - 1) / 11) * 100
                        );

                        return (
                          <div
                            key={project.id as string}
                            className="p-3 border rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {(project.title as string) || "未命名项目"}
                              </span>
                              <Badge variant="default" className="text-xs">
                                进行中
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={progressPercent}
                                className="h-1.5 flex-1"
                              />
                              <span className="text-xs text-muted-foreground">
                                第{project.current_step as number}步 · {stepInfo.title}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      暂无进行中的项目
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12 mb-8">
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">还没有关联孩子</h3>
            <p className="text-muted-foreground mb-2 max-w-sm mx-auto">
              输入孩子注册时使用的邮箱，即可关联查看他们的科创进度。
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Child Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-400" />
            关联孩子
          </CardTitle>
          <CardDescription>
            输入孩子的注册邮箱来关联查看他们的项目进度
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AddChildForm existingIds={childrenIds} />
        </CardContent>
      </Card>
    </div>
  );
}
