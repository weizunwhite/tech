import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { stepNumber, nodeId, reason } = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未登录" }, { status: 401 });
    }

    // Save help request to conversations as a system message
    await supabase.from("conversations").insert({
      project_id: projectId,
      step_number: stepNumber,
      node_id: nodeId,
      role: "system",
      content: `[需要帮助] 学生请求老师介入。原因：${reason || "未说明"}`,
    });

    // Update step progress to mark it needs review
    await supabase
      .from("step_progress")
      .update({ status: "needs_review" })
      .eq("project_id", projectId)
      .eq("step_number", stepNumber)
      .eq("node_id", nodeId);

    return Response.json({ success: true, message: "已通知老师，请稍等" });
  } catch {
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}
