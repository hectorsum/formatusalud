import { Navbar } from '@/components/layout/navbar';
import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/core';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await verifySession();
  if (!session) redirect('/login');

  // Fetch appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      patientId: session.userId
    },
    include: {
      doctor: {
        include: {
          user: true, // to get doctor name
        },
      },
      payment: true,
    },
    orderBy: { startTime: 'desc' },
  });

  const now = new Date();
  const upcoming = appointments.filter(a => new Date(a.startTime) >= now);
  const past = appointments.filter(a => new Date(a.startTime) < now);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Appointments</h1>
          <Link href="/book">
            <Button>Book Appointment</Button>
          </Link>
        </div>

        <div className="space-y-12">
          {/* Upcoming */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Upcoming</h2>
            {upcoming.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No upcoming appointments.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((appt) => (
                  <AppointmentCard key={appt.id} appointment={appt} />
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Past History</h2>
            {past.length === 0 ? (
              <p className="text-slate-500">No past appointments.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {past.map((appt) => (
                  <AppointmentCard key={appt.id} appointment={appt} isPast />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function AppointmentCard({ appointment, isPast }: { appointment: any, isPast?: boolean }) {
  const doctorName = appointment.doctor.user.name;
  const date = new Date(appointment.startTime).toLocaleDateString();
  const time = new Date(appointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const status = appointment.status;

  return (
    <div className={`rounded-lg border bg-white p-6 shadow-sm ${isPast ? 'opacity-75' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">Dr. {doctorName}</h3>
          <p className="text-sm text-slate-500">{appointment.doctor.specialty}</p>
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium 
          ${status === 'PAID' || status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
            status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
          {status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-medium">Date:</span> {date}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Time:</span> {time}
        </div>
        {appointment.payment && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span>Amt: {appointment.payment.amount / 100} {appointment.payment.currency}</span>
            <span className="text-slate-400">Ref: {appointment.payment.providerReference.slice(0, 8)}...</span>
          </div>
        )}
      </div>

      {!isPast && status === 'PENDING_PAYMENT' && (
        <div className="mt-4">
          {/* Link to retry payment? or just show pending */}
          <Button size="sm" variant="outline" className="w-full">Pay Now</Button>
        </div>
      )}
    </div>
  );
}
