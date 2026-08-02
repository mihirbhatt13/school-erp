import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const exams = await prisma.exam.findMany();

  return NextResponse.json(exams);
}

export async function POST(request: Request) {
  const body = await request.json();

  const exam = await prisma.exam.create({
    data: {
      subject: body.subject,
      className: body.className,
      examType: body.examType,
      examDate: body.examDate,
      examTime: body.examTime,
      totalMarks: body.totalMarks,
      passingMarks: body.passingMarks,
    },
  });

  return NextResponse.json(exam);
}