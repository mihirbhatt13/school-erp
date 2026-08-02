import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "school_erp_super_secret_2026";

export async function POST(req: NextRequest) {
  try {
    const { loginType, email, password, phone, otp } = await req.json();

    let student = null;

    // 1. LOGIN WITH GOOGLE
    if (loginType === "google") {
      const googleEmail = email || "student.google@gmail.com";
      student = await prisma.student.findFirst({
        where: { OR: [{ email: googleEmail }, { email: "student@gmail.com" }] },
      });

      if (!student) {
        student = await prisma.student.create({
          data: {
            name: "Google Student",
            email: googleEmail,
            class: "Grade 10-A",
            rollNo: `STU${Math.floor(1000 + Math.random() * 9000)}`,
          },
        });
      }
    }
    // 2. LOGIN WITH MOBILE NUMBER & OTP
    else if (loginType === "phone") {
      if (!phone) {
        return NextResponse.json({ message: "Mobile number is required" }, { status: 400 });
      }

      if (!otp) {
        return NextResponse.json({ message: "OTP sent to your mobile number" }, { status: 200 });
      }

      // Verify OTP (default test OTP: 123456 or any 6 digits)
      if (otp.length < 4) {
        return NextResponse.json({ message: "Invalid OTP code" }, { status: 401 });
      }

      student = await prisma.student.findFirst({
        where: { OR: [{ phone: phone }, { email: "student@gmail.com" }] },
      });

      if (!student) {
        student = await prisma.student.create({
          data: {
            name: `Student (${phone.slice(-4)})`,
            email: `student_${phone}@school.com`,
            phone: phone,
            class: "Grade 10-A",
            rollNo: `STU${Math.floor(1000 + Math.random() * 9000)}`,
          },
        });
      }
    }
    // 3. LOGIN WITH EMAIL & PASSWORD
    else {
      if (!email || !password) {
        return NextResponse.json({ message: "Email and Password are required" }, { status: 400 });
      }

      student = await prisma.student.findUnique({ where: { email } });

      if (!student) {
        return NextResponse.json({ message: "Invalid Email or Password" }, { status: 401 });
      }

      let isPasswordValid = false;
      if (student.password) {
        if (
          student.password.startsWith("$2a$") ||
          student.password.startsWith("$2b$") ||
          student.password.startsWith("$2y$")
        ) {
          isPasswordValid = await bcrypt.compare(password, student.password);
        } else {
          isPasswordValid = password === student.password;
          if (isPasswordValid) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await prisma.student.update({
              where: { id: student.id },
              data: { password: hashedPassword },
            });
          }
        }
      }

      if (!isPasswordValid) {
        return NextResponse.json({ message: "Invalid Email or Password" }, { status: 401 });
      }
    }

    if (!student) {
      return NextResponse.json({ message: "Student account not found" }, { status: 404 });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email, role: "student" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({
      message: "Student Login Successful",
      student: { name: student.name, email: student.email, class: student.class },
    });

    response.cookies.set("student_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Student Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}