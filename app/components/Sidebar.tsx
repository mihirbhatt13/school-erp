"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Student Management", href: "/student", icon: "👨‍🎓" },
    { name: "Teacher Directory", href: "/teacher", icon: "👨‍🏫" },
    { name: "Class Allocation", href: "/classes", icon: "🏫" },
    { name: "Attendance Desk", href: "/attendance", icon: "📅" },
    { name: "Fees & Accounts", href: "/fees", icon: "💰" },
    { name: "Exams & Timetable", href: "/exams", icon: "📝" },
    { name: "Marks & Grades", href: "/marks", icon: "🎓" },
    { name: "Notice Board", href: "/notices", icon: "📢" },
    { name: "Contact Inquiries", href: "/admin/inquiries", icon: "📬" },
  ];

  return (
    <>
      {/* Mobile Header Bar with Hamburger Button */}
      <div className="md:hidden w-full bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-purple-600 p-0.5 overflow-hidden">
            <Image
              src="/images/logo.jpg"
              alt="EduPulse Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
          <span className="font-extrabold font-heading text-slate-900 text-lg">
            EduPulse <span className="text-indigo-600">Academy</span>
          </span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold text-xs flex items-center gap-1.5 shadow-xs"
        >
          <span>{mobileOpen ? "✕ Close" : "☰ ERP Menu"}</span>
        </button>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40"
        />
      )}

      {/* Main Sidebar Drawer */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 w-72 bg-white/95 backdrop-blur-xl border-r border-slate-200 text-slate-800 flex flex-col h-screen transition-transform duration-300 shadow-xl md:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 p-0.5 flex items-center justify-center shadow-md shadow-indigo-600/20 overflow-hidden">
              <Image
                src="/images/logo.jpg"
                alt="EduPulse Logo"
                width={44}
                height={44}
                className="w-full h-full object-cover rounded-[10px]"
              />
            </div>
            <div>
              <h2 className="text-xl font-extrabold font-heading text-slate-900 tracking-tight">
                EduPulse <span className="text-indigo-600">Academy</span>
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">
                ERP Governance
              </span>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-700 p-1 font-bold"
          >
            ✕
          </button>
        </div>

        {/* Navigation List */}
        <div className="p-4 flex-1 overflow-y-auto">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3">
            Management Modules
          </p>
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-700 text-white shadow-md shadow-indigo-700/20"
                        : "text-slate-600 hover:text-indigo-700 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-base">{item.icon}</span>
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User Info & Logout Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-xs">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-900 truncate">Administrator</p>
              <p className="text-[11px] text-slate-500 truncate">admin@school.com</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 rounded-xl py-2 text-xs font-bold transition-all shadow-xs"
          >
            <span>🚪</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}