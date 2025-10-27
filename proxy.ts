import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyUserToken, verifyAdminToken } from "@/lib/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get auth tokens from cookies
  const userToken = request.cookies.get("user-token")?.value;
  const adminToken = request.cookies.get("admin-token")?.value;

  // Verify tokens
  const isLoggedInAsUser = userToken ? !!verifyUserToken(userToken) : false;
  const isLoggedInAsAdmin = adminToken ? !!verifyAdminToken(adminToken) : false;

  // Define route types
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isAdminAuthRoute = pathname.startsWith("/admin/login");
  const isAdminRoute = pathname.startsWith("/admin") && !isAdminAuthRoute;

  // If logged in as user and trying to access auth routes, redirect to home
  if (isLoggedInAsUser && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in as admin and trying to access admin login, redirect to admin dashboard
  if (isLoggedInAsAdmin && isAdminAuthRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  // If trying to access admin routes without admin token, redirect to admin login
  if (isAdminRoute && !isLoggedInAsAdmin) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // If logged in as user, trying to access admin routes, redirect to home
  if (isAdminRoute && isLoggedInAsUser && !isLoggedInAsAdmin) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If logged in as admin, trying to access user auth routes, redirect to admin
  if (isLoggedInAsAdmin && isAuthRoute) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};