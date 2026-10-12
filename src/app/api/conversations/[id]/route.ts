import { NextResponse } from "next/server";
import { getConversationWithMessages, updateConversationTitle, deleteConversation } from "@/services/conversation-service";
import { updateConversationSchema } from "@/lib/validations/conversation";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getConversationWithMessages(id);
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load conversation" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await req.json();
    const validation = updateConversationSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid title", details: validation.error.format() }, { status: 400 });
    }

    const updated = await updateConversationTitle(id, validation.data.title);
    return NextResponse.json({ success: true, conversation: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update conversation" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteConversation(id);
    return NextResponse.json({ success: true, deleted: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete conversation" }, { status: 500 });
  }
}
