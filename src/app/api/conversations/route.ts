import { NextResponse } from "next/server";
import { getConversations, createConversation } from "@/services/conversation-service";
import { createConversationSchema } from "@/lib/validations/conversation";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workspaceId = searchParams.get("workspaceId") || undefined;

    let userId = "usr-default";
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {}

    const conversations = await getConversations(userId, workspaceId);
    return NextResponse.json({ success: true, conversations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validation = createConversationSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid payload", details: validation.error.format() }, { status: 400 });
    }

    let userId = "usr-default";
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {}

    const workspaceId = validation.data.workspaceId || "ws-default";
    const newConv = await createConversation(userId, workspaceId, validation.data.title);

    return NextResponse.json({ success: true, conversation: newConv }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create conversation" }, { status: 500 });
  }
}
