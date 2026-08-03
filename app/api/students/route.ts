import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const students = await prisma.student.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(students);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Prisma student fetch error:", error);
    return NextResponse.json(
      { message: `Database Read Error: ${errMsg}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { message: "Name and Email are required" },
        { status: 400 }
      );
    }

    const rawPassword = body.password || "student123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const student = await prisma.student.create({
      data: {
        rollNo: body.rollNo || `STU${Math.floor(1000 + Math.random() * 9000)}`,
        name: body.name,
        email: body.email,
        class: body.class || "Class 10-A",
        phone: body.phone || null,
        address: body.address || null,
        password: hashedPassword,
      },
    });

    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error creating student in database:", error);
    return NextResponse.json(
      { message: `Database Create Error: ${errMsg}` },
      { status: 500 }
    );
  }
}