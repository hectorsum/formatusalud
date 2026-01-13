import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Calendar, Clock, MapPin, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function AgendaPage() {
  const session = await verifySession();

  if (!session || session.role !== 'DOCTOR') {
    redirect('/login');
  }

  // Fetch Doctor Profile
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.userId },
    include: {
      appointments: {
        include: { patient: true },
        orderBy: { startTime: 'asc' },
        where: {
          startTime: {
            gte: new Date(), // Future appointments
          }
        }
      }
    }
  });

  if (!doctor) {
    return <div className="p-8 text-center">Perfil de médico no encontrado.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0c2340]">Mi Agenda</h1>
            <p className="text-slate-600">Próximas citas programadas</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200 text-sm font-medium text-slate-600">
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
          </div>
        </div>

        {doctor.appointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-slate-900 mb-2">No hay citas programadas</h3>
            <p className="text-slate-500">No tienes citas pendientes para los próximos días.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {doctor.appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-[#c8a882]/10 p-3 rounded-lg">
                    <Calendar className="w-6 h-6 text-[#c8a882]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0c2340] mb-1">{apt.patient.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {format(apt.startTime, 'HH:mm')} - {format(apt.endTime, 'HH:mm')}
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <Calendar className="w-4 h-4" />
                        {format(apt.startTime, 'EEEE d MMM', { locale: es })}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${apt.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                          apt.status === 'PENDING_PAYMENT' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-slate-100 text-slate-700'
                        }`}>
                        {apt.status === 'PENDING_PAYMENT' ? 'Pendiente Pago' : apt.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  <button className="px-4 py-2 text-sm font-medium text-[#0c2340] bg-slate-100 hover:bg-slate-200 rounded-lg transition">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
