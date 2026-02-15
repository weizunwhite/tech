import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET: Fetch help requests and student conversations for review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未登录" }, { status: 401 });
    }

    // Load project info
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (!project) {
      return Response.json({ error: "项目不存在" }, { status: 404 });
    }

    // Load help requests (system messages containing [需要帮助])
    const { data: helpRequests } = await supabase
      .from("conversations")
      .select("*")
      .eq("project_id", projectId)
      .eq("role", "system")
      .like("content", "%[需要帮助]%")
      .order("created_at", { ascending: false });

    // Load recent conversations
    const { data: conversations } = await supabase
      .from("conversations")
      .select("*")
      .eq("project_id", projectId)
      .neq("role", "system")
      .order("created_at", { ascending: false })
      .limit(50);

    // Load step progress
    const { data: stepProgress } = await supabase
      .from("step_progress")
      .select("*")
      .eq("project_id", projectId)
      .order("step_number");

    return Response.json({
      project,
      helpRequests: helpRequests || [],
      conversations: conversations || [],
      stepProgress: stepProgress || [],
    });
  } catch {
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}

// POST: Submit teacher feedback
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { stepNumber, nodeId, feedback } = await request.json();

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "未登录" }, { status: 401 });
    }

    // Save feedback as a system conversation entry
    await supabase.from("conversations").insert({
      project_id: projectId,
      step_number: stepNumber || 0,
      node_id: nodeId || "review",
      role: "system",
      content: `[教师反馈] ${feedback}`,
    });

    // If there was a needs_review status, update it back to in_progress
    if (stepNumber && nodeId) {
      await supabase
        .from("step_progress")
        .update({ status: "in_progress" })
        .eq("project_id", projectId)
        .eq("step_number", stepNumber)
        .eq("node_id", nodeId)
        .eq("status", "needs_review");
    }

    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "服务器错误" }, { status: 500 });
  }
}
