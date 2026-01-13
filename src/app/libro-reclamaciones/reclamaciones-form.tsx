'use client'

import { useActionState, useState } from 'react';
import { useFormState, } from 'react-dom';
import { Button, Input } from '@/components/ui/core';
import { submitClaim } from '@/actions/claims';
import { Check, Upload, AlertCircle, Trash2, FileText, Paperclip, Image as ImageIcon } from 'lucide-react';

// Initial state for server action
const initialState = {
  message: '',
  errors: {},
  success: false
};

export default function ReclamacionesForm() {
  const [state, dispatch] = useActionState(submitClaim, initialState);
  const [claimType, setClaimType] = useState<'CLAIM' | 'COMPLAINT'>('CLAIM');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // File Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 3 * 1024 * 1024; // 3MB
      return isValidType && isValidSize;
    });

    if (validFiles.length < newFiles.length) {
      alert("Algunos archivos no fueron agregados por formato incorrecto o peso mayor a 3MB.");
    }

    setFiles(prev => {
      const updated = [...prev, ...validFiles].slice(0, 4); // Max 4
      updateHiddenInput(updated);
      return updated;
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      updateHiddenInput(updated);
      return updated;
    });
  };

  // Sync state with hidden input for standard form submission
  const updateHiddenInput = (currentFiles: File[]) => {
    const dataTransfer = new DataTransfer();
    currentFiles.forEach(file => dataTransfer.items.add(file));

    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.files = dataTransfer.files;
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">

      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#0c2340] mb-4">Libro de Reclamaciones</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">
          Conforme a lo establecido en el Código de Protección y Defensa del Consumidor este establecimiento cuenta con un Libro de Reclamaciones a su disposición.
        </p>
      </div>

      {state?.success ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-[#0c2340] mb-4">¡Registrado Correctamente!</h2>
          <p className="text-lg text-slate-600 mb-8">
            Su hoja de reclamación ha sido enviada con éxito. Hemos enviado una copia de los detalles a su correo electrónico.
          </p>
          <Button onClick={() => window.location.href = '/'} className="bg-[#0c2340] text-white px-8">
            Volver al Inicio
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
          <form action={dispatch}>
            {/* 1. Datos del Usuario */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#0c2340] mb-6 border-b pb-2">1. Identificación del Consumidor Reclamante</h2>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre*</label>
                  <Input name="firstName" placeholder="Ingrese nombres" required />
                  {state?.errors?.firstName && <p className="text-red-500 text-xs mt-1">{state.errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Apellido Paterno*</label>
                  <Input name="paternalSurname" placeholder="Apellido paterno" required />
                  {state?.errors?.paternalSurname && <p className="text-red-500 text-xs mt-1">{state.errors.paternalSurname}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Apellido Materno*</label>
                  <Input name="maternalSurname" placeholder="Apellido materno" required />
                  {state?.errors?.maternalSurname && <p className="text-red-500 text-xs mt-1">{state.errors.maternalSurname}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tipo de Documento*</label>
                  <select name="documentType" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#c8a882] focus:border-transparent outline-none bg-white transition-all text-slate-700" required>
                    <option value="DNI">DNI</option>
                    <option value="CE">Carnet de Extranjería</option>
                    <option value="PASSPORT">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Número de Documento*</label>
                  <Input name="documentNumber" placeholder="Nro de documento" required />
                  {state?.errors?.documentNumber && <p className="text-red-500 text-xs mt-1">{state.errors.documentNumber}</p>}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email*</label>
                  <Input name="email" type="email" placeholder="correo@ejemplo.com" required />
                  {state?.errors?.email && <p className="text-red-500 text-xs mt-1">{state.errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Celular*</label>
                  <Input name="cellphone" placeholder="999 999 999" required />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Dirección*</label>
                  <Input name="address" placeholder="Av. Principal 123" required />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Distrito*</label>
                    <Input name="district" placeholder="San Isidro" required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Departamento*</label>
                    <Input name="department" placeholder="Lima" required />
                  </div>
                </div>
              </div>
            </div>


            {/* 2. Detalle del Reclamo */}
            <div className="mb-10">
              <h2 className="text-2xl font-bold text-[#0c2340] mb-6 border-b pb-2">2. Detalle del Reclamo</h2>

              <input type="hidden" name="claimType" value={claimType} />

              <div className="flex gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
                <button
                  type="button"
                  onClick={() => setClaimType('CLAIM')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold border transition-all ${claimType === 'CLAIM' ? 'bg-[#0c2340] text-white border-[#0c2340]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#0c2340]'}`}
                >
                  Reclamo
                  <span className="block text-[10px] font-normal mt-1 opacity-80">Disconformidad con el servicio</span>
                </button>
                <button
                  type="button"
                  onClick={() => setClaimType('COMPLAINT')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold border transition-all ${claimType === 'COMPLAINT' ? 'bg-[#0c2340] text-white border-[#0c2340]' : 'bg-white text-slate-500 border-slate-200 hover:border-[#0c2340]'}`}
                >
                  Queja
                  <span className="block text-[10px] font-normal mt-1 opacity-80">Malestar por atención al público</span>
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-1">Afectado*</label>
                <select name="affectedPersonType" className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#c8a882] focus:border-transparent outline-none bg-white" required>
                  <option value="PATIENT">Paciente (Yo mismo)</option>
                  <option value="THIRD_PARTY">Tercero (Familiar/Otro)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Detalle del {claimType === 'CLAIM' ? 'Reclamo' : 'Queja'}*</label>
                <textarea
                  name="claimDetail"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#c8a882] focus:border-transparent outline-none resize-none"
                  placeholder="Describa los hechos detalladamente..."
                  required
                ></textarea>
                {state?.errors?.claimDetail && <p className="text-red-500 text-xs mt-1">{state.errors.claimDetail}</p>}
              </div>
            </div>

            {/* 3. Archivos Attachments */}
            <div className="mb-10">
              <h2 className="text-lg font-bold text-[#0c2340] mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" /> Adjuntar Archivos (Opcional)
              </h2>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${isDragging ? 'border-[#c8a882] bg-[#c8a882]/10' : 'border-slate-300 hover:bg-slate-50'
                  }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <div className="flex flex-col items-center justify-center gap-2">
                  <p className="text-sm text-slate-500 font-medium">Haga clic o arrastre archivos aquí</p>
                  <p className="text-xs text-slate-400">Máximo 4 archivos (png, jpg, pdf). Máx 3MB c/u.</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  name="files" // Important: matches the server action receipt
                  className="hidden"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf"
                  onChange={handleFileSelect}
                />
              </div>

              {/* File List Preview */}
              {files.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-bold text-[#0c2340] flex items-center gap-2">
                    <Paperclip className="w-4 h-4" /> Archivos adjuntos
                  </h3>
                  <div className="grid gap-3">
                    {files.map((file, index) => (
                      <div key={`${file.name}-${index}`} className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            {file.type.includes('pdf') ? (
                              <FileText className="w-5 h-5 text-red-500" />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-[#c8a882]" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                            <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>


            {/* 4. Terms */}
            <div className="mb-8 bg-slate-50 p-6 rounded-xl text-sm text-slate-600">
              <label className="flex items-start gap-3 cursor-pointer mb-4">
                <input type="checkbox" name="terms_confirm" className="mt-1 w-4 h-4 rounded border-slate-300 text-[#c8a882] focus:ring-[#c8a882]" required />
                <span>
                  <strong>Cláusula informativa:</strong> Estoy de acuerdo con lo ingresado en esta hoja de reclamaciones y así mismo confirmo que los datos son tomados como firma de esta solicitud.
                </span>
              </label>

              <div className="flex items-start gap-3 p-4 bg-teal-50 border border-teal-100 rounded-lg text-teal-800">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  Las IAFAS, IPRESS o UGIPRESS deben atender el reclamo en un plazo de 30 días hábiles. "Estimado Usuario: usted puede presentar su queja ante SUSALUD ante hechos o actos que vulneren sus derechos..."
                </p>
              </div>
            </div>


            {/* Submit */}
            <div className="text-center">
              <Button type="submit" size="lg" className="w-full md:w-auto px-12 bg-[#c8a882] hover:bg-[#028b89] text-white shadow-lg text-lg rounded-full">
                ENVIAR RECLAMO
              </Button>
              {state?.message && !state.success && (
                <p className="mt-4 text-red-600 font-semibold bg-red-50 p-2 rounded-lg inline-block px-6">
                  {state.message}
                </p>
              )}
            </div>

          </form>
        </div>
      )}
    </div>
  );
}
