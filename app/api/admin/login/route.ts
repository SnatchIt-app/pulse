import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({ password: z.string().min(1) });

// Sets pulse_admin_session cookie when password matches ADMIN_PASSWORD env var.
// Phase 5 replaces this with Supabase session auth.
export async function POST(req: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminPassword) {
    return NextResponse.json({ ok: false, error: "admin_not_configured" }, { status: 503 });
  }

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  if (parsed.password !== adminPassword) {
    return NextResponse.json({ ok: false, error: "invalid_password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true }, { status: 200 });
  res.cookies.set("pulse_admin_session", "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  return res;
}
