'use server';

import { prisma } from '@/lib/prisma';
import {verifySession } from '@/lib/session';
import { Role } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type MedicalRecordInput = {
  appointmentId: string;
  diagnosis: string;
  symptoms?: string;
  prescription?: string;
  notes?: string;
  type: string;
};

export async function createMedicalRecord(data: MedicalRecordInput) {
  const session = await verifySession();
  
  // 1. Auth Check: Doctor Only
  if (!session || session.role !== Role.DOCTOR) {
    return { success: false, message: 'Unauthorized' };
  }

  // 2. Profile Check
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.userId },
  });

  if (!doctor) {
    return { success: false, message: 'Doctor profile not found' };
  }

  // 3. Appointment Ownership Check
  const appointment = await prisma.appointment.findUnique({
    where: { id: data.appointmentId },
  });

  if (!appointment || appointment.doctorId !== doctor.id) {
    return { success: false, message: 'Appointment not found or not assigned to you' };
  }

  try {
    // 4. Create Record
    await prisma.medicalRecord.create({
      data: {
        appointmentId: data.appointmentId,
        diagnosis: data.diagnosis,
        symptoms: data.symptoms,
        prescription: data.prescription,
        notes: data.notes,
        type: data.type,
      },
    });

    // 5. Update Appointment Status (Optional but good practice)
    if (appointment.status !== 'CONFIRMED') {
         await prisma.appointment.update({
            where: { id: appointment.id },
            data: { status: 'CONFIRMED' } // Or separate 'COMPLETED' status if exists
         });
    }

    revalidatePath('/dashboard');
    return { success: true, message: 'Diagnostic Saved' };

  } catch (error: any) {
    console.error('Failed to create medical record:', error);
    return { success: false, message: 'Failed to save record' };
  }
}

export async function getPatientHistory(patientId: string) {
  const session = await verifySession();

  if (!session || session.role !== Role.DOCTOR) {
    return { success: false, message: 'Unauthorized' };
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.userId },
  });

  if (!doctor) {
    return { success: false, message: 'Doctor profile not found' };
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        patientId: patientId,
      },
      include: {
        medicalRecord: true,
        patient: {
          select: {
            name: true,
            email: true,
            birthdate: true,
            documentNumber: true
          }
        }
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return { success: true, data: appointments };
  } catch (error) {
    console.error('Error fetching patient history:', error);
    return { success: false, message: 'Failed to fetch history' };
  }
}
