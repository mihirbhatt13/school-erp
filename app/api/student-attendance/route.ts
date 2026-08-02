import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET =
  process.env.JWT_SECRET || "school_erp_super_secret_2026";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("student_token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };

    console.log("Decoded:", decoded);

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId: decoded.id,
      },
      orderBy: {
        id: "desc",
      },
    });

    console.log("Attendance:", attendance);

    return NextResponse.json(attendance);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Server Error" },
      { status: 500 }
    );
  }
}