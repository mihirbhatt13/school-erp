import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Fallback attendance store
let fallbackAttendance: Array<{
  id: number;
  studentId: number;
  student: string;
  studentName?: string;
  className: string;
  status: string;
  date: string;
}> = [
  {
    id: 1,
    studentId: 1,
    student: "Aarav Sharma",
    studentName: "Aarav Sharma",
    className: "Grade 10-A",
    status: "Present",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: 2,
    studentId: 2,
    student: "Ananya Verma",
    studentName: "Ananya Verma",
    className: "Grade 10-A",
    status: "Present",
    date: new Date().toISOString().split("T")[0],
  },
  {
    id: 3,
    studentId: 3,
    student: "Rohan Patel",
    studentName: "Rohan Patel",
    className: "Grade 9-B",
    status: "Late",
    date: new Date().toISOString().split("T")[0],
  },
];

export async function GET() {
  try {
    const attendance = await prisma.attendance.findMany({
      orderBy: { id: "desc" },
    });

    if (attendance.length > 0) {
      const formatted = attendance.map((item) => ({
        ...item,
        studentName: item.student,
      }));
      return NextResponse.json(formatted);
    }

    return NextResponse.json(fallbackAttendance);
  } catch (error) {
    console.warn("Prisma attendance fetch fallback:", error);
    return NextResponse.json(fallbackAttendance);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const studentId = Number(body.studentId);
    const date = body.date || new Date().toISOString().split("T")[0];

    try {
      // Check if existing record for student + date exists to prevent duplicates
      const existing = await prisma.attendance.findFirst({
        where: { studentId: studentId, date: date },
      });

      let attendance;
      if (existing) {
        attendance = await prisma.attendance.update({
          where: { id: existing.id },
          data: {
            status: body.status,
            className: body.className || existing.className,
            student: body.student || existing.student,
          },
        });
      } else {
        attendance = await prisma.attendance.create({
          data: {
            studentId: studentId,
            student: body.student || "Student",
            className: body.className || "Grade 10-A",
            date: date,
            status: body.status || "Present",
          },
        });
      }

      return NextResponse.json(attendance, { status: 201 });
    } catch (dbError) {
      console.warn("DB attendance create/update fallback:", dbError);
      
      // Update in fallback array or append
      const existingIndex = fallbackAttendance.findIndex(
        (a) => a.studentId === studentId && a.date === date
      );

      let record;
      if (existingIndex >= 0) {
        fallbackAttendance[existingIndex].status = body.status;
        fallbackAttendance[existingIndex].className = body.className || fallbackAttendance[existingIndex].className;
        record = fallbackAttendance[existingIndex];
      } else {
        record = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          studentId: studentId,
          student: body.student || "Student",
          studentName: body.student || "Student",
          className: body.className || "Grade 10-A",
          status: body.status || "Present",
          date: date,
        };
        fallbackAttendance.unshift(record);
      }

      return NextResponse.json(record, { status: 201 });
    }
  } catch (error) {
    console.error("Error posting attendance:", error);
    return NextResponse.json(
      { message: "Failed to log attendance" },
      { status: 500 }
    );
  }
}