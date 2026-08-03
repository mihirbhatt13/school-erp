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
    const studentId = Number(id);

    await prisma.student.delete({
      where: { id: studentId },
    });

    return NextResponse.json({
      message: "Student Deleted Successfully",
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error deleting student from database:", error);
    return NextResponse.json(
      { message: `Database Delete Error: ${errMsg}` },
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
    const studentId = Number(id);
    const body = await request.json();

    const updateData: any = {
      rollNo: body.rollNo,
      name: body.name,
      email: body.email,
      class: body.class,
      phone: body.phone || null,
      address: body.address || null,
    };

    if (body.password && body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

    const student = await prisma.student.update({
      where: { id: studentId },
      data: updateData,
    });

    return NextResponse.json(student);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Error updating student in database:", error);
    return NextResponse.json(
      { message: `Database Update Error: ${errMsg}` },
      { status: 500 }
    );
  }
}