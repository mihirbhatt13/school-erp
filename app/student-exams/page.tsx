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
      <div className="min-h-screen bg-mesh-dark flex items-center justify-center text-slate-300 font-bold text-lg">
        Loading Exam Schedules...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-dark text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-6 border border-cyan-500/30">
          <div className="flex items-center gap-3">
            <Link
              href="/student-dashboard"
              className="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 font-bold text-xs transition"
            >
              ← Back to Student Dashboard
            </Link>
            <h1 className="text-2xl font-bold font-heading text-white">
              My Examination Schedule
            </h1>
          </div>

          <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            Exams: {exams.length}
          </span>
        </div>

        {/* Exams Table */}
        {exams.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 text-slate-400 font-semibold text-sm">
            No Exams Scheduled For Your Class.
          </div>
        ) : (
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Subject</th>
                    <th className="p-4">Exam Type</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Total Marks</th>
                    <th className="p-4">Passing Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {exams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-bold text-white">{exam.subject}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                          {exam.examType}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-slate-300">{exam.examDate}</td>
                      <td className="p-4 font-semibold text-white">{exam.totalMarks}</td>
                      <td className="p-4 font-bold text-amber-400">{exam.passingMarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}