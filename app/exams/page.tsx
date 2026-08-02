"use client";

import { useEffect, useState } from "react";

interface Exam {
  id: number;
  subject: string;
  className: string;
  examType: string;
  examDate: string;
  examTime: string;
  totalMarks: number;
  passingMarks: number;
}

export default function ExamsPage() {

  const [showModal, setShowModal] = useState(false);

  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [examType, setExamType] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");

  const [totalMarks, setTotalMarks] =
    useState<number | "">("");

  const [passingMarks, setPassingMarks] =
    useState<number | "">("");

  const [exams, setExams] = useState<Exam[]>([]);

  const [search, setSearch] = useState("");

  const [filterType, setFilterType] =
    useState("All");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  useEffect(() => {
    loadExams();
  }, []);

  async function loadExams() {
    const response = await fetch("/api/exams");
    const data = await response.json();

    setExams(data);
  }

  async function deleteExam(id: number) {

    const confirmDelete = confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmDelete) return;

    const response = await fetch(
      `/api/exams/${id}`,
      {
        method: "DELETE",
      }
    );

    if (response.ok) {
      alert("Exam Deleted Successfully");
      await loadExams();
    } else {
      alert("Error deleting exam");
    }
  }

  const query = search.trim().toLowerCase();

  const filteredExams = exams.filter((exam) => {

    const matchesSearch =
      exam.subject
        ?.toLowerCase()
        .includes(query) ||

      exam.className
        ?.toLowerCase()
        .includes(query) ||

      exam.examType
        ?.toLowerCase()
        .includes(query);

    const matchesType =
      filterType === "All" ||
      exam.examType === filterType;

    return (
      matchesSearch &&
      matchesType
    );
  });

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        📝 Exam Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <input
            type="text"
            placeholder="🔍 Search Subject, Class or Exam Type..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="flex-1 border border-gray-300 rounded-lg p-3 text-black"
          />

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(e.target.value)
            }
            className="border border-gray-300 rounded-lg p-3 text-black"
          >

            <option value="All">
              All Types
            </option>

            <option value="Unit Test">
              Unit Test
            </option>

            <option value="Mid Term">
              Mid Term
            </option>

            <option value="Final Exam">
              Final Exam
            </option>

          </select>

        </div>

        <button
          onClick={() => {
            setEditingId(null);
            setSubject("");
            setClassName("");
            setExamType("");
            setExamDate("");
            setExamTime("");
            setTotalMarks("");
            setPassingMarks("");
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg mb-6"
        >
          + Add Exam
          
        </button>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-300">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-3">ID</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Class</th>
                <th className="p-3">Exam Type</th>
                <th className="p-3">Exam Date</th>
                <th className="p-3">Exam Time</th>
                <th className="p-3">Total Marks</th>
                <th className="p-3">Passing Marks</th>
                <th className="p-3">Actions</th>

              </tr>

            </thead>

            <tbody className="bg-white text-black">

              {filteredExams.length > 0 ? (

                filteredExams.map((exam) => (

                  <tr
                    key={exam.id}
                    className="text-center border-b"
                  >

                    <td className="p-3">
                      {exam.id}
                    </td>

                    <td className="p-3">
                      {exam.subject}
                    </td>

                    <td className="p-3">
                      {exam.className}
                    </td>

                    <td className="p-3">

                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          exam.examType === "Unit Test"
                            ? "bg-green-500"
                            : exam.examType === "Mid Term"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {exam.examType}
                      </span>

                    </td>

                    <td className="p-3">
                      {exam.examDate}
                    </td>

                    <td className="p-3">
  {exam.examTime}
</td>

                    <td className="p-3 font-semibold">
                      {exam.totalMarks}
                    </td>

                    <td className="p-3 font-semibold text-red-600">
                      {exam.passingMarks}
                    </td>

                    <td className="p-3">

                      <button
                        onClick={() => {
                          setEditingId(exam.id);
                          setSubject(exam.subject);
                          setClassName(exam.className);
                          setExamType(exam.examType);
                          setExamDate(exam.examDate);
                          setExamTime(exam.examTime);
                          setTotalMarks(exam.totalMarks);
                          setPassingMarks(exam.passingMarks);
                          setShowModal(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteExam(exam.id)}
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
                    colSpan={9}
                    className="text-center p-8 text-red-500 font-semibold"
                  >
                    No Exams Found
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
              {editingId !== null
                ? "Edit Exam"
                : "Add Exam"}
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Subject Name"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="text"
                placeholder="Class Name"
                value={className}
                onChange={(e) =>
                  setClassName(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <select
                value={examType}
                onChange={(e) =>
                  setExamType(e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              >
                <option value="">
                  Select Exam Type
                </option>

                <option value="Unit Test">
                  Unit Test
                </option>

                <option value="Mid Term">
                  Mid Term
                </option>

                <option value="Final Exam">
                  Final Exam
                </option>

              </select>

              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
  type="time"
  value={examTime}
  onChange={(e) => setExamTime(e.target.value)}
  className="w-full border border-gray-300 rounded-lg p-3 text-black"
/>

              <input
                type="number"
                placeholder="Total Marks"
                value={totalMarks}
                onChange={(e) => {
                  const total =
                    e.target.value === "" ? "" : Number(e.target.value);

                  const passing =
                    passingMarks === "" ? 0 : passingMarks;

                  if (total !== "" && passing > total) {
                    alert("Passing Marks cannot be greater than Total Marks.");
                    return;
                  }

                  setTotalMarks(total);
                }}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
                type="number"
                placeholder="Passing Marks"
                value={passingMarks}
                onChange={(e) => {
                  const passing =
                    e.target.value === "" ? "" : Number(e.target.value);

                  const total =
                    totalMarks === "" ? 0 : totalMarks;

                  if (passing !== "" && passing > total) {
                    alert("Passing Marks cannot be greater than Total Marks.");
                    return;
                  }

                  setPassingMarks(passing);
                }}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setSubject("");
                  setClassName("");
                  setExamType("");
                  setExamDate("");
                  setExamTime("");
                  setTotalMarks("");
                  setPassingMarks("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  if (
                    !subject ||
                    !className ||
                    !examType ||
                    !examDate ||
                    totalMarks === "" ||
                    passingMarks === ""
                  ) {
                    alert("Please fill all fields.");
                    return;
                  }

                  let response;

                  if (editingId !== null) {
                    response = await fetch(`/api/exams/${editingId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        subject,
                        className,
                        examType,
                        examDate,
                        examTime,
                        totalMarks,
                        passingMarks,
                      }),
                    });
                  } else {
                    response = await fetch("/api/exams", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        subject,
                        className,
                        examType,
                        examDate,
                        examTime,
                        totalMarks,
                        passingMarks,
                      }),
                    });
                  }

                  if (response.ok) {
                    alert(
                      editingId !== null
                        ? "Exam Updated Successfully"
                        : "Exam Added Successfully"
                    );

                    setSubject("");
                    setClassName("");
                    setExamType("");
                    setExamDate("");
                    setExamTime("");
                    setTotalMarks("");
                    setPassingMarks("");
                    setEditingId(null);

                    await loadExams();

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

