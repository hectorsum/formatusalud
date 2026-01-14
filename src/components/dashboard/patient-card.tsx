'use client';

import { useState } from 'react';
import { User, FileText, Mail, Phone } from 'lucide-react';
import { PatientHistoryDialog } from './patient-history-dialog';

interface PatientCardProps {
  patient: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string | null;
  }
}

export function PatientCard({ patient }: PatientCardProps) {
  const [openHistory, setOpenHistory] = useState(false);

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all group">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-[#0c2340] group-hover:bg-[#0c2340] group-hover:text-white transition-colors">
            <User className="w-6 h-6" />
          </div>
          <button 
             onClick={() => setOpenHistory(true)}
             className="text-slate-400 hover:text-[#c8a882]"
          >
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
          {patient.phoneNumber ? (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4 text-[#c8a882]" />
              <span>{patient.phoneNumber}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-400 italic">
              <Phone className="w-4 h-4" />
              <span>No registrado</span>
            </div>
          )}
        </div>

        <button 
          onClick={() => setOpenHistory(true)}
          className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          Ver Historial
        </button>
      </div>

      <PatientHistoryDialog 
        open={openHistory} 
        onOpenChange={setOpenHistory}
        patientId={patient.id}
        patientName={patient.name}
      />
    </>
  );
}
