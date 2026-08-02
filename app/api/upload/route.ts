import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if not exists
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const filename = `avatar_${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const filePath = path.join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({
      message: "File uploaded successfully",
      url: imageUrl,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: "File upload failed" }, { status: 500 });
  }
}
