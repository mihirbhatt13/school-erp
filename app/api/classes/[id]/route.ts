import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const classId = Number(id);

    await prisma.class.delete({
      where: { id: classId },
    });

    return NextResponse.json({
      message: "Class Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting class from database:", error);
    return NextResponse.json(
      { message: "Failed to delete class from database" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const classId = Number(id);
    const body = await request.json();

    const updatedClass = await prisma.class.update({
      where: { id: classId },
      data: {
        className: body.className,
        section: body.section,
      },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error("Error updating class in database:", error);
    return NextResponse.json(
      { message: "Unable to update class in database" },
      { status: 500 }
    );
  }
}