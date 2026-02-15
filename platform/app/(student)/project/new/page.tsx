"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Rocket } from "lucide-react";
import Link from "next/link";

export default function NewProjectPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();

    // Get current user's profile
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("请先登录");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (!profile) {
      setError("用户信息未找到，请重新登录");
      setLoading(false);
      return;
    }

    // Create project
    const { data: project, error: createError } = await supabase
      .from("projects")
      .insert({
        student_id: profile.id,
        title: title || null,
        description: description || null,
        current_step: 1,
        current_node: "1.1",
      })
      .select()
      .single();

    if (createError) {
      setError("创建失败，请重试");
      setLoading(false);
      return;
    }

    // Initialize step progress for step 1
    await supabase.from("step_progress").insert([
      { project_id: project.id, step_number: 1, node_id: "1.1", status: "in_progress", started_at: new Date().toISOString() },
      { project_id: project.id, step_number: 1, node_id: "1.2", status: "not_started" },
      { project_id: project.id, step_number: 1, node_id: "1.3", status: "not_started" },
    ]);

    router.push(`/project/${project.id}`);
  }

  return (
    <div className="container mx-auto max-w-lg px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        返回仪表盘
      </Link>

      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-xl">创建新项目</CardTitle>
          <CardDescription>
            不用想太多，项目名称和描述后面都可以修改。我们先开始吧！
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">项目名称（选填）</Label>
              <Input
                id="title"
                placeholder="比如：智能药盒、教室空气质量监测..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                没想好也没关系，在引导过程中可以随时修改
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">简短描述（选填）</Label>
              <Textarea
                id="description"
                placeholder="简单描述一下你想做什么，或者你观察到的问题..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "创建中..." : "开始科创之旅"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
