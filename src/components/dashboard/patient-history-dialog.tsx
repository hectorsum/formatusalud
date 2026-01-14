'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { getPatientHistory } from '@/actions/medical-record';
import { Loader2, Calendar, FileText, Pill } from 'lucide-react';
import { MedicalRecordView } from './medical-record-view';

interface PatientHistoryDialogProps {
  patientId: string;
  patientName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PatientHistoryDialog({ 
  patientId, 
  patientName, 
  open, 
  onOpenChange 
}: PatientHistoryDialogProps) {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (open && patientId) {
      setLoading(true);
      getPatientHistory(patientId)
        .then((result) => {
          if (result.success) {
            setHistory(result.data || []);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [open, patientId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial Médico - {patientName}</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
          ) : history.length === 0 ? (
            <p className="text-center text-slate-500 py-8">No se encontraron registros previos.</p>
          ) : (
            <div className="space-y-6 relative border-l border-slate-200 ml-3 pl-6 py-2">
              {history.map((appt) => (
                <div key={appt.id} className="relative mb-8 last:mb-0">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white ring-2 ring-slate-200 bg-teal-500"></div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(appt.startTime).toLocaleDateString()}
                      <span className="text-slate-400 font-normal ml-1">
                         {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      appt.appointmentType === 'virtual' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {appt.appointmentType === 'virtual' ? 'Virtual' : 'Presencial'}
                    </span>
                  </div>

                  {appt.medicalRecord ? (
                    <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                      <div className="mb-2">
                         <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                            <FileText className="w-4 h-4 text-teal-600" />
                            Diagnóstico:
                         </h4>
                         <p className="text-sm text-slate-700 mt-1 pl-6">{appt.medicalRecord.diagnosis}</p>
                      </div>
                      
                      {appt.medicalRecord.prescription && (
                         <div className="mt-3 pt-3 border-t border-slate-200">
                             <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                <Pill className="w-4 h-4 text-blue-500" />
                                Receta:
                             </h4>
                             <p className="text-sm text-slate-600 mt-1 pl-6">{appt.medicalRecord.prescription}</p>
                         </div>
                      )}

                      {appt.medicalRecord.notes && (
                        <div className="mt-2 pl-6 text-xs text-slate-500 italic">
                            Nota: {appt.medicalRecord.notes}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm text-slate-400 italic bg-gray-50 p-3 rounded border border-dashed border-gray-200">
                       Sin registro médico.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
