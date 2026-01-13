import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { User, Search, Phone, Mail, FileText } from 'lucide-react';

export default async function PacientesPage() {
  const session = await verifySession();

  if (!session || session.role !== 'DOCTOR') {
    redirect('/login');
  }

  // Fetch unique patients from doctor's appointments
  // Since Prisma distinct is basic, we'll fetch appointments and group or use distinct
  const doctor = await prisma.doctor.findUnique({
    where: { userId: session.userId },
  });

  if (!doctor) return <div>Perfil no encontrado</div>;

  const patients = await prisma.appointment.findMany({
    where: { doctorId: doctor.id },
    select: {
      patient: true
    },
    distinct: ['patientId'] // Get unique patients
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0c2340]">Mis Pacientes</h1>
            <p className="text-slate-600">Historial de pacientes atendidos</p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-[#c8a882] outline-none w-full md:w-64"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {patients.map(({ patient }) => (
            <div key={patient.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[#0c2340] group-hover:bg-[#0c2340] group-hover:text-white transition-colors">
                  <User className="w-6 h-6" />
                </div>
                <button className="text-slate-400 hover:text-[#c8a882]">
                  <FileText className="w-5 h-5" />
                </button>
              </div>

              <h3 className="text-lg font-bold text-[#0c2340] mb-1">{patient.name}</h3>
              <p className="text-xs text-slate-500 mb-4 uppercase tracking-wider">Paciente</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Mail className="w-4 h-4 text-[#c8a882]" />
                  <span className="truncate">{patient.email}</span>
                </div>
                {patient.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Phone className="w-4 h-4 text-[#c8a882]" />
                    <span>{patient.phoneNumber}</span>
                  </div>
                )}
                {!patient.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-slate-400 italic">
                    <Phone className="w-4 h-4" />
                    <span>No registrado</span>
                  </div>
                )}
              </div>

              <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition">
                Ver Historial
              </button>
            </div>
          ))}

          {patients.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">
              No tienes pacientes registrados aún.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
