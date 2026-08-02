"use client";

import { useEffect, useState } from "react";
import { showToast } from "@/app/components/Toast";
import ConfirmModal from "@/app/components/ConfirmModal";
import { TableSkeletonRows } from "@/app/components/SkeletonLoader";

interface ContactInquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  category: string;
  message: string;
  createdAt: string;
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const fetchInquiries = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (Array.isArray(data)) {
        setInquiries(data);
      }
    } catch (error) {
      console.error(error);
      showToast("Error loading inquiries.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const confirmDelete = async () => {
    if (!deleteTargetId) return;

    try {
      const res = await fetch(`/api/contact/${deleteTargetId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setInquiries((prev) => prev.filter((item) => item.id !== deleteTargetId));
        showToast("Contact inquiry removed.", "warning");
      } else {
        showToast("Failed to delete inquiry.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Error deleting inquiry.", "error");
    } finally {
      setDeleteTargetId(null);
    }
  };

  const filteredInquiries = inquiries.filter(
    (item) =>
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.category || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.message || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-md">
        <div>
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            Public Submissions
          </span>
          <h2 className="text-2xl font-bold font-heading text-slate-900 mt-1">
            Contact Us Inquiries
          </h2>
          <p className="text-slate-500 text-xs mt-0.5 font-medium">
            Review and manage inquiry submissions from parents, students, and prospective faculty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
            Total Inquiries: {inquiries.length}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
        <span className="text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search inquiries by name, email, category, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none font-medium"
        />
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Sender</th>
                <th className="p-4">Category</th>
                <th className="p-4">Message</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <TableSkeletonRows rows={5} cols={5} />
              ) : filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 text-xs font-medium">
                    No contact inquiries found.
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((item) => {
                  const dateFormatted = item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently";

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                        {dateFormatted}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900">{item.name}</div>
                        <div className="text-xs text-indigo-700 font-semibold">{item.email}</div>
                        {item.phone && <div className="text-[11px] text-slate-500">📞 {item.phone}</div>}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 max-w-md">
                        <p className="text-xs text-slate-700 line-clamp-3 leading-relaxed font-medium">
                          {item.message}
                        </p>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setDeleteTargetId(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition"
                        >
                          Delete 🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Contact Inquiry"
        message="Are you sure you want to remove this inquiry submission? This action cannot be undone."
        confirmText="Yes, Delete Inquiry"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
}
