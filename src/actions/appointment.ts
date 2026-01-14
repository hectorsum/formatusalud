'use server';

import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { createOrder } from '@/infrastructure/payment/culqi';
import { CONSULTATION_PRICE_CENTS, CURRENCY } from '@/domain/constants';
import { AppointmentStatus, PaymentStatus, PaymentProvider } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export type BookingResult = {
  success: boolean;
  message?: string;
  orderId?: string; // Culqi Order ID (simulated or real)
  appointmentId?: string;
  culqiPublicKey?: string;
};

export async function getAvailableSlots(doctorId: string, date: string, endDate?: string) {
  // date string YYYY-MM-DD
  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = endDate ? new Date(`${endDate}T23:59:59`) : new Date(`${date}T23:59:59`);

  const slots = await prisma.availabilitySlot.findMany({
    where: {
      doctorId,
      isAvailable: true,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    orderBy: { startTime: 'asc' },
  });

  return slots;
}

export async function bookAppointment(slotId: string, appointmentType: string): Promise<BookingResult> {
  const session = await verifySession();
  if (!session || !session.userId) {
    return { success: false, message: 'Unauthorized' };
  }

  const patientId = session.userId;

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Lock availability slot
      // We rely on atomic update. `isAvailable: true` check ensures no double booking.
      const updatedSlot = await tx.availabilitySlot.updateMany({
        where: {
          id: slotId,
          isAvailable: true,
        },
        data: {
          isAvailable: false,
        },
      });

      if (updatedSlot.count === 0) {
        throw new Error('Slot is no longer available.');
      }

      // Fetch slot details for appointment creation
      const slot = await tx.availabilitySlot.findUniqueOrThrow({
        where: { id: slotId },
      });

      // 2. Create Appointment (PENDING_PAYMENT)
      const appointment = await tx.appointment.create({
        data: {
          patientId,
          doctorId: slot.doctorId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: AppointmentStatus.PENDING_PAYMENT,
          appointmentType,
        },
      });

      // 3. Create Culqi Order
      const user = await tx.user.findUniqueOrThrow({ where: { id: patientId } });
      const orderDescription = `Appointment with Doctor for ${slot.startTime.toLocaleString()}`;

      const culqiOrder = await createOrder(
        CONSULTATION_PRICE_CENTS,
        CURRENCY,
        orderDescription,
        user.email,
        { first_name: user.name, last_name: '', email: user.email, phone_number: '999999999' }
      );

      // 4. Persist Payment Record (CREATED)
      await tx.payment.create({
        data: {
          appointmentId: appointment.id,
          provider: PaymentProvider.CULQI,
          providerReference: culqiOrder.id, // ID from Culqi
          amount: CONSULTATION_PRICE_CENTS,
          currency: CURRENCY,
          status: PaymentStatus.CREATED,
        },
      });

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          entity: 'Appointment',
          entityId: appointment.id,
          action: 'BOOKING_INITIATED',
          actorId: patientId,
          metadata: { slotId, orderId: culqiOrder.id },
        },
      });

      return {
        success: true,
        orderId: culqiOrder.id,
        appointmentId: appointment.id,
        culqiPublicKey: process.env.CULQI_PUBLIC_KEY || 'pk_test_mock',
      };
    });
  } catch (error: any) {
    console.error('Booking failed:', error);
    return { success: false, message: error.message || 'Booking failed.' };
  }
}
