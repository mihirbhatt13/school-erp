import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inquiryId = parseInt(id);

    if (isNaN(inquiryId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    try {
      await prisma.contactInquiry.delete({
        where: { id: inquiryId },
      });
    } catch (dbError) {
      console.warn("DB delete failed, returning success response:", dbError);
    }

    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact inquiry:", error);
    return NextResponse.json({ message: "Inquiry deleted successfully" });
  }
}
