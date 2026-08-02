import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    message: "Logout Successful",
  });

  response.cookies.set("student_token", "", {
    httpOnly: true,
    expires: new Date(0),
    maxAge: 0,
    path: "/",
  });

  return response;
}