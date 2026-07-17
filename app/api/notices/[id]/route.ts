import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.notice.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Notice Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Notice not found",
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

    const notice = await prisma.notice.update({
      where: {
        id: Number(id),
      },
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
      },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update notice",
      },
      {
        status: 500,
      }
    );
  }
}