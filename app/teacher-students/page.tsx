"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
  rollNo?: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

interface Teacher {
  id: number;
  name: string;
  assignedClass: string;
  subject: string;
}

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<"assigned" | "all">("assigned");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      let teacherData: Teacher | null = null;
      const teacherResponse = await fetch("/api/teacher-profile");
      if (teacherResponse.ok) {
        teacherData = await teacherResponse.json();
        setTeacher(teacherData);
      }

      const response = await fetch("/api/students");
      const data = await response.json();
      const allStudents: Student[] = Array.isArray(data) ? data : [];

      setStudents(allStudents);

      if (teacherData?.assignedClass) {
        const classStudents = allStudents.filter(
          (s) => s.class.toLowerCase() === teacherData?.assignedClass.toLowerCase()
        );
        if (classStudents.length > 0) {
          setFilteredStudents(classStudents);
        } else {
          setFilteredStudents(allStudents);
          setFilterMode("all");
        }
      } else {
        setFilteredStudents(allStudents);
        setFilterMode("all");
      }
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query: string, mode = filterMode) {
    setSearch(query);
    const q = query.trim().toLowerCase();

    let baseList = students;
    if (mode === "assigned" && teacher?.assignedClass) {
      const assigned = students.filter(
        (s) => s.class.toLowerCase() === teacher.assignedClass.toLowerCase()
      );
      if (assigned.length > 0) baseList = assigned;
    }

    if (!q) {
      setFilteredStudents(baseList);
      return;
    }

    const matched = baseList.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        s.class?.toLowerCase().includes(q) ||
        s.rollNo?.toLowerCase().includes(q) ||
        s.phone?.toLowerCase().includes(q)
    );
    setFilteredStudents(matched);
  }

  function toggleFilterMode(newMode: "assigned" | "all") {
    setFilterMode(newMode);
    handleSearch(search, newMode);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm">
        Loading Student Roster...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Navigation */}
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
                Student Roster
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                {teacher?.assignedClass ? `Assigned Class: ${teacher.assignedClass}` : "School Student Directory"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFilterMode("assigned")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                filterMode === "assigned"
                  ? "bg-indigo-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Assigned Class
            </button>
            <button
              onClick={() => toggleFilterMode("all")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                filterMode === "all"
                  ? "bg-indigo-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              All Students ({students.length})
            </button>
          </div>
        </div>

        {/* Search Bar - Crisp visible dark text while writing! */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md flex items-center gap-3">
          <span className="text-slate-400 font-bold">🔍</span>
          <input
            type="text"
            placeholder="Type student name, roll number, class, or email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none transition"
          />
        </div>

        {/* Student Cards Grid / Table */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Student</th>
                  <th className="p-4">Roll No</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-xs font-medium">
                      No students found matching search.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                            {s.profileImage ? (
                              <Image
                                src={s.profileImage}
                                alt={s.name}
                                width={40}
                                height={40}
                                unoptimized
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-slate-400 text-lg">👤</span>
                            )}
                          </div>
                          <div>
                            <strong className="text-slate-900 block font-bold">{s.name}</strong>
                            <span className="text-slate-400 text-[11px]">ID #{s.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-900 text-xs">{s.rollNo || "-"}</td>
                      <td className="p-4 text-xs">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold border border-indigo-100">
                          {s.class}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-medium text-slate-700">{s.email}</td>
                      <td className="p-4 text-xs font-medium text-slate-700">{s.phone || "-"}</td>
                      <td className="p-4 text-xs text-slate-500 max-w-xs truncate">{s.address || "-"}</td>
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