import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/core';
import Link from 'next/link';
import { Calendar, ShieldCheck, Clock } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-slate-50 py-24 sm:py-32">
          <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
              Advanced Urology Care, <br className="hidden sm:block" />
              <span className="text-teal-600">Simplified.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Book your appointment with top specialists in Peru. Secure payments, instant confirmation, and full medical history tracking.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link href="/signup">
                <Button size="lg" className="px-8">Book Appointment</Button>
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-slate-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-sm font-semibold leading-7 text-teal-600">Why Choose Us</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need for your health journey
              </p>
            </div>

            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <div className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col items-start">
                  <div className="rounded-lg bg-teal-50 p-2 ring-1 ring-teal-100">
                    <Calendar className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-8 text-slate-900">Easy Online Booking</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">
                    Choose your doctor and preferred time slot in seconds. No phone calls needed.
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-lg bg-teal-50 p-2 ring-1 ring-teal-100">
                    <ShieldCheck className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-8 text-slate-900">Secure Payments</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">
                    Pay securely with any card or Yape using Culqi integration. Your data is safe.
                  </p>
                </div>
                <div className="flex flex-col items-start">
                  <div className="rounded-lg bg-teal-50 p-2 ring-1 ring-teal-100">
                    <Clock className="h-6 w-6 text-teal-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold leading-8 text-slate-900">History Tracking</h3>
                  <p className="mt-2 text-base leading-7 text-slate-600">
                    Access your appointment history and payment records anytime from your dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} FormatuSalud. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
