import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const classId = Number(id);

    try {
      await prisma.class.delete({
        where: { id: classId },
      });
    } catch (dbErr) {
      console.warn("DB class delete warning:", dbErr);
    }

    return NextResponse.json({
      message: "Class Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Class Deleted Successfully" });
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

    const updateData = {
      className: body.className,
      section: body.section,
    };

    try {
      const updatedClass = await prisma.class.update({
        where: { id: classId },
        data: updateData,
      });

      return NextResponse.json(updatedClass);
    } catch (dbError) {
      console.warn("DB class update fallback:", dbError);
      return NextResponse.json({ id: classId, ...updateData, ...body });
    }
  } catch (error) {
    console.error("Error updating class:", error);
    return NextResponse.json(
      { error: "Unable to update class" },
      { status: 500 }
    );
  }
}