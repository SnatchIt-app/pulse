import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type CreateTaskInput = {
  title: string;
  description?: string | null;
  due_at?: string | null;
  entity_type?: "lead" | "booking" | "client" | "asset" | null;
  entity_id?: string | null;
  assignee?: string | null;
};

// Fire-and-forget task creation for follow-up automation. Never throws.
export async function createTask(input: CreateTaskInput): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("tasks").insert({
      title: input.title,
      description: input.description ?? null,
      due_at: input.due_at ?? null,
      status: "open",
      entity_type: input.entity_type ?? null,
      entity_id: input.entity_id ?? null,
      assignee: input.assignee ?? null,
    });
  } catch {
    // Automation must never block the primary operation
  }
}
