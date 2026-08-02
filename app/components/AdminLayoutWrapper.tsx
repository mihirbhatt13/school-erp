"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-800 font-sans">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
        <Header />
        {children}
      </main>
    </div>
  );
}
