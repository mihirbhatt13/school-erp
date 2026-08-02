import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Fallback teachers store
let fallbackTeachers: Array<{
  id: number;
  teacherId: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  assignedClass: string;
}> = [
  {
    id: 1,
    teacherId: "TCH1001",
    name: "Dr. Vikramaditya Sen",
    email: "mihirbhatt529@gmail.com",
    phone: "+91 98201 99887",
    subject: "Physics",
    assignedClass: "Grade 10-A",
  },
  {
    id: 2,
    teacherId: "TCH1002",
    name: "Mrs. Meenakshi Iyer",
    email: "meenakshi@school.com",
    phone: "+91 98201 99888",
    subject: "Mathematics",
    assignedClass: "Grade 9-B",
  },
];

export async function GET() {
  try {
    const teachers = await prisma.teacher.findMany();
    if (teachers.length > 0) {
      return NextResponse.json(teachers);
    }
    return NextResponse.json(fallbackTeachers);
  } catch (error) {
    console.warn("Prisma teacher fetch failed, returning fallback:", error);
    return NextResponse.json(fallbackTeachers);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { message: "Name and Email are required" },
        { status: 400 }
      );
    }

    const rawPassword = body.password || "teacher123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    try {
      const teacher = await prisma.teacher.create({
        data: {
          teacherId: body.teacherId || `TCH${Math.floor(1000 + Math.random() * 9000)}`,
          name: body.name,
          email: body.email,
          phone: body.phone || null,
          subject: body.subject || "Mathematics",
          assignedClass: body.assignedClass || "Grade 10-A",
          password: hashedPassword,
        },
      });

      return NextResponse.json(teacher, { status: 201 });
    } catch (dbError) {
      console.warn("DB teacher create failed, saving to fallback store:", dbError);
      const newTeacher = {
        id: Date.now(),
        teacherId: body.teacherId || `TCH${Math.floor(1000 + Math.random() * 9000)}`,
        name: body.name,
        email: body.email,
        phone: body.phone || "",
        subject: body.subject || "Mathematics",
        assignedClass: body.assignedClass || "Grade 10-A",
      };
      fallbackTeachers.unshift(newTeacher);

      return NextResponse.json(newTeacher, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}