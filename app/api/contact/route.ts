import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, category, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, Email, and Message are required." },
        { status: 400 }
      );
    }

    const inquiry = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        category: category || "General Inquiry",
        message,
      },
    });

    return NextResponse.json(
      {
        message: "Inquiry submitted successfully to database",
        inquiry,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving contact inquiry in database:", error);
    return NextResponse.json(
      { message: "Failed to submit inquiry to database" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const inquiries = await prisma.contactInquiry.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(inquiries);
  } catch (error) {
    console.error("Error fetching contact inquiries from database:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
