-- CreateTable
CREATE TABLE "Attendance" (
    "id" SERIAL NOT NULL,
    "student" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);
