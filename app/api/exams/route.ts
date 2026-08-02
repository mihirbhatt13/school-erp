import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const exams = await prisma.exam.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(exams);
  } catch (error) {
    console.error("Prisma exams fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch exam schedules from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.subject || !body.className) {
      return NextResponse.json(
        { message: "Subject and Class are required" },
        { status: 400 }
      );
    }

    const exam = await prisma.exam.create({
      data: {
        subject: body.subject,
        className: body.className,
        examType: body.examType || "Unit Test 1",
        examDate: body.examDate || new Date().toISOString().split("T")[0],
        examTime: body.examTime || "10:00 AM - 01:00 PM",
        totalMarks: Number(body.totalMarks) || 100,
        passingMarks: Number(body.passingMarks) || 40,
      },
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    console.error("Error creating exam schedule in database:", error);
    return NextResponse.json(
      { message: "Failed to create exam schedule in database" },
      { status: 500 }
    );
  }
}