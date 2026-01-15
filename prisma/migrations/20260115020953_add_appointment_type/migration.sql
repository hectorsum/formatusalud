-- AlterTable
ALTER TABLE "appointments" ADD COLUMN     "appointmentType" TEXT NOT NULL DEFAULT 'IN_PERSON';

-- CreateTable
CREATE TABLE "medical_records" (
    "id" TEXT NOT NULL,
    "appointmentId" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "symptoms" TEXT,
    "prescription" TEXT,
    "notes" TEXT,
    "type" TEXT NOT NULL DEFAULT 'CONSULTATION',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_appointmentId_key" ON "medical_records"("appointmentId");

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "appointments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
