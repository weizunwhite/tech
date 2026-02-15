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
import {
  GraduationCap,
  FolderOpen,
  ArrowRight,
  Search,
} from "lucide-react";

export default async function TeacherStudentsPage() {
  const supabase = await createClient();

  // Get all students with their project counts
  const { data: students } = await supabase
    .from("users")
    .select("*")
    .eq("role", "student")
    .order("created_at", { ascending: false });

  // Get all projects grouped by student
  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("updated_at", { ascending: false });

  // Map projects to students
  const studentProjects: Record<string, typeof projects> = {};
  (projects || []).forEach((p) => {
    if (!studentProjects[p.student_id]) {
      studentProjects[p.student_id] = [];
    }
    studentProjects[p.student_id]!.push(p);
  });

  // Group students by grade
  const gradeGroups: Record<string, NonNullable<typeof students>> = {};
  (students || []).forEach((s) => {
    const grade = s.grade ? `${s.grade}年级` : "未分组";
    if (!gradeGroups[grade]) {
      gradeGroups[grade] = [];
    }
    gradeGroups[grade].push(s);
  });

  const sortedGrades = Object.keys(gradeGroups).sort((a, b) => {
    const numA = parseInt(a) || 999;
    const numB = parseInt(b) || 999;
    return numA - numB;
  });

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">学生管理</h1>
          <p className="text-muted-foreground mt-1">
            查看所有学生及其项目进展
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Search className="w-4 h-4" />
          共 {students?.length || 0} 名学生
        </div>
      </div>

      {sortedGrades.length > 0 ? (
        <div className="space-y-8">
          {sortedGrades.map((grade) => (
            <div key={grade}>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                {grade}
                <Badge variant="secondary" className="text-xs">
                  {gradeGroups[grade].length} 人
                </Badge>
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gradeGroups[grade].map((student) => {
                  const stuProjects = studentProjects[student.id] || [];
                  const activeCount = stuProjects.filter(
                    (p) => p.status === "active"
                  ).length;
                  const latestProject = stuProjects[0];

                  return (
                    <Card key={student.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-primary">
                                {student.name?.slice(0, 1) || "?"}
                              </span>
                            </div>
                            <div>
                              <CardTitle className="text-base">
                                {student.name || "未知学生"}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground">
                                {student.email}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <FolderOpen className="w-3.5 h-3.5" />
                            {stuProjects.length} 个项目
                          </span>
                          {activeCount > 0 && (
                            <Badge variant="default" className="text-xs">
                              {activeCount} 进行中
                            </Badge>
                          )}
                        </div>

                        {latestProject && (
                          <div className="p-2 bg-muted/50 rounded-lg">
                            <p className="text-xs font-medium truncate">
                              {latestProject.title || "未命名项目"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <Progress
                                value={Math.round(
                                  ((latestProject.current_step - 1) / 11) * 100
                                )}
                                className="h-1.5 flex-1"
                              />
                              <span className="text-[10px] text-muted-foreground">
                                第{latestProject.current_step}步
                              </span>
                            </div>
                          </div>
                        )}

                        {stuProjects.length > 0 ? (
                          <div className="flex gap-2">
                            {stuProjects.slice(0, 2).map((p) => (
                              <Link
                                key={p.id}
                                href={`/teacher/review/${p.id}`}
                                className="flex-1"
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full text-xs"
                                >
                                  审核
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            暂无项目
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <CardContent>
            <GraduationCap className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-muted-foreground">暂无注册学生</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
