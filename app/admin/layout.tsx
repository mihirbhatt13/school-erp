"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white p-6">
        <h2 className="text-3xl font-bold mb-8">
          School ERP
        </h2>

        <ul className="space-y-3">
          <li><Link href="/admin">Dashboard</Link></li>
          <li><Link href="/student">Students</Link></li>
          <li><Link href="/teacher">Teachers</Link></li>
          <li><Link href="/classes">Classes</Link></li>
          <li><Link href="/attendance">Attendance</Link></li>
          <li><Link href="/fees">Fees</Link></li>
          <li><Link href="/exams">Exams</Link></li>
          <li><Link href="/notices">Notice Board</Link></li>

          <li
            onClick={handleLogout}
            className="cursor-pointer text-red-300"
          >
            Logout
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}