'use client';

import { useState } from 'react';
import { DoctorWithUser } from './booking-wizard';
import { Search, Star, User } from 'lucide-react';
import { Input } from '@/components/ui/core';

interface StepDoctorSearchProps {
  doctors: DoctorWithUser[];
  onSelect: (doctor: DoctorWithUser) => void;
}

export function StepDoctorSearch({ doctors, onSelect }: StepDoctorSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = searchTerm
    ? doctors.filter((doc) =>
        doc.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Mock favorite doctors (in a real app, this would come from user profile/history)
  const favorites = doctors.slice(0, 2); 

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Encuentre su Doctor</h2>
        <p className="text-slate-600">Busque por nombre o elija de sus favoritos.</p>
      </div>

      <div className="relative max-w-lg mx-auto">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <Input
          type="text"
          placeholder="Escriba el nombre del doctor..."
          className="pl-10 h-12 text-lg rounded-xl border-slate-300 focus:ring-accent focus:border-accent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {searchTerm ? (
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
          {filteredDoctors.length === 0 && (
            <p className="text-center text-slate-500 py-4">No se encontraron doctores que coincidan con &quot;{searchTerm}&quot;</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Sugeridos y Favoritos
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {favorites.map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelect(doc)}
                className="cursor-pointer flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#c8a882] hover:shadow-md transition-all group"
              >
                <div className="h-12 w-12 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-400" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{doc.user.name}</h4>
                  <p className="text-sm text-slate-500">{doc.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
