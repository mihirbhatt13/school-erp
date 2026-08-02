import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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

    await prisma.contactInquiry.delete({
      where: { id: inquiryId },
    });

    return NextResponse.json({ message: "Inquiry deleted successfully" });
  } catch (error) {
    console.error("Error deleting contact inquiry from database:", error);
    return NextResponse.json(
      { message: "Failed to delete inquiry from database" },
      { status: 500 }
    );
  }
}
