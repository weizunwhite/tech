import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// POST /api/admin/setup — Bootstrap the admin account
// Only works if no admin account exists yet
export async function POST(request: NextRequest) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return Response.json(
        { error: "缺少 SUPABASE_SERVICE_ROLE_KEY 环境变量，无法创建管理员" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Check if admin already exists in users table
    const { data: existingAdmin } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (existingAdmin) {
      return Response.json(
        { message: "管理员账号已存在，可直接登录", email: "admin@admin.com" },
        { status: 200 }
      );
    }

    // Use admin API to create user with email pre-confirmed
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: "admin@admin.com",
        password: "admin123",
        email_confirm: true,
        user_metadata: { name: "管理员", role: "admin" },
      });

    if (authError) {
      // If auth user already exists but not in users table, look it up
      if (authError.message.includes("already been registered")) {
        const { data: listData } = await supabase.auth.admin.listUsers();
        const existingAuthUser = listData?.users?.find(
          (u) => u.email === "admin@admin.com"
        );

        if (existingAuthUser) {
          // Confirm email if not confirmed
          if (!existingAuthUser.email_confirmed_at) {
            await supabase.auth.admin.updateUserById(existingAuthUser.id, {
              email_confirm: true,
            });
          }

          // Create profile in users table
          await supabase.from("users").upsert(
            {
              auth_id: existingAuthUser.id,
              email: "admin@admin.com",
              name: "管理员",
              role: "admin",
            },
            { onConflict: "auth_id" }
          );

          return Response.json({
            success: true,
            message: "管理员账号已修复（邮箱已确认），可直接登录",
            email: "admin@admin.com",
          });
        }
      }

      return Response.json(
        { error: "创建失败: " + authError.message },
        { status: 500 }
      );
    }

    // Create user profile in users table
    if (authData.user) {
      const { error: profileError } = await supabase.from("users").insert({
        auth_id: authData.user.id,
        email: "admin@admin.com",
        name: "管理员",
        role: "admin",
      });

      if (profileError) {
        console.error("Admin profile creation error:", profileError);
      }
    }

    return Response.json({
      success: true,
      message: "管理员账号创建成功",
      email: "admin@admin.com",
      hint: "请使用 admin@admin.com / admin123 登录",
    });
  } catch {
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}
