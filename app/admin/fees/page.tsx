"use client";

import { useEffect, useState } from "react";

interface FeeItem {
  id: number;
  student: string;
  className: string;
  totalFees: number;
  paidAmount: number;
  pendingFees: number;
  paymentDate: string;
  status: string;
}

export default function AdminFeesPage() {
  const [fees, setFees] = useState<FeeItem[]>([]);
  const [filteredFees, setFilteredFees] = useState<FeeItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [student, setStudent] = useState("");
  const [className, setClassName] = useState("Grade 10-A");
  const [totalFees, setTotalFees] = useState(50000);
  const [paidAmount, setPaidAmount] = useState(30000);
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [status, setStatus] = useState("Partial");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFees();
  }, []);

  async function fetchFees() {
    try {
      const res = await fetch("/api/fees");
      const data = await res.json();
      const list: FeeItem[] = Array.isArray(data) ? data : [];
      setFees(list);
      setFilteredFees(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(query: string) {
    setSearch(query);
    const q = query.trim().toLowerCase();
    if (!q) {
      setFilteredFees(fees);
      return;
    }
    const matched = fees.filter(
      (f) =>
        f.student?.toLowerCase().includes(q) ||
        f.className?.toLowerCase().includes(q) ||
        f.status?.toLowerCase().includes(q)
    );
    setFilteredFees(matched);
  }

  function openAddModal() {
    setEditingId(null);
    setStudent("");
    setClassName("Grade 10-A");
    setTotalFees(50000);
    setPaidAmount(50000);
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setStatus("Paid");
    setShowModal(true);
  }

  function openEditModal(fee: FeeItem) {
    setEditingId(fee.id);
    setStudent(fee.student);
    setClassName(fee.className);
    setTotalFees(fee.totalFees);
    setPaidAmount(fee.paidAmount);
    setPaymentDate(fee.paymentDate || new Date().toISOString().split("T")[0]);
    setStatus(fee.status);
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!student || !className) return;
    setSubmitting(true);

    try {
      const pendingFees = Math.max(0, totalFees - paidAmount);
      const computedStatus = pendingFees === 0 ? "Paid" : paidAmount > 0 ? "Partial" : "Pending";

      const payload = {
        student,
        className,
        totalFees: Number(totalFees),
        paidAmount: Number(paidAmount),
        pendingFees,
        paymentDate,
        status: computedStatus,
      };

      let res;
      if (editingId) {
        res = await fetch(`/api/fees/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/fees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (res.ok) {
        setShowModal(false);
        fetchFees();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this fee ledger record?")) return;
    try {
      const res = await fetch(`/api/fees/${id}`, { method: "DELETE" });
      if (res.ok) fetchFees();
    } catch (err) {
      console.error(err);
    }
  }

  const totalCollected = fees.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
  const totalPending = fees.reduce((acc, curr) => acc + (curr.pendingFees || 0), 0);

  return (
    <div className="space-y-6">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Fee Collected</p>
            <h3 className="text-3xl font-extrabold text-emerald-600 mt-1">₹{totalCollected.toLocaleString("en-IN")}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xl font-bold">
            💰
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Pending Dues</p>
            <h3 className="text-3xl font-extrabold text-rose-600 mt-1">₹{totalPending.toLocaleString("en-IN")}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center text-xl font-bold">
            ⚠️
          </div>
        </div>
      </div>

      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <span className="absolute left-3.5 top-2.5 text-slate-400">🔍</span>
          <input
            type="text"
            placeholder="Search fee records by student, class, or payment status..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:bg-white focus:border-indigo-600 font-medium transition"
          />
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition"
        >
          <span>➕</span>
          <span>Log Fee Receipt</span>
        </button>
      </div>

      {/* Fees Ledger Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700">
            <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Class</th>
                <th className="p-4">Total Fee</th>
                <th className="p-4">Paid</th>
                <th className="p-4">Pending</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs font-medium">
                    Loading fee ledger records...
                  </td>
                </tr>
              ) : filteredFees.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 text-xs font-medium">
                    No fee records found.
                  </td>
                </tr>
              ) : (
                filteredFees.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-bold text-slate-900">{f.student}</td>
                    <td className="p-4 text-xs font-bold text-slate-700">{f.className}</td>
                    <td className="p-4 text-xs font-bold text-slate-900">₹{f.totalFees?.toLocaleString("en-IN")}</td>
                    <td className="p-4 text-xs font-bold text-emerald-600">₹{f.paidAmount?.toLocaleString("en-IN")}</td>
                    <td className="p-4 text-xs font-bold text-rose-600">₹{f.pendingFees?.toLocaleString("en-IN")}</td>
                    <td className="p-4 text-xs font-medium text-slate-600">{f.paymentDate}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          f.status?.toLowerCase() === "paid"
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : f.status?.toLowerCase() === "partial"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                      >
                        {f.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(f)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(f.id)}
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

      {/* Fee Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold font-heading text-slate-900">
                {editingId ? "Edit Fee Entry" : "Log Fee Payment"}
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
                  <label className="block font-bold text-slate-700 mb-1">Student Name *</label>
                  <input
                    type="text"
                    required
                    value={student}
                    onChange={(e) => setStudent(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Class</label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Fee Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={totalFees}
                    onChange={(e) => setTotalFees(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Paid Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={paidAmount}
                    onChange={(e) => setPaidAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Date</label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-600"
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
                  {submitting ? "Saving..." : editingId ? "Update Fee Entry" : "Save Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
