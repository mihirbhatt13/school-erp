"use client";

import { useEffect, useState } from "react";

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
  const [examType, setExamType] = useState("Mid-Term Exam");
  const [examDate, setExamDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [examTime, setExamTime] = useState("10:00 AM - 01:00 PM");
  const [totalMarks, setTotalMarks] = useState(100);
  const [passingMarks, setPassingMarks] = useState(40);
  const [submitting, setSubmitting] = useState(false);

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

  function openAddModal() {
    setEditingId(null);
    setSubject("");
    setClassName("Grade 10-A");
    setExamType("Mid-Term Exam");
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
    setExamType(exam.examType || "Mid-Term Exam");
    setExamDate(exam.examDate || new Date().toISOString().split("T")[0]);
    setExamTime(exam.examTime || "10:00 AM - 01:00 PM");
    setTotalMarks(exam.totalMarks || 100);
    setPassingMarks(exam.passingMarks || 40);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!subject || !className) return;
    setSubmitting(true);

    try {
      const payload = {
        subject,
        className,
        examType,
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
        fetchExams();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to remove this exam schedule?")) return;
    try {
      const res = await fetch(`/api/exams/${id}`, { method: "DELETE" });
      if (res.ok) fetchExams();
    } catch (err) {
      console.error(err);
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

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
        >
          <span>➕</span>
          <span>Schedule New Exam</span>
        </button>
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
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs font-medium">
                    Loading exam schedules...
                  </td>
                </tr>
              ) : filteredExams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-xs font-medium">
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
                        {e.examType || "Term Test"}
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
                          onClick={() => handleDelete(e.id)}
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
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Class *</label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Type</label>
                  <input
                    type="text"
                    required
                    value={examType}
                    onChange={(e) => setExamType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Date</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Exam Timing</label>
                  <input
                    type="text"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={totalMarks}
                    onChange={(e) => setTotalMarks(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Passing Marks</label>
                  <input
                    type="number"
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
                  {submitting ? "Saving..." : editingId ? "Update Exam" : "Schedule Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
