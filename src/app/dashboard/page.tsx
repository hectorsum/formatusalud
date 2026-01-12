import { Navbar } from '@/components/layout/navbar';
import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/core';
import Link from 'next/link';
import { Role } from '@prisma/client';

export default async function DashboardPage() {
  const session = await verifySession();
  if (!session) redirect('/login');

  if (session.role === Role.DOCTOR) {
    return <DoctorDashboard userId={session.userId} />;
  }

  // PATIENT VIEW (Default)
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

// --- Components ---

async function DoctorDashboard({ userId }: { userId: string }) {
  // 1. Get Doctor Profile
  const doctor = await prisma.doctor.findUnique({
    where: { userId },
  });

  if (!doctor) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p>Doctor profile not found for this user.</p>
        <Link href="/" className="text-blue-600 underline">Go Home</Link>
      </div>
    );
  }

  // 2. Get Appointments for this doctor
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id
    },
    include: {
      patient: true, // Get patient details
      payment: true,
    },
    orderBy: { startTime: 'asc' }, // Nearest first
  });

  const now = new Date();
  // Filter for clarity
  const upcoming = appointments.filter(a => new Date(a.startTime) >= now);
  const past = appointments.filter(a => new Date(a.startTime) < now);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Doctor Dashboard</h1>
            <p className="text-slate-500">Welcome, Dr. {doctor.specialty}</p>
          </div>
          <div className="flex gap-2">
            {/* Future: Add 'Manage Slots' button here */}
            <Button variant="outline">Manage Schedule</Button>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Upcoming Appointments</h2>
              <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{upcoming.length}</span>
            </div>

            {upcoming.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border text-center text-slate-500">
                No upcoming patient bookings.
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden border">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {upcoming.map((appt) => (
                      <tr key={appt.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="font-semibold">{new Date(appt.startTime).toLocaleDateString()}</div>
                          <div className="text-slate-500">{new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          <div className="font-medium">{appt.patient.name}</div>
                          <div className="text-slate-500 text-xs">{appt.patient.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={appt.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {appt.payment ? (
                            <span className={appt.payment.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>
                              {appt.payment.status} ({appt.payment.amount / 100} {appt.payment.currency})
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Past List (Collapsed or simple list) */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Past Appointments</h2>
            <div className="text-sm text-slate-500">
              You have {past.length} past appointments.
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  // @ts-ignore
  const className = styles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {status.replace('_', ' ')}
    </span>
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
        <StatusBadge status={status} />
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
          <Button size="sm" variant="outline" className="w-full">Pay Now</Button>
        </div>
      )}
    </div>
  );
}
