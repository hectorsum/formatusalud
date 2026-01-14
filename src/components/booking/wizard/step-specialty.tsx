'use client';

import { useState } from 'react';
import { DoctorWithUser } from './booking-wizard';
import { User } from 'lucide-react';

interface StepSpecialtyProps {
  doctors: DoctorWithUser[];
  onSelect: (doctor: DoctorWithUser) => void;
}

export function StepSpecialty({ doctors, onSelect }: StepSpecialtyProps) {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null);

  const specialties = Array.from(new Set(doctors.map((d) => d.specialty)));

  const filteredDoctors = selectedSpecialty
    ? doctors.filter((d) => d.specialty === selectedSpecialty)
    : [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Seleccione una Especialidad</h2>
        <p className="text-slate-600">Elija el tipo de especialista que necesita.</p>
      </div>

      {!selectedSpecialty ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className="p-4 rounded-xl border border-slate-200 hover:border-[#c8a882] hover:bg-slate-50 transition-all text-left font-medium text-slate-800"
            >
              {spec}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="text-lg font-semibold text-slate-900">Doctores en {selectedSpecialty}</h3>
             <button onClick={() => setSelectedSpecialty(null)} className="text-sm text-teal-600 hover:underline">Cambiar Especialidad</button>
          </div>
         
          <div className="grid md:grid-cols-2 gap-4">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelect(doc)}
                className="cursor-pointer flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all group"
              >
                <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-teal-50 transition-colors">
                  <User className="w-6 h-6 text-slate-500 group-hover:text-teal-600" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{doc.user.name}</h4>
                  <p className="text-sm text-slate-500">{doc.specialty}</p>
                </div>
              </div>
            ))}
          </div>
          {filteredDoctors.length === 0 && (
            <p className="text-center text-slate-500 py-8">No se encontraron doctores para esta especialidad.</p>
          )}
        </div>
      )}
    </div>
  );
}
