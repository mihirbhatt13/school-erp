"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Exam {
  id: number;
  subject: string;
  className: string;
  examType: string;
  examDate: string;
  totalMarks: number;
  passingMarks: number;
}

interface Student {
  id: number;
  name: string;
  class: string;
}

export default function StudentExamsPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const studentResponse = await fetch("/api/student-profile");
      if (!studentResponse.ok) {
        setLoading(false);
        return;
      }

      const studentData = await studentResponse.json();
      setStudent(studentData);

      const examResponse = await fetch("/api/exams");
      const examData = await examResponse.json();

      const myExams = Array.isArray(examData)
        ? examData.filter(
            (exam: Exam) =>
              exam.className.trim().toLowerCase() ===
              studentData.class.trim().toLowerCase()
          )
        : [];

      setExams(myExams);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm">
        Loading Exam Schedule...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
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
                Examination Schedule
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                {student ? `Class: ${student.class}` : "Upcoming tests and evaluation dates"}
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
            Total Exams: {exams.length}
          </span>
        </div>

        {/* Exams Table */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Exam Type</th>
                  <th className="p-4">Exam Date</th>
                  <th className="p-4">Total Marks</th>
                  <th className="p-4">Passing Marks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {exams.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 text-xs font-medium">
                      No exams scheduled for your class.
                    </td>
                  </tr>
                ) : (
                  exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-slate-900">{exam.subject}</td>
                      <td className="p-4 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                          {exam.examType || "Term Test"}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-600">{exam.examDate}</td>
                      <td className="p-4 text-xs font-bold text-slate-900">{exam.totalMarks || 100}</td>
                      <td className="p-4 text-xs font-bold text-emerald-600">{exam.passingMarks || 40}</td>
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