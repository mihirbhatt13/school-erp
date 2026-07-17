-- CreateTable
CREATE TABLE "Fee" (
    "id" SERIAL NOT NULL,
    "student" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "totalFees" INTEGER NOT NULL,
    "paidAmount" INTEGER NOT NULL,
    "pendingFees" INTEGER NOT NULL,
    "paymentDate" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);
