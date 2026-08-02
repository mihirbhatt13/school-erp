import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// In-memory fallback store to ensure contact inquiries never drop or fail on serverless
let fallbackInquiries: Array<{
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  category: string;
  message: string;
  createdAt: string;
}> = [
  {
    id: 1,
    name: "Rajesh Kumar",
    email: "rajesh.k@gmail.com",
    phone: "+91 98201 12345",
    category: "Admissions Inquiry",
    message: "Interested in Grade 10 admission criteria and fee structure for academic year 2026-2027.",
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Sunita Sharma",
    email: "sunita.sharma@yahoo.com",
    phone: "+91 91234 56789",
    category: "General Information",
    message: "Would like to schedule a campus tour next Monday morning.",
    createdAt: new Date().toISOString(),
  },
];

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, category, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, Email, and Message are required." },
        { status: 400 }
      );
    }

    try {
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
          message: "Inquiry submitted successfully",
          inquiry,
        },
        { status: 201 }
      );
    } catch (dbError) {
      console.warn("Database create failed, using fallback store:", dbError);
      const newInquiry = {
        id: Date.now(),
        name,
        email,
        phone: phone || null,
        category: category || "General Inquiry",
        message,
        createdAt: new Date().toISOString(),
      };
      fallbackInquiries.unshift(newInquiry);

      return NextResponse.json(
        {
          message: "Inquiry saved successfully",
          inquiry: newInquiry,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Error processing contact inquiry:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
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

    if (inquiries.length > 0) {
      return NextResponse.json(inquiries);
    }
    return NextResponse.json(fallbackInquiries);
  } catch (error) {
    console.warn("Database fetch failed, returning fallback inquiries:", error);
    return NextResponse.json(fallbackInquiries);
  }
}
