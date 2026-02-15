import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ProgressMap } from "@/components/project/ProgressMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { STEP_TITLES } from "@/types/project";
import { ArrowRight, FileText } from "lucide-react";
import Link from "next/link";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) {
    notFound();
  }

  const { data: deliverables } = await supabase
    .from("deliverables")
    .select("*")
    .eq("project_id", id)
    .order("step_number");

  const currentStepInfo = STEP_TITLES[project.current_step];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Project Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-2xl font-bold">
            {project.title || "未命名项目"}
          </h1>
          <Badge variant="default">
            {project.status === "active" ? "进行中" : "已完成"}
          </Badge>
        </div>
        {project.description && (
          <p className="text-muted-foreground">{project.description}</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Current Task */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-3">
              <p className="text-xs text-primary font-medium">当前任务</p>
              <CardTitle className="text-lg">
                第{project.current_step}步：{currentStepInfo?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {currentStepInfo?.description}
              </p>
              <Link href={`/project/${id}/step/${project.current_step}`}>
                <Button>
                  继续工作
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Deliverables */}
          {deliverables && deliverables.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold">已产出的文档</h2>
                <Link href={`/project/${id}/deliverables`}>
                  <Button variant="ghost" size="sm">
                    查看全部
                  </Button>
                </Link>
              </div>
              <div className="space-y-2">
                {deliverables.slice(0, 3).map((d) => (
                  <Card key={d.id}>
                    <CardContent className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{d.title}</p>
                        <p className="text-xs text-muted-foreground">
                          第{d.step_number}步
                        </p>
                      </div>
                      <Badge variant="outline">
                        {d.status === "draft" ? "草稿" : "已提交"}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Progress Map */}
        <div>
          <h2 className="font-semibold mb-3">项目进度</h2>
          <ProgressMap currentStep={project.current_step} />
        </div>
      </div>
    </div>
  );
}
