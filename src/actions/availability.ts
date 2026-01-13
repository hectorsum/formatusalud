'use server'

import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

// Helper to Create Date in Specific Timezone (Peru: UTC-5)
// This ensures that when we say "9:00 AM" it is 9:00 AM in Peru.
function createDateInPeru(dateStr: string, hour: number, minute: number = 0): Date {
  // dateStr is YYYY-MM-DD
  // ISO string with offset: YYYY-MM-DDTHH:mm:ss-05:00
  const iso = `${dateStr}T${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00-05:00`;
  return new Date(iso);
}

export async function toggleSlot(dateStr: string, hour: number, isAvailable: boolean) {
  const session = await verifySession();
  if (!session || session.role !== 'DOCTOR') {
    return { success: false, message: 'Unauthorized' };
  }

  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.userId }
  });

  if (!doctor) return { success: false, message: 'Doctor not found' };

  // Create dates with explicit timezone logic
  const startTime = createDateInPeru(dateStr, hour);
  const endTime = createDateInPeru(dateStr, hour + 1);

  try {
    if (isAvailable) {
      // Create slot if it doesn't exist
      // First check if it exists to avoid dupes (though DB constraints might handle this if we added unique index, but schema has index on [doctorId, startTime])
      const existing = await prisma.availabilitySlot.findFirst({
        where: {
          doctorId: doctor.id,
          startTime: startTime
        }
      });

      if (!existing) {
        await prisma.availabilitySlot.create({
          data: {
            doctorId: doctor.id,
            startTime: startTime,
            endTime: endTime,
            isAvailable: true
          }
        });
      }
    } else {
      // Remove slot (Make unavailable)
      // Check if there is an appointment first? 
      // Ideally yes, but for MVP we might just delete the slot.
      // If an appointment exists, we probably shouldn't just delete the slot without warning.

      const appointment = await prisma.appointment.findFirst({
        where: {
          doctorId: doctor.id,
          startTime: startTime,
          status: { not: 'CANCELLED' }
        }
      });

      if (appointment) {
        return { success: false, message: 'No se puede cerrar horario con cita activa.' };
      }

      await prisma.availabilitySlot.deleteMany({
        where: {
          doctorId: doctor.id,
          startTime: startTime
        }
      });
    }

    revalidatePath('/disponibilidad');
    return { success: true };
  } catch (error) {
    console.error('Toggle slot error:', error);
    return { success: false, message: 'Error updating slot' };
  }
}

export async function getSlotsForDate(dateStr: string) {
  const session = await verifySession();
  if (!session || session.role !== 'DOCTOR') return [];

  const doctor = await prisma.doctor.findUnique({ where: { userId: session.userId } });
  if (!doctor) return [];

  // Range: 00:00 Peru to 23:59 Peru
  const start = createDateInPeru(dateStr, 0);
  const end = createDateInPeru(dateStr, 23, 59);

  const slots = await prisma.availabilitySlot.findMany({
    where: {
      doctorId: doctor.id,
      startTime: {
        gte: start,
        lte: end
      }
    },
    orderBy: { startTime: 'asc' }
  });

  return slots;
}
