import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "用户未找到" }, { status: 404 });
    }

    const { data: projects } = await supabase
      .from("projects")
      .select("*")
      .eq("student_id", profile.id)
      .order("updated_at", { ascending: false });

    return NextResponse.json({ projects: projects || [] });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "未登录" }, { status: 401 });
    }

    const { title, description } = await request.json();

    const { data: profile } = await supabase
      .from("users")
      .select("id")
      .eq("auth_id", user.id)
      .single();

    if (!profile) {
      return NextResponse.json({ error: "用户未找到" }, { status: 404 });
    }

    const { data: project, error } = await supabase
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

    if (error) {
      return NextResponse.json({ error: "创建失败" }, { status: 500 });
    }

    return NextResponse.json({ project });
  } catch {
    return NextResponse.json({ error: "服务器错误" }, { status: 500 });
  }
}
