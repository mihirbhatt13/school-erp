"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Notice {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function StudentNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh-dark flex items-center justify-center text-slate-300 font-bold text-lg">
        Loading Notice Board...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-dark text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-6 border border-rose-500/30">
          <div className="flex items-center gap-3">
            <Link
              href="/student-dashboard"
              className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-slate-950 border border-rose-500/30 font-bold text-xs transition"
            >
              ← Back to Student Dashboard
            </Link>
            <h1 className="text-2xl font-bold font-heading text-white">
              Official Notice Board
            </h1>
          </div>

          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold uppercase tracking-wider">
            Notices: {notices.length}
          </span>
        </div>

        {/* Notices Grid */}
        {notices.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 text-slate-400 font-semibold text-sm">
            No Active Notices Published.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 space-y-3 hover:border-rose-500/40 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold font-heading text-white">{notice.title}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap">
                    {new Date(notice.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{notice.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}