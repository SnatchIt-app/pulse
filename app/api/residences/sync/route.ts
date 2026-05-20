import { NextResponse } from "next/server";

// Protected residences availability sync endpoint.
// Phase 1: secret-gated shell that returns 501. Phase 6 implements iCal/API fetch
// + parse + upsert into residence_availability. Server-side only; source URLs
// (source_calendar_url) never leave Supabase.
export async function POST(req: Request) {
  const provided = req.headers.get("x-sync-secret");
  const expected = process.env.SYNC_SECRET;
  if (!expected || provided !== expected) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ ok: false, error: "not_implemented", phase: 6 }, { status: 501 });
}
