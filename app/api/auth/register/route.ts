import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/app/lib/prisma";

export async function POST(req: Request) {
    try {
        const { universityId, password } = await req.json();

        // Validate input
        if (!universityId || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Check if universityId already exists
        const existingUser = await prisma.user.findUnique({
            where: { universityId },
        });

        if (existingUser) {
            return NextResponse.json({ error: "University ID already registered" }, { status: 409 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with canCreate set to true
        const user = await prisma.user.create({
            data: {
                universityId,
                password: hashedPassword,
                canCreate: true, // Always set to true
            },
            select: {
                id: true,
                universityId: true,
                canCreate: true,
                createdAt: true,
            },
        });

        return NextResponse.json({ message: "User registered successfully", user }, { status: 201 });

    } catch (error) {
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Registration failed" }, { status: 500 });
    }
}
