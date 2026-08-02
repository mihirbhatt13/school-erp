import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const teachers = await prisma.teacher.findMany();

  return NextResponse.json(teachers);
}

export async function POST(request: Request) {
  const body = await request.json();

  const hashedPassword = body.password
    ? await bcrypt.hash(body.password, 10)
    : null;

  const teacher = await prisma.teacher.create({
    data: {
      teacherId: body.teacherId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      assignedClass: body.assignedClass,
      password: hashedPassword,
    },
  });

  return NextResponse.json(teacher);
}