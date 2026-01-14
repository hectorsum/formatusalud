'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/core';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { simulatePayment } from '@/actions/payment';

interface PaymentModalProps {
  appointmentId: string;
  amount: number;
  currency: string;
  doctorName: string;
}

export function PaymentModal({ appointmentId, amount, currency, doctorName }: PaymentModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await simulatePayment(appointmentId);
      if (!result.success) {
        setError(result.error || 'Error al procesar el pago');
      } else {
        setOpen(false);
      }
    } catch (err) {
      setError('Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="w-full">
          Pagar Ahora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Realizar Pago</DialogTitle>
        </DialogHeader>

        <form onSubmit={handlePayment} className="space-y-4 py-4">
          <div className="bg-slate-50 p-4 rounded-lg text-sm text-slate-600 mb-4">
            <p><span className="font-semibold">Doctor:</span> {doctorName}</p>
            <p><span className="font-semibold">Monto a pagar:</span> {amount} {currency}</p>
          </div>

          <div className="space-y-3">
             <div className="space-y-1">
              <label className="text-sm font-medium">Número de Tarjeta (Simulado)</label>
              <input 
                type="text" 
                placeholder="0000 0000 0000 0000"
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha Exp.</label>
                <input 
                  type="text" 
                  placeholder="MM/YY"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">CVV</label>
                <input 
                  type="text" 
                  placeholder="123"
                  className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              {loading ? 'Procesando...' : `Pagar ${amount} ${currency}`}
            </Button>
          </div>
          
          <p className="text-xs text-center text-slate-400 mt-2">
            Modo Simulación: No se realizar&aacute; ningún cobro real.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
