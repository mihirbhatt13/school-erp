"use client";

import { useEffect, useState } from "react";

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
}

export default function StudentPage() {
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [studentClass, setStudentClass] = useState("");

  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const response = await fetch("/api/students");
    const data = await response.json();
    setStudents(data);
  }

  async function deleteStudent(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/students/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Student Deleted Successfully");
      await loadStudents();
    } else {
      alert("Error deleting student");
    }
  }

  const query = search.toLowerCase();

  const filteredStudents = students.filter((student) => {
    return (
      student.name?.toLowerCase().includes(query) ||
      student.email?.toLowerCase().includes(query) ||
      student.class?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        👨‍🎓 Student Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

  <input
    type="text"
    placeholder="🔍 Search by Name, Email or Class..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:flex-1 border border-gray-300 rounded-lg p-3 text-black"
  />

  <button
    onClick={() => {
      setEditingId(null);
      setName("");
      setEmail("");
      setStudentClass("");
      setShowModal(true);
    }}
    className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg whitespace-nowrap shadow"
  >
    + Add Student
  </button>

</div>

<div className="grid grid-cols-1 gap-4 mb-6">

  <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
    <p className="text-lg">Total Students</p>

    <h2 className="text-4xl font-bold">
      {students.length}
    </h2>
  </div>

</div>
        <div className="overflow-x-auto rounded-xl">

        <table className="min-w-full border border-gray-300">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Class</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white text-black">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <tr
  key={student.id}
  className="text-center border-b hover:bg-gray-100 transition"
>
                  <td className="p-3">{student.id}</td>
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.class}</td>
                  <td className="p-3">{student.email}</td>

                  <td className="p-3">
                    <button
                      onClick={() => {
                        setEditingId(student.id);
                        setName(student.name);
                        setEmail(student.email);
                        setStudentClass(student.class);
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteStudent(student.id)}
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
                  colSpan={5}
                  className="text-center p-8 text-red-500 font-semibold"
                >
                  No Students Found
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
              {editingId !== null ? "Edit Student" : "Add Student"}
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="text"
                placeholder="Class"
                value={studentClass}
                onChange={(e) => setStudentClass(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setName("");
                  setEmail("");
                  setStudentClass("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!name || !email || !studentClass) {
                    alert("Please fill all fields.");
                    return;
                  }

                  let response;

                  if (editingId !== null) {
                    response = await fetch(`/api/students/${editingId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name,
                        email,
                        class: studentClass,
                      }),
                    });
                  } else {
                    response = await fetch("/api/students", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name,
                        email,
                        class: studentClass,
                      }),
                    });
                  }

                  if (response.ok) {
                    alert(
                      editingId !== null
                        ? "Student Updated Successfully"
                        : "Student Added Successfully"
                    );

                    setName("");
                    setEmail("");
                    setStudentClass("");
                    setEditingId(null);

                    await loadStudents();

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