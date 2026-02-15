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
import { Lightbulb, GraduationCap, Users, BookOpen, Shield } from "lucide-react";

const TEST_LOGINS = [
  { email: "student@test.com", role: "student", label: "学生", icon: GraduationCap },
  { email: "teacher@test.com", role: "teacher", label: "教师", icon: BookOpen },
  { email: "parent@test.com", role: "parent", label: "家长", icon: Users },
  { email: "admin@test.com", role: "admin", label: "管理员", icon: Shield },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupStatus, setSetupStatus] = useState("");

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

  async function handleTestLogin(testEmail: string, role: string) {
    setError("");
    setSetupStatus("正在初始化测试账号...");
    setLoading(true);

    // 先确保测试账号存在
    try {
      const res = await fetch("/api/admin/setup", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "初始化失败");
        setLoading(false);
        setSetupStatus("");
        return;
      }
    } catch {
      setError("网络错误，请重试");
      setLoading(false);
      setSetupStatus("");
      return;
    }

    setSetupStatus("正在登录...");

    const supabase = createClient();
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: "test123",
    });

    if (loginError) {
      setError("登录失败: " + loginError.message);
      setLoading(false);
      setSetupStatus("");
      return;
    }

    const userRole = data.user?.user_metadata?.role || role;
    router.push(getRoleHomePath(userRole));
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

          {/* 测试快捷登录 */}
          <div className="mt-5 pt-4 border-t border-dashed">
            <p className="text-xs text-muted-foreground text-center mb-3">
              {setupStatus || "快捷测试登录（密码统一 test123）"}
            </p>
            <div className="grid grid-cols-4 gap-2">
              {TEST_LOGINS.map(({ email: testEmail, role, label, icon: Icon }) => (
                <Button
                  key={role}
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex flex-col items-center gap-1 h-auto py-2 text-xs"
                  onClick={() => handleTestLogin(testEmail, role)}
                  disabled={loading}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
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
