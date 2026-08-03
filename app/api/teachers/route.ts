import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(teachers);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Prisma teacher fetch error:", error);
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

    const rawPassword = body.password || "teacher123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const teacher = await prisma.teacher.create({
      data: {
        teacherId: body.teacherId || `TCH${Math.floor(1000 + Math.random() * 9000)}`,
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject || "Mathematics",
        assignedClass: body.assignedClass || "Class 10-A",
        password: hashedPassword,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error creating teacher in database:", error);
    return NextResponse.json(
      { message: `Database Create Error: ${errMsg}` },
      { status: 500 }
    );
  }
}