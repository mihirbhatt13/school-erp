"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Student {
  id: number;
  name: string;
  class: string;
  rollNo?: string;
}

interface AttendanceRecord {
  id: number;
  studentId: number;
  student: string;
  studentName?: string;
  className: string;
  status: string;
  date: string;
}

interface Teacher {
  id: number;
  name: string;
  assignedClass: string;
}

export default function TeacherAttendancePage() {
  const [activeTab, setActiveTab] = useState<"mark" | "history">("mark");
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AttendanceRecord[]>([]);
  
  // Attendance Marking State
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [attendanceStates, setAttendanceStates] = useState<Record<number, "Present" | "Absent" | "Late">>({});
  const [submitting, setSubmitting] = useState(false);
  const [markMessage, setMarkMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
  
  // History Search State
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      let tData: Teacher | null = null;
      const teacherRes = await fetch("/api/teacher-profile");
      if (teacherRes.ok) {
        tData = await teacherRes.json();
        setTeacher(tData);
      }

      const [studentsRes, attendanceRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/attendance"),
      ]);

      const allStudents: Student[] = await studentsRes.json();
      const allLogs: AttendanceRecord[] = await attendanceRes.json();

      const studentList = Array.isArray(allStudents) ? allStudents : [];
      setStudents(studentList);

      // Initialize attendance states default to "Present"
      const initialStates: Record<number, "Present" | "Absent" | "Late"> = {};
      studentList.forEach((s) => {
        initialStates[s.id] = "Present";
      });
      setAttendanceStates(initialStates);

      const logsList = Array.isArray(allLogs) ? allLogs : [];
      setAttendanceLogs(logsList);
      setFilteredLogs(logsList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleStatusChange(studentId: number, status: "Present" | "Absent" | "Late") {
    setAttendanceStates((prev) => ({ ...prev, [studentId]: status }));
  }

  async function handleMarkAttendance(e: React.FormEvent) {
    e.preventDefault();
    if (students.length === 0) return;

    setSubmitting(true);
    setMarkMessage(null);

    try {
      let successCount = 0;

      for (const student of students) {
        const status = attendanceStates[student.id] || "Present";
        const res = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: student.id,
            student: student.name,
            className: student.class,
            date: selectedDate,
            status: status,
          }),
        });

        if (res.ok) successCount++;
      }

      if (successCount > 0) {
        setMarkMessage({ text: `Attendance saved for ${successCount} students on ${selectedDate}.`, type: "success" });
        // Reload logs
        const refreshedLogs = await (await fetch("/api/attendance")).json();
        const list = Array.isArray(refreshedLogs) ? refreshedLogs : [];
        setAttendanceLogs(list);
        setFilteredLogs(list);
      } else {
        setMarkMessage({ text: "Failed to submit attendance.", type: "error" });
      }
    } catch (error) {
      console.error(error);
      setMarkMessage({ text: "Error saving attendance register.", type: "error" });
    } finally {
      setSubmitting(false);
    }
  }

  function handleSearch(query: string) {
    setSearch(query);
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredLogs(attendanceLogs);
      return;
    }

    const matched = attendanceLogs.filter(
      (item) =>
        (item.student || item.studentName || "").toLowerCase().includes(q) ||
        item.status?.toLowerCase().includes(q) ||
        item.className?.toLowerCase().includes(q) ||
        item.date?.includes(q)
    );
    setFilteredLogs(matched);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm">
        Loading Attendance Module...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher-dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-slate-900">
                Attendance Register
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                {teacher?.assignedClass ? `Assigned Class: ${teacher.assignedClass}` : "Mark & Inspect Daily Attendance"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("mark")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "mark"
                  ? "bg-indigo-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Mark Attendance
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === "history"
                  ? "bg-indigo-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Attendance Logs ({attendanceLogs.length})
            </button>
          </div>
        </div>

        {/* TAB 1: MARK ATTENDANCE */}
        {activeTab === "mark" && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-900">Daily Attendance Entry</h3>
                <p className="text-slate-500 text-xs mt-0.5 font-medium">
                  Select date and mark student attendance statuses.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs font-bold text-slate-700">Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {markMessage && (
              <div
                className={`p-3 rounded-xl border text-xs font-bold text-center ${
                  markMessage.type === "success"
                    ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                    : "bg-rose-100 border-rose-200 text-rose-800"
                }`}
              >
                {markMessage.text}
              </div>
            )}

            <form onSubmit={handleMarkAttendance} className="space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Student Name</th>
                      <th className="p-4">Roll No</th>
                      <th className="p-4">Class</th>
                      <th className="p-4 text-center">Status Selection</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {students.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 text-xs font-medium">
                          No students available to mark.
                        </td>
                      </tr>
                    ) : (
                      students.map((student) => {
                        const currentStatus = attendanceStates[student.id] || "Present";

                        return (
                          <tr key={student.id} className="hover:bg-slate-50 transition">
                            <td className="p-4 font-bold text-slate-900">{student.name}</td>
                            <td className="p-4 text-xs font-bold text-slate-600">{student.rollNo || "-"}</td>
                            <td className="p-4 text-xs">
                              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                                {student.class}
                              </span>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, "Present")}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                    currentStatus === "Present"
                                      ? "bg-emerald-600 text-white shadow-sm"
                                      : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                                  }`}
                                >
                                  Present
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, "Absent")}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                    currentStatus === "Absent"
                                      ? "bg-rose-600 text-white shadow-sm"
                                      : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                                  }`}
                                >
                                  Absent
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, "Late")}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                                    currentStatus === "Late"
                                      ? "bg-amber-500 text-white shadow-sm"
                                      : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                                  }`}
                                >
                                  Late
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={submitting || students.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold transition shadow-md"
                >
                  {submitting ? "Saving Register..." : "Submit Attendance Register"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 2: ATTENDANCE HISTORY LOGS */}
        {activeTab === "history" && (
          <div className="space-y-6">
            {/* Search Bar - Crisp visible dark text while writing! */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md flex items-center gap-3">
              <span className="text-slate-400 font-bold">🔍</span>
              <input
                type="text"
                placeholder="Search attendance logs by student name, date, or status..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none transition"
              />
            </div>

            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-4">Date</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">Class</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-500 text-xs font-medium">
                          No attendance logs found matching search.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition">
                          <td className="p-4 text-xs font-bold text-slate-700">{item.date}</td>
                          <td className="p-4 font-bold text-slate-900">{item.student || item.studentName}</td>
                          <td className="p-4 text-xs font-medium text-slate-600">{item.className}</td>
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
        )}
      </div>
    </div>
  );
}