import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  residenceSlug: z.string().min(1),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  guests: z.number().int().positive().optional(),
  budget: z.number().nonnegative().optional(),
  message: z.string().max(2000).optional(),
});

// Phase 1: validate + accept. Phase 4 wires Supabase writes (leads + residence_requests).
export async function POST(req: Request) {
  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }
  return NextResponse.json(
    { ok: true, received: { residenceSlug: parsed.residenceSlug } },
    { status: 202 },
  );
}
