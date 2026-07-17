"use client";

import { useEffect, useState } from "react";

interface SchoolClass {
  id: number;
  className: string;
  section: string;
}

export default function ClassesPage() {
  const [showModal, setShowModal] = useState(false);

  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    loadClasses();
  }, []);

  async function loadClasses() {
    const response = await fetch("/api/classes");
    const data = await response.json();

    setClasses(data);
  }

  async function deleteClass(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this class?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/classes/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Class Deleted Successfully");
      await loadClasses();
    } else {
      alert("Error deleting class");
    }
  }

  const query = search.trim().toLowerCase();

  const filteredClasses = classes.filter((item) => {
    return (
      item.className?.toLowerCase().includes(query) ||
      item.section?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        📚 Class Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="🔍 Search by Class Name or Section..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-black"
          />
        

        <button
          onClick={() => {
            setEditingId(null);
            setClassName("");
            setSection("");
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg whitespace-nowrap shadow"
        >
          ➕ Add Class
        </button>

        </div>

        <div className="grid grid-cols-1 gap-4 mb-6">

  <div className="bg-blue-600 text-white rounded-xl p-5 shadow">

    <p className="text-lg">
      Total Classes
    </p>

    <h2 className="text-4xl font-bold">
      {classes.length}
    </h2>

  </div>

</div>

        <div className="overflow-x-auto rounded-xl">

<table className="min-w-full border border-gray-300">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Class Name</th>
              <th className="p-3">Section</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody className="bg-white text-black">
            {filteredClasses.length > 0 ? (
              filteredClasses.map((item) => (
                <tr
  key={item.id}
  className="text-center border-b hover:bg-gray-100 transition"
>

                  <td className="p-3">{item.id}</td>
                  <td className="p-3">{item.className}</td>
                  <td className="p-3">{item.section}</td>

                  <td className="p-3">

                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setClassName(item.className);
                        setSection(item.section);
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteClass(item.id)}
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
                  colSpan={4}
                  className="text-center p-8 text-red-500 font-semibold"
                >
                  No Classes Found
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
              {editingId !== null ? "Edit Class" : "Add Class"}
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Class Name"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full md:flex-1 border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="text"
                placeholder="Section"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full md:flex-1 border border-gray-300 rounded-lg p-3 text-black"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setClassName("");
                  setSection("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!className || !section) {
                    alert("Please fill all fields.");
                    return;
                  }

                  let response;

                  if (editingId !== null) {
                    response = await fetch(`/api/classes/${editingId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        className,
                        section,
                      }),
                    });
                  } else {
                    response = await fetch("/api/classes", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        className,
                        section,
                      }),
                    });
                  }

                  if (response.ok) {
                    alert(
                      editingId !== null
                        ? "Class Updated Successfully"
                        : "Class Added Successfully"
                    );

                    setClassName("");
                    setSection("");
                    setEditingId(null);

                    await loadClasses();

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