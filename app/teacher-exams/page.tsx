"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Exam {
  id: number;
  subject: string;
  className: string;
  examType?: string;
  examDate: string;
  totalMarks?: number;
  passingMarks?: number;
}

export default function TeacherExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  async function loadExams() {
    try {
      const response = await fetch("/api/exams");
      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      setExams(list);
      setFilteredExams(list);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(value: string) {
    setSearch(value);
    const q = value.trim().toLowerCase();
    if (!q) {
      setFilteredExams(exams);
      return;
    }
    const result = exams.filter(
      (exam) =>
        exam.subject?.toLowerCase().includes(q) ||
        exam.className?.toLowerCase().includes(q) ||
        exam.examType?.toLowerCase().includes(q) ||
        exam.examDate?.includes(q)
    );
    setFilteredExams(result);
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
                Exam Timetable
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                Scheduled tests and subject examinations
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
            Total Exams: {exams.length}
          </span>
        </div>

        {/* Search - Crisp visible dark text while writing! */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md flex items-center gap-3">
          <span className="text-slate-400 font-bold">🔍</span>
          <input
            type="text"
            placeholder="Type subject, class, date, or test type..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none transition"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Exam Type</th>
                  <th className="p-4">Exam Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500 text-xs font-medium">
                      Loading exam timetable...
                    </td>
                  </tr>
                ) : filteredExams.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500 text-xs font-medium">
                      No exams found matching search.
                    </td>
                  </tr>
                ) : (
                  filteredExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-slate-900">{exam.subject}</td>
                      <td className="p-4 text-xs font-bold text-slate-700">{exam.className}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 text-xs font-bold">
                          {exam.examType || "Term Exam"}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600">{exam.examDate}</td>
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