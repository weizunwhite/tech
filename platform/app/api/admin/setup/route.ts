import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

// POST /api/admin/setup — Bootstrap the admin account
// Only works if no admin account exists yet
export async function POST(request: NextRequest) {
  try {
    // Use service role key if available, otherwise fall back to anon key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if admin already exists in users table
    const { data: existingAdmin } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin")
      .limit(1)
      .single();

    if (existingAdmin) {
      return Response.json(
        { error: "管理员账号已存在，无需重复创建" },
        { status: 400 }
      );
    }

    // Create admin auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: "admin@admin.com",
      password: "admin123",
      options: {
        data: { name: "管理员", role: "admin" },
      },
    });

    if (authError) {
      // If user already exists in auth but not in users table
      if (authError.message.includes("already registered")) {
        // Try to sign in to get the user ID
        const { data: signInData, error: signInError } =
          await supabase.auth.signInWithPassword({
            email: "admin@admin.com",
            password: "admin123",
          });

        if (signInError) {
          return Response.json(
            { error: "管理员认证账号已存在但登录失败: " + signInError.message },
            { status: 500 }
          );
        }

        if (signInData.user) {
          // Create profile in users table
          await supabase.from("users").insert({
            auth_id: signInData.user.id,
            email: "admin@admin.com",
            name: "管理员",
            role: "admin",
          });

          return Response.json({
            success: true,
            message: "管理员账号已同步到用户表",
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
