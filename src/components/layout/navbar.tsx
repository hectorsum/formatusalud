import Link from 'next/link';
import Image from 'next/image';
import { verifySession } from '@/lib/session';
import { Button } from '@/components/ui/core';
import { logout } from '@/actions/auth';
import { Mail, Phone, User } from 'lucide-react';

export async function Navbar() {
  const session = await verifySession();
  const userRole = session?.role;

  return (
    <div className="flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#0c2340] text-white py-2 text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-end gap-6 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-6">
            <a href="mailto:formatusalud@gmail.com" className="flex items-center gap-2 hover:text-[#c8a882] transition">
              <Mail size={14} /> formatusalud@gmail.com
            </a>
            <span className="flex items-center gap-2">
              <Phone size={14} /> +51 987 654 321
            </span>
            {!session?.isAuth && (
              <Link href="/login" className="flex items-center gap-2 hover:text-[#c8a882] transition">
                <User size={14} /> Portal Paciente
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image src="/logo.svg" alt="FormatuSalud Logo" width={180} height={40} className="w-auto h-10 object-contain" />
          </Link>

          {/* Navigation Links based on Role */}
          <div className="hidden md:flex items-center gap-8">
            {/* 1. DOCTOR VIEW */}
            {userRole === 'DOCTOR' && (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Dashboard</Link>
                <Link href="/agenda" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Mi Agenda</Link>
                <Link href="/pacientes" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Pacientes</Link>
                <Link href="/disponibilidad" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Disponibilidad</Link>
              </>
            )}

            {/* 2. PATIENT VIEW */}
            {userRole === 'PATIENT' && (
              <>
                <Link href="/dashboard" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Dashboard</Link>
                <Link href="/citas" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Mis Citas</Link>
                <Link href="/pagos" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Pagos</Link>
                <Link href="/perfil" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Mis Datos</Link>
              </>
            )}

            {/* 3. PUBLIC VIEW (Guest or No Role) */}
            {!session?.isAuth && (
              <>
                <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Inicio</Link>
                <Link href="/nosotros" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Nosotros</Link>
                <Link href="/medicos" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Médicos</Link>
                <Link href="/servicios" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Servicios</Link>
                <Link href="/contacto" className="text-sm font-semibold text-slate-700 hover:text-[#c8a882] transition">Contacto</Link>
              </>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="flex items-center gap-4">
            {session?.userId ? (
              <div className="flex items-center gap-4">
                {/* Role Badge */}
                <span className="hidden lg:inline-block px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-[#0c2340]">
                  {userRole === 'DOCTOR' ? 'PANEL MÉDICO' : 'PACIENTE'}
                </span>

                {/* Logout Form */}
                <form action={logout}>
                  <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 transition flex items-center gap-1">
                    Cerrar Sesión
                  </button>
                </form>
              </div>
            ) : (
              <>
                <a href="tel:+51987654321">
                  <Button size="sm" className="bg-[#c8a882] hover:bg-[#b89772] text-white border-none shadow-md flex items-center gap-2">
                    <Phone size={16} /> Reservar Cita
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}
