"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  assignedClass: string;
  address?: string | null;
  profileImage?: string | null;
}

export default function TeacherProfile() {
  const router = useRouter();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    subject: "",
    assignedClass: "",
    address: "",
    profileImage: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/teacher-profile");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data: Teacher = await res.json();
      setTeacher(data);
      setEditForm({
        name: data.name || "",
        phone: data.phone || "",
        subject: data.subject || "",
        assignedClass: data.assignedClass || "",
        address: data.address || "",
        profileImage: data.profileImage || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const startEditing = () => {
    if (teacher) {
      setEditForm({
        name: teacher.name || "",
        phone: teacher.phone || "",
        subject: teacher.subject || "",
        assignedClass: teacher.assignedClass || "",
        address: teacher.address || "",
        profileImage: teacher.profileImage || "",
      });
    }
    setIsEditing(true);
    setMessage(null);
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setEditForm((prev) => ({ ...prev, profileImage: data.url }));
        setMessage({ text: "Photo uploaded. Click Save Changes to complete.", type: "success" });
      } else {
        setMessage({ text: "Photo upload failed.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Error uploading photo.", type: "error" });
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/teacher-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (res.ok && data.teacher) {
        setTeacher(data.teacher);
        setMessage({ text: "Profile updated successfully", type: "success" });
        setTimeout(() => {
          setIsEditing(false);
          setMessage(null);
        }, 1200);
      } else {
        setMessage({ text: data.message || "Failed to update profile.", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "Error saving profile changes.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 text-slate-700 text-sm font-semibold">
        Loading...
      </div>
    );
  }

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher-dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              ← Back
            </Link>
            <h1 className="text-2xl font-extrabold font-heading text-slate-900">
              Teacher Profile
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => (isEditing ? setIsEditing(false) : startEditing())}
              className="px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-md transition"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`p-3 rounded-xl border text-xs font-bold text-center ${
              message.type === "success"
                ? "bg-emerald-100 border-emerald-200 text-emerald-800"
                : "bg-rose-100 border-rose-200 text-rose-800"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Profile Details Card View */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200 text-center sm:text-left">
            <div className="relative w-24 h-24 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
              {teacher.profileImage ? (
                <Image
                  src={teacher.profileImage}
                  alt={teacher.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl text-slate-400">
                  👤
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h2 className="text-3xl font-extrabold font-heading text-slate-900">{teacher.name}</h2>
              <p className="text-slate-600 text-xs font-bold">
                Subject: {teacher.subject} • Assigned Class: {teacher.assignedClass}
              </p>
              <p className="text-slate-500 text-xs font-medium">Email: {teacher.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Teacher ID</span>
              <span className="text-slate-900 font-bold text-sm mt-1 block">{teacher.teacherId}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Phone Number</span>
              <span className="text-slate-900 font-bold text-sm mt-1 block">{teacher.phone || "-"}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Subject</span>
              <span className="text-slate-900 font-bold text-sm mt-1 block">{teacher.subject}</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Assigned Class</span>
              <span className="text-slate-900 font-bold text-sm mt-1 block">{teacher.assignedClass}</span>
            </div>

            <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Address</span>
              <span className="text-slate-900 font-bold text-sm mt-1 block">{teacher.address || "-"}</span>
            </div>
          </div>
        </div>

        {/* Profile Editor Form Card */}
        {isEditing && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-xl font-bold font-heading text-slate-900">Edit Profile</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6">
              {/* Profile Image Upload Box */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-300 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {editForm.profileImage ? (
                    <Image
                      src={editForm.profileImage}
                      alt="Preview"
                      width={80}
                      height={80}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-slate-400">👤</span>
                  )}
                </div>

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <label className="block text-xs font-bold text-slate-800">
                    Profile Photo
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-sm transition">
                      {uploading ? "Uploading..." : "Upload Photo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploading}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:border-indigo-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:border-indigo-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={editForm.subject}
                    onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:border-indigo-600 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Class *
                  </label>
                  <input
                    type="text"
                    value={editForm.assignedClass}
                    onChange={(e) => setEditForm({ ...editForm, assignedClass: e.target.value })}
                    required
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:border-indigo-600 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="Address"
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-4 py-2.5 text-xs font-medium focus:bg-white focus:border-indigo-600 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold transition shadow-md"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}