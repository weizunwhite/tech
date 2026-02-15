import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { StepStatus } from "@/types/project";

interface StepCardProps {
  projectId: string;
  stepNumber: number;
  title: string;
  description: string;
  status: StepStatus;
  nodeProgress?: { total: number; completed: number };
}

export function StepCard({
  projectId,
  stepNumber,
  title,
  description,
  status,
  nodeProgress,
}: StepCardProps) {
  const statusConfig = {
    completed: { label: "已完成", variant: "secondary" as const },
    in_progress: { label: "进行中", variant: "default" as const },
    not_started: { label: "未开始", variant: "outline" as const },
    locked: { label: "未解锁", variant: "outline" as const },
  };

  const config = statusConfig[status];

  return (
    <Card className={status === "locked" ? "opacity-50" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              第{stepNumber}步
            </span>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>
          {nodeProgress && (
            <span className="text-xs text-muted-foreground">
              {nodeProgress.completed}/{nodeProgress.total} 个节点
            </span>
          )}
        </div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        {status !== "locked" && (
          <Link href={`/project/${projectId}/step/${stepNumber}`}>
            <Button
              variant={status === "in_progress" ? "default" : "outline"}
              size="sm"
              className="w-full"
            >
              {status === "in_progress" ? "继续" : "查看"}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
