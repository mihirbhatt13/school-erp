import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory fallback store for students
let fallbackStudents: Array<{
  id: number;
  rollNo?: string;
  name: string;
  email: string;
  class: string;
  phone?: string;
  address?: string;
}> = [
  {
    id: 1,
    rollNo: "STU1001",
    name: "Aarav Sharma",
    email: "aarav@school.com",
    class: "Grade 10-A",
    phone: "+91 98765 43210",
    address: "B-201, Sunshine Heights, Mumbai",
  },
  {
    id: 2,
    rollNo: "STU1002",
    name: "Ananya Verma",
    email: "ananya@school.com",
    class: "Grade 10-A",
    phone: "+91 98765 43211",
    address: "C-405, Palm Grove, Mumbai",
  },
  {
    id: 3,
    rollNo: "STU1003",
    name: "Rohan Patel",
    email: "rohan@school.com",
    class: "Grade 9-B",
    phone: "+91 98765 43212",
    address: "A-102, Ocean View, Mumbai",
  },
];

export async function GET() {
  try {
    const students = await prisma.student.findMany();
    if (students.length > 0) {
      return NextResponse.json(students);
    }
    return NextResponse.json(fallbackStudents);
  } catch (error) {
    console.warn("Prisma student fetch failed, returning fallback:", error);
    return NextResponse.json(fallbackStudents);
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

    const rawPassword = body.password || "student123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    try {
      const student = await prisma.student.create({
        data: {
          rollNo: body.rollNo || `STU${Math.floor(1000 + Math.random() * 9000)}`,
          name: body.name,
          email: body.email,
          class: body.class || "Grade 10-A",
          phone: body.phone || null,
          address: body.address || null,
          password: hashedPassword,
        },
      });

      return NextResponse.json(student, { status: 201 });
    } catch (dbError) {
      console.warn("DB student create failed, saving to fallback store:", dbError);
      const newStudent = {
        id: Date.now(),
        rollNo: body.rollNo || `STU${Math.floor(1000 + Math.random() * 9000)}`,
        name: body.name,
        email: body.email,
        class: body.class || "Grade 10-A",
        phone: body.phone || "",
        address: body.address || "",
      };
      fallbackStudents.unshift(newStudent);

      return NextResponse.json(newStudent, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}