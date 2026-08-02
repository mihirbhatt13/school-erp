"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Student {
  id: number;
  rollNo?: string;
  name: string;
  email: string;
  class: string;
  phone?: string;
  address?: string;
  profileImage?: string;
}

export default function StudentDashboard() {
  const [student, setStudent] = useState<Student | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: "",
    profileImage: "",
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchStudent();
  }, []);

  async function fetchStudent() {
    try {
      const response = await fetch("/api/student-profile");
      if (!response.ok) return;
      const data = await response.json();
      setStudent(data);
      setEditForm({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        profileImage: data.profileImage || "",
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogout() {
    await fetch("/api/student-logout", { method: "POST" });
    window.location.href = "/student-login";
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
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
        setSuccessMsg("Photo uploaded. Click Save Changes to complete.");
      } else {
        alert("Image upload failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/student-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (res.ok && data.student) {
        setStudent(data.student);
        setSuccessMsg("Profile updated successfully");
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMsg("");
        }, 1200);
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10 flex flex-col justify-center items-center">
      <div className="w-full max-w-4xl space-y-8">
        {/* Banner Card with Avatar */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-5">
            {/* Student Avatar */}
            <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 shadow-sm overflow-hidden flex-shrink-0">
              {student?.profileImage ? (
                <Image
                  src={student.profileImage}
                  alt={student.name}
                  width={80}
                  height={80}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl text-slate-400">
                  👤
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold font-heading text-slate-900">
                {student?.name || "Student"}
              </h1>

              <p className="text-slate-600 text-xs mt-1 font-medium">
                Class: <span className="text-slate-900 font-bold">{student?.class || "-"}</span>
                {student?.rollNo && ` • Roll No: ${student.rollNo}`}
                {student?.email && ` • ${student.email}`}
                {student?.phone && ` • ${student.phone}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Profile Editor Card */}
        {isEditing && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
            <div className="pb-4 border-b border-slate-200">
              <h3 className="text-xl font-bold font-heading text-slate-900">Edit Profile</h3>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
                {successMsg}
              </div>
            )}

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
                    Full Name
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

        {/* Portal Modules Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/student-attendance">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:border-indigo-500 group transition duration-300">
              <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-indigo-600">
                Attendance
              </h3>
              <p className="text-slate-500 text-xs mt-1">View attendance records.</p>
            </div>
          </Link>

          <Link href="/student-fees">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:border-indigo-500 group transition duration-300">
              <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-indigo-600">
                Fees
              </h3>
              <p className="text-slate-500 text-xs mt-1">View fee status and receipts.</p>
            </div>
          </Link>

          <Link href="/student-exams">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:border-indigo-500 group transition duration-300">
              <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-indigo-600">
                Exams
              </h3>
              <p className="text-slate-500 text-xs mt-1">View examination schedule.</p>
            </div>
          </Link>

          <Link href="/student-notices">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:border-indigo-500 group transition duration-300">
              <h3 className="text-xl font-bold font-heading text-slate-900 group-hover:text-indigo-600">
                Notices
              </h3>
              <p className="text-slate-500 text-xs mt-1">School announcements.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}