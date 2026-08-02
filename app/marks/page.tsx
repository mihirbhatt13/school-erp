"use client";

import { useEffect, useState } from "react";

interface Mark {
  id: number;
  studentId: number;
  student: string;
  className: string;
  subject: string;
  examType: string;
  totalMarks: number;
  passingMarks: number;
  obtainedMarks: number;
}

interface Exam {
  id: number;
  subject: string;
  className: string;
  examType: string;
  totalMarks: number;
  passingMarks: number;
}

interface Student {
  id: number;
  name: string;
  email: string;
  class: string;
}

export default function MarksPage() {
  const [showModal, setShowModal] = useState(false);

  const [studentId, setStudentId] = useState<number | "">("");
  const [student, setStudent] = useState("");
  const [className, setClassName] = useState("");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("");

  const [passingMarks, setPassingMarks] =
  useState<number | "">("");

  const [totalMarks, setTotalMarks] =
  useState<number | "">("");

  const [obtainedMarks, setObtainedMarks] =
    useState<number | "">("");

  const [marks, setMarks] = useState<Mark[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);

  const [students, setStudents] = useState<Student[]>([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

useEffect(() => {
  loadMarks();
  loadExams();
}, []);


async function loadExams() {
  const response = await fetch("/api/exams");
  const data = await response.json();

  setExams(data);
}

function autoFillMarks(
  selectedSubject: string,
  selectedClass: string,
  selectedExam: string
) {
  const exam = exams.find(
    (e) =>
      e.subject === selectedSubject &&
      e.className === selectedClass &&
      e.examType === selectedExam
  );

  if (exam) {
    setTotalMarks(exam.totalMarks);
    setPassingMarks(exam.passingMarks);
  } else {
    setTotalMarks("");
    setPassingMarks("");
  }
}

  async function loadMarks() {
  const response = await fetch("/api/marks");
  const data = await response.json();

  console.log("MARKS API RESPONSE:", data);
  console.log("Is Array:", Array.isArray(data));

  setMarks(Array.isArray(data) ? data : []);
}

  async function deleteMark(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this mark?"
    );

    if (!confirmDelete) return;

    const response = await fetch(`/api/marks/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Marks Deleted Successfully");
      await loadMarks();
    } else {
      alert("Error deleting marks");
    }
  }

  const query = search.trim().toLowerCase();

  const filteredMarks = marks.filter((mark) => {
    return (
      mark.student.toLowerCase().includes(query) ||
      mark.className.toLowerCase().includes(query) ||
      mark.subject.toLowerCase().includes(query) ||
      mark.examType.toLowerCase().includes(query)
    );
  });

  return (
        <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        📊 Marks Management
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <input
            type="text"
            placeholder="🔍 Search Student, Class, Subject or Exam Type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-3 text-black"
          />

          <button
            onClick={() => {
              setEditingId(null);
              setStudentId("");
              setStudent("");
              setClassName("");
              setSubject("");
              setExamType("");
              setTotalMarks("");
              setPassingMarks("");
              setObtainedMarks("");
              setShowModal(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
          >
            + Add Marks
          </button>

        </div>

        <div className="mb-5">

          <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold">
            Total Records : {filteredMarks.length}
          </span>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full border border-gray-300">

            <thead className="bg-blue-600 text-white">

              <tr>

                <th className="p-3">ID</th>
                <th className="p-3">Student</th>
                <th className="p-3">Class</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Exam</th>
                <th className="p-3">Total</th>
                <th className="p-3">Passing</th>
                <th className="p-3">Obtained</th>
                <th className="p-3">%</th>
                <th className="p-3">Result</th>
                <th className="p-3">Actions</th>

              </tr>

            </thead>

            <tbody className="bg-white text-black">

              {filteredMarks.length > 0 ? (

                filteredMarks.map((mark) => {

                  const percentage =
  mark.totalMarks > 0
    ? ((mark.obtainedMarks / mark.totalMarks) * 100).toFixed(2)
    : "0.00";
                  const result =
  mark.obtainedMarks >= mark.passingMarks
    ? "Pass"
    : "Fail";

                  return (

                    <tr
                      key={mark.id}
                      className="border-b text-center"
                    >

                      <td className="p-3">{mark.id}</td>

                      <td className="p-3">
                        {mark.student}
                      </td>

                      <td className="p-3">
                        {mark.className}
                      </td>

                      <td className="p-3">
                        {mark.subject}
                      </td>

                      <td className="p-3">
                        {mark.examType}
                      </td>

                      <td className="p-3 font-semibold">
                        {mark.totalMarks}
                      </td>

                      <td className="p-3 font-semibold">
  {mark.passingMarks}
</td>

                      <td className="p-3 font-semibold">
                        {mark.obtainedMarks}
                      </td>

                      <td className="p-3 font-semibold text-blue-600">
                        {percentage}%
                      </td>

                      <td
                        className={`p-3 font-bold ${
                          result === "Pass"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {result}
                      </td>

                      <td className="p-3">

                        <button
                          onClick={() => {
                            setEditingId(mark.id);
                            setStudentId(mark.studentId);
                            setStudent(mark.student);
                            setClassName(mark.className);
                            setSubject(mark.subject);
                            setExamType(mark.examType);
                            setTotalMarks(mark.totalMarks);
                            setPassingMarks(mark.passingMarks);
                            setObtainedMarks(mark.obtainedMarks);
                            setShowModal(true);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            deleteMark(mark.id)
                          }
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan={10}
                    className="text-center p-8 text-red-500 font-semibold"
                  >
                    No Marks Found
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

            {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="bg-white rounded-xl shadow-xl w-[500px] p-6">

            <h2 className="text-2xl font-bold text-blue-700 mb-5">
              {editingId !== null ? "Edit Marks" : "Add Marks"}
            </h2>

            <div className="space-y-4">

              <input
                type="number"
                placeholder="Student ID"
                value={studentId}
                onChange={(e) =>
                  setStudentId(
                    e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

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
                onChange={(e) => {
  const value = e.target.value;
  setClassName(value);
  autoFillMarks(subject, value, examType);
}}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
  type="text"
  placeholder="Subject"
  value={subject}
  onChange={(e) => {
    const value = e.target.value;
    setSubject(value);
    autoFillMarks(value, className, examType);
  }}
  className="w-full border border-gray-300 rounded-lg p-3 text-black"
/>

              <select
                value={examType}
                onChange={(e) => {
  const value = e.target.value;
  setExamType(value);
  autoFillMarks(subject, className, value);
}}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              >
                <option value="">Select Exam Type</option>
                <option value="Unit Test">Unit Test</option>
                <option value="Mid Term">Mid Term</option>
                <option value="Final Exam">Final Exam</option>
              </select>

              <input
                type="number"
                placeholder="Total Marks"
                value={totalMarks}
                onChange={(e) =>
                  setTotalMarks(
                    e.target.value === ""
                      ? ""
                      : Number(e.target.value)
                  )
                }
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

              <input
  type="number"
  placeholder="Passing Marks"
  value={passingMarks}
  onChange={(e) =>
    setPassingMarks(
      e.target.value === ""
        ? ""
        : Number(e.target.value)
    )
  }
  className="w-full border border-gray-300 rounded-lg p-3 text-black"
/>

              <input
                type="number"
                placeholder="Obtained Marks"
                value={obtainedMarks}
                onChange={(e) => {
                  const value =
                    e.target.value === ""
                      ? ""
                      : Number(e.target.value);

                  if (
                    value !== "" &&
                    totalMarks !== "" &&
                    value > totalMarks
                  ) {
                    alert(
                      "Obtained Marks cannot be greater than Total Marks."
                    );
                    return;
                  }

                  setObtainedMarks(value);
                }}
                className="w-full border border-gray-300 rounded-lg p-3 text-black"
              />

            </div>

            <div className="flex justify-end gap-3 mt-6">

              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingId(null);
                  setStudentId("");
                  setStudent("");
                  setClassName("");
                  setSubject("");
                  setExamType("");
                  setTotalMarks("");
                  setPassingMarks("");
                  setObtainedMarks("");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

                            <button
                onClick={async () => {
                  if (
                    studentId === "" ||
                    !student ||
                    !className ||
                    !subject ||
                    !examType ||
                    totalMarks === "" ||
                    passingMarks === "" ||
                    obtainedMarks === ""
                  ) {
                    alert("Please fill all fields.");
                    return;
                  }

                  let response;

                  if (editingId !== null) {
                    response = await fetch(`/api/marks/${editingId}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        studentId,
                        student,
                        className,
                        subject,
                        examType,
                        totalMarks,
                        passingMarks,
                        obtainedMarks,
                      }),
                    });
                  } else {
                    response = await fetch("/api/marks", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        studentId,
                        student,
                        className,
                        subject,
                        examType,
                        totalMarks,
                        passingMarks,
                        obtainedMarks,
                      }),
                    });
                  }

                  if (response.ok) {
                    alert(
                      editingId !== null
                        ? "Marks Updated Successfully"
                        : "Marks Added Successfully"
                    );

                    setStudentId("");
                    setStudent("");
                    setClassName("");
                    setSubject("");
                    setExamType("");
                    setTotalMarks("");
                    setPassingMarks("");
                    setObtainedMarks("");
                    setEditingId(null);

                    await loadMarks();

                    setShowModal(false);
                 } else {
  const error = await response.json();
  alert(error.error || "Something went wrong!");
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



    