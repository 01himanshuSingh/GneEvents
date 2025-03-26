import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    // If token exists, verify it
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET!);
            return NextResponse.next();
        } catch (error) {
            console.error("Invalid Token:", error);
        }
    }

    return NextResponse.redirect(new URL("/api/auth/login", req.url));
}

