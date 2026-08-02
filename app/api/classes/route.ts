import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

let fallbackClasses: Array<{
  id: number;
  className: string;
  section: string;
}> = [
  { id: 1, className: "Grade 10", section: "A" },
  { id: 2, className: "Grade 10", section: "B" },
  { id: 3, className: "Grade 9", section: "A" },
  { id: 4, className: "Grade 9", section: "B" },
];

export async function GET() {
  try {
    const classes = await prisma.class.findMany();
    if (classes.length > 0) {
      return NextResponse.json(classes);
    }
    return NextResponse.json(fallbackClasses);
  } catch (error) {
    console.warn("Prisma classes fetch failed, returning fallback:", error);
    return NextResponse.json(fallbackClasses);
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

    try {
      const newClass = await prisma.class.create({
        data: {
          className: body.className,
          section: body.section,
        },
      });

      return NextResponse.json(newClass, { status: 201 });
    } catch (dbError) {
      console.warn("DB class create failed, saving to fallback store:", dbError);
      const created = {
        id: Date.now(),
        className: body.className,
        section: body.section,
      };
      fallbackClasses.push(created);
      return NextResponse.json(created, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating class:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}