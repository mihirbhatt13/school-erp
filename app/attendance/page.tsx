"use client";

import { useEffect, useState } from "react";

interface Attendance {
  id: number;
  student: string;
  className: string;
  date: string;
  status: string;
}

export default function AttendancePage() {
  const [showModal, setShowModal] = useState(false);

  const [student, setStudent] = useState("");
  const [className, setClassName] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadAttendance();
  }, []);

  async function loadAttendance() {
    const response = await fetch("/api/attendance");
    const data = await response.json();
    setAttendance(data);
  }

  async function deleteAttendance(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this attendance?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/attendance/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Attendance Deleted Successfully");
      await loadAttendance();
    } else {
      alert("Error deleting attendance");
    }
  }

  const query = search.trim().toLowerCase();

  const filteredAttendance = attendance.filter((item) => {
    const matchesSearch =
      item.student?.toLowerCase().includes(query) ||
      item.className?.toLowerCase().includes(query) ||
      item.date?.toLowerCase().includes(query);

    const matchesStatus =
      filterStatus === "All" || item.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        📅 Attendance Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex flex-col md:flex-row items-center gap-4 mb-6">

          <input
            type="text"
            placeholder="🔍 Search Student, Class or Date..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:flex-1 border border-gray-300 rounded-lg p-3 text-black"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-auto border border-gray-300 rounded-lg p-3 text-black whitespace-nowrap"
          >
            <option value="All">All</option>
            <option value="Present">Present</option>
            <option value="Absent">Absent</option>
          </select>

        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setStudent("");
            setClassName("");
            setDate("");
            setStatus("");
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg whitespace-nowrap shadow mb-6"
        >

          + Mark Attendance
        </button>

        <div className="grid grid-cols-1 gap-4 mb-6">
  <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
    <p className="text-lg">Total Attendance</p>

    <h2 className="text-4xl font-bold">
      {attendance.length}
    </h2>
  </div>
</div>

<div className="overflow-x-auto rounded-xl">

        <table className="min-w-full border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Student</th>
              <th className="p-3">Class</th>
              <th className="p-3">Date</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white text-black">
            {filteredAttendance.length > 0 ? (
              filteredAttendance.map((item) => (
                <tr
  key={item.id}
  className="text-center border-b hover:bg-gray-100 transition"
>

                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.student}</td>
                  <td className="p-3">{item.className}</td>
                  <td className="p-3">{item.date}</td>
                  <td className="p-3">{item.status}</td>

                  <td className="p-3">

                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setStudent(item.student);
                        setClassName(item.className);
                        setDate(item.date);
                        setStatus(item.status);
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteAttendance(item.id)}
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
                  colSpan={6}
                  className="text-center p-8 text-red-500 font-semibold"
                >
                  No Attendance Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        </div>

      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">

            <h2 className="text-2xl font-bold text-blue-700 mb-5">
              {editingId !== null ? "Edit Attendance" : "Mark Attendance"}
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
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              >
                <option value="">Select Status</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setStudent("");
                  setClassName("");
                  setDate("");
                  setStatus("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!student || !className || !date || !status) {
                    alert("Please fill all fields.");
                    return;
                  }

                  let response;

                  if (editingId !== null) {
                    response = await fetch(`/api/attendance/${editingId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        student,
                        className,
                        date,
                        status,
                      }),
                    });
                  } else {
                    response = await fetch("/api/attendance", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        student,
                        className,
                        date,
                        status,
                      }),
                    });
                  }

                  if (response.ok) {
                    alert(
                      editingId !== null
                        ? "Attendance Updated Successfully"
                        : "Attendance Added Successfully"
                    );

                    setStudent("");
                    setClassName("");
                    setDate("");
                    setStatus("");
                    setEditingId(null);

                    await loadAttendance();

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