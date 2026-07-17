import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const fees = await prisma.fee.findMany();

  return NextResponse.json(fees);
}

export async function POST(request: Request) {
  const body = await request.json();

  const fee = await prisma.fee.create({
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

  return NextResponse.json(fee);
}