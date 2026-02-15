import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, FileCheck, FileClock, FileWarning } from "lucide-react";
import type { Deliverable } from "@/types/database";

interface DeliverableCardProps {
  deliverable: Deliverable;
  projectId?: string;
}

const statusConfig = {
  draft: { label: "草稿", variant: "outline" as const, Icon: FileClock },
  submitted: { label: "已提交", variant: "default" as const, Icon: FileText },
  approved: { label: "已通过", variant: "secondary" as const, Icon: FileCheck },
  revision_needed: {
    label: "需修改",
    variant: "destructive" as const,
    Icon: FileWarning,
  },
};

export function DeliverableCard({ deliverable, projectId }: DeliverableCardProps) {
  const config = statusConfig[deliverable.status];
  const Icon = config.Icon;

  const cardContent = (
    <Card className="hover:shadow-sm transition-shadow cursor-pointer">
      <CardContent className="flex items-center gap-4 py-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{deliverable.title}</h4>
          <p className="text-xs text-muted-foreground">
            第{deliverable.step_number}步 · 版本 {deliverable.version}
          </p>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </CardContent>
    </Card>
  );

  const pid = projectId || deliverable.project_id;
  if (pid) {
    return (
      <Link href={`/project/${pid}/deliverables/${deliverable.id}`}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
