import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(notices);
  } catch (error) {
    console.error("Prisma notices fetch error:", error);
    return NextResponse.json(
      { error: "Unable to fetch notices from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: "Title and Description are required" },
        { status: 400 }
      );
    }

    const notice = await prisma.notice.create({
      data: {
        title: body.title,
        description: body.description,
        date: body.date || new Date().toISOString().split("T")[0],
      },
    });

    return NextResponse.json(notice, { status: 201 });
  } catch (error) {
    console.error("Error creating notice in database:", error);
    return NextResponse.json(
      { error: "Unable to create notice in database" },
      { status: 500 }
    );
  }
}