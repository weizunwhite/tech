import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { STEP_TITLES } from "@/types/project";
import type { Project } from "@/types/database";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const stepInfo = STEP_TITLES[project.current_step] || STEP_TITLES[1];
  const progressPercent = Math.round(((project.current_step - 1) / 11) * 100);

  return (
    <Link href={`/project/${project.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              {project.title || "未命名项目"}
            </CardTitle>
            <Badge
              variant={project.status === "active" ? "default" : "secondary"}
            >
              {project.status === "active" ? "进行中" : "已完成"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              当前：第{project.current_step}步 · {stepInfo.title}
            </span>
            <span className="text-muted-foreground">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>
    </Link>
  );
}
