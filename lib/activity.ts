import "server-only";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function logActivity(
  leadId: string,
  type: string,
  content: string,
  createdBy?: string,
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("lead_activities").insert({
      lead_id: leadId,
      type,
      content,
      created_by: createdBy ?? null,
    });
  } catch {
    // Fire-and-forget — never throws, never blocks the caller
  }
}
