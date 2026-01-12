import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/core';
import Link from 'next/link';
import { DoctorsList } from '@/components/medicos/doctors-list';

export default function MedicosPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0c2340] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Nuestros Especialistas</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Conozca al equipo de profesionales altamente calificados dedicados a su salud y bienestar.
          </p>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-6xl">
          <DoctorsList />
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#0c2340] mb-6">¿Listo para agendar su consulta?</h2>
          <Link href="/book">
            <Button size="lg" className="bg-[#c8a882] hover:bg-[#b89772] text-white">
              Ver Disponibilidad
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
