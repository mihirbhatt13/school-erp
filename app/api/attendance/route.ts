import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const attendance = await prisma.attendance.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const formattedAttendance = attendance.map((item) => ({
      ...item,
      studentName: item.student, // frontend ke liye
    }));

    return NextResponse.json(formattedAttendance);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch attendance" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const attendance = await prisma.attendance.create({
      data: {
        studentId: Number(body.studentId),
        student: body.student,
        className: body.className,
        date: body.date,
        status: body.status,
      },
    });

    return NextResponse.json(attendance);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create attendance" },
      { status: 500 }
    );
  }
}