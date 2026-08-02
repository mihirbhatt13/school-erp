"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/admin": "Dashboard Overview",
    "/admin/students": "Student Management",
    "/admin/teachers": "Faculty Directory",
    "/admin/classes": "Classes & Sections Allocation",
    "/admin/attendance": "Attendance Desk & Register",
    "/admin/fees": "Fee Management & Ledger",
    "/admin/exams": "Examination Schedules & Timetable",
    "/admin/marks": "Student Marks & Grades Entry",
    "/admin/notices": "Notice Board Broadcasts",
    "/admin/inquiries": "Contact Us Inquiries",
  };

  const pageTitle = pageTitles[pathname] || "EduPulse Academy ERP";

  const moduleName = pathname
    .replace("/admin", "")
    .replace("/", "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="bg-white rounded-2xl p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-200 shadow-sm">
      <div>
        <div className="flex items-center gap-3 text-xs font-bold text-indigo-600 mb-1">
          {pathname !== "/admin" && (
            <Link
              href="/admin"
              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 font-bold transition flex items-center gap-1"
            >
              <span>←</span>
              <span>Dashboard</span>
            </Link>
          )}
          <span>EduPulse Academy</span>
          <span>/</span>
          <span className="text-slate-700">{moduleName || "Dashboard"}</span>
        </div>
        <h1 className="text-2xl font-extrabold font-heading text-slate-900">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-2">
          <span>🎓 Session:</span>
          <span>2026-2027</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Active</span>
        </div>

        <div className="px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-right">
          <p className="text-xs font-bold text-slate-900">
            👨‍💼 Administrator
          </p>
          <p className="text-[11px] text-slate-500 font-medium">
            📅 {today}
          </p>
        </div>
      </div>
    </header>
  );
}