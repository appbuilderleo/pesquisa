import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose/jwt/verify";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "stoka-pesquisa-secret-key-2025-token-random-key"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedPaths = ["/dashboard", "/api/dashboard", "/api/surveys"];
  const isProtected = protectedPaths.some(p => pathname.startsWith(p));
  const isApiSurveyPost = pathname === "/api/surveys" && request.method === "POST";

  // Allow POST to /api/surveys publicly (for form submissions)
  if (isApiSurveyPost) return NextResponse.next();

  if (!isProtected) return NextResponse.next();

  const cookieName = process.env.COOKIE_NAME || "stoka_session";
  const token = request.cookies.get(cookieName)?.value;

  if (!token) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Sessão expirada." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/dashboard/:path*", "/api/surveys/:path*", "/api/surveys"],
};
