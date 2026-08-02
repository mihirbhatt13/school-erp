"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Attendance {
  id: number;
  studentId: number;
  student: string;
  className: string;
  date: string;
  status: string;
}

export default function StudentAttendance() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  async function fetchAttendance() {
    try {
      const response = await fetch("/api/student-attendance");
      if (!response.ok) return;
      const data = await response.json();
      setAttendance(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-mesh-dark text-slate-100 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Bar with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-6 border border-blue-500/30">
          <div className="flex items-center gap-3">
            <Link
              href="/student-dashboard"
              className="px-3 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500 text-blue-300 hover:text-white border border-blue-500/30 font-bold text-xs transition"
            >
              ← Back to Student Dashboard
            </Link>
            <h1 className="text-2xl font-bold font-heading text-white">
              My Attendance History
            </h1>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Total Logs: {attendance.length}
          </span>
        </div>

        {/* Data Table Card */}
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading ? (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-slate-400 text-sm">
                      Loading attendance logs...
                    </td>
                  </tr>
                ) : attendance.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-6 text-center text-slate-400 text-sm">
                      No attendance logs recorded.
                    </td>
                  </tr>
                ) : (
                  attendance.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 text-xs font-bold text-white">{item.date}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status.toLowerCase() === "present"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {item.status.toLowerCase() === "present" ? "✅ Present" : "❌ Absent"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}