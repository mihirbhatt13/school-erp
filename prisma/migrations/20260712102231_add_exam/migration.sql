-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "subject" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "examDate" TEXT NOT NULL,
    "totalMarks" INTEGER NOT NULL,
    "passingMarks" INTEGER NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);
