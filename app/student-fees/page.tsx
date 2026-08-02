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

      const myFees = Array.isArray(feeData)
        ? feeData.filter((item: Fee) => item.student === student.name)
        : [];

      setFees(myFees);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-700 font-bold text-sm">
        Loading Fee Records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-3xl p-6 border border-slate-200 shadow-xl">
          <div className="flex items-center gap-3">
            <Link
              href="/student-dashboard"
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
            >
              ← Back
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold font-heading text-slate-900">
                Fee Ledger & Receipts
              </h1>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                Personal fee payment statements and pending balance details
              </p>
            </div>
          </div>

          <span className="px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
            Total Records: {fees.length}
          </span>
        </div>

        {/* Fee Table */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-bold border-b border-slate-200">
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
              <tbody className="divide-y divide-slate-100">
                {fees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 text-xs font-medium">
                      No fee payment receipts recorded yet.
                    </td>
                  </tr>
                ) : (
                  fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-slate-50 transition">
                      <td className="p-4 font-bold text-slate-900">{fee.student}</td>
                      <td className="p-4 text-xs font-bold text-slate-700">{fee.className}</td>
                      <td className="p-4 text-xs font-bold text-slate-900">₹{fee.totalFees?.toLocaleString("en-IN")}</td>
                      <td className="p-4 text-xs font-bold text-emerald-600">₹{fee.paidAmount?.toLocaleString("en-IN")}</td>
                      <td className="p-4 text-xs font-bold text-rose-600">₹{fee.pendingFees?.toLocaleString("en-IN")}</td>
                      <td className="p-4 text-xs font-medium text-slate-600">{fee.paymentDate}</td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            fee.status?.toLowerCase() === "paid"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : fee.status?.toLowerCase() === "partial"
                              ? "bg-amber-100 text-amber-800 border border-amber-200"
                              : "bg-rose-100 text-rose-800 border border-rose-200"
                          }`}
                        >
                          {fee.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}