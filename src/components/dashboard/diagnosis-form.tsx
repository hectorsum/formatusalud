'use client';

import { useState } from 'react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/core"; 
import { PlusCircle, Loader2 } from 'lucide-react';
import { createMedicalRecord } from '@/actions/medical-record';

export function DiagnosisForm({ appointmentId, patientName }: { appointmentId: string, patientName: string }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    diagnosis: '',
    symptoms: '',
    prescription: '',
    notes: '',
    type: 'CONSULTATION'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await createMedicalRecord({
        appointmentId,
        ...formData
      });
      
      if (res.success) {
        setOpen(false);
        // Toast or refresh handled by next's action/state ideally, 
        // but here we rely on revalidatePath from server action
      } else {
        alert(res.message);
      }
    } catch (error) {
       console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
          <PlusCircle className="w-4 h-4" />
          Diagnosticar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Atención - {patientName}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Atención</label>
              <select 
                name="type" 
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="CONSULTATION">Consulta Médica</option>
                <option value="CHECKUP">Control / Chequeo</option>
                <option value="EMERGENCY">Emergencia / Urgencia</option>
                <option value="PROCEDURE">Procedimiento</option>
              </select>
            </div>

            <div className="col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Diagnóstico Principal *</label>
               <input 
                 required
                 name="diagnosis"
                 value={formData.diagnosis}
                 onChange={handleChange}
                 placeholder="Ej. Bronquitis Aguda"
                 className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>

            <div className="col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Síntomas / Motivo</label>
               <textarea 
                 rows={2}
                 name="symptoms"
                 value={formData.symptoms}
                 onChange={handleChange}
                 placeholder="Ej. Tos persistente, fiebre leve..."
                 className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
               />
            </div>

            <div className="col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Receta / Tratamiento</label>
               <textarea 
                 rows={3}
                 name="prescription"
                 value={formData.prescription}
                 onChange={handleChange}
                 placeholder="Medicamentos, dosis, duración..."
                 className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
               />
            </div>

            <div className="col-span-2">
               <label className="block text-sm font-medium text-slate-700 mb-1">Notas Internas</label>
               <textarea 
                 rows={2}
                 name="notes"
                 value={formData.notes}
                 onChange={handleChange}
                 placeholder="Observaciones para el próximo control..."
                 className="w-full rounded-md border border-slate-300 p-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-yellow-50"
               />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]">
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Historia'}
            </Button>
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}
