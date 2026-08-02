import bcrypt from "bcryptjs";
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
    const teacherId = Number(id);

    await prisma.teacher.delete({
      where: { id: teacherId },
    });

    return NextResponse.json({
      message: "Teacher Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting teacher from database:", error);
    return NextResponse.json(
      { message: "Failed to delete teacher from database" },
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
    const teacherId = Number(id);
    const body = await request.json();

    const updateData: any = {
      teacherId: body.teacherId,
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      subject: body.subject,
      assignedClass: body.assignedClass,
      address: body.address || null,
    };

    if (body.password && body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: updateData,
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("Error updating teacher in database:", error);
    return NextResponse.json(
      { message: "Unable to update teacher in database" },
      { status: 500 }
    );
  }
}