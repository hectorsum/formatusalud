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
            <div className="rounded-xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition duration-500 h-80 relative group">
              <img
                src="/carousel-tower-real.jpg"
                alt="Nuestra Clínica"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white font-bold text-xl">Torre de Consultorios El Golf</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision Cards */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Mission Card */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0">
                {/* Using Patient Room image for Mission (Care/Humanity) */}
                <img src="/tech-3.png" alt="Nuestra Misión" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340] via-[#0c2340]/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 p-10 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-white mb-6 border-l-4 border-[#c8a882] pl-4">Nuestra Misión</h3>
                <p className="text-slate-200 text-lg leading-relaxed mb-4">
                  Brindar la mejor experiencia en salud a los pacientes a través de su innovador servicio, sistema informático y personal médico de alta calidad humana y científica.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0">
                {/* Using Lab image for Vision (Innovation/Technology) */}
                <img src="/specialists_card_bg_1768264475971.png" alt="Nuestra Visión" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340] via-[#0c2340]/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />
              </div>
              <div className="absolute bottom-0 left-0 p-10 z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-white mb-6 border-l-4 border-[#c8a882] pl-4">Nuestra Visión</h3>
                <p className="text-slate-100 text-lg leading-relaxed mb-4">
                  Ser la mejor compañía de salud peruana, innovando y creando cambios positivos en la salud, estando por encima de estructuras y sistemas clásicos de salud.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Features Block */}
      <section className="relative py-28 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img src="/carousel-staff-real.png" alt="Medical Team" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0c2340]/80 backdrop-blur-[2px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">

            {/* Feature 1 */}
            <div className="group p-6 rounded-xl hover:bg-white/5 transition-colors duration-300">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-[#c8a882] group-hover:bg-[#c8a882]/10 transition-all duration-300">
                {/* Doctor Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-[#c8a882] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Experiencia garantizada</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Más de 7 años de experiencia al cuidado de tu salud
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-6 rounded-xl hover:bg-white/5 transition-colors duration-300">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-[#c8a882] group-hover:bg-[#c8a882]/10 transition-all duration-300">
                {/* Mask Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-[#c8a882] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.746 3.746 0 0121 12z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Protocolos de seguridad</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Garantizamos tu completa seguridad con la atención a distancia
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-6 rounded-xl hover:bg-white/5 transition-colors duration-300">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-[#c8a882] group-hover:bg-[#c8a882]/10 transition-all duration-300">
                {/* Laptop/Virtual Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-[#c8a882] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">100% Virtual</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Con historias clínicas, recetas y exámenes en formato digital
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group p-6 rounded-xl hover:bg-white/5 transition-colors duration-300">
              <div className="mx-auto mb-6 w-16 h-16 rounded-full border-2 border-white/20 flex items-center justify-center group-hover:border-[#c8a882] group-hover:bg-[#c8a882]/10 transition-all duration-300">
                {/* File/Lock Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white group-hover:text-[#c8a882] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">Total Confidencialidad</h4>
              <p className="text-slate-300 text-sm leading-relaxed">
                Garantizamos la exclusividad paciente-médico
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
