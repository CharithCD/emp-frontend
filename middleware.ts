import { NextRequest, NextResponse } from "next/server";
import { decryptToken } from "./lib/decryptToken";

export const middleware = async (request: NextRequest) => {
  const path = request.nextUrl.pathname;
  const isPublicPath = path === "/login" || path === "/sign-up";

  const token = request.cookies.get("accessToken")?.value || "";


  const decryptedToken = await decryptToken(token);



  if (decryptedToken) {
    const { id, email, role } = decryptedToken;

    console.log({ id, email, role });

    //only if the user role is admin
    if (role === "admin" && !path.startsWith("/admin-panel")) {
      return NextResponse.redirect(new URL("/admin-panel", request.nextUrl));
    }


    if (role === "user" && path.startsWith("/admin-panel")) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    if (isPublicPath && id !== null) {
      return NextResponse.redirect(new URL("/", request.nextUrl));
    }

    if (!isPublicPath && id === null) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  } else {
    if (!isPublicPath) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }
  }
};

export const config = {
    matcher: ["/", "/login", "/sign-up", "/dashboard/:path*", "/admin-panel/:path*"],
};
