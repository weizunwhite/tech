"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus } from "lucide-react";

interface AddChildFormProps {
  existingIds: string[];
}

export function AddChildForm({ existingIds }: AddChildFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/parent/link-child", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "关联失败");
        setLoading(false);
        return;
      }

      toast.success(`已成功关联 ${data.name || "孩子"}`);
      setEmail("");
      router.refresh();
    } catch {
      toast.error("操作失败，请重试");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleAdd} className="flex gap-3">
      <Input
        type="email"
        placeholder="孩子的注册邮箱"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="flex-1"
      />
      <Button type="submit" disabled={loading}>
        <Plus className="w-4 h-4 mr-1" />
        {loading ? "关联中..." : "关联"}
      </Button>
    </form>
  );
}
