import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DELETE MARK
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.mark.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Marks Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Mark not found",
      },
      {
        status: 404,
      }
    );
  }
}

// UPDATE MARK
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existingMark = await prisma.mark.findFirst({
  where: {
    studentId: Number(body.studentId),
    subject: body.subject,
    examType: body.examType,
    NOT: {
      id: Number(id),
    },
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

    const mark = await prisma.mark.update({
      where: {
        id: Number(id),
      },
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
        error: "Unable to update marks",
      },
      {
        status: 500,
      }
    );
  }
}