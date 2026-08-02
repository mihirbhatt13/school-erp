"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { exportToCSV } from "@/lib/csvExport";
import { showToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { CardSkeletonGrid } from "@/app/components/SkeletonLoader";

interface ClassItem {
  id: number;
  className: string;
  section: string;
  roomNo?: string;
  capacity?: number;
  academicYear?: string;
  status?: string;
}

interface Student {
  id: number;
  name: string;
  class: string;
  rollNo?: string;
  email?: string;
}

interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  subject: string;
  assignedClass: string;
  email?: string;
}

export default function AdminClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // View Students Modal
  const [viewStudentsClass, setViewStudentsClass] = useState<string | null>(null);

  // Assign Teacher Modal
  const [assignClassTarget, setAssignClassTarget] = useState<string | null>(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(null);

  // Delete Target
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  // Form State
  const [className, setClassName] = useState("Grade 10");
  const [section, setSection] = useState("A");
  const [roomNo, setRoomNo] = useState("Room 301");
  const [capacity, setCapacity] = useState(40);
  const [academicYear, setAcademicYear] = useState("2026-2027");
  const [status, setStatus] = useState("Active");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [classesRes, studentsRes, teachersRes] = await Promise.all([
        fetch("/api/classes"),
        fetch("/api/students"),
        fetch("/api/teachers"),
      ]);

      const classData: ClassItem[] = await classesRes.json();
      const studentData: Student[] = await studentsRes.json();
      const teacherData: Teacher[] = await teachersRes.json();

      setClasses(Array.isArray(classData) ? classData : []);
      setStudents(Array.isArray(studentData) ? studentData : []);
      setTeachers(Array.isArray(teacherData) ? teacherData : []);
    } catch (err) {
      console.error(err);
      showToast("Error loading classroom data.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleExportCSV() {
    const csvData = classes.map((c) => {
      const fullClassName = `${c.className}-${c.section}`;
      const enrolledCount = students.filter((s) => s.class === fullClassName).length;
      const assignedTeacher = teachers.find((t) => t.assignedClass === fullClassName);

      return {
        id: c.id,
        className: c.className,
        section: c.section,
        fullClass: fullClassName,
        teacher: assignedTeacher ? assignedTeacher.name : "Unassigned",
        enrolledStudents: enrolledCount,
        capacity: c.capacity || 40,
        roomNo: c.roomNo || "Room 101",
        academicYear: c.academicYear || "2026-2027",
        status: c.status || "Active",
      };
    });

    exportToCSV("classroom_allocations", csvData, [
      { key: "id", label: "ID" },
      { key: "fullClass", label: "Class & Section" },
      { key: "teacher", label: "Class Teacher" },
      { key: "enrolledStudents", label: "Enrolled Students" },
      { key: "capacity", label: "Capacity" },
      { key: "roomNo", label: "Room Number" },
      { key: "academicYear", label: "Academic Year" },
      { key: "status", label: "Status" },
    ]);
    showToast("Classroom allocations exported to CSV file.", "info");
  }

  function openAddModal() {
    setEditingId(null);
    setClassName("Grade 10");
    setSection("A");
    setRoomNo(`Room ${Math.floor(100 + Math.random() * 400)}`);
    setCapacity(40);
    setAcademicYear("2026-2027");
    setStatus("Active");
    setShowAddModal(true);
  }

  function openEditModal(c: ClassItem) {
    setEditingId(c.id);
    setClassName(c.className);
    setSection(c.section);
    setRoomNo(c.roomNo || "Room 301");
    setCapacity(c.capacity || 40);
    setAcademicYear(c.academicYear || "2026-2027");
    setStatus(c.status || "Active");
    setShowAddModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!className || !section) return;
    setSubmitting(true);

    try {
      const payload = {
        className,
        section,
        roomNo,
        capacity: Number(capacity),
        academicYear,
        status,
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/classes/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowAddModal(false);
        showToast(
          editingId ? `Updated classroom section ${className}-${section}` : `Created new classroom ${className}-${section}`,
          "success"
        );
        loadData();
      } else {
        showToast("Failed to save classroom section.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving classroom allocation.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAssignTeacherSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!assignClassTarget || !selectedTeacherId) return;

    try {
      const teacherToAssign = teachers.find((t) => t.id === selectedTeacherId);
      if (!teacherToAssign) return;

      const res = await fetch(`/api/teachers/${selectedTeacherId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...teacherToAssign,
          assignedClass: assignClassTarget,
        }),
      });

      if (res.ok) {
        setAssignClassTarget(null);
        showToast(`Assigned ${teacherToAssign.name} to ${assignClassTarget}`, "success");
        loadData();
      } else {
        showToast("Failed to assign teacher.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error assigning teacher to class.", "error");
    }
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/classes/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Classroom section removed.", "warning");
        loadData();
      } else {
        showToast("Failed to delete class.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error removing classroom section.", "error");
    } finally {
      setDeleteTargetId(null);
    }
  }

  const filteredClasses = classes.filter(
    (c) =>
      c.className?.toLowerCase().includes(search.toLowerCase()) ||
      c.section?.toLowerCase().includes(search.toLowerCase()) ||
      `${c.className}-${c.section}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100 uppercase tracking-wider">
            Academic Infrastructure
          </span>
          <h2 className="text-2xl font-extrabold font-heading text-slate-900 mt-1">
            Class Management & Allocation
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Manage classroom sections, assign faculty teachers, inspect student enrollments, and check room capacity.
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
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>➕</span>
            <span>Create Class Section</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
        <span className="text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search classroom by name, section, or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
        />
      </div>

      {/* Classes Grid */}
      {loading ? (
        <CardSkeletonGrid cards={6} />
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs font-medium space-y-3 max-w-sm mx-auto">
          <span className="text-4xl block">🏫</span>
          <strong className="text-slate-900 block font-bold">No Classroom Sections Found</strong>
          <p>Create a new classroom section to begin student allocations.</p>
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-xl bg-indigo-700 text-white font-bold text-xs"
          >
            + Create Class Section
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((c) => {
            const fullClassName = `${c.className}-${c.section}`;
            const enrolledStudents = students.filter(
              (s) => s.class.toLowerCase() === fullClassName.toLowerCase()
            );
            const assignedTeacher = teachers.find(
              (t) => t.assignedClass.toLowerCase() === fullClassName.toLowerCase()
            );
            const cardCapacity = c.capacity || 40;
            const isFull = enrolledStudents.length >= cardCapacity;

            return (
              <div
                key={c.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-5 flex flex-col justify-between hover:border-indigo-500 transition group"
              >
                <div className="space-y-4">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold group-hover:bg-indigo-600 group-hover:text-white transition">
                      🏫
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200">
                        Sec {c.section}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          (c.status || "Active").toLowerCase() === "active"
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {c.status || "Active"}
                      </span>
                    </div>
                  </div>

                  {/* Title & Info */}
                  <div>
                    <h3 className="text-xl font-extrabold font-heading text-slate-900">
                      {c.className} <span className="text-indigo-600">({c.section})</span>
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5 font-medium">
                      Academic Year: {c.academicYear || "2026-2027"} • {c.roomNo || "Room 101"}
                    </p>
                  </div>

                  {/* Class Teacher Badge */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Class Teacher</span>
                      <strong className="text-slate-900 text-xs font-bold">
                        {assignedTeacher ? assignedTeacher.name : "Unassigned"}
                      </strong>
                    </div>
                    <button
                      onClick={() => setAssignClassTarget(fullClassName)}
                      className="text-indigo-700 hover:text-indigo-900 font-bold text-xs underline"
                    >
                      {assignedTeacher ? "Change" : "Assign"}
                    </button>
                  </div>

                  {/* Student Capacity Meter */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">Enrolled Students</span>
                      <span className={isFull ? "text-rose-600" : "text-indigo-700"}>
                        {enrolledStudents.length} / {cardCapacity}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isFull ? "bg-rose-500" : "bg-indigo-600"
                        }`}
                        style={{
                          width: `${Math.min(100, (enrolledStudents.length / cardCapacity) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Action Grid Buttons */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setViewStudentsClass(fullClassName)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                    >
                      <span>👥</span>
                      <span>Students ({enrolledStudents.length})</span>
                    </button>

                    <Link
                      href="/admin/attendance"
                      className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition border border-emerald-200"
                    >
                      <span>📋</span>
                      <span>Attendance</span>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href="/admin/exams"
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] transition border border-indigo-100"
                    >
                      📅 Timetable & Exams
                    </Link>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(c)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => setDeleteTargetId(c.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-xs transition"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT CLASS MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {editingId ? "Edit Classroom Details" : "Create Classroom Section"}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-slate-800 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 10"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Room 302"
                    value={roomNo}
                    onChange={(e) => setRoomNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-bold"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold transition shadow-sm"
                >
                  {submitting ? "Saving..." : editingId ? "Update Classroom" : "Create Classroom"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW STUDENTS MODAL */}
      {viewStudentsClass && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 space-y-6 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Enrolled Students - {viewStudentsClass}
                </h3>
                <p className="text-slate-500 text-xs mt-0.5 font-medium">
                  Roster of students assigned to this classroom section.
                </p>
              </div>
              <button
                onClick={() => setViewStudentsClass(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
              {students.filter((s) => s.class.toLowerCase() === viewStudentsClass.toLowerCase()).length === 0 ? (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200">
                  <p className="text-slate-500 font-medium">No students enrolled in {viewStudentsClass} yet.</p>
                </div>
              ) : (
                students
                  .filter((s) => s.class.toLowerCase() === viewStudentsClass.toLowerCase())
                  .map((student) => (
                    <div
                      key={student.id}
                      className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200 flex items-center justify-between"
                    >
                      <div>
                        <strong className="text-slate-900 block font-bold">{student.name}</strong>
                        <span className="text-slate-500 text-[11px]">{student.email}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100">
                        {student.rollNo || `#${student.id}`}
                      </span>
                    </div>
                  ))
              )}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setViewStudentsClass(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs transition"
              >
                Close Roster
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN TEACHER MODAL */}
      {assignClassTarget && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-slate-900">
                  Assign Class Teacher
                </h3>
                <p className="text-slate-500 text-xs mt-0.5 font-medium">
                  Select a faculty member for {assignClassTarget}
                </p>
              </div>
              <button
                onClick={() => setAssignClassTarget(null)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignTeacherSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Faculty Member *</label>
                <select
                  required
                  value={selectedTeacherId || ""}
                  onChange={(e) => setSelectedTeacherId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-indigo-600 font-bold"
                >
                  <option value="">-- Select Faculty Member --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject}) - Currently: {t.assignedClass || "Unassigned"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignClassTarget(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedTeacherId}
                  className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold transition shadow-sm disabled:opacity-50"
                >
                  Assign Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Classroom Section"
        message="Are you sure you want to remove this classroom section? This action cannot be undone."
        confirmText="Yes, Delete Section"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
