import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const students = await prisma.student.findMany();

  return NextResponse.json(students);
}

export async function POST(request: Request) {
  const body = await request.json();

  const student = await prisma.student.create({
    data: {
      name: body.name,
      email: body.email,
      class: body.class,
    },
  });

  return NextResponse.json(student);
}