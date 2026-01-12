import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/core';
import Link from 'next/link';

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0c2340] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre Nosotros</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Comprometidos con su salud y bienestar desde el primer día.
          </p>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#0c2340] mb-6">¿Quiénes Somos?</h2>
              <div className="w-20 h-1 bg-[#c8a882] mb-6"></div>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Bienvenidos a <strong>FormatuSalud</strong>. Somos la práctica médica más respetada y con mayor trayectoria.
                Con un equipo de más de 70 proveedores de atención médica, no solo ofrecemos experiencia y tradición,
                sino también la mejor terapia disponible, tecnología de imágenes de vanguardia y una experiencia
                de tratamiento excepcional personalizada a sus necesidades.
              </p>
              <p className="text-slate-600 mb-6 text-lg leading-relaxed">
                Nuestros médicos y proveedores de práctica avanzada están capacitados en prácticamente todas las subespecialidades,
                ofreciendo los servicios más completos disponibles en la región.
              </p>
            </div>
            <div className="rounded-xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition duration-500">
              <div className="h-80 bg-gradient-to-tr from-teal-600 to-blue-900 flex items-center justify-center">
                {/* Placeholder for clinic image */}
                <span className="text-white font-bold opacity-20 text-4xl">Nuestra Clínica</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision Cards */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="bg-white p-10 rounded-xl shadow-md border-t-8 border-[#029d9b]">
              <h3 className="text-2xl font-bold text-[#0c2340] mb-4">Nuestra Misión</h3>
              <p className="text-slate-600 leading-relaxed">
                Brindar la mejor experiencia en salud a los pacientes a través de su innovador servicio, sistema informático y personal médico de alta calidad humana y científica.
              </p>
            </div>

            {/* Vision - Adapted/Inferred */}
            <div className="bg-white p-10 rounded-xl shadow-md border-t-8 border-[#c8a882]">
              <h3 className="text-2xl font-bold text-[#0c2340] mb-4">Nuestra Visión</h3>
              <p className="text-slate-600 leading-relaxed">
                Ser la mejor compañía de salud peruana, innovando y creando cambios positivos en la salud, estando por encima de estructuras y sistemas clásicos de salud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats/Facts */}
      <section className="py-16 bg-[#0c2340] text-white">
        <div className="container mx-auto px-4 max-w-6xl flex flex-wrap justify-around text-center gap-8">
          <div>
            <div className="text-4xl font-bold text-[#c8a882] mb-2">+70</div>
            <div className="text-sm uppercase tracking-widest">Especialistas</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#c8a882] mb-2">+10k</div>
            <div className="text-sm uppercase tracking-widest">Pacientes Atendidos</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#c8a882] mb-2">24/7</div>
            <div className="text-sm uppercase tracking-widest">Atención Emergencia</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#c8a882] mb-2">100%</div>
            <div className="text-sm uppercase tracking-widest">Compromiso</div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
