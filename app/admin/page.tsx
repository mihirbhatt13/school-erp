"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [feeCount, setFeeCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);

  useEffect(() => {
    async function loadData() {
      const students = await fetch("/api/students").then(r => r.json());
      const teachers = await fetch("/api/teachers").then(r => r.json());
      const classes = await fetch("/api/classes").then(r => r.json());
      const attendance = await fetch("/api/attendance").then(r => r.json());
      const fees = await fetch("/api/fees").then(r => r.json());
      const exams = await fetch("/api/exams").then(r => r.json());
      const notices = await fetch("/api/notices").then(r => r.json());

      setStudentCount(students.length);
      setTeacherCount(teachers.length);
      setClassCount(classes.length);

      const present = attendance.filter(
        (item: { status: string }) => item.status === "Present"
      ).length;

      setAttendancePercentage(
        attendance.length === 0
          ? 0
          : Math.round((present / attendance.length) * 100)
      );

      setFeeCount(fees.length);
      setExamCount(exams.length);
      setNoticeCount(notices.length);
    }

    loadData();
  }, []);

  return (
    <>
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        👨‍💼 Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
          <h2>Students</h2>
          <p className="text-3xl">{studentCount}</p>
        </div>

        <div className="bg-green-500 text-white p-6 rounded-xl shadow">
          <h2>Teachers</h2>
          <p className="text-3xl">{teacherCount}</p>
        </div>

        <div className="bg-yellow-500 text-white p-6 rounded-xl shadow">
          <h2>Classes</h2>
          <p className="text-3xl">{classCount}</p>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-xl shadow">
          <h2>Attendance</h2>
          <p className="text-3xl">{attendancePercentage}%</p>
        </div>

        <div className="bg-purple-500 text-white p-6 rounded-xl shadow">
          <h2>Fees</h2>
          <p className="text-3xl">{feeCount}</p>
        </div>

        <div className="bg-indigo-500 text-white p-6 rounded-xl shadow">
          <h2>Exams</h2>
          <p className="text-3xl">{examCount}</p>
        </div>

        <div className="bg-pink-500 text-white p-6 rounded-xl shadow">
          <h2>Notice Board</h2>
          <p className="text-3xl">{noticeCount}</p>
        </div>
      </div>

      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Recent Activities</h2>

        <ul className="space-y-3">
          <li>✅ New Student Registered</li>
          <li>✅ Teacher Added</li>
          <li>✅ Fees Collected</li>
          <li>✅ Attendance Updated</li>
        </ul>
      </div>
    </>
  );
}