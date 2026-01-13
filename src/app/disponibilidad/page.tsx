import { verifySession } from '@/lib/session';
import { Navbar } from '@/components/layout/navbar';
import { redirect } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import AvailabilityManager from './availability-manager';
import { getSlotsForDate } from '@/actions/availability';

export default async function DisponibilidadPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const session = await verifySession();

  if (!session || session.role !== 'DOCTOR') {
    redirect('/login');
  }

  // Await searchParams in Next.js 15+
  const params = await searchParams;
  const dateStr = params.date || new Date().toISOString().split('T')[0];
  const slots = await getSlotsForDate(dateStr);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0c2340]">Gestión de Disponibilidad</h1>
          <p className="text-slate-600">Configura tus horarios de atención para que los pacientes puedan reservar.</p>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3 mb-8">
          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-orange-800 text-sm">Modo de Edición</h4>
            <p className="text-sm text-orange-700">
              Los cambios que realices aquí se reflejarán inmediatamente en el portal de pacientes.
              Asegúrate de no eliminar horarios donde ya tengas citas confirmadas.
            </p>
          </div>
        </div>

        <AvailabilityManager initialSlots={slots} dateStr={dateStr} />

      </main>
    </div>
  );
}
