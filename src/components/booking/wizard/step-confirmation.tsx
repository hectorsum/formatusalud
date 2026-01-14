'use client';

import { useState } from 'react';
import { bookAppointment } from '@/actions/appointment';
import { WizardState } from './booking-wizard';
import { Button } from '@/components/ui/core';
import { Calendar, Clock, MapPin, Monitor, User, AlertCircle, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface StepConfirmationProps {
  state: WizardState;
  onRestart: () => void;
}

export function StepConfirmation({ state, onRestart }: StepConfirmationProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'booking' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState<string | null>(null);

  const { selectedDoctor, selectedSlot, appointmentType } = state;

  if (!selectedDoctor || !selectedSlot) return null;

  const dateStr = new Date(selectedSlot.startTime).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  const timeStr = new Date(selectedSlot.startTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleConfirm = async () => {
    setStatus('booking');
    try {
      const result = await bookAppointment(selectedSlot.id, appointmentType || 'in-person');
      if (result.success) {
        setStatus('success');
        setOrderId(result.orderId || 'N/A');
      } else {
        setStatus('error');
        setErrorMessage(result.message || 'Booking failed');
      }
    } catch (err: unknown) {
      // Safely handle error of unknown type
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setStatus('error');
      setErrorMessage(message);
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center space-y-6 py-8">
        <div className="mx-auto h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900">¡Cita Confirmada!</h2>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-md mx-auto text-left">
           <p className="text-sm text-slate-500 mb-2">ID de Orden</p>
           <p className="font-mono text-lg font-bold text-slate-900">{orderId}</p>
        </div>
        <p className="text-slate-600 max-w-md mx-auto">
          Su cita ha sido reservada con éxito. Por favor complete su pago dentro de las 24 horas para asegurar su espacio.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button onClick={() => router.push('/dashboard')}>Ir al Panel</Button>
          <Button variant="outline" onClick={onRestart}>Reservar Otra</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Confirmar Cita</h2>
        <p className="text-slate-600">Por favor revise los detalles de su cita.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-white border border-slate-200 flex items-center justify-center">
             <User className="h-6 w-6 text-slate-500" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">Dr. {selectedDoctor.user.name}</h3>
            <p className="text-slate-500">{selectedDoctor.specialty}</p>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-teal-600 mt-1" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Fecha</p>
                <p className="text-slate-600">{dateStr}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-teal-600 mt-1" />
              <div>
                <p className="text-sm font-semibold text-slate-900">Hora</p>
                <p className="text-slate-600">{timeStr}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              {appointmentType === 'virtual' ? <Monitor className="w-5 h-5 text-indigo-600 mt-1" /> : <MapPin className="w-5 h-5 text-indigo-600 mt-1" />}
              <div>
                <p className="text-sm font-semibold text-slate-900">Tipo</p>
                <p className="text-slate-600 capitalize">Consulta {appointmentType === 'virtual' ? 'Virtual' : 'Presencial'}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100 flex gap-3 text-yellow-800 text-sm">
             <AlertCircle className="w-5 h-5 shrink-0" />
             <p>Esta reserva solo será válida por <strong>24 horas</strong> pendiente de pago. Después de eso, será cancelada automáticamente.</p>
          </div>
          
          {status === 'error' && (
             <div className="bg-red-50 rounded-lg p-4 border border-red-100 text-red-700 text-sm">
               Error: {errorMessage}
             </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onRestart}
          disabled={status === 'booking'}
        >
          Cancelar
        </Button>
        <Button 
          className="flex-1 bg-teal-600 hover:bg-teal-700"
          onClick={handleConfirm}
          disabled={status === 'booking'}
        >
          {status === 'booking' ? 'Reservando...' : 'Confirmar Cita'}
        </Button>
      </div>
    </div>
  );
}
