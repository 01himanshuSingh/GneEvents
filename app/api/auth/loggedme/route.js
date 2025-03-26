import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function GET(req) {
    try {
        // Get the token from cookies
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ isAuthenticated: false }, { status: 401 });
        }

        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        return NextResponse.json({
            isAuthenticated: true,
            user: { id: decoded.id, universityId: decoded.universityId, canCreate: decoded.canCreate }
        });

    } catch (error) {
        return NextResponse.json({ isAuthenticated: false, error: "Invalid token" }, { status: 401 });
    }
}
