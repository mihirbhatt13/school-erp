/*
  Warnings:

  - A unique constraint covering the columns `[rollNo]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `passingMarks` to the `Mark` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mark" ADD COLUMN     "passingMarks" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "rollNo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Student_rollNo_key" ON "Student"("rollNo");
