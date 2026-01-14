'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { Menu, X, Mail, Phone, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/core';
import { logout } from '@/actions/auth';

interface MobileMenuProps {
  userRole?: string;
  isAuth: boolean;
  userId?: string;
}

export function MobileMenu({ userRole, isAuth, userId }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuContent = (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div 
        className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-[#0c2340]">Menú</h2>
          <button 
            onClick={() => setOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            {userRole === 'DOCTOR' && (
              <>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Panel Médico</h3>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-[#c8a882]">Dashboard</Link>
                <Link href="/agenda" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-[#c8a882]">Mi Agenda</Link>
                <Link href="/pacientes" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-[#c8a882]">Pacientes</Link>
                <Link href="/disponibilidad" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-[#c8a882]">Disponibilidad</Link>
              </>
            )}

            {userRole === 'PATIENT' && (
              <>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Paciente</h3>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-[#c8a882]">Dashboard</Link>
                <Link href="/citas" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-[#c8a882]">Mis Citas</Link>
                <Link href="/pagos" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-[#c8a882]">Pagos</Link>
                <Link href="/perfil" onClick={() => setOpen(false)} className="text-sm font-medium text-slate-700 hover:text-[#c8a882]">Mis Datos</Link>
              </>
            )}

            {!isAuth && (
              <>
                <Link href="/" onClick={() => setOpen(false)} className="text-base font-semibold text-slate-800 hover:text-[#c8a882]">Inicio</Link>
                <Link href="/nosotros" onClick={() => setOpen(false)} className="text-base font-semibold text-slate-800 hover:text-[#c8a882]">Nosotros</Link>
                <Link href="/medicos" onClick={() => setOpen(false)} className="text-base font-semibold text-slate-800 hover:text-[#c8a882]">Médicos</Link>
                <Link href="/servicios" onClick={() => setOpen(false)} className="text-base font-semibold text-slate-800 hover:text-[#c8a882]">Servicios</Link>
                <Link href="/contacto" onClick={() => setOpen(false)} className="text-base font-semibold text-slate-800 hover:text-[#c8a882]">Contacto</Link>
              </>
            )}
          </nav>

          <hr className="border-slate-100" />

          {/* Contact / Auth */}
          <div className="space-y-4">
            {isAuth ? (
                <form action={logout}>
                  <button type="submit" className="w-full flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700">
                    <LogOut size={16} /> Cerrar Sesión
                  </button>
                </form>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm text-slate-600 hover:text-[#c8a882]">
                  <User size={16} /> Portal Paciente
                </Link>
                <div className="pt-2">
                  <a href="tel:+51987654321">
                    <Button className="w-full bg-[#c8a882] hover:bg-[#b89772] text-white">
                      <Phone size={16} className="mr-2" /> Reservar Cita
                    </Button>
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
        
        <div className="mt-auto pt-6 border-t border-slate-100 text-xs text-slate-400 text-center">
            &copy; 2024 FormatuSalud
        </div>
      </div>
    </div>
  );

  return (
    <div className="md:hidden">
      <button 
        onClick={() => setOpen(true)} 
        className="p-2 text-slate-700 hover:text-[#c8a882] transition"
      >
        <Menu size={24} />
      </button>

      {mounted && open && createPortal(menuContent, document.body)}
    </div>
  );
}
