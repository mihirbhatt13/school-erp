import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "school_erp_super_secret_2026";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("student_token")?.value;
    let studentId: number | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        studentId = decoded.id;
      } catch (err) {
        console.error("Student token verification failed:", err);
      }
    }

    let student = null;
    if (studentId) {
      student = await prisma.student.findUnique({
        where: { id: studentId },
      });
    }

    // Fallback: If no token or student not found by token, load first student in DB
    if (!student) {
      student = await prisma.student.findFirst();
    }

    if (!student) {
      // Create a default student if database is completely empty
      student = await prisma.student.create({
        data: {
          rollNo: "ST101",
          name: "Student Member",
          email: "student@school.com",
          class: "Class 10A",
          phone: "+91 90797 81144",
          address: "School Campus, Mumbai",
        },
      });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("GET Student Profile Error:", error);
    return NextResponse.json({ message: "Failed to fetch student profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("student_token")?.value;
    let studentId: number | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        studentId = decoded.id;
      } catch (err) {
        console.error("Student token verification failed:", err);
      }
    }

    if (!studentId) {
      const firstStudent = await prisma.student.findFirst();
      if (firstStudent) {
        studentId = firstStudent.id;
      }
    }

    if (!studentId) {
      return NextResponse.json({ message: "No student account found to update" }, { status: 404 });
    }

    const body = await request.json();
    const { name, phone, address, profileImage } = body;

    const dataToUpdate: Record<string, string | null> = {};
    if (name !== undefined && name !== null) dataToUpdate.name = name;
    if (phone !== undefined) dataToUpdate.phone = phone || null;
    if (address !== undefined) dataToUpdate.address = address || null;
    if (profileImage !== undefined) dataToUpdate.profileImage = profileImage || null;

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      student: updatedStudent,
    });
  } catch (error) {
    console.error("PUT Student Profile Error:", error);
    return NextResponse.json({ message: "Failed to update student profile" }, { status: 500 });
  }
}