"use client";

import { useEffect, useState } from "react";

interface AttendanceRecord {
  id: number;
  studentId: number;
  student: string;
  studentName?: string;
  className: string;
  status: string;
  date: string;
}

export default function AdminAttendancePage() {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AttendanceRecord[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      setLogs(list);
      setFilteredLogs(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleFilter(query: string, dt: string) {
    setSearch(query);
    setSelectedDate(dt);
    const q = query.trim().toLowerCase();

    let list = logs;
    if (dt) {
      list = list.filter((item) => item.date === dt);
    }

    if (q) {
      list = list.filter(
        (item) =>
          (item.student || item.studentName || "").toLowerCase().includes(q) ||
          item.className?.toLowerCase().includes(q) ||
          item.status?.toLowerCase().includes(q)
      );
    }

    setFilteredLogs(list);
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this attendance record?")) return;
    try {
      const res = await fetch(`/api/attendance/${id}`, { method: "DELETE" });
      if (res.ok) fetchLogs();
    } catch (err) {
      console.error(err);
    }
  }

  const presentCount = logs.filter((l) => l.status?.toLowerCase() === "present").length;
  const absentCount = logs.filter((l) => l.status?.toLowerCase() === "absent").length;
  const lateCount = logs.filter((l) => l.status?.toLowerCase() === "late").length;

  return (
    <div className="space-y-6">
      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Present</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{presentCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xl font-bold">
            ✓
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Absent</p>
            <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{absentCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center text-xl font-bold">
            ✕
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Late</p>
            <h3 className="text-3xl font-extrabold text-amber-600 mt-1">{lateCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-xl font-bold">
            ⏱
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-2.5 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search student name, class, or status..."
            value={search}
            onChange={(e) => handleFilter(e.target.value, selectedDate)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-indigo-600 font-medium transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleFilter(search, e.target.value)}
            className="bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:bg-white focus:border-indigo-600 transition"
          />
          {selectedDate && (
            <button
              onClick={() => handleFilter(search, "")}
              className="px-3 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-slate-200 transition"
            >
              Clear Date
            </button>
          )}
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Student</th>
                <th className="p-4">Class</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-xs font-medium">
                    Loading attendance records...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 text-xs font-medium">
                    No attendance records found matching filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-xs font-bold text-slate-700">{item.date}</td>
                    <td className="p-4 font-bold text-slate-900">{item.student || item.studentName}</td>
                    <td className="p-4 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                        {item.className}
                      </span>
                    </td>
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
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-xs transition"
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
