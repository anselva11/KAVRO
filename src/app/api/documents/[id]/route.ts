import { NextResponse } from "next/server";
import { getDocumentById, updateDocument, deleteDocument } from "@/services/document-service";
import { updateDocumentSchema } from "@/lib/validations/document";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const document = await getDocumentById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, document });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load document" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const json = await req.json();
    const validation = updateDocumentSchema.safeParse(json);

    if (!validation.success) {
      return NextResponse.json({ error: "Invalid updates", details: validation.error.format() }, { status: 400 });
    }

    const updated = await updateDocument(id, validation.data);
    if (!updated) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, document: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update document" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteDocument(id);
    return NextResponse.json({ success: true, deleted: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete document" }, { status: 500 });
  }
}
