import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.teacher.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Teacher Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Teacher not found",
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

    const teacher = await prisma.teacher.update({
      where: {
        id: Number(id),
      },
      data: {
  teacherId: body.teacherId,
  name: body.name,
  email: body.email,
  phone: body.phone,
  subject: body.subject,
  assignedClass: body.assignedClass,
  password: body.password,
},
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update teacher",
      },
      {
        status: 500,
      }
    );
  }
}