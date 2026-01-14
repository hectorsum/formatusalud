import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AppointmentStatus, PaymentStatus } from '@prisma/client';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // TODO: Verify signature using process.env.CULQI_WEBHOOK_SECRET
    // const signature = req.headers.get('x-culqi-signature');

    // Log for debugging
    console.log('Culqi Webhook Received:', JSON.stringify(body, null, 2));

    const { type, data } = body;

    // Handle 'order.status.changed' -> 'paid'
    // Or 'charge.creation.succeeded' depending on Culqi configuration
    // We'll assume order-based flow as per plan
    if (type === 'order.status.changed' && data.state === 'paid') {
      const orderId = data.id;

      await prisma.$transaction(async (tx) => {
        const payment = await tx.payment.findFirst({
          where: { providerReference: orderId },
        });

        if (!payment) {
          console.error(`Payment not found for order ${orderId}`);
          return;
        }

        if (payment.status === PaymentStatus.PAID) {
          return; // Already processed
        }

        // 1. Update Payment
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.PAID,
            paidAt: new Date(),
          },
        });

        // 2. Update Appointment
        await tx.appointment.update({
          where: { id: payment.appointmentId },
          data: {
            status: AppointmentStatus.PAID, // Prompt said PAID, could be CONFIRMED
          },
        });

        // 3. Audit Log
        await tx.auditLog.create({
          data: {
            entity: 'Payment',
            entityId: payment.id,
            action: 'WEBHOOK_PAYMENT_SUCCESS',
            actorId: null, // System
            metadata: { eventId: body.id, orderId },
          },
        });
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return new NextResponse('Webhook Handler Failed', { status: 500 });
  }
}
