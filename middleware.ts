// const cookie = (await cookies()).get("session")?.value;
// const session = await decrypt(cookie);


import { NextRequest, NextResponse } from "next/server";
import { decryptToken } from "./lib/decryptToken";

export const middleware = (request: NextRequest) => {
    const path = request.nextUrl.pathname;
    const isPublicPath = path === "/login" || path === "/sign-up";

    const token = request.cookies.get("accessToken")?.value || "";
    const userid = decryptToken(token);

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", request.nextUrl));
    }
    
    if (!isPublicPath && !userid) {
        return NextResponse.redirect(new URL("/login", request.nextUrl)); 
    }

}

export const config = {
    matcher:[
        "/",
        "/profile/:path*",
        "/login",
        "/signup",
    ]
}



