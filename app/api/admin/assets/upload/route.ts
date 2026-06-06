import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { requireWriteAccess } from "@/lib/auth";

export const runtime = "nodejs";

const BUCKET = "asset-images";
const MAX_BYTES = 8 * 1024 * 1024; // 8MB

type StorageClient = ReturnType<typeof getSupabaseAdmin>["storage"];

async function uploadOnce(
  storage: StorageClient,
  path: string,
  file: File,
): Promise<{ error: { message: string } | null }> {
  return storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });
}

export async function POST(req: Request) {
  const denied = await requireWriteAccess();
  if (denied) return denied;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch (err) {
    console.error("[assets/upload] formData parse error:", err);
    return NextResponse.json(
      { ok: false, error: "invalid_request", message: "Could not read the uploaded file." },
      { status: 400 },
    );
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "invalid_file", message: "No image file received." },
      { status: 400 },
    );
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { ok: false, error: "invalid_type", message: "Please choose an image file." },
      { status: 400 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "too_large", message: "Image must be 8MB or smaller." },
      { status: 400 },
    );
  }

  // Guard: env must be configured for the service-role client.
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    console.error("[assets/upload] Missing Supabase env vars");
    return NextResponse.json(
      { ok: false, error: "not_configured", message: "Image storage is not configured." },
      { status: 500 },
    );
  }

  const rawExt = file.name.includes(".") ? (file.name.split(".").pop() ?? "") : "";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `assets/${crypto.randomUUID()}.${ext}`;

  const supabase = getSupabaseAdmin();
  const storage = supabase.storage;

  let { error } = await uploadOnce(storage, path, file);

  // Self-heal: if the bucket is missing, create it (public) and retry once.
  if (error && /bucket not found|not found|does not exist/i.test(error.message)) {
    console.warn("[assets/upload] Bucket missing — creating", BUCKET);
    const { error: createErr } = await supabase.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: MAX_BYTES,
    });
    if (createErr && !/already exists|exists/i.test(createErr.message)) {
      console.error("[assets/upload] Bucket create error:", createErr.message);
      return NextResponse.json(
        { ok: false, error: "bucket_unavailable", message: createErr.message },
        { status: 500 },
      );
    }
    ({ error } = await uploadOnce(storage, path, file));
  }

  if (error) {
    console.error("[assets/upload] Upload error:", error.message);
    return NextResponse.json(
      { ok: false, error: "upload_failed", message: error.message },
      { status: 500 },
    );
  }

  const { data } = storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}
