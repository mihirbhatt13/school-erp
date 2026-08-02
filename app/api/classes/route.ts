import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Complete K-12 Class structure fallback (Nursery through Class 12)
let fallbackClasses: Array<{
  id: number;
  className: string;
  section: string;
  roomNo?: string;
  capacity?: number;
  academicYear?: string;
  status?: string;
}> = [
  { id: 1, className: "Nursery", section: "A", roomNo: "Room 101", capacity: 30, academicYear: "2026-2027", status: "Active" },
  { id: 2, className: "Junior KG (LKG)", section: "A", roomNo: "Room 102", capacity: 30, academicYear: "2026-2027", status: "Active" },
  { id: 3, className: "Senior KG (UKG)", section: "A", roomNo: "Room 103", capacity: 30, academicYear: "2026-2027", status: "Active" },
  { id: 4, className: "Class 1", section: "A", roomNo: "Room 201", capacity: 35, academicYear: "2026-2027", status: "Active" },
  { id: 5, className: "Class 2", section: "A", roomNo: "Room 202", capacity: 35, academicYear: "2026-2027", status: "Active" },
  { id: 6, className: "Class 3", section: "A", roomNo: "Room 203", capacity: 35, academicYear: "2026-2027", status: "Active" },
  { id: 7, className: "Class 4", section: "A", roomNo: "Room 204", capacity: 35, academicYear: "2026-2027", status: "Active" },
  { id: 8, className: "Class 5", section: "A", roomNo: "Room 205", capacity: 35, academicYear: "2026-2027", status: "Active" },
  { id: 9, className: "Class 6", section: "A", roomNo: "Room 301", capacity: 40, academicYear: "2026-2027", status: "Active" },
  { id: 10, className: "Class 7", section: "A", roomNo: "Room 302", capacity: 40, academicYear: "2026-2027", status: "Active" },
  { id: 11, className: "Class 8", section: "A", roomNo: "Room 303", capacity: 40, academicYear: "2026-2027", status: "Active" },
  { id: 12, className: "Class 9", section: "A", roomNo: "Room 401", capacity: 40, academicYear: "2026-2027", status: "Active" },
  { id: 13, className: "Class 10", section: "A", roomNo: "Room 402", capacity: 40, academicYear: "2026-2027", status: "Active" },
  { id: 14, className: "Class 10", section: "B", roomNo: "Room 403", capacity: 40, academicYear: "2026-2027", status: "Active" },
  { id: 15, className: "Class 11", section: "A", roomNo: "Room 501", capacity: 45, academicYear: "2026-2027", status: "Active" },
  { id: 16, className: "Class 12", section: "A", roomNo: "Room 502", capacity: 45, academicYear: "2026-2027", status: "Active" },
];

export async function GET() {
  try {
    const classes = await prisma.class.findMany({
      orderBy: { id: "asc" },
    });
    if (classes.length > 0) {
      return NextResponse.json(classes);
    }
    return NextResponse.json(fallbackClasses);
  } catch (error) {
    console.warn("Prisma classes fetch failed, returning K-12 fallback:", error);
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
        roomNo: body.roomNo || "Room 101",
        capacity: body.capacity || 40,
        academicYear: body.academicYear || "2026-2027",
        status: body.status || "Active",
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