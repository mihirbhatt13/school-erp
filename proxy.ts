import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "school_erp_super_secret_2026";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const adminToken = request.cookies.get("token")?.value;
  const studentToken = request.cookies.get("student_token")?.value;
  const teacherToken = request.cookies.get("teacher_token")?.value;

  // =========================
  // Public Routes
  // =========================
  if (pathname === "/") {
    return NextResponse.next();
  }

  // =========================
  // Admin Login
  // =========================
  if (pathname === "/login") {
    if (adminToken) {
      try {
        jwt.verify(adminToken, JWT_SECRET);
        return NextResponse.redirect(new URL("/admin", request.url));
      } catch {}
    }

    return NextResponse.next();
  }

  // =========================
  // Student Login
  // =========================
  if (pathname === "/student-login") {
    if (studentToken) {
      try {
        jwt.verify(studentToken, JWT_SECRET);
        return NextResponse.redirect(
          new URL("/student-dashboard", request.url)
        );
      } catch {}
    }

    return NextResponse.next();
  }

  // =========================
  // Teacher Login
  // =========================
  if (pathname === "/teacher-login") {
    if (teacherToken) {
      try {
        jwt.verify(teacherToken, JWT_SECRET);
        return NextResponse.redirect(
          new URL("/teacher-dashboard", request.url)
        );
      } catch {}
    }

    return NextResponse.next();
  }

  // =========================
  // Student Dashboard & Pages
  // =========================
  if (
    pathname === "/student-dashboard" ||
    pathname.startsWith("/student-dashboard/") ||
    pathname.startsWith("/student-attendance") ||
    pathname.startsWith("/student-fees") ||
    pathname.startsWith("/student-exams") ||
    pathname.startsWith("/student-notices")
  ) {
    if (!studentToken) {
      return NextResponse.redirect(
        new URL("/student-login", request.url)
      );
    }

    try {
      jwt.verify(studentToken, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(
        new URL("/student-login", request.url)
      );
    }
  }

  // =========================
  // Teacher Dashboard & Pages
  // =========================
  if (
    pathname === "/teacher-dashboard" ||
    pathname.startsWith("/teacher-dashboard/") ||
    pathname.startsWith("/teacher-profile") ||
    pathname.startsWith("/teacher-students") ||
    pathname.startsWith("/teacher-attendance") ||
    pathname.startsWith("/teacher-exams") ||
    pathname.startsWith("/teacher-notices")
  ) {
    if (!teacherToken) {
      return NextResponse.redirect(
        new URL("/teacher-login", request.url)
      );
    }

    try {
      jwt.verify(teacherToken, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(
        new URL("/teacher-login", request.url)
      );
    }
  }

  // =========================
  // Admin Protected Routes
  // =========================
  const adminExactOrPrefix = (route: string) => {
    return pathname === route || pathname.startsWith(route + "/");
  };

  const adminRoutes = [
    "/admin",
    "/student",
    "/teacher",
    "/classes",
    "/attendance",
    "/fees",
    "/exams",
    "/marks",
    "/notices",
  ];

  if (adminRoutes.some((route) => adminExactOrPrefix(route))) {
    if (!adminToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      jwt.verify(adminToken, JWT_SECRET);
      return NextResponse.next();
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/student-login",
    "/teacher-login",
    "/student-dashboard/:path*",
    "/student-attendance/:path*",
    "/student-fees/:path*",
    "/student-exams/:path*",
    "/student-notices/:path*",
    "/teacher-dashboard/:path*",
    "/teacher-profile/:path*",
    "/teacher-students/:path*",
    "/teacher-attendance/:path*",
    "/teacher-exams/:path*",
    "/teacher-notices/:path*",
    "/admin/:path*",
    "/student/:path*",
    "/teacher/:path*",
    "/classes/:path*",
    "/attendance/:path*",
    "/fees/:path*",
    "/exams/:path*",
    "/marks/:path*",
    "/notices/:path*",
  ],
};