import { NextResponse } from "next/server";
import { getDashboardPath } from "@/utils/roleRedirect";

const AUTH_ROUTES = ["/login", "/register"];

function isProtectedRoute(pathname) {
  if (pathname.startsWith("/user")) return true;
  if (pathname.startsWith("/creator")) return true;
  if (pathname.startsWith("/admin")) return true;

  if (pathname.startsWith("/prompts/") && pathname !== "/prompts") {
    return true;
  }

  return false;
}

function getRoleFromToken(token) {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded.role || null;
  } catch {
    return null;
  }
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
    const role = getRoleFromToken(token);
    const dashboardPath = getDashboardPath(role);
    return NextResponse.redirect(new URL(dashboardPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
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
