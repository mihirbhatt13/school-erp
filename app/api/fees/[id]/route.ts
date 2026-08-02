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

    await prisma.fee.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Fee Deleted Successfully",
    });
  } catch (error) {
    console.error("Error deleting fee from database:", error);
    return NextResponse.json(
      { error: "Fee record not found or could not be deleted" },
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

    const totalFees = Number(body.totalFees) || 0;
    const paidAmount = Number(body.paidAmount) || 0;
    const pendingFees = Math.max(0, totalFees - paidAmount);
    const status = pendingFees === 0 ? "PAID" : paidAmount > 0 ? "PARTIAL" : "PENDING";

    const updatedFee = await prisma.fee.update({
      where: {
        id: Number(id),
      },
      data: {
        student: body.student,
        className: body.className,
        totalFees,
        paidAmount,
        pendingFees,
        paymentDate: body.paymentDate,
        status: body.status || status,
      },
    });

    return NextResponse.json(updatedFee);
  } catch (error) {
    console.error("Error updating fee in database:", error);
    return NextResponse.json(
      { error: "Unable to update fee in database" },
      { status: 500 }
    );
  }
}