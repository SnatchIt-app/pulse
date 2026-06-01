import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return NextResponse.json({ ok: false, error: "missing_id" }, { status: 400 });

  const supabase = getSupabaseAdmin();

  const { data: client } = await supabase.from("clients").select("email").eq("id", id).single();

  const email = client?.email ?? null;

  const [bookingsRes, leadsRes] = await Promise.all([
    supabase
      .from("bookings")
      .select("id, service_type, asset_title, start_date, end_date, status, created_at")
      .or(email ? `client_id.eq.${id},email.eq.${email}` : `client_id.eq.${id}`)
      .order("created_at", { ascending: false })
      .limit(20),

    email
      ? supabase
          .from("leads")
          .select("id, service_type, status, created_at")
          .eq("email", email)
          .order("created_at", { ascending: false })
          .limit(10)
      : Promise.resolve({
          data: [] as {
            id: string;
            service_type: string;
            status: string;
            created_at: string;
          }[],
          error: null,
        }),
  ]);

  return NextResponse.json({
    ok: true,
    bookings: bookingsRes.data ?? [],
    leads: leadsRes.data ?? [],
  });
}
