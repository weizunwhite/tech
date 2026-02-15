"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [adminSetupMsg, setAdminSetupMsg] = useState("");

  async function handleAdminTestLogin() {
    setError("");
    setAdminSetupMsg("正在初始化管理员账号...");
    // 先调用 setup 接口确保管理员账号存在
    try {
      await fetch("/api/admin/setup", { method: "POST" });
    } catch {
      // 忽略，可能已存在
    }
    // 自动填入并登录
    setEmail("admin@admin.com");
    setPassword("admin123");
    setAdminSetupMsg("");
    setLoading(true);

    const supabase = createClient();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: "admin@admin.com",
      password: "admin123",
    });

    if (loginError) {
      setError("管理员登录失败: " + loginError.message);
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role || "student";
    router.push(getRoleHomePath(role));
    router.refresh();
  }

  function getRoleHomePath(role: string): string {
    switch (role) {
      case "admin": return "/admin/dashboard";
      case "teacher": return "/teacher/dashboard";
      case "parent": return "/parent/dashboard";
      default: return "/dashboard";
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message === "Invalid login credentials"
        ? "邮箱或密码错误，请重试"
        : error.message);
      setLoading(false);
      return;
    }

    const role = data.user?.user_metadata?.role || "student";
    router.push(getRoleHomePath(role));
    router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">欢迎回来</CardTitle>
          <CardDescription>登录你的零一优创账号</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                placeholder="输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登录中..." : "登录"}
            </Button>
          </form>
          <div className="mt-4 pt-4 border-t border-dashed">
            <Button
              type="button"
              variant="outline"
              className="w-full text-sm"
              onClick={handleAdminTestLogin}
              disabled={loading}
            >
              {adminSetupMsg || "🔑 管理员测试登录"}
            </Button>
            <p className="mt-1 text-center text-[11px] text-muted-foreground">
              admin@admin.com / admin123
            </p>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            还没有账号？{" "}
            <Link href="/register" className="text-primary hover:underline">
              立即注册
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
