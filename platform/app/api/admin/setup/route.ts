import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const TEST_ACCOUNTS = [
  { email: "admin@test.com", password: "test123", name: "测试管理员", role: "admin" },
  { email: "teacher@test.com", password: "test123", name: "测试教师", role: "teacher" },
  { email: "student@test.com", password: "test123", name: "测试学生", role: "student", grade: 6 },
  { email: "parent@test.com", password: "test123", name: "测试家长", role: "parent" },
];

// POST /api/admin/setup — Bootstrap all test accounts
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return Response.json(
        { error: "缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);
    const results: { email: string; role: string; status: string }[] = [];

    for (const account of TEST_ACCOUNTS) {
      // Check if already exists in users table
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", account.email)
        .limit(1)
        .single();

      if (existing) {
        results.push({ email: account.email, role: account.role, status: "已存在" });
        continue;
      }

      // Create auth user with email confirmed
      const { data: authData, error: authError } =
        await supabase.auth.admin.createUser({
          email: account.email,
          password: account.password,
          email_confirm: true,
          user_metadata: { name: account.name, role: account.role },
        });

      let authId: string | null = authData?.user?.id ?? null;

      if (authError) {
        if (authError.message.includes("already been registered")) {
          // Auth user exists, find and confirm email
          const { data: listData } = await supabase.auth.admin.listUsers();
          const found = listData?.users?.find((u) => u.email === account.email);
          if (found) {
            authId = found.id;
            if (!found.email_confirmed_at) {
              await supabase.auth.admin.updateUserById(found.id, {
                email_confirm: true,
              });
            }
          }
        } else {
          results.push({ email: account.email, role: account.role, status: "失败: " + authError.message });
          continue;
        }
      }

      if (authId) {
        await supabase.from("users").upsert(
          {
            auth_id: authId,
            email: account.email,
            name: account.name,
            role: account.role,
            grade: account.role === "student" ? (account as { grade?: number }).grade : null,
          },
          { onConflict: "auth_id" }
        );
        results.push({ email: account.email, role: account.role, status: "创建成功" });
      }
    }

    return Response.json({
      success: true,
      message: "测试账号初始化完成",
      accounts: results,
      hint: "统一密码: test123",
    });
  } catch {
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}
