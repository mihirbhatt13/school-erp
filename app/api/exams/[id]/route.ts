import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.exam.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Exam Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Exam not found",
      },
      {
        status: 404,
      }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const exam = await prisma.exam.update({
      where: {
        id: Number(id),
      },
      data: {
        subject: body.subject,
        className: body.className,
        examType: body.examType,
        examDate: body.examDate,
        examTime: body.examTime,
        totalMarks: body.totalMarks,
        passingMarks: body.passingMarks,
      },
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update exam",
      },
      {
        status: 500,
      }
    );
  }
}