"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown, ChevronUp } from "lucide-react";
import type { Deliverable } from "@/types/database";
import ReactMarkdown from "react-markdown";

interface ParentDeliverableListProps {
  deliverables: Deliverable[];
}

export function ParentDeliverableList({ deliverables }: ParentDeliverableListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {deliverables.map((d) => {
        const isExpanded = expandedId === d.id;
        const content = d.content as Record<string, unknown>;
        const document = (content?.document as string) || "";

        return (
          <Card key={d.id}>
            <CardContent className="py-3">
              <button
                className="flex items-center gap-3 w-full text-left"
                onClick={() => setExpandedId(isExpanded ? null : d.id)}
              >
                <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{d.title}</p>
                  <p className="text-xs text-muted-foreground">
                    第{d.step_number}步
                  </p>
                </div>
                <Badge variant="outline" className="shrink-0">
                  {d.status === "draft" ? "草稿" : "已提交"}
                </Badge>
                {document && (
                  isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  )
                )}
              </button>

              {isExpanded && document && (
                <div className="mt-3 pt-3 border-t">
                  <div className="prose prose-sm max-w-none text-foreground/80">
                    <ReactMarkdown>{document}</ReactMarkdown>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
