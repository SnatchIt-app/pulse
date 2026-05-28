import { NextResponse, type NextRequest } from "next/server";

// Admin session gate. Phase 5 replaces pulse_admin_session with Supabase auth.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isAdminPage = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (isAdminPage || isAdminApi) {
    const session = req.cookies.get("pulse_admin_session");
    if (!session?.value) {
      if (isAdminApi) {
        return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
      }
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
