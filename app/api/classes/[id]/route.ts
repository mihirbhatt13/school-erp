import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.class.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Class Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Class not found",
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

    const updatedClass = await prisma.class.update({
      where: {
        id: Number(id),
      },
      data: {
        className: body.className,
        section: body.section,
      },
    });

    return NextResponse.json(updatedClass);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update class",
      },
      {
        status: 500,
      }
    );
  }
}