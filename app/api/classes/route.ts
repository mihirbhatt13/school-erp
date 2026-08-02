import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Prisma classes fetch error:", error);
    return NextResponse.json(
      { message: "Failed to fetch classes from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.className || !body.section) {
      return NextResponse.json(
        { message: "Class Name and Section are required" },
        { status: 400 }
      );
    }

    const newClass = await prisma.class.create({
      data: {
        className: body.className,
        section: body.section,
      },
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error creating class in database:", error);
    return NextResponse.json(
      { message: "Failed to create class in database" },
      { status: 500 }
    );
  }
}