"use client";

import { useEffect, useState } from "react";

interface Teacher {
  id: number;
  name: string;
  email: string;
  subject: string;
}

export default function TeacherPage() {
  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadTeachers();
  }, []);

  async function loadTeachers() {
    const response = await fetch("/api/teachers");
    const data = await response.json();

    setTeachers(data);
  }

  async function deleteTeacher(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/teachers/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Teacher Deleted Successfully");
      await loadTeachers();
    } else {
      alert("Error deleting teacher");
    }
  }

  const query = search.trim().toLowerCase();

  const filteredTeachers = teachers.filter((teacher) => {
    return (
      teacher.name?.toLowerCase().includes(query) ||
      teacher.email?.toLowerCase().includes(query) ||
      teacher.subject?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        👨‍🏫 Teacher Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">

  <input
    type="text"
    placeholder="🔍 Search by Name, Email or Subject..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full md:flex-1 border border-gray-300 rounded-lg p-3 text-black"
  />

  <button
    onClick={() => {
      setEditingId(null);
      setName("");
      setEmail("");
      setSubject("");
      setShowModal(true);
    }}
    className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg whitespace-nowrap shadow"
  >
    ➕ Add Teacher
  </button>

</div>

<div className="grid grid-cols-1 gap-4 mb-6">

  <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
    <p className="text-lg">Total Teachers</p>

    <h2 className="text-4xl font-bold">
      {teachers.length}
    </h2>
  </div>

</div>

        <div className="overflow-x-auto rounded-xl">

<table className="min-w-full border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Subject</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white text-black">
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <tr
  key={teacher.id}
  className="text-center border-b hover:bg-gray-100 transition"
>

                  <td className="p-3">{teacher.id}</td>
                  <td className="p-3">{teacher.name}</td>
                  <td className="p-3">{teacher.subject}</td>
                  <td className="p-3">{teacher.email}</td>

                  <td className="p-3">

                    <button
                      onClick={() => {
                        setEditingId(teacher.id);
                        setName(teacher.name);
                        setEmail(teacher.email);
                        setSubject(teacher.subject);
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTeacher(teacher.id)}
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
                  No Teachers Found
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
              {editingId !== null ? "Edit Teacher" : "Add Teacher"}
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Teacher Name"
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
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
                  setSubject("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!name || !email || !subject) {
                    alert("Please fill all fields.");
                    return;
                  }

                  let response;

                  if (editingId !== null) {
                    response = await fetch(`/api/teachers/${editingId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name,
                        email,
                        subject,
                      }),
                    });
                  } else {
                    response = await fetch("/api/teachers", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name,
                        email,
                        subject,
                      }),
                    });
                  }

                  if (response.ok) {
                    alert(
                      editingId !== null
                        ? "Teacher Updated Successfully"
                        : "Teacher Added Successfully"
                    );

                    setName("");
                    setEmail("");
                    setSubject("");
                    setEditingId(null);

                    await loadTeachers();

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


