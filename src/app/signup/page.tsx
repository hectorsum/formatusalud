'use client';

import { useTransition, useState } from 'react';
import { registerUser } from '@/actions/auth';
import SignupWizard from '@/components/auth/signup-wizard';
import Link from 'next/link';

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState('');

  const handleSignup = (data: any) => {
    setErrorMessage('');
    startTransition(async () => {
      const result = await registerUser(data);
      if (result?.message) {
        setErrorMessage(result.message);
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-secondary">Únete a FormaTuSalud</h1>
        <p className="mt-2 text-slate-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-primary hover:text-primary-hover">
            Inicia sesión aquí
          </Link>
        </p>
      </div>

      <SignupWizard onComplete={handleSignup} />

      {errorMessage && (
        <div className="max-w-2xl mx-auto mt-4 p-4 bg-red-50 text-red-600 rounded-md text-center">
          {errorMessage}
        </div>
      )}

      {isPending && (
        <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
        </div>
      )}
    </div>
  );
}
