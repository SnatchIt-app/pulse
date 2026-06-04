import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireWriteAccess } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 8 * 1024 * 1024; // 8MB

export async function POST(req: Request) {
  const denied = await requireWriteAccess();
  if (denied) return denied;

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "invalid_file" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ ok: false, error: "invalid_type" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 400 });
  }

  // Derive a safe extension from the file name.
  const rawExt = file.name.includes(".") ? (file.name.split(".").pop() ?? "") : "";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";

  const path = `assets/${crypto.randomUUID()}.${ext}`;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from("asset-images")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    console.error("[assets/upload] Upload error:", error.message);
    return NextResponse.json({ ok: false, error: "upload_failed" }, { status: 500 });
  }

  const { data } = supabase.storage.from("asset-images").getPublicUrl(path);

  return NextResponse.json({ ok: true, url: data.publicUrl });
}
