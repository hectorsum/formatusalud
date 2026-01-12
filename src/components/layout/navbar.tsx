import Link from 'next/link';
import Image from 'next/image';
import { verifySession } from '@/lib/session';
import { Button } from '@/components/ui/core';
import { logout } from '@/actions/auth';
import { Mail, Phone, User } from 'lucide-react';

export async function Navbar() {
  const session = await verifySession();

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
              <Phone size={14} /> (01) 3405653
            </span>
            <Link href="/login" className="flex items-center gap-2 hover:text-[#c8a882] transition">
              <User size={14} /> Portal Paciente
            </Link>
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-[#766341] transition">Inicio</Link>
            <Link href="/nosotros" className="text-sm font-semibold text-slate-700 hover:text-[#766341] transition">Nosotros</Link>
            <Link href="/medicos" className="text-sm font-semibold text-slate-700 hover:text-[#766341] transition">Médicos</Link>
            <Link href="/servicios" className="text-sm font-semibold text-slate-700 hover:text-[#766341] transition">Servicios</Link>
            <Link href="/contacto" className="text-sm font-semibold text-slate-700 hover:text-[#766341] transition">Contacto</Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {session?.userId ? (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-[#766341]">
                  Dashboard
                </Link>
                <form action={logout}>
                  <button type="submit" className="text-sm font-medium text-red-600 hover:text-red-700 transition">
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <>
                <a href="tel:013405653">
                  <Button size="sm" className="bg-[#c8a882] hover:bg-[#b89772] text-white border-none shadow-md flex items-center gap-2">
                    <Phone size={16} /> Call Now (01) 3405653
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
