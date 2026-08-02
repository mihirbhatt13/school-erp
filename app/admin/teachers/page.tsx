"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { exportToCSV } from "@/lib/csvExport";
import { showToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { TableSkeletonRows } from "@/app/components/SkeletonLoader";

interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  assignedClass: string;
  address?: string;
  profileImage?: string;
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [teacherId, setTeacherId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Mathematics");
  const [assignedClass, setAssignedClass] = useState("Grade 10-A");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("teacher123");
  const [submitting, setSubmitting] = useState(false);

  // Delete Confirm State
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      const list: Teacher[] = Array.isArray(data) ? data : [];
      setTeachers(list);
      setFilteredTeachers(list);
    } catch (err) {
      console.error(err);
      showToast("Failed to load faculty directory.", "error");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query: string) {
    setSearch(query);
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredTeachers(teachers);
      return;
    }
    const matched = teachers.filter(
      (t) =>
        t.name?.toLowerCase().includes(q) ||
        t.email?.toLowerCase().includes(q) ||
        t.subject?.toLowerCase().includes(q) ||
        t.assignedClass?.toLowerCase().includes(q) ||
        t.teacherId?.toLowerCase().includes(q)
    );
    setFilteredTeachers(matched);
  }

  function handleExportCSV() {
    exportToCSV("faculty_directory", filteredTeachers, [
      { key: "id", label: "ID" },
      { key: "teacherId", label: "Teacher ID" },
      { key: "name", label: "Full Name" },
      { key: "subject", label: "Subject Specialization" },
      { key: "assignedClass", label: "Assigned Class" },
      { key: "email", label: "Email Address" },
      { key: "phone", label: "Phone Number" },
    ]);
    showToast("Faculty directory exported to CSV file.", "info");
  }

  function openAddModal() {
    setEditingId(null);
    setTeacherId(`TCH${Math.floor(1000 + Math.random() * 9000)}`);
    setName("");
    setEmail("");
    setSubject("Mathematics");
    setAssignedClass("Grade 10-A");
    setPhone("");
    setAddress("");
    setPassword("teacher123");
    setShowModal(true);
  }

  function openEditModal(teacher: Teacher) {
    setEditingId(teacher.id);
    setTeacherId(teacher.teacherId || "");
    setName(teacher.name || "");
    setEmail(teacher.email || "");
    setSubject(teacher.subject || "Mathematics");
    setAssignedClass(teacher.assignedClass || "Grade 10-A");
    setPhone(teacher.phone || "");
    setAddress(teacher.address || "");
    setPassword("");
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) return;
    setSubmitting(true);

    try {
      const payload = {
        teacherId,
        name,
        email,
        subject,
        assignedClass,
        phone,
        address,
        password: password || undefined,
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/teachers/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowModal(false);
        showToast(
          editingId ? `Updated faculty profile for ${name}` : `Added faculty member ${name}`,
          "success"
        );
        fetchTeachers();
      } else {
        showToast("Failed to save faculty record.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving faculty record.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      const res = await fetch(`/api/teachers/${deleteTargetId}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Faculty record removed.", "warning");
        fetchTeachers();
      } else {
        showToast("Failed to delete faculty member.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting faculty record.", "error");
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
            placeholder="Search faculty by name, ID, subject, class, or email..."
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
            <span>Add Faculty</span>
          </button>
        </div>
      </div>

      {/* Teachers Directory Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Faculty Member</th>
                <th className="p-4">Teacher ID</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Assigned Class</th>
                <th className="p-4">Contact Email</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <TableSkeletonRows rows={5} cols={6} />
              ) : filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="max-w-xs mx-auto space-y-3">
                      <span className="text-4xl block">👨‍🏫</span>
                      <strong className="text-slate-900 block font-bold">No Faculty Records</strong>
                      <p className="text-slate-500 text-xs font-medium">Try adjusting search or add a new faculty member.</p>
                      <button
                        onClick={openAddModal}
                        className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200"
                      >
                        + Add First Teacher
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center flex-shrink-0">
                          {t.profileImage ? (
                            <Image
                              src={t.profileImage}
                              alt={t.name}
                              width={40}
                              height={40}
                              unoptimized
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-slate-400 text-base">👨‍🏫</span>
                          )}
                        </div>
                        <div>
                          <strong className="text-slate-900 block font-bold">{t.name}</strong>
                          <span className="text-slate-400 text-[11px]">{t.phone || "No phone listed"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-900">{t.teacherId}</td>
                    <td className="p-4 text-xs font-bold text-indigo-700">{t.subject}</td>
                    <td className="p-4 text-xs">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-100">
                        {t.assignedClass}
                      </span>
                    </td>
                    <td className="p-4 text-xs font-medium text-slate-700">{t.email}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(t)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(t.id)}
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

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {editingId ? "Edit Faculty Member" : "Add Faculty Member"}
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
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Teacher ID Code</label>
                  <input
                    type="text"
                    required
                    value={teacherId}
                    onChange={(e) => setTeacherId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject Specialization</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Class</label>
                  <input
                    type="text"
                    required
                    value={assignedClass}
                    onChange={(e) => setAssignedClass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {editingId ? "Reset Password (Optional)" : "Password"}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={editingId ? "Leave empty to keep" : "Default: teacher123"}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600 font-medium"
                />
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
                  {submitting ? "Saving..." : editingId ? "Update Faculty" : "Create Faculty"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Remove Faculty Member"
        message="Are you sure you want to delete this faculty record? This action cannot be undone."
        confirmText="Yes, Delete Record"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
