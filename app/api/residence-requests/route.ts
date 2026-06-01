import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeDate, isValidYMD, isFutureDate, isAfter } from "@/lib/dates";

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

// Phase 1: validate + accept. Future phase wires Supabase writes.
export async function POST(req: Request) {
  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  // Normalize blank dates to null; reject invalid / past / same-day dates.
  const startDate = normalizeDate(parsed.startDate);
  const endDate = normalizeDate(parsed.endDate);

  for (const value of [startDate, endDate]) {
    if (value === null) continue;
    if (!isValidYMD(value)) {
      console.warn("[residence-requests] Rejected invalid date format");
      return NextResponse.json(
        { ok: false, error: "invalid_date", message: "Please enter a valid date." },
        { status: 400 },
      );
    }
    if (!isFutureDate(value)) {
      console.warn("[residence-requests] Rejected past/same-day date");
      return NextResponse.json(
        {
          ok: false,
          error: "invalid_date",
          message:
            "Requested dates must be at least one day in advance. Please choose a date from tomorrow onward.",
        },
        { status: 400 },
      );
    }
  }

  if (startDate && endDate && !isAfter(endDate, startDate)) {
    return NextResponse.json(
      { ok: false, error: "invalid_date", message: "Check-out must be after check-in." },
      { status: 400 },
    );
  }

  return NextResponse.json(
    { ok: true, received: { residenceSlug: parsed.residenceSlug } },
    { status: 202 },
  );
}
