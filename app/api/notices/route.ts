import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json(notices);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to fetch notices",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const notice = await prisma.notice.create({
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
      },
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Unable to create notice",
      },
      {
        status: 500,
      }
    );
  }
}