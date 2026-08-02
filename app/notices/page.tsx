"use client";

import { useEffect, useState } from "react";

interface Notice {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function NoticePage() {

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const [notices, setNotices] = useState<Notice[]>([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  useEffect(() => {
    loadNotices();
  }, []);

  async function loadNotices() {
    const response = await fetch("/api/notices");
    const data = await response.json();

    setNotices(data);
  }

  async function deleteNotice(id: number) {

    const confirmDelete = confirm(
      "Are you sure you want to delete this notice?"
    );

    if (!confirmDelete) return;

    const response = await fetch(
      `/api/notices/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      alert("Notice Deleted Successfully");
      await loadNotices();
    } else {
      alert("Error deleting notice");
    }
  }

  const query = search.trim().toLowerCase();

  const filteredNotices = notices.filter((notice) => {

    return (
      notice.title
        ?.toLowerCase()
        .includes(query) ||

      notice.description
        ?.toLowerCase()
        .includes(query) ||

      notice.date
        ?.toLowerCase()
        .includes(query)
    );
  });

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        📢 Notice Board
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="mb-6">

          <input
            type="text"
            placeholder="🔍 Search Title, Description or Date..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full border border-gray-300 rounded-lg p-3 text-black"
          />

        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setTitle("");
            setDescription("");
            setDate("");
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-6 py-3 rounded-lg whitespace-nowrap shadow mb-6"
        >
          + Add Notice
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

  <div className="bg-blue-600 text-white rounded-xl p-5 shadow">
    <p className="text-lg">Total Notices</p>

    <h2 className="text-4xl font-bold">
      {notices.length}
    </h2>
  </div>

  <div className="bg-green-600 text-white rounded-xl p-5 shadow">
    <p className="text-lg">Today's Notices</p>

    <h2 className="text-4xl font-bold">
      {
        notices.filter(
          n => n.date === new Date().toISOString().split("T")[0]
        ).length
      }
    </h2>
  </div>

  <div className="bg-purple-600 text-white rounded-xl p-5 shadow">
    <p className="text-lg">Search Results</p>

    <h2 className="text-4xl font-bold">
      {filteredNotices.length}
    </h2>
  </div>

</div>

        <div className="overflow-x-auto rounded-xl">

          <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden">

            <thead className="bg-blue-600 text-white sticky top-0">

              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Description</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>

            </thead>

            <tbody className="bg-white text-black">

              {filteredNotices.length > 0 ? (

                filteredNotices.map((notice) => (

                  <tr
                    key={notice.id}
                    className="text-center border-b hover:bg-gray-100 transition"
                  >

                    <td className="p-3">
                      {notice.id}
                    </td>

                    <td className="p-3 font-semibold">
                      {notice.title}
                    </td>

                    <td className="p-3 max-w-xs break-words">
                      {notice.description}
                    </td>

                    <td className="p-3">
                      {new Date(notice.date).toLocaleDateString("en-IN", {
  day: "2-digit",
  month: "short",
  year: "numeric",
})}
                    </td>

                    <td className="p-3">

                      <button
                        onClick={() => {
                          setEditingId(notice.id);
                          setTitle(notice.title);
                          setDescription(notice.description);
                          setDate(notice.date);
                          setShowModal(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteNotice(notice.id)}
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
                    No Notices Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>
      {showModal && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">

            <h2 className="text-2xl font-bold text-blue-700 mb-5">
              {editingId !== null
                ? "Edit Notice"
                : "Add Notice"}
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Notice Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <textarea
                placeholder="Notice Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setTitle("");
                  setDescription("");
                  setDate("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (!title || !description || !date) {
                    alert("Please fill all fields.");
                    return;
                  }

                  let response;

                  if (editingId !== null) {
                    response = await fetch(`/api/notices/${editingId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        title,
                        description,
                        date,
                      }),
                    });
                  } else {
                    response = await fetch("/api/notices", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        title,
                        description,
                        date,
                      }),
                    });
                  }

                  if (response.ok) {
                    alert(
                      editingId !== null
                        ? "Notice Updated Successfully"
                        : "Notice Added Successfully"
                    );

                    setTitle("");
                    setDescription("");
                    setDate("");
                    setEditingId(null);

                    await loadNotices();

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

