import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import { DeliverableContent } from "./DeliverableContent";

export default async function DeliverableDetailPage({
  params,
}: {
  params: Promise<{ id: string; deliverableId: string }>;
}) {
  const { id, deliverableId } = await params;
  const supabase = await createClient();

  const { data: deliverable } = await supabase
    .from("deliverables")
    .select("*")
    .eq("id", deliverableId)
    .single();

  if (!deliverable) {
    notFound();
  }

  const content = deliverable.content as Record<string, unknown>;
  const document = (content?.document as string) || "";

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/project/${id}/deliverables`}>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{deliverable.title}</h1>
          <p className="text-sm text-muted-foreground">
            第{deliverable.step_number}步 · 版本 {deliverable.version}
          </p>
        </div>
        <Badge variant={deliverable.status === "draft" ? "outline" : "default"}>
          {deliverable.status === "draft" ? "草稿" : "已提交"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">文档内容</CardTitle>
        </CardHeader>
        <CardContent>
          {document ? (
            <DeliverableContent content={document} deliverableId={deliverableId} title={deliverable.title} />
          ) : (
            <p className="text-muted-foreground text-sm">暂无文档内容</p>
          )}
        </CardContent>
      </Card>

      {/* Export buttons */}
      <div className="flex gap-2 mt-4">
        <DeliverableContent
          content={document}
          deliverableId={deliverableId}
          title={deliverable.title}
          exportOnly
        />
      </div>
    </div>
  );
}
