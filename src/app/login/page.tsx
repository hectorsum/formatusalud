'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { Button, Input, Label, cn } from '@/components/ui/core';
import Link from 'next/link';
import Image from 'next/image';
import { Ambulance, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [state, dispatch, isPending] = useActionState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const [errorMessage, setErrorMessage] = useState<string | null>(error === 'SessionExpired' ? 'Tu sesión ha expirado. Por favor ingresa nuevamente.' : null);

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side - Image */}
      <div className="relative hidden w-1/2 md:block">
        <Image
          src="/login_background_v2_1768263492562.png"
          alt="FormaTuSalud Clinic"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-[400px]">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <Image src="/logo.svg" alt="FormaTuSalud" width={180} height={50} className="h-12 w-auto" />
          </div>

          <div className="mb-8 text-center text-sm text-slate-600">
            ¿Ingresas por primera vez?{' '}
            <Link href="/signup" className="font-bold text-secondary hover:text-primary-hover">
              REGÍSTRATE
            </Link>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200">
              {errorMessage}
            </div>
          )}

          <form action={dispatch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-secondary">
                Correo Electrónico *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="Ingresa tu correo"
                className="h-12 rounded-md border-slate-300 focus:border-accent focus:ring-accent"
              />
              {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-secondary">
                Ingresa tu clave *
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  className="h-12 rounded-md border-slate-300 pr-10 focus:border-accent focus:ring-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {state?.errors?.password && <p className="text-sm text-red-600">{state.errors.password[0]}</p>}
            </div>

            <div className="flex items-center gap-2">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-accent"
              />
              <Label htmlFor="remember" className="text-sm text-secondary">
                Recordar usuario y contraseña
              </Label>
            </div>

            {state?.message && (
              <div className={cn("rounded-md p-3 text-sm", state.message === 'Invalid credentials.' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
                {state.message}
              </div>
            )}

            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full rounded bg-primary text-base font-semibold text-white hover:bg-primary-hover transition-colors"
            >
              {isPending ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="#" className="text-sm font-bold text-secondary hover:underline">
              ¿OLVIDASTE TU CONTRASEÑA?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
