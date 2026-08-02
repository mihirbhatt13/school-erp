"use client";

import { useEffect, useState } from "react";
import { DEFAULT_EXAM_TYPES } from "@/lib/examTypes";
import { exportToCSV } from "@/lib/csvExport";
import { showToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { TableSkeletonRows } from "@/app/components/SkeletonLoader";

interface MarkItem {
  id: number;
  studentId: number;
  student: string;
  className: string;
  subject: string;
  examType: string;
  totalMarks: number;
  passingMarks: number;
  obtainedMarks: number;
}

export default function AdminMarksPage() {
  const [marks, setMarks] = useState<MarkItem[]>([]);
  const [filteredMarks, setFilteredMarks] = useState<MarkItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [studentId, setStudentId] = useState(1);
  const [student, setStudent] = useState("");
  const [className, setClassName] = useState("Grade 10-A");
  const [subject, setSubject] = useState("Mathematics");
  const [selectedExamType, setSelectedExamType] = useState("Unit Test 1");
  const [customExamType, setCustomExamType] = useState("");
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(40);
  const [obtainedMarks, setObtainedMarks] = useState(85);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    fetchMarks();
  }, []);

  async function fetchMarks() {
    try {
      const res = await fetch("/api/marks");
      const data = await res.json();
      const list: MarkItem[] = Array.isArray(data) ? data : [];
      setMarks(list);
      setFilteredMarks(list);
    } catch (err) {
      console.error(err);
      showToast("Error loading student marks.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query: string) {
    setSearch(query);
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredMarks(marks);
      return;
    }
    const matched = marks.filter(
      (m) =>
        m.student?.toLowerCase().includes(q) ||
        m.subject?.toLowerCase().includes(q) ||
        m.className?.toLowerCase().includes(q) ||
        m.examType?.toLowerCase().includes(q)
    );
    setFilteredMarks(matched);
  }

  function handleExportCSV() {
    exportToCSV("student_marks_report", filteredMarks, [
      { key: "id", label: "Entry ID" },
      { key: "student", label: "Student Name" },
      { key: "className", label: "Class" },
      { key: "subject", label: "Subject" },
      { key: "examType", label: "Exam Type" },
      { key: "obtainedMarks", label: "Marks Obtained" },
      { key: "totalMarks", label: "Total Marks" },
      { key: "passingMarks", label: "Passing Marks" },
    ]);
    showToast("Student marks ledger exported to CSV file.", "info");
  }

  function openAddModal() {
    setEditingId(null);
    setStudentId(1);
    setStudent("");
    setClassName("Grade 10-A");
    setSubject("Mathematics");
    setSelectedExamType("Unit Test 1");
    setCustomExamType("");
    setTotalMarks(100);
    setPassingMarks(40);
    setObtainedMarks(85);
    setShowModal(true);
  }

  function openEditModal(mark: MarkItem) {
    setEditingId(mark.id);
    setStudentId(mark.studentId || 1);
    setStudent(mark.student);
    setClassName(mark.className);
    setSubject(mark.subject);
    
    const existingType = mark.examType || "Unit Test 1";
    if (DEFAULT_EXAM_TYPES.includes(existingType)) {
      setSelectedExamType(existingType);
      setCustomExamType("");
    } else {
      setSelectedExamType("Other");
      setCustomExamType(existingType);
    }

    setTotalMarks(mark.totalMarks);
    setPassingMarks(mark.passingMarks);
    setObtainedMarks(mark.obtainedMarks);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!student || !subject) return;

    const finalExamType = selectedExamType === "Other" ? customExamType : selectedExamType;
    if (!finalExamType) {
      showToast("Please specify the exam type.", "warning");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        studentId: Number(studentId),
        student,
        className,
        subject,
        examType: finalExamType,
        totalMarks: Number(totalMarks),
        passingMarks: Number(passingMarks),
        obtainedMarks: Number(obtainedMarks),
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/marks/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/marks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowModal(false);
        showToast(
          editingId ? `Updated marks entry for ${student}` : `Recorded marks for ${student}`,
          "success"
        );
        fetchMarks();
      } else {
        showToast("Failed to save marks entry.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving marks entry.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/marks/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Marks entry removed.", "warning");
        fetchMarks();
      } else {
        showToast("Failed to delete marks entry.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error removing marks entry.", "error");
    } finally {
      setDeleteTargetId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-2.5 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search marks by student name, subject, class, or test type..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-indigo-600 font-medium transition"
          />
        </div>

        <div className="flex items-center gap-2">
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
            <span>Log Student Marks</span>
          </button>
        </div>
      </div>

      {/* Marks Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Class</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Exam Type</th>
                <th className="p-4">Marks Obtained</th>
                <th className="p-4">Result Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <TableSkeletonRows rows={5} cols={7} />
              ) : filteredMarks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 text-xs font-medium">
                    No student marks records found.
                  </td>
                </tr>
              ) : (
                filteredMarks.map((m) => {
                  const passed = m.obtainedMarks >= m.passingMarks;
                  const percentage = Math.round((m.obtainedMarks / m.totalMarks) * 100);

                  return (
                    <tr key={m.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-slate-900">{m.student}</td>
                      <td className="p-4 text-xs font-bold text-slate-700">{m.className}</td>
                      <td className="p-4 text-xs font-bold text-indigo-700">{m.subject}</td>
                      <td className="p-4 text-xs font-medium text-slate-600">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                          {m.examType || "Unit Test 1"}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-bold text-slate-900">
                        {m.obtainedMarks} / {m.totalMarks} <span className="text-slate-400 font-normal">({percentage}%)</span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            passed
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {passed ? "PASSED" : "FAILED"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(m)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(m.id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-xs transition"
                          >
                            🗑️
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
      </div>

      {/* Marks Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {editingId ? "Edit Marks Entry" : "Record Student Marks"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-slate-800 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={student}
                    onChange={(e) => setStudent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 10-A"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                {/* SEARCHABLE EXAM TYPE DROPDOWN */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Type Category *</label>
                  <select
                    value={selectedExamType}
                    onChange={(e) => setSelectedExamType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-indigo-600"
                  >
                    {DEFAULT_EXAM_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {selectedExamType === "Other" && (
                    <input
                      type="text"
                      required
                      placeholder="Enter custom examination name..."
                      value={customExamType}
                      onChange={(e) => setCustomExamType(e.target.value)}
                      className="w-full bg-white border border-indigo-500 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none font-medium mt-2"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks Obtained *</label>
                  <input
                    type="number"
                    required
                    value={obtainedMarks}
                    onChange={(e) => setObtainedMarks(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 font-bold rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    required
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    required
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold transition shadow-sm"
                >
                  {submitting ? "Saving..." : editingId ? "Update Marks" : "Save Marks"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Remove Marks Entry"
        message="Are you sure you want to delete this student marks record? This action cannot be undone."
        confirmText="Yes, Delete Marks"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
