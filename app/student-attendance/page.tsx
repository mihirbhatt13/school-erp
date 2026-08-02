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
      setAttendance(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const presentCount = attendance.filter((a) => a.status?.toLowerCase() === "present").length;
  const attendanceRate = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm">
        Loading Attendance History...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/student-dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-slate-900">
                Attendance Register
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                Personal daily presence logs and attendance score
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100">
              Score: {attendanceRate}%
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
              Total Logs: {attendance.length}
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-slate-500 text-xs font-medium">
                      No attendance logs recorded yet.
                    </td>
                  </tr>
                ) : (
                  attendance.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 text-xs font-bold text-slate-900">{item.date}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status?.toLowerCase() === "present"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : item.status?.toLowerCase() === "late"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {item.status}
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