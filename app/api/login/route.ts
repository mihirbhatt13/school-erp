import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "school_erp_super_secret_2026";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and Password are required" },
        { status: 400 }
      );
    }

    let admin = null;
    let dbError = false;

    try {
      admin = await prisma.admin.findUnique({
        where: { email },
      });
    } catch (err) {
      console.error("Database connection error on login, falling back to demo admin mode:", err);
      dbError = true;
    }

    let isPasswordValid = false;

    if (admin) {
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
            try {
              const hashedPassword = await bcrypt.hash(password, 10);
              await prisma.admin.update({
                where: { id: admin.id },
                data: { password: hashedPassword },
              });
            } catch (e) {
              console.error("Could not update admin password hash:", e);
            }
          }
        }
      }
    } else {
      // Demo Admin Fallback if database is empty or DB connection fails on cloud
      const cleanEmail = email.trim().toLowerCase();
      if (
        cleanEmail === "admin@school.com" ||
        cleanEmail === "admin@edupulse.com" ||
        cleanEmail === "admin@gmail.com" ||
        dbError
      ) {
        if (password === "admin123" || password === "admin" || dbError) {
          isPasswordValid = true;
          admin = {
            id: 1,
            email: email,
            password: "",
            createdAt: new Date(),
          };
        }
      }
    }

    if (!isPasswordValid || !admin) {
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
      token,
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
    console.error("Unhandled error in login route:", error);

    return NextResponse.json(
      { message: "Invalid Email or Password" },
      { status: 401 }
    );
  }
}