import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import prisma from "@/app/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Store in .env for security
const TOKEN_EXPIRY = "7d"; // Token valid for 7 days

export async function POST(req: Request) {
    try {
        const { universityId, password } = await req.json();

        // Validate input
        if (!universityId || !password) {
            return NextResponse.json({ error: "University ID and password are required" }, { status: 400 });
        }

        // Find user by universityId
        const user = await prisma.user.findUnique({
            where: { universityId },
        });

        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id, universityId: user.universityId, canCreate: user.canCreate },
            JWT_SECRET,
            { expiresIn: TOKEN_EXPIRY }
        );

        // Create secure HTTP-only cookie
        const cookie = serialize("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 7 * 24 * 60 * 60, // 7 days
        });

        // Send response with cookie
        return new NextResponse(
            JSON.stringify({ message: "Login successful", user: { id: user.id, universityId: user.universityId, canCreate: user.canCreate } }),
            {
                status: 200,
                headers: { "Set-Cookie": cookie, "Content-Type": "application/json" },
            }
        );

    } catch (error) {
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Login failed" }, { status: 500 });
    }
}
