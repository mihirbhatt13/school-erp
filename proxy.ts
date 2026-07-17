import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "school_erp_super_secret_2026";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // Public Routes
  if (pathname === "/" || pathname === "/login") {
    if (pathname === "/login" && token) {
      try {
        jwt.verify(token, JWT_SECRET);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {
        // Invalid token
      }
    }

    return NextResponse.next();
  }

  // Protected Routes
  const protectedRoutes = [
    "/admin",
    "/student",
    "/teacher",
    "/classes",
    "/attendance",
    "/fees",
    "/exams",
    "/notices",
    "/dashboard",
  ];

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

 try {
  const decoded = jwt.verify(token, JWT_SECRET);

  console.log("JWT VERIFIED:", decoded);

  return NextResponse.next();
} catch (err) {
  console.error("JWT VERIFY FAILED");
  console.error(err);

  return NextResponse.redirect(new URL("/login", request.url));
}
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/dashboard/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/classes/:path*",
    "/attendance/:path*",
    "/fees/:path*",
    "/exams/:path*",
    "/notices/:path*",
  ],
};