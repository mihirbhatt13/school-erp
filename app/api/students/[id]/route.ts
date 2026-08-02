import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.student.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Student Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Student not found",
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

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const student = await prisma.student.update({
      where: {
        id: Number(id),
      },
      data: {
  rollNo: body.rollNo,
  name: body.name,
  email: body.email,
  class: body.class,
  password: hashedPassword,
},
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update student",
      },
      {
        status: 500,
      }
    );
  }
}