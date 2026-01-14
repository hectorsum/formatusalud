'use client'

import { useFormState } from 'react-dom';
import { updateProfile } from '@/actions/user';
import { Button } from '@/components/ui/core';
import { User, Phone, MapPin, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useActionState, useEffect, useState } from 'react';

const initialState = {
  message: '',
  errors: {},
  success: false
};

interface UserData {
  name: string;
  email: string;
  documentNumber: string;
  phoneNumber: string | null;
  address: string | null;
  department: string | null;
  province: string | null;
  district: string | null;
}

export default function ProfileForm({ user }: { user: UserData }) {
  const [state, dispatch] = useActionState(updateProfile, initialState);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (state?.success) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [state?.success]);

  return (
    <form action={dispatch} className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">

      {showSuccess && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800 animate-in fade-in slide-in-from-top-2">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      {state?.message && !state.success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800">
          <AlertCircle className="w-5 h-5" />
          <span className="font-medium">{state.message}</span>
        </div>
      )}

      {/* Personal Info */}
      <div className="mb-8 border-b border-slate-100 pb-8">
        <h3 className="text-lg font-bold text-[#0c2340] mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[#c8a882]" /> Información Básica
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre Completo</label>
            <input
              type="text"
              defaultValue={user.name}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
            />
            <p className="text-[10px] text-slate-400 mt-1">Contacte administración para corregir su nombre</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email</label>
            <input
              type="email"
              defaultValue={user.email}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">DNI / Documento</label>
            <input
              type="text"
              defaultValue={user.documentNumber}
              disabled
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-500 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Contact Info (Editable) */}
      <div className="mb-8 border-b border-slate-100 pb-8">
        <h3 className="text-lg font-bold text-[#0c2340] mb-4 flex items-center gap-2">
          <Phone className="w-5 h-5 text-[#c8a882]" /> Contacto
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Celular</label>
            <input
              type="tel"
              name="phoneNumber"
              defaultValue={user.phoneNumber || ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#c8a882] outline-none"
              placeholder="999 999 999"
            />
          </div>
        </div>
      </div>

      {/* Address (Editable) */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-[#0c2340] mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#c8a882]" /> Ubicación
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dirección</label>
            <input
              type="text"
              name="address"
              defaultValue={user.address || ''}
              className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#c8a882] outline-none"
              placeholder="Av. Principal 123, Urb. Los Álamos"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departamento</label>
              <input
                type="text"
                name="department"
                defaultValue={user.department || 'Lima'}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#c8a882] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Provincia</label>
              <input
                type="text"
                name="province"
                defaultValue={user.province || 'Lima'}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#c8a882] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Distrito</label>
              <input
                type="text"
                name="district"
                defaultValue={user.district || ''}
                className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#c8a882] outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="bg-[#0c2340] hover:bg-slate-800 text-white px-8 flex items-center gap-2">
          <Save className="w-4 h-4" /> Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
