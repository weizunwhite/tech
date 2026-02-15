import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { message, type } = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未登录" }, { status: 401 });
    }

    // Save comment as a system conversation entry
    await supabase.from("conversations").insert({
      project_id: projectId,
      step_number: 0,
      node_id: "comment",
      role: "system",
      content: `[${type === "parent_encouragement" ? "家长留言" : "教师反馈"}] ${message}`,
    });

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}
