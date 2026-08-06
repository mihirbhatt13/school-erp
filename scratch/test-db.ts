import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function testDirectInsertion() {
  console.log("🔍 Testing direct Prisma database insertion...");

  try {
    // 1. Create Student
    const student = await prisma.student.create({
      data: {
        rollNo: `TEST${Math.floor(1000 + Math.random() * 9000)}`,
        name: "Direct Test Student",
        email: `teststudent_${Date.now()}@edupulse.edu`,
        class: "Class 10-A",
        phone: "+91 99999 88888",
        address: "Test Address, Mumbai",
        password: "hashedpassword123",
      },
    });
    console.log("✅ Student Created Successfully:", student);

    // 2. Create Teacher
    const teacher = await prisma.teacher.create({
      data: {
        teacherId: `TCHTEST${Math.floor(1000 + Math.random() * 9000)}`,
        name: "Direct Test Teacher",
        email: `testteacher_${Date.now()}@edupulse.edu`,
        subject: "Physics",
        assignedClass: "Class 12-A",
        phone: "+91 99999 77777",
        password: "hashedpassword123",
      },
    });
    console.log("✅ Teacher Created Successfully:", teacher);

    // Clean up test records
    await prisma.student.delete({ where: { id: student.id } });
    await prisma.teacher.delete({ where: { id: teacher.id } });
    console.log("🧹 Test records cleaned up successfully.");

    console.log("🎉 DIRECT DATABASE INSERTION & DELETION VERIFIED 100%!");
  } catch (error) {
    console.error("❌ DIRECT DATABASE INSERTION FAILED:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDirectInsertion();
