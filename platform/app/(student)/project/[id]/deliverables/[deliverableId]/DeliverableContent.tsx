"use client";

import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeliverableContentProps {
  content: string;
  deliverableId: string;
  title: string;
  exportOnly?: boolean;
}

export function DeliverableContent({
  content,
  title,
  exportOnly = false,
}: DeliverableContentProps) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("已复制到剪贴板");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleExportMarkdown() {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.md`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("已下载 Markdown 文件");
  }

  if (exportOnly) {
    return (
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={handleExportMarkdown}>
          <Download className="w-4 h-4 mr-1" />
          下载 Markdown
        </Button>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
          {copied ? "已复制" : "复制内容"}
        </Button>
      </div>
    );
  }

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground/80">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
