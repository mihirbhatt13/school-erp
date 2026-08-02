"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Fee {
  id: number;
  student: string;
  className: string;
  totalFees: number;
  paidAmount: number;
  pendingFees: number;
  paymentDate: string;
  status: string;
}

export default function StudentFeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFees();
  }, []);

  async function loadFees() {
    try {
      const profileResponse = await fetch("/api/student-profile");
      if (!profileResponse.ok) {
        setLoading(false);
        return;
      }

      const student = await profileResponse.json();
      const feeResponse = await fetch("/api/fees");
      const feeData = await feeResponse.json();

      const myFees = feeData.filter(
        (item: Fee) => item.student === student.name
      );

      setFees(myFees);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mesh-dark flex items-center justify-center text-slate-300 font-bold text-lg">
        Loading Fee Records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-dark text-slate-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Bar with Back Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card rounded-3xl p-6 border border-emerald-500/30">
          <div className="flex items-center gap-3">
            <Link
              href="/student-dashboard"
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 font-bold text-xs transition"
            >
              ← Back to Student Dashboard
            </Link>
            <h1 className="text-2xl font-bold font-heading text-white">
              My Fee Ledger & Receipts
            </h1>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Records: {fees.length}
          </span>
        </div>

        {/* Fee Table */}
        {fees.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 text-slate-400 font-semibold text-sm">
            No Fee Records Found.
          </div>
        ) : (
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Student</th>
                    <th className="p-4">Class</th>
                    <th className="p-4">Total Fees</th>
                    <th className="p-4">Paid</th>
                    <th className="p-4">Pending</th>
                    <th className="p-4">Payment Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-900/40 transition">
                      <td className="p-4 font-bold text-white">{fee.student}</td>
                      <td className="p-4 text-xs text-slate-400">{fee.className}</td>
                      <td className="p-4 font-semibold text-white">₹ {fee.totalFees}</td>
                      <td className="p-4 font-bold text-emerald-400">₹ {fee.paidAmount}</td>
                      <td className="p-4 font-bold text-rose-400">₹ {fee.pendingFees}</td>
                      <td className="p-4 text-xs text-slate-400">{fee.paymentDate}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            fee.status === "Paid"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}