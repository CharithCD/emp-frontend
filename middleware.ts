import { NextRequest, NextResponse } from "next/server";
import { decryptToken } from "./lib/decryptToken";

// Define public paths and admin paths
const PUBLIC_PATHS = new Set(["/login", "/sign-up"]);
const ADMIN_PATHS = "/admin-panel";
const USER_PATHS = "/dashboard";

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.has(pathname);
  const isAdminPath = pathname.startsWith(ADMIN_PATHS);
  const isUserPath = pathname.startsWith(USER_PATHS);

  // Get and decrypt token
  const token = request.cookies.get("accessToken")?.value || "";
  const decryptedToken = await decryptToken(token);

  if (!decryptedToken) {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
    return NextResponse.next();
  }

  const { id, role } = decryptedToken;

  // Redirect logic based on role and path
  if (role === "admin" && !isAdminPath) {
    return NextResponse.redirect(new URL(ADMIN_PATHS, request.nextUrl));
  }

  if (role === "user" && isAdminPath) {
    return NextResponse.redirect(new URL(USER_PATHS, request.nextUrl));
  }

  if (isPublicPath && id) {
    const redirectPath = role === "admin" ? ADMIN_PATHS : USER_PATHS;
    return NextResponse.redirect(new URL(redirectPath, request.nextUrl));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/",
    "/login", 
    "/sign-up",
    "/dashboard/:path*",
    "/admin-panel/:path*"
  ],
};