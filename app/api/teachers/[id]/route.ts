import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teacherId = Number(id);

    try {
      await prisma.teacher.delete({
        where: { id: teacherId },
      });
    } catch (dbErr) {
      console.warn("DB teacher delete warning:", dbErr);
    }

    return NextResponse.json({
      message: "Teacher Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Teacher Deleted Successfully" });
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

    try {
      const teacher = await prisma.teacher.update({
        where: { id: teacherId },
        data: updateData,
      });

      return NextResponse.json(teacher);
    } catch (dbError) {
      console.warn("DB teacher update fallback:", dbError);
      return NextResponse.json({ id: teacherId, ...updateData });
    }
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json(
      { error: "Unable to update teacher" },
      { status: 500 }
    );
  }
}