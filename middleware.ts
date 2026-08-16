import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const currentPath = req.nextUrl.pathname;

  const publicRoutes = ["/library", "/videos", "/library/:id"];

  if (publicRoutes.some((val) => currentPath.includes(val))) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
