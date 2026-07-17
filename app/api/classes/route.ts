import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const classes = await prisma.class.findMany();

  return NextResponse.json(classes);
}

export async function POST(request: Request) {
  const body = await request.json();

  const newClass = await prisma.class.create({
    data: {
      className: body.className,
      section: body.section,
    },
  });

  return NextResponse.json(newClass);
}