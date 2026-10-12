import { NextResponse } from "next/server";
import { getDocuments, createDocument } from "@/services/document-service";
import { createDocumentSchema } from "@/lib/validations/document";
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

    const documents = await getDocuments(userId, workspaceId);
    return NextResponse.json({ success: true, documents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validation = createDocumentSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid payload", details: validation.error.format() }, { status: 400 });
    }

    let userId = "usr-default";
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) userId = user.id;
    } catch {}

    const doc = await createDocument({
      ...validation.data,
      userId,
    });

    return NextResponse.json({ success: true, document: doc }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create document" }, { status: 500 });
  }
}
