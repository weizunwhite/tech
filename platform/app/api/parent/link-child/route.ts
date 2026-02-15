import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "请输入邮箱" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未登录" }, { status: 401 });
    }

    if (user.user_metadata?.role !== "parent") {
      return Response.json({ error: "无权限" }, { status: 403 });
    }

    // Find the student by email
    const { data: student } = await supabase
      .from("users")
      .select("id, name, email, role")
      .eq("email", email)
      .eq("role", "student")
      .single();

    if (!student) {
      return Response.json(
        { error: "未找到该邮箱对应的学生账号" },
        { status: 404 }
      );
    }

    // Check if already linked
    const existingIds: string[] = user.user_metadata?.children_ids || [];
    if (existingIds.includes(student.id)) {
      return Response.json(
        { error: "该孩子已经关联过了" },
        { status: 400 }
      );
    }

    // Update parent's user_metadata with the new child ID
    const updatedIds = [...existingIds, student.id];
    const { error: updateError } = await supabase.auth.updateUser({
      data: { children_ids: updatedIds },
    });

    if (updateError) {
      return Response.json({ error: "关联失败" }, { status: 500 });
    }

    return Response.json({
      success: true,
      name: student.name,
      id: student.id,
    });
  } catch {
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}
