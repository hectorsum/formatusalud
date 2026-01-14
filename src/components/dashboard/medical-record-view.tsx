'use client';

import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/core";
import { FileText, Stethoscope, Pill, Info } from 'lucide-react';

interface MedicalRecordViewProps {
  record: {
    diagnosis: string;
    symptoms?: string | null;
    prescription?: string | null;
    notes?: string | null;
    type: string;
    createdAt: Date;
  };
}

export function MedicalRecordView({ record }: MedicalRecordViewProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="w-4 h-4" />
          Ver Historia
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Historia Cínica / Diagnóstico</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          
          <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <div className="bg-blue-100 p-2 rounded-full h-fit">
              <Stethoscope className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 text-sm">Diagnóstico Principal</h4>
              <p className="text-slate-700 mt-1 font-medium">{record.diagnosis}</p>
              <div className="mt-2 text-xs text-slate-500 uppercase font-semibold tracking-wider">
                Tipo: {record.type}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {record.symptoms && (
               <div className="border border-slate-200 rounded-lg p-4">
                 <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                   <Info className="w-4 h-4 text-slate-400" /> Síntomas
                 </h4>
                 <p className="text-sm text-slate-600">{record.symptoms}</p>
               </div>
            )}
            
            {record.prescription && (
               <div className="border border-slate-200 rounded-lg p-4">
                 <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2 mb-2">
                   <Pill className="w-4 h-4 text-slate-400" /> Receta / Tratamiento
                 </h4>
                 <p className="text-sm text-slate-600 whitespace-pre-line">{record.prescription}</p>
               </div>
            )}
          </div>

          {record.notes && (
             <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 text-sm text-yellow-900">
               <span className="font-semibold block mb-1">Notas / Observaciones:</span>
               {record.notes}
             </div>
          )}
          
          <div className="text-xs text-slate-400 text-right pt-4 border-t">
            Registrado el: {new Date(record.createdAt).toLocaleDateString()}
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
