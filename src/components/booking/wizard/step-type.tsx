'use client';

import { Monitor, MapPin } from 'lucide-react';

interface StepTypeProps {
  onSelect: (type: 'virtual' | 'in-person') => void;
}

export function StepType({ onSelect }: StepTypeProps) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-slate-900">¿Cómo le gustaría ver al doctor?</h2>
      <p className="text-slate-600">Elija el tipo de cita que prefiera.</p>
      
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <button
          onClick={() => onSelect('virtual')}
          className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-slate-200 hover:border-[#c8a882] hover:bg-slate-50 transition-all duration-300"
        >
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Monitor className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Consulta Virtual</h3>
          <p className="text-slate-500 text-sm">Video llamada desde la comodidad de su hogar.</p>
        </button>

        <button
          onClick={() => onSelect('in-person')}
          className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-slate-200 hover:border-[#c8a882] hover:bg-slate-50 transition-all duration-300"
        >
          <div className="h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="h-8 w-8 text-teal-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Visita Presencial</h3>
          <p className="text-slate-500 text-sm">Visítenos en nuestro centro médico.</p>
        </button>
      </div>
    </div>
  );
}
