import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';import { User, Search, Phone, Mail, FileText } from 'lucide-react';
import { PatientCard } from '@/components/dashboard/patient-card';

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
            <PatientCard key={patient.id} patient={patient} />
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
