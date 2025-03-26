import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
    const cookie = serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 0, // Remove cookie immediately
    });

    const response = NextResponse.json({ message: "Logged out successfully" });
    response.headers.set("Set-Cookie", cookie);
    
    return response;
}
