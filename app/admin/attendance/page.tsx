"use client";

import { useEffect, useState } from "react";
import { exportToCSV } from "@/lib/csvExport";
import { showToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { TableSkeletonRows } from "@/app/components/SkeletonLoader";

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

interface ClassItem {
  id: number;
  className: string;
  section: string;
}

export default function AdminAttendancePage() {
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classList, setClassList] = useState<string[]>([]);
  
  const [search, setSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // Take Attendance Modal State
  const [showTakeModal, setShowTakeModal] = useState(false);
  const [modalClass, setModalClass] = useState("Grade 10-A");
  const [modalDate, setModalDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [attendanceStates, setAttendanceStates] = useState<Record<number, "Present" | "Absent" | "Late" | "Leave">>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [attendanceRes, studentsRes, classesRes] = await Promise.all([
        fetch("/api/attendance"),
        fetch("/api/students"),
        fetch("/api/classes"),
      ]);

      const attendanceData: AttendanceRecord[] = await attendanceRes.json();
      const studentsData: Student[] = await studentsRes.json();
      const classesData: ClassItem[] = await classesRes.json();

      const logList = Array.isArray(attendanceData) ? attendanceData : [];
      setLogs(logList);
      setFilteredLogs(logList);

      const stuList = Array.isArray(studentsData) ? studentsData : [];
      setStudents(stuList);

      // Extract unique classes
      const rawClasses: string[] = [];
      if (Array.isArray(classesData)) {
        classesData.forEach((c) => rawClasses.push(`${c.className}-${c.section}`));
      }
      stuList.forEach((s) => {
        if (s.class && !rawClasses.includes(s.class)) rawClasses.push(s.class);
      });

      const uniqueClasses = Array.from(new Set(rawClasses)).filter(Boolean);
      setClassList(uniqueClasses.length > 0 ? uniqueClasses : ["Grade 10-A", "Grade 9-B"]);
      if (uniqueClasses.length > 0) setModalClass(uniqueClasses[0]);
    } catch (err) {
      console.error("Error loading attendance data:", err);
      showToast("Error loading attendance data.", "error");
    } finally {
      setLoading(false);
    }
  }

  // Load class students when modal opens or modalClass changes
  useEffect(() => {
    if (!showTakeModal) return;
    const targetStudents = students.filter(
      (s) => s.class.toLowerCase() === modalClass.toLowerCase()
    );
    setClassStudents(targetStudents);

    // Initialize attendance states with existing records or default to "Present"
    const initial: Record<number, "Present" | "Absent" | "Late" | "Leave"> = {};
    targetStudents.forEach((s) => {
      const existing = logs.find(
        (l) => l.studentId === s.id && l.date === modalDate
      );
      if (existing && ["Present", "Absent", "Late", "Leave"].includes(existing.status)) {
        initial[s.id] = existing.status as any;
      } else {
        initial[s.id] = "Present";
      }
    });
    setAttendanceStates(initial);
  }, [showTakeModal, modalClass, modalDate, students, logs]);

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

  function handleExportCSV() {
    exportToCSV("attendance_master_log", filteredLogs, [
      { key: "id", label: "Log ID" },
      { key: "date", label: "Date" },
      { key: "student", label: "Student Name" },
      { key: "className", label: "Class Assigned" },
      { key: "status", label: "Attendance Status" },
    ]);
    showToast("Attendance master log exported to CSV file.", "info");
  }

  function handleMarkAll(status: "Present" | "Absent" | "Late" | "Leave") {
    const updated: Record<number, "Present" | "Absent" | "Late" | "Leave"> = {};
    classStudents.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceStates(updated);
    showToast(`All students marked as ${status}.`, "info");
  }

  function handleResetModal() {
    const reset: Record<number, "Present" | "Absent" | "Late" | "Leave"> = {};
    classStudents.forEach((s) => {
      reset[s.id] = "Present";
    });
    setAttendanceStates(reset);
    showToast("Attendance reset to default Present.", "info");
  }

  async function handleSaveAttendance(e: React.FormEvent) {
    e.preventDefault();
    if (classStudents.length === 0) {
      showToast("No students found in selected class.", "warning");
      return;
    }

    setSubmitting(true);

    try {
      let savedCount = 0;

      for (const student of classStudents) {
        const status = attendanceStates[student.id] || "Present";
        const res = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: student.id,
            student: student.name,
            className: modalClass,
            date: modalDate,
            status: status,
          }),
        });

        if (res.ok) savedCount++;
      }

      if (savedCount > 0) {
        setShowTakeModal(false);
        showToast(
          `Successfully recorded attendance for ${savedCount} students in ${modalClass} on ${modalDate}.`,
          "success"
        );
        loadData();
      } else {
        showToast("Failed to save attendance records.", "error");
      }
    } catch (err) {
      console.error("Error saving attendance:", err);
      showToast("Error submitting attendance register.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/attendance/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Attendance record removed.", "warning");
        loadData();
      } else {
        showToast("Failed to delete record.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting record.", "error");
    } finally {
      setDeleteTargetId(null);
    }
  }

  const presentCount = logs.filter((l) => l.status?.toLowerCase() === "present").length;
  const absentCount = logs.filter((l) => l.status?.toLowerCase() === "absent").length;
  const lateCount = logs.filter((l) => l.status?.toLowerCase() === "late").length;
  const leaveCount = logs.filter((l) => l.status?.toLowerCase() === "leave").length;
  const totalLogs = logs.length;
  const attendanceRate = totalLogs > 0 ? Math.round((presentCount / totalLogs) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Action Header with Prominent Take Attendance Button */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-100 uppercase tracking-wider">
            Daily Presence Register
          </span>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 mt-1">
            Attendance Desk
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Record daily student presence, review historical logs, and monitor attendance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            <span>📥</span>
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setShowTakeModal(true)}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition hover:scale-105"
          >
            <span className="text-base">📋</span>
            <span>Take Attendance</span>
          </button>
        </div>
      </div>

      {/* Attendance Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Present Score</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">{attendanceRate}%</h3>
            <span className="text-slate-400 text-[11px] font-medium">{presentCount} Present</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xl font-bold">
            ✓
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Absent</p>
            <h3 className="text-3xl font-extrabold text-rose-600 mt-1">{absentCount}</h3>
            <span className="text-slate-400 text-[11px] font-medium">Unexcused</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center text-xl font-bold">
            ✕
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Late</p>
            <h3 className="text-3xl font-extrabold text-amber-500 mt-1">{lateCount}</h3>
            <span className="text-slate-400 text-[11px] font-medium">Tardy Arrival</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-xl font-bold">
            ⏱
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">On Leave</p>
            <h3 className="text-3xl font-extrabold text-indigo-600 mt-1">{leaveCount}</h3>
            <span className="text-slate-400 text-[11px] font-medium">Approved Leave</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-xl font-bold">
            📝
          </div>
        </div>
      </div>

      {/* Search & Date Filter Bar */}
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
                <TableSkeletonRows rows={5} cols={5} />
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <span className="text-4xl block">📋</span>
                      <strong className="text-slate-900 block font-bold">No Attendance Records</strong>
                      <p className="text-slate-500 text-xs font-medium">Click Take Attendance to log student presence.</p>
                      <button
                        onClick={() => setShowTakeModal(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
                      >
                        + Take Attendance Now
                      </button>
                    </div>
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
                            : item.status?.toLowerCase() === "leave"
                            ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setDeleteTargetId(item.id)}
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

      {/* TAKE ATTENDANCE MODAL */}
      {showTakeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
                  <span>📋</span>
                  <span>Take Class Attendance</span>
                </h3>
                <p className="text-slate-500 text-xs mt-0.5 font-medium">
                  Select class and date to log or update student attendance.
                </p>
              </div>
              <button
                onClick={() => setShowTakeModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            {/* Select Class & Date Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-shrink-0 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Class *</label>
                <select
                  value={modalClass}
                  onChange={(e) => setModalClass(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-600"
                >
                  {classList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Attendance Date *</label>
                <input
                  type="date"
                  value={modalDate}
                  onChange={(e) => setModalDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            {/* Quick Action Batch Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 flex-shrink-0 pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-600">
                Students ({classStudents.length})
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkAll("Present")}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px] hover:bg-emerald-600 hover:text-white transition"
                >
                  ✓ All Present
                </button>
                <button
                  type="button"
                  onClick={() => handleMarkAll("Absent")}
                  className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px] hover:bg-rose-600 hover:text-white transition"
                >
                  ✕ All Absent
                </button>
                <button
                  type="button"
                  onClick={handleResetModal}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-bold text-[11px] hover:bg-slate-200 transition"
                >
                  ↺ Reset
                </button>
              </div>
            </div>

            {/* Student List */}
            <form onSubmit={handleSaveAttendance} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {classStudents.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <p className="text-xs font-bold text-slate-700">No students registered in {modalClass}.</p>
                  <p className="text-[11px] text-slate-500">Please register students to this class in Student Management.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {classStudents.map((student) => {
                    const status = attendanceStates[student.id] || "Present";

                    return (
                      <div
                        key={student.id}
                        className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-300 transition"
                      >
                        <div>
                          <strong className="text-slate-900 block font-bold text-xs">{student.name}</strong>
                          <span className="text-slate-400 text-[11px] font-medium">Roll: {student.rollNo || `#${student.id}`}</span>
                        </div>

                        <div className="flex items-center gap-1.5 self-start sm:self-auto">
                          <button
                            type="button"
                            onClick={() => setAttendanceStates({ ...attendanceStates, [student.id]: "Present" })}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                              status === "Present"
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttendanceStates({ ...attendanceStates, [student.id]: "Absent" })}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                              status === "Absent"
                                ? "bg-rose-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                            }`}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttendanceStates({ ...attendanceStates, [student.id]: "Late" })}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                              status === "Late"
                                ? "bg-amber-500 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700"
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => setAttendanceStates({ ...attendanceStates, [student.id]: "Leave" })}
                            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition ${
                              status === "Leave"
                                ? "bg-indigo-600 text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                            }`}
                          >
                            Leave
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowTakeModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || classStudents.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-md disabled:opacity-50"
                >
                  {submitting ? "Saving Attendance..." : "Save Attendance Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Remove Attendance Record"
        message="Are you sure you want to delete this attendance log? This action cannot be undone."
        confirmText="Yes, Delete Log"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
