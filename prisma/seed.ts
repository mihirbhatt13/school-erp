import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting EduPulse Academy Database Seeding...");

  // 1. Seed Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  await prisma.admin.upsert({
    where: { email: "admin@gmail.com" },
    update: { password: adminPassword },
    create: {
      email: "admin@gmail.com",
      password: adminPassword,
    },
  });
  console.log("✅ Admin user seeded: admin@gmail.com / admin123");

  // 2. Seed Standard K-12 Classes
  const classesData = [
    { className: "Nursery", section: "A" },
    { className: "Junior KG (LKG)", section: "A" },
    { className: "Senior KG (UKG)", section: "A" },
    { className: "Class 1", section: "A" },
    { className: "Class 2", section: "A" },
    { className: "Class 3", section: "A" },
    { className: "Class 4", section: "A" },
    { className: "Class 5", section: "A" },
    { className: "Class 6", section: "A" },
    { className: "Class 7", section: "A" },
    { className: "Class 8", section: "A" },
    { className: "Class 9", section: "A" },
    { className: "Class 10", section: "A" },
    { className: "Class 10", section: "B" },
    { className: "Class 11", section: "A" },
    { className: "Class 12", section: "A" },
  ];

  for (const item of classesData) {
    const existingClass = await prisma.class.findFirst({
      where: { className: item.className, section: item.section },
    });
    if (!existingClass) {
      await prisma.class.create({ data: item });
    }
  }
  console.log("✅ K-12 Classrooms seeded");

  // 3. Seed Teachers
  const teacherPassword = await bcrypt.hash("teacher123", 10);
  const teachersData = [
    {
      teacherId: "TCH101",
      name: "Dr. Sarah Jenkins",
      email: "sarah@edupulse.edu",
      subject: "Mathematics",
      assignedClass: "Class 10-A",
      phone: "+91 98765 43210",
      password: teacherPassword,
    },
    {
      teacherId: "TCH102",
      name: "Prof. Robert Chen",
      email: "robert@edupulse.edu",
      subject: "Physics",
      assignedClass: "Class 12-A",
      phone: "+91 98765 43211",
      password: teacherPassword,
    },
    {
      teacherId: "TCH103",
      name: "Mrs. Anita Sharma",
      email: "anita@edupulse.edu",
      subject: "English Literature",
      assignedClass: "Class 9-A",
      phone: "+91 98765 43212",
      password: teacherPassword,
    },
  ];

  for (const teacher of teachersData) {
    await prisma.teacher.upsert({
      where: { email: teacher.email },
      update: { password: teacherPassword },
      create: teacher,
    });
  }
  console.log("✅ Faculty Directory seeded: sarah@edupulse.edu / teacher123");

  // 4. Seed Students
  const studentPassword = await bcrypt.hash("student123", 10);
  const studentsData = [
    {
      rollNo: "STU1001",
      name: "Aarav Sharma",
      email: "aarav@edupulse.edu",
      class: "Class 10-A",
      phone: "+91 91234 56789",
      address: "402, Siddhivinayak Apartment, Andheri East, Mumbai",
      password: studentPassword,
    },
    {
      rollNo: "STU1002",
      name: "Ananya Verma",
      email: "ananya@edupulse.edu",
      class: "Class 10-A",
      phone: "+91 91234 56790",
      address: "12, Green Park Main, Bandra West, Mumbai",
      password: studentPassword,
    },
    {
      rollNo: "STU1003",
      name: "Rohan Gupta",
      email: "rohan@edupulse.edu",
      class: "Class 12-A",
      phone: "+91 91234 56791",
      address: "88, Sunshine Heights, Powai, Mumbai",
      password: studentPassword,
    },
  ];

  for (const student of studentsData) {
    await prisma.student.upsert({
      where: { email: student.email },
      update: { password: studentPassword },
      create: student,
    });
  }
  console.log("✅ Student Roster seeded: aarav@edupulse.edu / student123");

  // 5. Seed Attendance
  const attendanceData = [
    { studentId: 1, student: "Aarav Sharma", className: "Class 10-A", date: "2026-08-01", status: "Present" },
    { studentId: 2, student: "Ananya Verma", className: "Class 10-A", date: "2026-08-01", status: "Present" },
    { studentId: 3, student: "Rohan Gupta", className: "Class 12-A", date: "2026-08-01", status: "Absent" },
  ];

  for (const item of attendanceData) {
    const existing = await prisma.attendance.findFirst({
      where: { studentId: item.studentId, date: item.date },
    });
    if (!existing) {
      await prisma.attendance.create({ data: item });
    }
  }
  console.log("✅ Attendance registers seeded");

  // 6. Seed Fee Ledgers
  const feeData = [
    { student: "Aarav Sharma", className: "Class 10-A", totalFees: 45000, paidAmount: 45000, pendingFees: 0, paymentDate: "2026-07-15", status: "PAID" },
    { student: "Ananya Verma", className: "Class 10-A", totalFees: 45000, paidAmount: 25000, pendingFees: 20000, paymentDate: "2026-07-20", status: "PARTIAL" },
    { student: "Rohan Gupta", className: "Class 12-A", totalFees: 52000, paidAmount: 0, pendingFees: 52000, paymentDate: "2026-08-01", status: "PENDING" },
  ];

  for (const item of feeData) {
    const existing = await prisma.fee.findFirst({
      where: { student: item.student },
    });
    if (!existing) {
      await prisma.fee.create({ data: item });
    }
  }
  console.log("✅ Fee Accounts seeded");

  // 7. Seed Exam Schedules
  const examData = [
    { subject: "Mathematics", className: "Class 10-A", examType: "Unit Test 1", examDate: "2026-08-10", examTime: "10:00 AM - 01:00 PM", totalMarks: 100, passingMarks: 40 },
    { subject: "Physics", className: "Class 12-A", examType: "Mid Term Examination", examDate: "2026-08-15", examTime: "02:00 PM - 05:00 PM", totalMarks: 100, passingMarks: 40 },
  ];

  for (const item of examData) {
    const existing = await prisma.exam.findFirst({
      where: { subject: item.subject, className: item.className, examType: item.examType },
    });
    if (!existing) {
      await prisma.exam.create({ data: item });
    }
  }
  console.log("✅ Exam Timetables seeded");

  // 8. Seed Marks Entries
  const markData = [
    { studentId: 1, student: "Aarav Sharma", className: "Class 10-A", subject: "Mathematics", examType: "Unit Test 1", totalMarks: 100, passingMarks: 40, obtainedMarks: 94 },
    { studentId: 2, student: "Ananya Verma", className: "Class 10-A", subject: "Mathematics", examType: "Unit Test 1", totalMarks: 100, passingMarks: 40, obtainedMarks: 88 },
  ];

  for (const item of markData) {
    const existing = await prisma.mark.findFirst({
      where: { studentId: item.studentId, subject: item.subject, examType: item.examType },
    });
    if (!existing) {
      await prisma.mark.create({ data: item });
    }
  }
  console.log("✅ Student Marks ledgers seeded");

  // 9. Seed Notices
  const noticeData = [
    { title: "Academic Session 2026-2027 Welcome", description: "Welcome back all students and faculty to EduPulse Academy for the new academic year!", date: "2026-08-01" },
    { title: "Annual Sports & Cultural Meet", description: "Preparations for the Annual Sports Meet will begin next Monday. Register with your class teacher.", date: "2026-08-02" },
  ];

  for (const item of noticeData) {
    const existing = await prisma.notice.findFirst({
      where: { title: item.title },
    });
    if (!existing) {
      await prisma.notice.create({ data: item });
    }
  }
  console.log("✅ Notice Board seeded");

  console.log("🎉 EduPulse Academy Database Seeding Complete!");
}

main()
  .catch((error) => {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });