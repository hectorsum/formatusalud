import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Calendar, Clock, MapPin, Video, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';

export default async function CitasPage() {
  const session = await verifySession();

  if (!session || session.role !== 'PATIENT') {
    redirect('/login');
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId: session.userId },
    include: {
      doctor: {
        include: { user: true }
      },
      payment: true
    },
    orderBy: { startTime: 'desc' }
  });

  const now = new Date();
  const upcoming = appointments.filter(a => new Date(a.startTime) >= now && a.status !== 'CANCELLED');
  const past = appointments.filter(a => new Date(a.startTime) < now && a.status !== 'CANCELLED');
  const cancelled = appointments.filter(a => a.status === 'CANCELLED');

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0c2340]">Mis Citas</h1>
            <p className="text-slate-600">Historial y próximas atenciones</p>
          </div>
          <Link href="/" className="px-6 py-2 bg-[#c8a882] hover:bg-[#b89772] text-white rounded-lg font-bold shadow-md transition">
            Nueva Cita
          </Link>
        </div>

        <div className="space-y-12">
          {/* UPCOMING */}
          <section>
            <h2 className="text-xl font-bold text-[#0c2340] mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#c8a882]" /> Próximas Citas
            </h2>

            {upcoming.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center text-slate-500">
                No tienes citas programadas próximamente.
              </div>
            ) : (
              <div className="grid gap-4">
                {upcoming.map(apt => <AppointmentCard key={apt.id} apt={apt} isUpcoming />)}
              </div>
            )}
          </section>

          {/* PAST */}
          <section>
            <h2 className="text-xl font-bold text-[#0c2340] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-slate-400" /> Historial
            </h2>

            {past.length === 0 ? (
              <div className="text-slate-500 italic text-sm">
                No hay historial de citas.
              </div>
            ) : (
              <div className="grid gap-4 opacity-80">
                {past.map(apt => <AppointmentCard key={apt.id} apt={apt} />)}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

function AppointmentCard({ apt, isUpcoming }: { apt: any, isUpcoming?: boolean }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
      {isUpcoming && <div className="absolute top-0 left-0 w-1 h-full bg-[#c8a882]" />}

      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[#0c2340] font-bold text-lg shrink-0">
          {format(apt.startTime, 'd')}
        </div>
        <div>
          <p className="text-xs font-bold text-[#c8a882] uppercase tracking-wider mb-1">
            {format(apt.startTime, 'MMMM yyyy', { locale: es })}
          </p>
          <h3 className="text-lg font-bold text-[#0c2340]">Dr. {apt.doctor.user.name}</h3>
          <p className="text-slate-600">{apt.doctor.specialty}</p>

          <div className="flex flex-wrap items-center gap-y-2 gap-x-6 mt-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5 align-middle">
              <Clock className="w-4 h-4" /> {format(apt.startTime, 'HH:mm')}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" /> Consultorio 204
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3 min-w-[140px]">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
            apt.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-700' :
              'bg-slate-100 text-slate-700'
          }`}>
          {apt.status === 'PENDING_PAYMENT' ? 'Pendiente Pago' : apt.status}
        </span>

        {isUpcoming && apt.status === 'PENDING_PAYMENT' && (
          <button className="px-4 py-2 bg-[#0c2340] text-white text-sm font-bold rounded-lg hover:bg-slate-800 transition">
            Pagar Ahora
          </button>
        )}
      </div>
    </div>
  )
}
