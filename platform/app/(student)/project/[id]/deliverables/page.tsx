import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DeliverableCard } from "@/components/project/DeliverableCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FolderOpen } from "lucide-react";
import Link from "next/link";

export default async function DeliverablesPage({
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
    .order("step_number")
    .order("created_at");

  // Group by step
  type DeliverableRow = NonNullable<typeof deliverables>[number];
  const grouped = (deliverables || []).reduce(
    (acc, d) => {
      const key = d.step_number;
      if (!acc[key]) acc[key] = [];
      acc[key].push(d);
      return acc;
    },
    {} as Record<number, DeliverableRow[]>
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/project/${id}`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">产出物管理</h1>
          <p className="text-sm text-muted-foreground">
            {project.title || "未命名项目"} 的所有产出文档
          </p>
        </div>
      </div>

      {deliverables && deliverables.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(grouped).map(([step, items]) => {
            const list = items as DeliverableRow[];
            return (
              <div key={step}>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">
                  第{step}步
                </h2>
                <div className="space-y-2">
                  {list.map((d) => (
                    <DeliverableCard key={d.id} deliverable={d} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center">
              <FolderOpen className="w-7 h-7 text-muted-foreground" />
            </div>
          </div>
          <h3 className="font-medium mb-1">暂无产出物</h3>
          <p className="text-sm text-muted-foreground">
            完成项目步骤后，产出的文档会出现在这里
          </p>
        </div>
      )}
    </div>
  );
}
