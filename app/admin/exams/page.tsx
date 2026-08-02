"use client";

import { useEffect, useState } from "react";
import { DEFAULT_EXAM_TYPES } from "@/lib/examTypes";
import { exportToCSV } from "@/lib/csvExport";
import { showToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { TableSkeletonRows } from "@/app/components/SkeletonLoader";

interface ExamItem {
  id: number;
  subject: string;
  className: string;
  examType?: string;
  examDate: string;
  examTime?: string;
  totalMarks?: number;
  passingMarks?: number;
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<ExamItem[]>([]);
  const [filteredExams, setFilteredExams] = useState<ExamItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("Grade 10-A");
  const [selectedExamType, setSelectedExamType] = useState("Unit Test 1");
  const [customExamType, setCustomExamType] = useState("");
  const [examDate, setExamDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [examTime, setExamTime] = useState("10:00 AM - 01:00 PM");
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(40);
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    fetchExams();
  }, []);

  async function fetchExams() {
    try {
      const res = await fetch("/api/exams");
      const data = await res.json();
      const list: ExamItem[] = Array.isArray(data) ? data : [];
      setExams(list);
      setFilteredExams(list);
    } catch (err) {
      console.error(err);
      showToast("Error loading examination timetable.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query: string) {
    setSearch(query);
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredExams(exams);
      return;
    }
    const matched = exams.filter(
      (e) =>
        e.subject?.toLowerCase().includes(q) ||
        e.className?.toLowerCase().includes(q) ||
        e.examType?.toLowerCase().includes(q) ||
        e.examDate?.includes(q)
    );
    setFilteredExams(matched);
  }

  function handleExportCSV() {
    exportToCSV("examination_schedules", filteredExams, [
      { key: "id", label: "Exam ID" },
      { key: "subject", label: "Subject Name" },
      { key: "className", label: "Target Class" },
      { key: "examType", label: "Exam Type" },
      { key: "examDate", label: "Date" },
      { key: "examTime", label: "Timing" },
      { key: "totalMarks", label: "Total Marks" },
      { key: "passingMarks", label: "Passing Marks" },
    ]);
    showToast("Exam schedules exported to CSV file.", "info");
  }

  function openAddModal() {
    setEditingId(null);
    setSubject("");
    setClassName("Grade 10-A");
    setSelectedExamType("Unit Test 1");
    setCustomExamType("");
    setExamDate(new Date().toISOString().split("T")[0]);
    setExamTime("10:00 AM - 01:00 PM");
    setTotalMarks(100);
    setPassingMarks(40);
    setShowModal(true);
  }

  function openEditModal(exam: ExamItem) {
    setEditingId(exam.id);
    setSubject(exam.subject);
    setClassName(exam.className);
    
    const existingType = exam.examType || "Unit Test 1";
    if (DEFAULT_EXAM_TYPES.includes(existingType)) {
      setSelectedExamType(existingType);
      setCustomExamType("");
    } else {
      setSelectedExamType("Other");
      setCustomExamType(existingType);
    }

    setExamDate(exam.examDate || new Date().toISOString().split("T")[0]);
    setExamTime(exam.examTime || "10:00 AM - 01:00 PM");
    setTotalMarks(exam.totalMarks || 100);
    setPassingMarks(exam.passingMarks || 40);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject || !className) return;

    const finalExamType = selectedExamType === "Other" ? customExamType : selectedExamType;
    if (!finalExamType) {
      showToast("Please specify the exam type.", "warning");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        subject,
        className,
        examType: finalExamType,
        examDate,
        examTime,
        totalMarks: Number(totalMarks),
        passingMarks: Number(passingMarks),
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/exams/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/exams", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowModal(false);
        showToast(
          editingId ? `Updated ${finalExamType} schedule for ${subject}` : `Scheduled ${finalExamType} for ${subject}`,
          "success"
        );
        fetchExams();
      } else {
        showToast("Failed to save exam schedule.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving exam schedule.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/exams/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Exam schedule removed.", "warning");
        fetchExams();
      } else {
        showToast("Failed to delete exam schedule.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error removing exam schedule.", "error");
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
            placeholder="Search exam by subject, class, date, or test type..."
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
            <span>Schedule New Exam</span>
          </button>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Subject</th>
                <th className="p-4">Class</th>
                <th className="p-4">Exam Type</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Total / Pass Marks</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <TableSkeletonRows rows={5} cols={6} />
              ) : filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 text-xs font-medium">
                    No examination schedules found.
                  </td>
                </tr>
              ) : (
                filteredExams.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">{e.subject}</td>
                    <td className="p-4 text-xs font-bold text-slate-700">{e.className}</td>
                    <td className="p-4 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                        {e.examType || "Unit Test 1"}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-600">
                      <div>{e.examDate}</div>
                      <div className="text-[11px] text-slate-400">{e.examTime || "10:00 AM"}</div>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-800">
                      {e.totalMarks || 100} / <span className="text-emerald-600">{e.passingMarks || 40}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(e)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(e.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white font-bold text-xs transition"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {editingId ? "Edit Examination Schedule" : "Schedule New Examination"}
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
                  <label className="block font-bold text-slate-700 mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Class *</label>
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

              {/* SEARCHABLE EXAM TYPE DROPDOWN */}
              <div className="space-y-2">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Date *</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Timing</label>
                  <input
                    type="text"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={passingMarks}
                    onChange={(e) => setPassingMarks(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
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
                  {submitting ? "Saving..." : editingId ? "Update Exam" : "Schedule Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Remove Examination Schedule"
        message="Are you sure you want to delete this exam schedule? This action cannot be undone."
        confirmText="Yes, Delete Exam"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
