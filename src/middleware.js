import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/register"];

function isProtectedRoute(pathname) {
  if (pathname === "/pricing" || pathname.startsWith("/pricing/")) {
    return true;
  }

  if (pathname.startsWith("/user")) return true;
  if (pathname.startsWith("/creator")) return true;
  if (pathname.startsWith("/admin")) return true;

  if (pathname.startsWith("/prompts/") && pathname !== "/prompts") {
    return true;
  }

  return false;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  if (isProtectedRoute(pathname) && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (AUTH_ROUTES.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/user", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/pricing",
    "/pricing/:path*",
    "/prompts/:id",
    "/user",
    "/user/:path*",
    "/creator",
    "/creator/:path*",
    "/admin",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
