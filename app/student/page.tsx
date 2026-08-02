"use client";

import { useEffect, useState } from "react";
import AdminLayoutWrapper from "../components/AdminLayoutWrapper";

interface Student {
  id: number;
  rollNo: string | null;
  name: string;
  email: string;
  class: string;
  password: string | null;
}

export default function StudentPage() {
  const [showModal, setShowModal] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [password, setPassword] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    try {
      const response = await fetch("/api/students");
      const data = await response.json();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteStudent(id: number) {
    if (!confirm("Are you sure you want to delete this student record?")) return;

    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await loadStudents();
    } else {
      alert("Error deleting student");
    }
  }

  const query = search.toLowerCase();
  const filteredStudents = students.filter((student) => {
    return (
      student.rollNo?.toLowerCase().includes(query) ||
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.class?.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6">
        {/* Header & Add Button */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto">
            <h2 className="text-xl font-bold font-heading text-white">
              👨‍🎓 Student Management
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Total Enrolled Students:{" "}
              <span className="text-indigo-400 font-bold">{students.length}</span>
            </p>
          </div>

          <div className="w-full md:w-auto flex items-center gap-3">
            <input
              type="text"
              placeholder="🔍 Search Student..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm w-full md:w-72 outline-none focus:border-indigo-600 font-medium"
            />
            <button
              onClick={() => {
                setEditingId(null);
                setRollNo("");
                setName("");
                setEmail("");
                setStudentClass("");
                setPassword("");
                setShowModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 whitespace-nowrap transition"
            >
              + Add Student
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Roll No.</th>
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Class</th>
                  <th className="p-4">Email</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 text-slate-500 font-mono">#{student.id}</td>
                      <td className="p-4 font-semibold text-slate-200">
                        {student.rollNo || "-"}
                      </td>
                      <td className="p-4 font-bold text-white">{student.name}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
                          {student.class}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{student.email}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(student.id);
                            setRollNo(student.rollNo || "");
                            setName(student.name);
                            setEmail(student.email);
                            setStudentClass(student.class);
                            setPassword("");
                            setShowModal(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-500/20 text-xs font-bold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteStudent(student.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 text-xs font-bold transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center p-8 text-slate-500">
                      No Students Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="glass-card rounded-3xl border border-slate-700 w-full max-w-md p-8 shadow-2xl animate-float">
              <h2 className="text-2xl font-extrabold font-heading text-white mb-6">
                {editingId !== null ? "✏️ Edit Student Profile" : "➕ Add New Student"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 101"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="student@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Class & Section
                  </label>
                  <input
                    type="text"
                    placeholder="Class 10A"
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    if (!name || !email || !studentClass || (!editingId && !password)) {
                      alert("Please fill in required fields.");
                      return;
                    }

                    const url = editingId !== null ? `/api/students/${editingId}` : "/api/students";
                    const method = editingId !== null ? "PUT" : "POST";

                    const res = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        rollNo,
                        name,
                        email,
                        class: studentClass,
                        password,
                      }),
                    });

                    if (res.ok) {
                      await loadStudents();
                      setShowModal(false);
                    } else {
                      alert("Operation failed");
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition"
                >
                  {editingId !== null ? "Save Changes" : "Create Student"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}