import { NextResponse, type NextRequest } from "next/server";

// Phase 1: /admin is private. Redirect all hits to /login.
// Phase 5 replaces this with a real Supabase session check.
export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
