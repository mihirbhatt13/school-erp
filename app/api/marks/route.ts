import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    console.error(error);

    return NextResponse.json(
      { error: "Unable to fetch marks" },
      { status: 500 }
    );
  }
}

// ADD MARKS
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const existingMark = await prisma.mark.findFirst({
  where: {
    studentId: Number(body.studentId),
    subject: body.subject,
    examType: body.examType,
  },
});

if (existingMark) {
  return NextResponse.json(
    {
      error: "Marks already exist for this student, subject and exam.",
    },
    { status: 400 }
  );
}

    const mark = await prisma.mark.create({
  data: {
    studentId: Number(body.studentId),
    student: body.student,
    className: body.className,
    subject: body.subject,
    examType: body.examType,
    totalMarks: Number(body.totalMarks),
    passingMarks: Number(body.passingMarks),
    obtainedMarks: Number(body.obtainedMarks),
  },
});

    return NextResponse.json(mark);
 } catch (error) {
  console.error(error);

  return NextResponse.json(
    {
      error: String(error),
    },
    { status: 500 }
  );
}
}