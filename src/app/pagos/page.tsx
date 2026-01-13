import { verifySession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CreditCard, CheckCircle, AlertCircle } from 'lucide-react';

export default async function PagosPage() {
  const session = await verifySession();

  if (!session || session.role !== 'PATIENT') {
    redirect('/login');
  }

  const payments = await prisma.payment.findMany({
    where: {
      appointment: {
        patientId: session.userId
      }
    },
    include: {
      appointment: {
        include: {
          doctor: {
            include: { user: true }
          }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold text-[#0c2340] mb-2">Historial de Pagos</h1>
        <p className="text-slate-600 mb-8">Registro de transacciones realizadas</p>

        {payments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center text-slate-500">
            <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            No tienes pagos registrados.
          </div>
        ) : (
          <div className="bg-white text-slate-900 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                <tr>
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Concepto</th>
                  <th className="p-4">Monto</th>
                  <th className="p-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 whitespace-nowrap">
                      <div className="font-medium text-[#0c2340]">
                        {format(payment.createdAt, 'd MMM yyyy', { locale: es })}
                      </div>
                      <div className="text-xs text-slate-500">
                        {format(payment.createdAt, 'HH:mm')}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-[#0c2340]">Cita Médica</div>
                      <div className="text-xs text-slate-500">
                        Dr. {payment.appointment.doctor.user.name} - {payment.appointment.doctor.specialty}
                      </div>
                    </td>
                    <td className="p-4 font-mono text-sm font-medium text-slate-700">
                      S/ {(payment.amount / 100).toFixed(2)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${payment.status === 'PAID' ? 'bg-green-100 text-green-700' :
                        payment.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                        {payment.status === 'PAID' && <CheckCircle className="w-3 h-3" />}
                        {payment.status === 'FAILED' && <AlertCircle className="w-3 h-3" />}
                        {payment.status === 'CREATED' ? 'PENDIENTE' : payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
