import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const teachers = await prisma.teacher.findMany();

  return NextResponse.json(teachers);
}

export async function POST(request: Request) {
  const body = await request.json();

  const teacher = await prisma.teacher.create({
    data: {
      name: body.name,
      email: body.email,
      subject: body.subject,
    },
  });

  return NextResponse.json(teacher);
}