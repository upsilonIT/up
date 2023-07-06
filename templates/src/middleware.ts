import { getSession } from "@auth0/nextjs-auth0/edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest): Promise<NextResponse> {
  let session;

  try {
    session = await getSession(req, NextResponse.next());
  } catch {
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }

  const res = NextResponse.next();

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /examples (inside /public)
     * 5. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api|zoomverify|_next|fonts|examples|[\\w-]+\\.\\w+).*)",
  ],
};
