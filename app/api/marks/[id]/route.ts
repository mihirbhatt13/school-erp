import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    console.error("Error deleting mark from database:", error);
    return NextResponse.json(
      { error: "Marks entry not found or could not be deleted" },
      { status: 500 }
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

    const mark = await prisma.mark.update({
      where: {
        id: Number(id),
      },
      data: {
        studentId: Number(body.studentId) || 1,
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
    console.error("Error updating mark in database:", error);
    return NextResponse.json(
      { error: "Unable to update marks entry in database" },
      { status: 500 }
    );
  }
}