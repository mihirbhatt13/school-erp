import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const fees = await prisma.fee.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(fees);
  } catch (error) {
    console.error("Prisma fee fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch fee ledgers from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.student || !body.className) {
      return NextResponse.json(
        { message: "Student and Class are required" },
        { status: 400 }
      );
    }

    const totalFees = Number(body.totalFees) || 0;
    const paidAmount = Number(body.paidAmount) || 0;
    const pendingFees = Math.max(0, totalFees - paidAmount);
    const status = pendingFees === 0 ? "PAID" : paidAmount > 0 ? "PARTIAL" : "PENDING";

    const fee = await prisma.fee.create({
      data: {
        student: body.student,
        className: body.className,
        totalFees,
        paidAmount,
        pendingFees,
        paymentDate: body.paymentDate || new Date().toISOString().split("T")[0],
        status: body.status || status,
      },
    });

    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    console.error("Error creating fee ledger in database:", error);
    return NextResponse.json(
      { message: "Failed to create fee record in database" },
      { status: 500 }
    );
  }
}