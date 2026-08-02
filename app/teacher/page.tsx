"use client";

import { useEffect, useState } from "react";
import AdminLayoutWrapper from "../components/AdminLayoutWrapper";

interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  assignedClass: string;
  password: string | null;
}

export default function TeacherPage() {
  const [showModal, setShowModal] = useState(false);
  const [teacherId, setTeacherId] = useState("");
  const [phone, setPhone] = useState("");
  const [assignedClass, setAssignedClass] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [password, setPassword] = useState("");

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    try {
      const response = await fetch("/api/teachers");
      const data = await response.json();
      setTeachers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteTeacher(id: number) {
    if (!confirm("Are you sure you want to delete this faculty record?")) return;

    const response = await fetch(`/api/teachers/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      await loadTeachers();
    } else {
      alert("Error deleting teacher");
    }
  }

  const query = search.trim().toLowerCase();
  const filteredTeachers = teachers.filter((teacher) => {
    return (
      teacher.name?.toLowerCase().includes(query) ||
      teacher.email?.toLowerCase().includes(query) ||
      teacher.subject?.toLowerCase().includes(query)
    );
  });

  return (
    <AdminLayoutWrapper>
      <div className="space-y-6">
        {/* Header & Add Button */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-full md:w-auto">
            <h2 className="text-xl font-bold font-heading text-white">
              👨‍🏫 Faculty Directory
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Total Faculty Members:{" "}
              <span className="text-purple-400 font-bold">{teachers.length}</span>
            </p>
          </div>

          <div className="w-full md:w-auto flex items-center gap-3">
            <input
              type="text"
              placeholder="🔍 Search Faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm w-full md:w-72 outline-none focus:border-indigo-600 font-medium"
            />
            <button
              onClick={() => {
                setEditingId(null);
                setName("");
                setEmail("");
                setSubject("");
                setPassword("");
                setTeacherId("");
                setPhone("");
                setAssignedClass("");
                setShowModal(true);
              }}
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 whitespace-nowrap transition"
            >
              + Add Faculty Member
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[11px] font-bold tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Teacher ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Assigned Class</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTeachers.length > 0 ? (
                  filteredTeachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-4 text-purple-400 font-mono font-bold">
                        {teacher.teacherId}
                      </td>
                      <td className="p-4 font-bold text-white">
                        {teacher.name}
                        <span className="block text-xs font-normal text-slate-400">
                          {teacher.email}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-semibold">
                          {teacher.subject}
                        </span>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">
                        {teacher.assignedClass}
                      </td>
                      <td className="p-4 text-slate-400">{teacher.phone || "N/A"}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingId(teacher.id);
                            setTeacherId(teacher.teacherId);
                            setName(teacher.name);
                            setEmail(teacher.email);
                            setPhone(teacher.phone);
                            setSubject(teacher.subject);
                            setAssignedClass(teacher.assignedClass);
                            setPassword("");
                            setShowModal(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-white border border-amber-500/20 text-xs font-bold transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTeacher(teacher.id)}
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
                      No Faculty Members Found
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
                {editingId !== null ? "✏️ Edit Faculty Details" : "➕ Add Faculty Member"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Teacher ID
                  </label>
                  <input
                    type="text"
                    placeholder="T-101"
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Dr. Sarah Connor"
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
                    placeholder="teacher@school.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 555-0192"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Subject Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="Mathematics"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full glass-input rounded-xl px-4 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                    Assigned Class
                  </label>
                  <input
                    type="text"
                    placeholder="Class 10A"
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(e.target.value)}
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
                    if (!teacherId || !name || !email || !subject || !assignedClass) {
                      alert("Please fill in all required fields.");
                      return;
                    }

                    const url = editingId !== null ? `/api/teachers/${editingId}` : "/api/teachers";
                    const method = editingId !== null ? "PUT" : "POST";

                    const res = await fetch(url, {
                      method,
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        teacherId,
                        name,
                        email,
                        phone,
                        subject,
                        assignedClass,
                        password,
                      }),
                    });

                    if (res.ok) {
                      await loadTeachers();
                      setShowModal(false);
                    } else {
                      alert("Operation failed");
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition"
                >
                  {editingId !== null ? "Save Changes" : "Create Faculty Record"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayoutWrapper>
  );
}


