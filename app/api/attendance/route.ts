import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const attendance = await prisma.attendance.findMany();

  return NextResponse.json(attendance);
}

export async function POST(request: Request) {
  const body = await request.json();

  const attendance = await prisma.attendance.create({
    data: {
      student: body.student,
      className: body.className,
      date: body.date,
      status: body.status,
    },
  });

  return NextResponse.json(attendance);
}