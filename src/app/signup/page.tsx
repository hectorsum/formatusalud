'use client';

import { useActionState } from 'react';
import { signup } from '@/actions/auth';
import { Button, Input, Label, cn } from '@/components/ui/core';
import Link from 'next/link';

export default function SignupPage() {
  const [state, dispatch, isPending] = useActionState(signup, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg border border-slate-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-600">
            Already have an account? <Link href="/login" className="font-medium text-teal-600 hover:text-teal-500">Sign in</Link>
          </p>
        </div>

        <form action={dispatch} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" type="text" required autoComplete="name" placeholder="John Doe" />
            {state?.errors?.name && <p className="text-sm text-red-600">{state.errors.name[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" placeholder="john@example.com" />
            {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required autoComplete="new-password" placeholder="Min. 8 characters" />
            {state?.errors?.password && (
              <div className="text-sm text-red-600">
                {state.errors.password.map((err, i) => <p key={i}>{err}</p>)}
              </div>
            )}
          </div>

          {state?.message && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
              {state.message}
            </div>
          )}

          <Button type="submit" variant="primary" disabled={isPending} className="w-full">
            {isPending ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
      </div>
    </div>
  );
}
