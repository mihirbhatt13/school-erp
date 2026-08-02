"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Teacher {
  id: number;
  teacherId: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  assignedClass: string;
  address?: string | null;
  profileImage?: string | null;
}

export default function TeacherDashboard() {
  const router = useRouter();

  const [students, setStudents] = useState(0);
  const [attendance, setAttendance] = useState(0);
  const [exams, setExams] = useState(0);
  const [notices, setNotices] = useState(0);
  const [teacher, setTeacher] = useState<Teacher | null>(null);

  const handleLogout = async () => {
    await fetch("/api/teacher-logout", {
      method: "POST",
    });

    router.push("/teacher-login");
  };

  useEffect(() => {
    checkTeacher();
    loadDashboard();
  }, []);

  async function checkTeacher() {
    try {
      const response = await fetch("/api/teacher-profile");
      if (!response.ok) return;
      const data = await response.json();
      setTeacher(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function loadDashboard() {
    try {
      const [studentsRes, attendanceRes, examsRes, noticesRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/attendance"),
        fetch("/api/exams"),
        fetch("/api/notices"),
      ]);

      const studentsData = await studentsRes.json();
      const attendanceData = await attendanceRes.json();
      const examsData = await examsRes.json();
      const noticesData = await noticesRes.json();

      setStudents(Array.isArray(studentsData) ? studentsData.length : 0);
      setAttendance(Array.isArray(attendanceData) ? attendanceData.length : 0);
      setExams(Array.isArray(examsData) ? examsData.length : 0);
      setNotices(Array.isArray(noticesData) ? noticesData.length : 0);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-10">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl">
          <div className="flex items-center gap-5">
            {/* Profile Avatar */}
            <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
              {teacher?.profileImage ? (
                <Image
                  src={teacher.profileImage}
                  alt={teacher.name}
                  width={80}
                  height={80}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl text-slate-400">
                  👤
                </div>
              )}
            </div>

            <div>
              <h1 className="text-3xl font-extrabold font-heading text-slate-900">
                {teacher?.name || "Teacher"}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 font-medium">
                Subject: <span className="text-slate-900 font-bold">{teacher?.subject || "-"}</span> • Assigned Class: <span className="text-slate-900 font-bold">{teacher?.assignedClass || "-"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/teacher-profile"
              className="px-4 py-2.5 rounded-xl bg-indigo-700 hover:bg-indigo-600 text-white text-xs font-bold transition shadow-sm whitespace-nowrap"
            >
              Edit Profile
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition whitespace-nowrap"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Students</p>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">{students}</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Attendance</p>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">{attendance}</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Exams</p>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">{exams}</h2>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Notices</p>
            <h2 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">{notices}</h2>
          </div>
        </div>

        {/* Quick Module Cards */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="/teacher-students"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:border-indigo-500 group transition duration-300"
            >
              <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-indigo-600">Students</h3>
              <p className="text-slate-500 text-xs mt-1">View class student roster.</p>
            </Link>

            <Link
              href="/teacher-attendance"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:border-indigo-500 group transition duration-300"
            >
              <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-indigo-600">Attendance</h3>
              <p className="text-slate-500 text-xs mt-1">Record daily attendance.</p>
            </Link>

            <Link
              href="/teacher-exams"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:border-indigo-500 group transition duration-300"
            >
              <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-indigo-600">Exams</h3>
              <p className="text-slate-500 text-xs mt-1">View exam timetable.</p>
            </Link>

            <Link
              href="/teacher-notices"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:border-indigo-500 group transition duration-300"
            >
              <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-indigo-600">Notices</h3>
              <p className="text-slate-500 text-xs mt-1">View announcements.</p>
            </Link>

            <Link
              href="/teacher-profile"
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg hover:border-indigo-500 group transition duration-300"
            >
              <h3 className="text-lg font-bold font-heading text-slate-900 group-hover:text-indigo-600">Profile</h3>
              <p className="text-slate-500 text-xs mt-1">View and edit teacher details.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}