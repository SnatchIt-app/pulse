import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const WRITE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

// Admin gate. Authentication + role-based authorization for /admin and
// /api/admin, backed by Supabase Auth. The public site is never matched.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminPage && !isAdminApi) return NextResponse.next();

  const res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const deny = (status: number, error: string) =>
    isAdminApi
      ? NextResponse.json({ ok: false, error }, { status })
      : NextResponse.redirect(new URL(error === "unauthorized" ? "/login" : "/admin", req.url));

  if (!user) return deny(401, "unauthorized");

  // The signed-in user can read their own profile (RLS: users_select_own).
  const { data: profile } = await supabase
    .from("users")
    .select("role, is_active")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !profile.is_active) return deny(403, "unauthorized");

  const role = String(profile.role);

  // User management surfaces are owner/admin only.
  const isUserMgmt =
    pathname.startsWith("/api/admin/users") || pathname.startsWith("/admin/settings");
  if (isUserMgmt && role !== "owner" && role !== "admin") {
    return deny(403, "forbidden");
  }

  // Viewers are strictly read-only across every admin API.
  if (isAdminApi && WRITE_METHODS.has(req.method) && role === "viewer") {
    return NextResponse.json({ ok: false, error: "read_only" }, { status: 403 });
  }

  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
