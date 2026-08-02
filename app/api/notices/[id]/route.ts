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

    await prisma.notice.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Notice Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting notice from database:", error);
    return NextResponse.json(
      { error: "Notice record not found or could not be deleted" },
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
    console.error("Error updating notice in database:", error);
    return NextResponse.json(
      { error: "Unable to update notice in database" },
      { status: 500 }
    );
  }
}