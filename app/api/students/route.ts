import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const students = await prisma.student.findMany();

  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const body = await request.json();

  const hashedPassword = await bcrypt.hash(body.password, 10);

  const student = await prisma.student.create({
   data: {
  rollNo: body.rollNo,
  name: body.name,
  email: body.email,
  class: body.class,
  password: hashedPassword,
},
  });

  return NextResponse.json(student);
}