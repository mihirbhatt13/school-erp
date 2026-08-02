import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "school_erp_super_secret_2026";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and Password are required" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: {
        email,
      },
    });

    if (!admin) {
      return NextResponse.json(
        { message: "Invalid Email or Password" },
        { status: 401 }
      );
    }

    let isPasswordValid = false;
    if (admin.password) {
      if (
        admin.password.startsWith("$2a$") ||
        admin.password.startsWith("$2b$") ||
        admin.password.startsWith("$2y$")
      ) {
        isPasswordValid = await bcrypt.compare(password, admin.password);
      } else {
        isPasswordValid = password === admin.password;
        if (isPasswordValid) {
          const hashedPassword = await bcrypt.hash(password, 10);
          await prisma.admin.update({
            where: { id: admin.id },
            data: { password: hashedPassword },
          });
        }
      }
    }

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid Email or Password" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    const response = NextResponse.json({
      message: "Login Successful",
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}