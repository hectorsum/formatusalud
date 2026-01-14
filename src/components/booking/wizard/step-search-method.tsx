'use client';

import { Stethoscope, UserSearch } from 'lucide-react';

interface StepSearchMethodProps {
  onSelect: (method: 'specialty' | 'medic') => void;
}

export function StepSearchMethod({ onSelect }: StepSearchMethodProps) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-slate-900">¿Cómo desea buscar un doctor?</h2>
      <p className="text-slate-600">Busque por especialidad médica o encuentre un doctor específico.</p>
      
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <button
          onClick={() => onSelect('specialty')}
          className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-slate-200 hover:border-[#c8a882] hover:bg-slate-50 transition-all duration-300"
        >
          <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Stethoscope className="h-8 w-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Por Especialidad</h3>
          <p className="text-slate-500 text-sm">Encuentre expertos en un campo médico específico.</p>
        </button>

        <button
          onClick={() => onSelect('medic')}
          className="group flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-slate-200 hover:border-[#c8a882] hover:bg-slate-50 transition-all duration-300"
        >
          <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <UserSearch className="h-8 w-8 text-orange-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-2">Por Nombre del Doctor</h3>
          <p className="text-slate-500 text-sm">Busque un doctor que ya conoce.</p>
        </button>
      </div>
    </div>
  );
}
