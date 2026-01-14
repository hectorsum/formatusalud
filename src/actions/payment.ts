'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function simulatePayment(appointmentId: string) {
  try {
    // 1. Validate appointment existence
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        payment: true,
      }
    });

    if (!appointment) {
      return { success: false, error: 'Appointment not found' };
    }

    if (appointment.status === 'CONFIRMED' || appointment.status === 'PAID') {
      return { success: false, error: 'Appointment already paid' };
    }

    // 2. Create or Update Payment Record (Simulated)
    await prisma.payment.upsert({
      where: {
        appointmentId: appointment.id,
      },
      create: {
        appointmentId: appointment.id,
        amount: 10000, // 100.00 PEN in cents
        currency: 'PEN',
        status: 'PAID',
        provider: 'CULQI', // Using CULQI as provider even if simulated
        providerReference: `sim_${Math.random().toString(36).substring(7)}`,
        paidAt: new Date(),
      },
      update: {
        status: 'PAID',
        paidAt: new Date(),
        // Keep original provider/amount if they exist, or update them?
        // For simulation, let's trust the original amount or update status only.
        // But to be safe for this simulation feature:
        providerReference: `sim_${Math.random().toString(36).substring(7)}`, 
      }
    });

    // 3. Update Appointment Status
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CONFIRMED', 
      }
    });

    // 4. Revalidate
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Payment simulation error:', error);
    return { success: false, error: 'Failed to process payment' };
  }
}
