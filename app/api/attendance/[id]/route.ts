import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.attendance.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Attendance Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Attendance not found",
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

    const attendance = await prisma.attendance.update({
      where: {
        id: Number(id),
      },
      data: {
        student: body.student,
        className: body.className,
        date: body.date,
        status: body.status,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update attendance",
      },
      {
        status: 500,
      }
    );
  }
}