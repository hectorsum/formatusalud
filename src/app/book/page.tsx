import { Navbar } from '@/components/layout/navbar';
import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { BookingClient } from './booking-client';

export default async function BookingPage() {
  const session = await verifySession();
  if (!session) redirect('/login');

  // Fetch active doctors
  const doctors = await prisma.doctor.findMany({
    where: { active: true },
    include: {
      user: true,
    },
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-slate-900 mb-8">Book an Appointment</h1>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
            <BookingClient doctors={doctors} />
          </div>
        </div>
      </main>
    </div>
  );
}
