import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET ALL MARKS
export async function GET() {
  try {
    const marks = await prisma.mark.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(marks);
  } catch (error) {
    console.error("Prisma marks fetch error:", error);
    return NextResponse.json(
      { error: "Unable to fetch marks from database" },
      { status: 500 }
    );
  }
}

// ADD MARKS
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.student || !body.subject) {
      return NextResponse.json(
        { error: "Student and Subject are required" },
        { status: 400 }
      );
    }

    const mark = await prisma.mark.create({
      data: {
        studentId: Number(body.studentId) || 1,
        student: body.student,
        className: body.className || "Grade 10-A",
        subject: body.subject,
        examType: body.examType || "Unit Test 1",
        totalMarks: Number(body.totalMarks) || 100,
        passingMarks: Number(body.passingMarks) || 40,
        obtainedMarks: Number(body.obtainedMarks) || 0,
      },
    });

    return NextResponse.json(mark, { status: 201 });
  } catch (error) {
    console.error("Error creating marks entry in database:", error);
    return NextResponse.json(
      { error: "Failed to save marks entry in database" },
      { status: 500 }
    );
  }
}