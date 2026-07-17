import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.fee.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Fee Deleted Successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Fee not found",
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

    const updatedFee = await prisma.fee.update({
      where: {
        id: Number(id),
      },
      data: {
        student: body.student,
        className: body.className,
        totalFees: body.totalFees,
        paidAmount: body.paidAmount,
        pendingFees: body.pendingFees,
        paymentDate: body.paymentDate,
        status: body.status,
      },
    });

    return NextResponse.json(updatedFee);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to update fee",
      },
      {
        status: 500,
      }
    );
  }
}