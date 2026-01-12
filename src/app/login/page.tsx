'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';
import { Button, Input, Label, cn } from '@/components/ui/core';
import Link from 'next/link';

export default function LoginPage() {
  const [state, dispatch, isPending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg border border-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in to your account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Or <Link href="/signup" className="font-medium text-teal-600 hover:text-teal-500">create a new account</Link>
          </p>
        </div>

        <form action={dispatch} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="patient@example.com" />
            {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
            {state?.errors?.password && <p className="text-sm text-red-600">{state.errors.password[0]}</p>}
          </div>

          {state?.message && (
            <div className={cn("rounded-md p-3 text-sm", state.message === 'Invalid credentials.' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
              {state.message}
            </div>
          )}

          <Button type="submit" disabled={isPending} className="w-full">
            {isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
