import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const records = await prisma.attendance.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error("Prisma attendance fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch attendance from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      const results = [];
      for (const item of body) {
        if (!item.studentId || !item.date) continue;
        
        const existing = await prisma.attendance.findFirst({
          where: {
            studentId: Number(item.studentId),
            date: item.date,
          },
        });

        if (existing) {
          const updated = await prisma.attendance.update({
            where: { id: existing.id },
            data: {
              status: item.status || "Present",
            },
          });
          results.push(updated);
        } else {
          const created = await prisma.attendance.create({
            data: {
              studentId: Number(item.studentId),
              student: item.student || "Student",
              className: item.className || "Grade 10-A",
              date: item.date,
              status: item.status || "Present",
            },
          });
          results.push(created);
        }
      }
      return NextResponse.json(results, { status: 201 });
    }

    if (!body.studentId || !body.date) {
      return NextResponse.json(
        { message: "Student ID and Date are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.attendance.findFirst({
      where: {
        studentId: Number(body.studentId),
        date: body.date,
      },
    });

    if (existing) {
      const updated = await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          status: body.status || "Present",
        },
      });
      return NextResponse.json(updated, { status: 200 });
    }

    const record = await prisma.attendance.create({
      data: {
        studentId: Number(body.studentId),
        student: body.student || "Student",
        className: body.className || "Grade 10-A",
        date: body.date,
        status: body.status || "Present",
      },
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error saving attendance in database:", error);
    return NextResponse.json(
      { message: "Failed to save attendance in database" },
      { status: 500 }
    );
  }
}