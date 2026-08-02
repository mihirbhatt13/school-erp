"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Notice {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function TeacherNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {
    try {
      const response = await fetch("/api/notices");
      const data = await response.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredNotices = notices.filter(
    (notice) =>
      notice.title.toLowerCase().includes(search.toLowerCase()) ||
      notice.description.toLowerCase().includes(search.toLowerCase())
  );

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
                School Notices
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                Official announcements and updates
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
            Active Notices: {notices.length}
          </span>
        </div>

        {/* Search Bar - Crisp visible dark text while writing! */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-md flex items-center gap-3">
          <span className="text-slate-400 font-bold">🔍</span>
          <input
            type="text"
            placeholder="Type notice title or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none transition"
          />
        </div>

        {/* Notices Grid */}
        {loading ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs font-medium">
            Loading notices...
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-xs font-medium">
            No notices found matching search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl space-y-3 hover:border-indigo-500 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold font-heading text-slate-900">{notice.title}</h2>
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 whitespace-nowrap">
                    {notice.date}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{notice.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}