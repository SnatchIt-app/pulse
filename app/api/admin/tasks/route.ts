import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const ENTITY_TYPES = ["lead", "booking", "client", "asset"] as const;

const CreateBody = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(4000).optional(),
  due_at: z.string().optional(),
  entity_type: z.enum(ENTITY_TYPES).optional(),
  entity_id: z.string().uuid().optional(),
  assignee: z.string().max(200).optional(),
});

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, description, due_at, status, entity_type, entity_id, assignee, created_at")
    .order("due_at", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[tasks] GET error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, tasks: data });
}

export async function POST(req: Request) {
  let parsed: z.infer<typeof CreateBody>;
  try {
    parsed = CreateBody.parse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_payload" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tasks")
    .insert({
      title: parsed.title,
      description: parsed.description ?? null,
      due_at: parsed.due_at ?? null,
      status: "open",
      entity_type: parsed.entity_type ?? null,
      entity_id: parsed.entity_id ?? null,
      assignee: parsed.assignee ?? null,
    })
    .select("id, title, description, due_at, status, entity_type, entity_id, assignee, created_at")
    .single();

  if (error) {
    console.error("[tasks] POST error:", error.message);
    return NextResponse.json({ ok: false, error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true, task: data }, { status: 201 });
}
