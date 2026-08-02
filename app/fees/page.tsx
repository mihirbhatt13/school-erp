"use client";

import { useEffect, useState } from "react";

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

export default function FeesPage() {
  const [showModal, setShowModal] = useState(false);

  const [student, setStudent] = useState("");
  const [className, setClassName] = useState("");
  const [totalFees, setTotalFees] = useState<number | "">("");
  const [paidAmount, setPaidAmount] = useState<number | "">("");
  const [pendingFees, setPendingFees] = useState(0);
  const [paymentDate, setPaymentDate] = useState("");
  

  const [fees, setFees] = useState<Fee[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadFees();
  }, []);

  async function loadFees() {
    const response = await fetch("/api/fees");
    const data = await response.json();
    setFees(data);
  }

  async function deleteFee(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this fee record?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/fees/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Fee Deleted Successfully");
      await loadFees();
    } else {
      alert("Error deleting fee");
    }
  }

  const query = search.trim().toLowerCase();

  const filteredFees = fees.filter((fee) => {
    const matchesSearch =
      fee.student?.toLowerCase().includes(query) ||
      fee.className?.toLowerCase().includes(query);

    const matchesStatus =
      filterStatus === "All" || fee.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        💰 Fees Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">

          <input
            type="text"
            placeholder="🔍 Search Student or Class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:flex-1 border border-gray-300 rounded-lg p-3 text-black"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-auto border border-gray-300 rounded-lg p-3 text-black whitespace-nowrap"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>

        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setStudent("");
            setClassName("");
            setTotalFees(0);
            setPaidAmount(0);
            setPendingFees(0);
            setPaymentDate("");
            
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg whitespace-nowrap shadow mb-6"
        >
          + Add Fee
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
    <p className="text-lg">Total Records</p>

    <h2 className="text-4xl font-bold">
      {fees.length}
    </h2>
  </div>

  <div className="bg-green-600 text-white rounded-xl p-5 shadow">
    <p className="text-lg">Paid Fees</p>

    <h2 className="text-4xl font-bold">
      {
        fees.filter(f => f.status === "Paid").length
      }
    </h2>
  </div>

  <div className="bg-red-600 text-white rounded-xl p-5 shadow">
    <p className="text-lg">Pending Fees</p>

    <h2 className="text-4xl font-bold">
      {
        fees.filter(f => f.status === "Pending").length
      }
    </h2>
  </div>

</div>

        <div className="overflow-x-auto rounded-xl mt-2">

          <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden">

            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Student</th>
                <th className="p-3">Class</th>
                <th className="p-3">Total</th>
                <th className="p-3">Paid</th>
                <th className="p-3">Pending</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white text-black">

            {filteredFees.length > 0 ? (
              filteredFees.map((fee) => (
                <tr
  key={fee.id}
  className="text-center border-b hover:bg-gray-100 transition"
>

                  <td className="p-3">{fee.id}</td>

                  <td className="p-3">{fee.student}</td>

                  <td className="p-3">{fee.className}</td>

                  <td className="p-3 font-semibold">
                    ₹ {fee.totalFees.toLocaleString()}
                  </td>

                  <td className="p-3 text-green-600 font-semibold">
                    ₹ {fee.paidAmount.toLocaleString()}
                  </td>

                  <td className="p-3 text-red-600 font-semibold">
                    ₹ {fee.pendingFees.toLocaleString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        fee.status === "Paid"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    >
                      {fee.status}
                    </span>
                  </td>

                  <td className="p-3">

                    <button
                      onClick={() => {
                        setEditingId(fee.id);
                        setStudent(fee.student);
                        setClassName(fee.className);
                        setTotalFees(fee.totalFees);
                        setPaidAmount(fee.paidAmount);
                        setPendingFees(fee.pendingFees);
                        setPaymentDate(fee.paymentDate);
                        
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteFee(fee.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center p-8 text-red-500 font-semibold"
                >
                  No Fees Found
                </td>
              </tr>
            )}
          </tbody>

        </table>

      </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[450px] p-6">

            <h2 className="text-2xl font-bold text-blue-700 mb-5">
              {editingId !== null ? "Edit Fee" : "Add Fee"}
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Student Name"
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="text"
                placeholder="Class Name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="number"
                min={0}
                placeholder="Enter Total Fees"
                value={totalFees}
                onChange={(e) => {
                  const total =
                    e.target.value === "" ? "" : Number(e.target.value);

                  const paid = paidAmount === "" ? 0 : paidAmount;

                  if (total !== "" && paid > total) {
                    alert("Total Fees cannot be less than Paid Amount");
                    return;
                  }

                  setTotalFees(total);
                  setPendingFees(total === "" ? 0 : total - paid);
                }}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="number"
                min={0}
                placeholder="Enter Paid Amount"
                value={paidAmount}
                onChange={(e) => {
  const paid =
    e.target.value === "" ? "" : Number(e.target.value);

  const total = totalFees === "" ? 0 : totalFees;

  if (paid !== "" && paid > total) {
    alert("Paid Amount cannot be greater than Total Fees");
    return;
  }

  setPaidAmount(paid);
  setPendingFees(total - (paid === "" ? 0 : paid));
}}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="number"
                placeholder="Pending Fees"
                value={pendingFees}
                readOnly
                className="w-full border border-gray-300 rounded-lg p-3 bg-gray-100 text-black"
              />

              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="text"
                value={pendingFees === 0 ? "Paid" : "Pending"}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 rounded-lg p-3 text-black cursor-not-allowed"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setStudent("");
                  setClassName("");
                  setTotalFees("");
                  setPaidAmount("");
                  setPendingFees(0);
                  setPaymentDate("");
                  
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (
                    !student ||
                    !className ||
                    totalFees === "" ||
                    paidAmount === "" ||
                    !paymentDate
                  ) {
                    alert("Please fill all fields.");
                    return;
                  }

                  const finalPending = totalFees - paidAmount;

                  const finalStatus =
                    finalPending === 0 ? "Paid" : "Pending";

                  let response;

                  if (editingId !== null) {
                    response = await fetch(`/api/fees/${editingId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        student,
                        className,
                        totalFees,
                        paidAmount,
                        pendingFees: finalPending,
                        paymentDate,
                        status: finalStatus,
                      }),
                    });
                  } else {
                    response = await fetch("/api/fees", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        student,
                        className,
                        totalFees,
                        paidAmount,
                        pendingFees: finalPending,
                        paymentDate,
                        status: finalStatus,
                      }),
                    });
                  }

                  if (response.ok) {
                    alert(
                      editingId !== null
                        ? "Fee Updated Successfully"
                        : "Fee Added Successfully"
                    );

                    setStudent("");
                    setClassName("");
                    setTotalFees("");
                    setPaidAmount("");
                    setPendingFees(0);
                    setPaymentDate("");
                    
                    setEditingId(null);

                    await loadFees();

                    setShowModal(false);
                  } else {
                    alert("Something went wrong!");
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
              >
                {editingId !== null ? "Update" : "Save"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}