import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chatStream } from "@/lib/ai/client";
import { buildContext } from "@/lib/ai/context-builder";

export async function POST(request: NextRequest) {
  try {
    const { projectId, stepNumber, nodeId, message } = await request.json();

    if (!projectId || !stepNumber || !nodeId || !message) {
      return Response.json({ error: "缺少必要参数" }, { status: 400 });
    }

    const supabase = await createClient();

    // Verify user is authenticated
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

    // Load student profile
    const { data: profile } = await supabase
      .from("users")
      .select("grade")
      .eq("auth_id", user.id)
      .single();

    // Load conversation history for this node
    const { data: history } = await supabase
      .from("conversations")
      .select("role, content")
      .eq("project_id", projectId)
      .eq("step_number", stepNumber)
      .eq("node_id", nodeId)
      .order("created_at");

    // Load previous deliverables
    const { data: deliverables } = await supabase
      .from("deliverables")
      .select("title, content")
      .eq("project_id", projectId)
      .lt("step_number", stepNumber);

    // Load previous node's form data (e.g., 1.1 data for 1.2)
    let previousFormData = null;
    let selectedProblem = null;

    if (nodeId === "1.2") {
      // Load 1.1 observation form data
      const { data: formData } = await supabase
        .from("form_submissions")
        .select("data")
        .eq("project_id", projectId)
        .eq("step_number", stepNumber)
        .eq("node_id", "1.1")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();
      previousFormData = formData?.data || null;
    }

    if (nodeId === "1.3") {
      // Extract selected problem from 1.2 conversation
      const { data: conv12 } = await supabase
        .from("conversations")
        .select("role, content")
        .eq("project_id", projectId)
        .eq("step_number", stepNumber)
        .eq("node_id", "1.2")
        .order("created_at");

      // Get the student's last few messages as the selected problem context
      const studentMessages = (conv12 || [])
        .filter((c) => c.role === "user")
        .map((c) => c.content);
      if (studentMessages.length > 0) {
        selectedProblem = studentMessages.slice(-3).join("\n");
      }
    }

    // Build AI context
    const context = buildContext({
      stepNumber,
      nodeId,
      projectTitle: project.title,
      studentGrade: profile?.grade,
      previousDeliverables: deliverables || [],
      conversationHistory:
        history?.map((h) => ({
          role: h.role as "user" | "assistant",
          content: h.content,
        })) || [],
      previousFormData,
      selectedProblem,
    });

    if (!context) {
      return Response.json({ error: "步骤配置不存在" }, { status: 400 });
    }

    // Save user message to database
    await supabase.from("conversations").insert({
      project_id: projectId,
      step_number: stepNumber,
      node_id: nodeId,
      role: "user",
      content: message,
    });

    // Build messages for AI (history + new message)
    const aiMessages = [
      ...context.currentConversation,
      { role: "user" as const, content: message },
    ];

    // Stream response using SSE
    const encoder = new TextEncoder();
    let fullReply = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatStream({
            systemPrompt: context.systemPrompt,
            messages: aiMessages,
          })) {
            fullReply += chunk;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`)
            );
          }

          // Save assistant reply to database (strip any residual think tags)
          const cleanReply = fullReply
            .replace(/<think>[\s\S]*?<\/think>/g, "")
            .trim();
          await supabase.from("conversations").insert({
            project_id: projectId,
            step_number: stepNumber,
            node_id: nodeId,
            role: "assistant",
            content: cleanReply,
          });

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "AI服务暂时不可用";
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: errorMsg })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return Response.json({ error: "服务器错误，请稍后再试" }, { status: 500 });
  }
}
