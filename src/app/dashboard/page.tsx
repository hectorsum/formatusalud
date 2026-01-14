import { Navbar } from '@/components/layout/navbar';
import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/core';
import Link from 'next/link';
import { Role } from '@prisma/client';
import { PaymentModal } from '@/components/dashboard/payment-modal';

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
          <h1 className="text-3xl font-bold text-slate-900">Mis Citas</h1>
          <Link href="/book">
            <Button>Reservar Cita</Button>
          </Link>
        </div>

        <div className="space-y-12">
          {/* Upcoming */}
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Próximas Citas</h2>
            {upcoming.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
                No hay citas próximas.
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
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Historial</h2>
            {past.length === 0 ? (
              <p className="text-slate-500">No hay citas pasadas.</p>
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

import { DiagnosisForm } from '@/components/dashboard/diagnosis-form';
import { MedicalRecordView } from '@/components/dashboard/medical-record-view';

// ... (existing imports)

async function DoctorDashboard({ userId }: { userId: string }) {
  // ... (existing doctor fetch)
  const doctor = await prisma.doctor.findUnique({
    where: { userId },
  });

  if (!doctor) {
     // ... (error view)
     return <div>Error</div>; 
  }

  // 2. Get Appointments for this doctor
  const appointments = await prisma.appointment.findMany({
    where: {
      doctorId: doctor.id
    },
    include: {
      patient: true, 
      payment: true,
      medicalRecord: true, // [NEW] Include record
    },
    orderBy: { startTime: 'asc' }, 
  });

  const now = new Date();
  const upcoming = appointments.filter(a => new Date(a.startTime) >= now);
  const past = appointments.filter(a => new Date(a.startTime) < now);

  // ... (rest of logic)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panel de Doctor</h1>
            <p className="text-slate-500">Bienvenido, Dr. {doctor.specialty}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Gestionar Horarios</Button>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-xl font-semibold text-slate-800">Próximas Citas</h2>
              <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{upcoming.length}</span>
            </div>

            {upcoming.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border text-center text-slate-500">
                No hay reservas de pacientes próximas.
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden border">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Hora</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Paciente</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pago</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Acciones</th>
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
                          <div className="text-xs text-indigo-600 font-medium capitalize mt-1">
                             {appt.appointmentType === 'virtual' ? 'Virtual' : 'Presencial'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={appt.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {appt.payment ? (
                              <span className={appt.payment.status === 'PAID' ? 'text-green-600' : 'text-yellow-600'}>
                                {appt.payment.status === 'PAID' ? 'PAGADO' : 'PENDIENTE'} ({appt.payment.amount / 100} {appt.payment.currency})
                              </span>
                            ) : (
                              <span className="text-slate-400">-</span>
                            )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                          {appt.medicalRecord ? (
                            <MedicalRecordView record={appt.medicalRecord} />
                          ) : (
                            <DiagnosisForm appointmentId={appt.id} patientName={appt.patient.name} />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Citas Pasadas</h2>
            <div className="text-sm text-slate-500">
              Tiene {past.length} citas pasadas.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// ... (rest of file)


function StatusBadge({ status }: { status: string }) {
  const styles = {
    PENDING_PAYMENT: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };
  
  const labels: Record<string, string> = {
    PENDING_PAYMENT: 'PENDIENTE PAGO',
    PAID: 'PAGADO',
    CONFIRMED: 'CONFIRMADO',
    CANCELLED: 'CANCELADO'
  };

  // @ts-ignore
  const className = styles[status] || 'bg-gray-100 text-gray-800';
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {labels[status] || status.replace('_', ' ')}
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
        {/* Status reflects DB status (CONFIRMED after payment) */}
        <StatusBadge status={status} />
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <span className="font-medium">Fecha:</span> {date}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-medium">Hora:</span> {time}
        </div>
        <div className="flex items-center gap-2">
            <span className="font-medium">Tipo:</span> 
            <span className={`capitalize ${appointment.appointmentType === 'virtual' ? 'text-indigo-600 font-semibold' : 'text-slate-600'}`}>
                {appointment.appointmentType === 'virtual' ? 'Consulta Virtual' : 'Visita Presencial'}
            </span>
        </div>
        {appointment.payment && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
            <span>Monto: {appointment.payment.amount / 100} {appointment.payment.currency}</span>
            <span className="text-slate-400">Ref: {appointment.payment.providerReference.slice(0, 8)}...</span>
          </div>
        )}
      </div>

      {!isPast && status === 'PENDING_PAYMENT' && (!appointment.payment || appointment.payment.status !== 'PAID') && (
        <div className="mt-4">
          <PaymentModal 
            appointmentId={appointment.id} 
            amount={100} // Default simulation amount
            currency="PEN"
            doctorName={doctorName}
          />
        </div>
      )}
    </div>
  );
}
