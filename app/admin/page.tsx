"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Inquiry {
  id: number;
  name: string;
  email: string;
  category: string;
  message: string;
  createdAt: string;
}

export default function AdminPage() {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(0);
  const [feeCount, setFeeCount] = useState(0);
  const [examCount, setExamCount] = useState(0);
  const [noticeCount, setNoticeCount] = useState(0);
  const [inquiryCount, setInquiryCount] = useState(0);
  const [recentInquiries, setRecentInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [students, teachers, classes, attendance, fees, exams, notices, inquiries] =
          await Promise.all([
            fetch("/api/students").then((r) => r.json()).catch(() => []),
            fetch("/api/teachers").then((r) => r.json()).catch(() => []),
            fetch("/api/classes").then((r) => r.json()).catch(() => []),
            fetch("/api/attendance").then((r) => r.json()).catch(() => []),
            fetch("/api/fees").then((r) => r.json()).catch(() => []),
            fetch("/api/exams").then((r) => r.json()).catch(() => []),
            fetch("/api/notices").then((r) => r.json()).catch(() => []),
            fetch("/api/contact").then((r) => r.json()).catch(() => []),
          ]);

        setStudentCount(Array.isArray(students) ? students.length : 0);
        setTeacherCount(Array.isArray(teachers) ? teachers.length : 0);
        setClassCount(Array.isArray(classes) ? classes.length : 0);

        if (Array.isArray(attendance) && attendance.length > 0) {
          const present = attendance.filter(
            (item: { status: string }) => item.status?.toLowerCase() === "present"
          ).length;
          setAttendancePercentage(Math.round((present / attendance.length) * 100));
        } else {
          setAttendancePercentage(0);
        }

        setFeeCount(Array.isArray(fees) ? fees.length : 0);
        setExamCount(Array.isArray(exams) ? exams.length : 0);
        setNoticeCount(Array.isArray(notices) ? notices.length : 0);
        setInquiryCount(Array.isArray(inquiries) ? inquiries.length : 0);
        setRecentInquiries(Array.isArray(inquiries) ? inquiries.slice(0, 5) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const stats = [
    { name: "Total Students", value: studentCount, icon: "👨‍🎓", href: "/admin/students", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { name: "Faculty Members", value: teacherCount, icon: "👨‍🏫", href: "/admin/teachers", color: "bg-purple-50 border-purple-200 text-purple-700" },
    { name: "Active Classes", value: classCount, icon: "🏫", href: "/admin/classes", color: "bg-amber-50 border-amber-200 text-amber-700" },
    { name: "Avg Attendance Rate", value: `${attendancePercentage}%`, icon: "✅", href: "/admin/attendance", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { name: "Contact Inquiries", value: inquiryCount, icon: "📬", href: "/admin/inquiries", color: "bg-indigo-50 border-indigo-200 text-indigo-700" },
    { name: "Fee Records", value: feeCount, icon: "💰", href: "/admin/fees", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
    { name: "Upcoming Exams", value: examCount, icon: "📝", href: "/admin/exams", color: "bg-cyan-50 border-cyan-200 text-cyan-700" },
    { name: "Active Notices", value: noticeCount, icon: "📢", href: "/admin/notices", color: "bg-rose-50 border-rose-200 text-rose-700" },
  ];

  return (
    <div className="space-y-8">
      {/* Banner Card */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-md">
        <div className="max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            Enterprise Control Center
          </span>
          <h2 className="text-3xl font-extrabold font-heading text-slate-900 mt-3">
            Welcome Back, Administrator
          </h2>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed font-medium">
            Real-time control over student enrollments, faculty directories, contact inquiries, fee ledgers, and exams.
          </p>
        </div>
      </div>

      {/* Grid of Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} border flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <span className="text-xs font-bold text-indigo-700 group-hover:translate-x-1 transition-transform">
                Manage →
              </span>
            </div>

            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                {stat.name}
              </p>
              <h3 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
                {loading ? "..." : stat.value}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Inquiries Preview Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <span>📬</span> Recent Contact Inquiries
            </h3>
            <p className="text-slate-500 text-xs mt-0.5">Submissions received from the public Contact Us form.</p>
          </div>
          <Link
            href="/admin/inquiries"
            className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-xs font-bold transition"
          >
            View All Inquiries →
          </Link>
        </div>

        {recentInquiries.length === 0 ? (
          <p className="text-slate-500 text-xs py-4">No contact inquiries submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 text-slate-700 text-xs uppercase font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {recentInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{inq.name}</td>
                    <td className="p-3 text-indigo-700 font-semibold">{inq.email}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200 font-bold uppercase text-[10px]">
                        {inq.category}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 truncate max-w-xs">{inq.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions Grid */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
        <h3 className="text-lg font-bold font-heading text-slate-900 mb-4 flex items-center gap-2">
          <span>⚡</span> Quick Administrative Actions
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/admin/inquiries"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-500 text-center group transition"
          >
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">📬</span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">View Inquiries</span>
          </Link>

          <Link
            href="/admin/students"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-indigo-500 text-center group transition"
          >
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">👨‍🎓</span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-700">Manage Students</span>
          </Link>

          <Link
            href="/admin/teachers"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-500 text-center group transition"
          >
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">👨‍🏫</span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-purple-700">Manage Faculty</span>
          </Link>

          <Link
            href="/admin/fees"
            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 text-center group transition"
          >
            <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform">💳</span>
            <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-700">Collect Fees</span>
          </Link>
        </div>
      </div>
    </div>
  );
}