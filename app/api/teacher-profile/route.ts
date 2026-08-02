import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "school_erp_super_secret_2026";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("teacher_token")?.value;
    let teacherId: number | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        teacherId = decoded.id;
      } catch (err) {
        console.error("Teacher token verification failed:", err);
      }
    }

    let teacher = null;
    if (teacherId) {
      teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
      });
    }

    // Fallback: If no token or teacher not found by token, load first teacher in DB
    if (!teacher) {
      teacher = await prisma.teacher.findFirst();
    }

    if (!teacher) {
      // Create a default teacher if database is completely empty
      teacher = await prisma.teacher.create({
        data: {
          teacherId: "TCH1001",
          name: "Faculty Member",
          email: "teacher@school.com",
          subject: "Science & STEM",
          assignedClass: "Grade 10-A",
          phone: "+91 90797 81144",
          address: "School Campus, Mumbai",
        },
      });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("GET Teacher Profile Error:", error);
    return NextResponse.json({ message: "Failed to fetch teacher profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("teacher_token")?.value;
    let teacherId: number | null = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
        teacherId = decoded.id;
      } catch (err) {
        console.error("Teacher token verification failed:", err);
      }
    }

    if (!teacherId) {
      const firstTeacher = await prisma.teacher.findFirst();
      if (firstTeacher) {
        teacherId = firstTeacher.id;
      }
    }

    if (!teacherId) {
      return NextResponse.json({ message: "No teacher account found to update" }, { status: 404 });
    }

    const body = await request.json();
    const { name, phone, subject, assignedClass, address, profileImage } = body;

    const dataToUpdate: Record<string, string | null> = {};
    if (name !== undefined && name !== null) dataToUpdate.name = name;
    if (phone !== undefined) dataToUpdate.phone = phone || null;
    if (subject !== undefined && subject !== null) dataToUpdate.subject = subject;
    if (assignedClass !== undefined && assignedClass !== null) dataToUpdate.assignedClass = assignedClass;
    if (address !== undefined) dataToUpdate.address = address || null;
    if (profileImage !== undefined) dataToUpdate.profileImage = profileImage || null;

    const updatedTeacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      teacher: updatedTeacher,
    });
  } catch (error) {
    console.error("PUT Teacher Profile Error:", error);
    return NextResponse.json({ message: "Failed to update teacher profile" }, { status: 500 });
  }
}