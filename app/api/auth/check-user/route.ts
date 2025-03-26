import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const universityId = searchParams.get("universityId");

        if (!universityId) {
            return NextResponse.json({ error: "University ID is required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { universityId },
            select: { canCreate: true },
        });

        if (!user) {
            return NextResponse.json({ exists: false }, { status: 200 });
        }

        return NextResponse.json({ exists: true, canCreate: user.canCreate }, { status: 200 });

    } catch (error) {
        console.error("Error checking user:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
