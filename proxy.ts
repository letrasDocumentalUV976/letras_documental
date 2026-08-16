import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME } from "@/constants/session";

const PUBLIC_PREFIXES = ["/login", "/library", "/videos", "/activate-account"];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isPublicRoute = PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  const hasSession = Boolean(req.cookies.get(SESSION_COOKIE_NAME)?.value);

  if (pathname === "/login" && hasSession) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname === "/" && !hasSession) {
    return NextResponse.redirect(new URL("/library", req.url));
  }

  if (!isPublicRoute && !hasSession) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
