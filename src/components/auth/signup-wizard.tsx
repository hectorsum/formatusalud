'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  signupSchemaStep1,
  signupSchemaStep2,
  signupSchemaStep3,
  documentTypes,
  sexTypes
} from '@/actions/auth-schema';
import { Button, Input, Label, cn } from '@/components/ui/core';
import { ChevronRight, Check, MapPin, Loader2, Eye, EyeOff } from 'lucide-react';

// Simplified Peru Location Data (Mock for now, normally fetched from API)
const DEPARTMENTS = ['Lima', 'Arequipa', 'Cusco'];
const PROVINCES = { 'Lima': ['Lima', 'Cañete'], 'Arequipa': ['Arequipa'], 'Cusco': ['Cusco'] };
const DISTRICTS = { 'Lima': ['Miraflores', 'San Isidro', 'Surco'], 'Cañete': ['Asia'], 'Arequipa': ['Yanahuara'], 'Cusco': ['Wanchaq'] };

export default function SignupWizard({ onComplete }: { onComplete: (data: any) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // --- Step 1 Form ---
  const form1 = useForm({
    resolver: zodResolver(signupSchemaStep1),
    defaultValues: {
      documentType: 'DNI',
      documentNumber: '',
      birthdate: '',
      termsAccepted: false,
      consentAccepted: false,
    },
    mode: 'onBlur',
  });

  // --- Step 2 Form ---
  const form2 = useForm({
    resolver: zodResolver(signupSchemaStep2),
    defaultValues: {
      firstName: '',
      paternalSurname: '',
      maternalSurname: '',
      sex: 'Masculino',
      country: 'Peru',
      department: '',
      province: '',
      district: '',
      address: '',
    },
    mode: 'onBlur',
  });

  // --- Step 3 Form ---
  const form3 = useForm({
    resolver: zodResolver(signupSchemaStep3),
    defaultValues: {
      email: '',
      countryCode: '+51',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmitStep1 = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(2);
  };

  const onSubmitStep2 = (data: any) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(3);
  };

  const onSubmitStep3 = (data: any) => {
    const finalData = { ...formData, ...data };
    onComplete(finalData);
  };

  // Helper for location dropdowns
  const selectedCountry = form2.watch('country');
  const selectedDepartment = form2.watch('department');
  const selectedProvince = form2.watch('province');

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden border border-slate-100">

      {/* Steps Header */}
      <div className="bg-slate-50 p-6 border-b border-slate-100">
        <div className="flex items-center justify-between relative z-0">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 transform -translate-y-1/2" />

          {[1, 2, 3].map((s) => (
            <div key={s} className="flex flex-col items-center bg-slate-50 px-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300",
                  step >= s ? "bg-primary text-white" : "bg-slate-200 text-slate-500"
                )}
              >
                {step > s ? <Check size={18} /> : s}
              </div>
              <span className={cn("text-xs mt-2 font-medium", step >= s ? "text-primary" : "text-slate-400")}>
                {s === 1 ? 'Datos' : s === 2 ? 'Personal' : 'Seguridad'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-8">

        {/* Step 1: Document & Basic Info */}
        {step === 1 && (
          <form onSubmit={form1.handleSubmit(onSubmitStep1)} className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary mb-4">Identificación</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <select
                  {...form1.register('documentType')}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {documentTypes.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {form1.formState.errors.documentType && (
                  <p className="text-red-500 text-xs">{form1.formState.errors.documentType.message}</p>
                )}
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label>Número de Documento</Label>
                <Input {...form1.register('documentNumber')} placeholder="Ingrese su número" className="focus:ring-accent focus:border-accent" />
                {form1.formState.errors.documentNumber && <p className="text-red-500 text-xs">{form1.formState.errors.documentNumber.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fecha de Nacimiento</Label>
              <Input type="date" {...form1.register('birthdate')} className="focus:ring-accent focus:border-accent" />
              {form1.formState.errors.birthdate && <p className="text-red-500 text-xs">{form1.formState.errors.birthdate.message}</p>}
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-1 text-primary focus:ring-accent"
                  {...form1.register('termsAccepted')}
                />
                <Label htmlFor="terms" className="text-sm font-normal text-slate-600 leading-tight">
                  Acepto los <a href="#" className="text-primary underline hover:text-primary-hover">Términos y Condiciones</a> y la Política de Privacidad de Datos.
                </Label>
              </div>
              {form1.formState.errors.termsAccepted && <p className="text-red-500 text-xs ml-6">{form1.formState.errors.termsAccepted.message}</p>}

              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 text-primary focus:ring-accent"
                  {...form1.register('consentAccepted')}
                />
                <Label htmlFor="consent" className="text-sm font-normal text-slate-600 leading-tight">
                  Acepto el uso de mis datos para fines adicionales (opcional).
                </Label>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 transition-colors">
                Siguiente Paso <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Personal Details */}
        {step === 2 && (
          <form onSubmit={form2.handleSubmit(onSubmitStep2)} className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary mb-4">Datos Personales</h2>

            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input {...form2.register('firstName')} placeholder="Ingresa tu nombre" className="focus:ring-accent focus:border-accent" />
              {form2.formState.errors.firstName && <p className="text-red-500 text-xs">{form2.formState.errors.firstName.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Apellido Paterno</Label>
                <Input {...form2.register('paternalSurname')} placeholder="Apellido paterno" className="focus:ring-accent focus:border-accent" />
                {form2.formState.errors.paternalSurname && <p className="text-red-500 text-xs">{form2.formState.errors.paternalSurname.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Apellido Materno</Label>
                <Input {...form2.register('maternalSurname')} placeholder="Apellido materno" className="focus:ring-accent focus:border-accent" />
                {form2.formState.errors.maternalSurname && <p className="text-red-500 text-xs">{form2.formState.errors.maternalSurname.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Sexo</Label>
              <select
                {...form2.register('sex')}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {sexTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {form2.formState.errors.sex && <p className="text-red-500 text-xs">{form2.formState.errors.sex.message}</p>}
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-4">
              <div className="space-y-2">
                <Label>País</Label>
                <select
                  {...form2.register('country')}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="Peru">Peru</option>
                  <option value="Other">Otro</option>
                </select>
              </div>

              {selectedCountry === 'Peru' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Departamento</Label>
                    <select
                      {...form2.register('department')}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      <option value="">Seleccione</option>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Provincia</Label>
                    <select
                      {...form2.register('province')}
                      disabled={!selectedDepartment}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-slate-100"
                    >
                      <option value="">Seleccione</option>
                      {(selectedDepartment ? (PROVINCES as any)[selectedDepartment] || [] : []).map((p: string) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Distrito</Label>
                    <select
                      {...form2.register('district')}
                      disabled={!selectedProvince}
                      className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent disabled:bg-slate-100"
                    >
                      <option value="">Seleccione</option>
                      {(selectedProvince ? (DISTRICTS as any)[selectedProvince] || [] : []).map((d: string) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Domicilio</Label>
                <div className="relative">
                  <Input {...form2.register('address')} placeholder="Dirección completa" className="pl-9 focus:ring-accent focus:border-accent" />
                  <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                </div>
                {form2.formState.errors.address && <p className="text-red-500 text-xs">{form2.formState.errors.address.message}</p>}
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setStep(1)} className="hover:text-primary">
                Atrás
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 transition-colors">
                Siguiente Paso <ChevronRight size={16} className="ml-2" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Security */}
        {step === 3 && (
          <form onSubmit={form3.handleSubmit(onSubmitStep3)} className="space-y-6">
            <h2 className="text-2xl font-bold text-secondary mb-4">Seguridad</h2>

            <div className="space-y-2">
              <Label>Correo Electrónico</Label>
              <Input {...form3.register('email')} type="email" placeholder="correo@ejemplo.com" className="focus:ring-accent focus:border-accent" />
              {form3.formState.errors.email && <p className="text-red-500 text-xs">{form3.formState.errors.email.message}</p>}
            </div>

            <div className="grid grid-cols-[100px_1fr] gap-4">
              <div className="space-y-2">
                <Label>País</Label>
                <Input {...form3.register('countryCode')} readOnly className="bg-slate-100 focus:ring-accent focus:border-accent" />
              </div>
              <div className="space-y-2">
                <Label>Celular</Label>
                <Input {...form3.register('phoneNumber')} placeholder="999 999 999" className="focus:ring-accent focus:border-accent" />
                {form3.formState.errors.phoneNumber && <p className="text-red-500 text-xs">{form3.formState.errors.phoneNumber.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contraseña</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form3.register('password')}
                  placeholder="Mínimo 8 caracteres"
                  className="focus:ring-accent focus:border-accent"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-slate-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form3.formState.errors.password && <p className="text-red-500 text-xs">{form3.formState.errors.password.message}</p>}

              {/* Password requirements visual aid */}
              <div className="bg-blue-50 p-3 rounded-md text-xs space-y-1 text-slate-600">
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> 1 minúscula</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> 1 mayúscula</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> 1 número</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> 1 carácter especial</p>
                <p className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> 8-12 caracteres</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  {...form3.register('confirmPassword')}
                  placeholder="Repite tu contraseña"
                  className="focus:ring-accent focus:border-accent"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-slate-400">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form3.formState.errors.confirmPassword && <p className="text-red-500 text-xs">{form3.formState.errors.confirmPassword.message}</p>}
            </div>

            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={() => setStep(2)} className="hover:text-primary">
                Atrás
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 w-full md:w-auto transition-colors">
                Confirmar Registro
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
