import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/core';
import Link from 'next/link';
import { TestimonialCarousel } from '@/components/ui/testimonial-carousel';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Colors: 
// Navy (Primary Text/Headings): #0c2340  (Tailwind closest: slate-900 or custom)
// Teal (Branding): #c8a882
// Gold (Accent): #c8a882

export default function Home() {
  const services = [
    { title: "Urología", image: "/service-medicina-general.jpg", link: "/servicios#urologia" },
    { title: "Ginecología", image: "/service-ginecologia.jpg", link: "/servicios#ginecologia" },
    { title: "Dermatología", image: "/service-dermatologia.jpg", link: "/servicios#dermatologia" },
    { title: "Cirugía General", image: "/service-cirugia.jpg", link: "/servicios#cirugia" },
    { title: "Cardiología", image: "/service-cardiologia.jpg", link: "/servicios#cardiologia" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">

      {/* Shared Navbar (Includes Top Bar & Main Header) */}
      <Navbar />

      {/* Hero Section */}
      <section
        className="relative py-32 sm:py-48 bg-cover bg-center text-left"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/landing_hero_v3.png')`
        }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
            Atención Médica Excepcional<br /> y Compasiva
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 mb-8 max-w-2xl leading-relaxed">
            En FormatuSalud, nuestros especialistas certificados están comprometidos a brindar un enfoque personalizado para el cuidado de su salud en cada etapa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/book">
              <button className="px-8 py-3 bg-[#c8a882] text-white font-semibold rounded hover:bg-[#b89772] transition shadow-lg text-lg">
                Buscar Doctor
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-8 py-3 bg-white text-[#0c2340] font-semibold rounded hover:bg-slate-100 transition shadow-lg text-lg">
                Agendar Cita
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#0c2340] mb-8">
            Bienvenido a FormatuSalud
          </h2>
          <p className="text-center text-slate-600 max-w-3xl mx-auto mb-16 text-lg">
            Somos la práctica médica más respetada y con mayor trayectoria. Con más de 70 proveedores de atención médica, ofrecemos tecnología de punta, diagnósticos precisos y una experiencia de tratamiento excepcional adaptada a sus necesidades.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Card 1: Specialists */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
              <Image
                src="/specialists_card_bg_1768264475971.png"
                alt="Nuestros Especialistas"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/90 to-[#0c2340]/20 group-hover:from-[#0c2340]/95 transition-all duration-300" />

              <div className="absolute bottom-0 left-0 p-8 w-full z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-white mb-4">Nuestros Especialistas</h3>
                <p className="text-slate-200 mb-6 text-lg leading-relaxed opacity-90">
                  Nuestros médicos están capacitados en prácticamente todas las subespecialidades. Ofrecemos los servicios más completos de la región.
                </p>
                <div className="flex items-center gap-2 text-[#c8a882] font-bold group-hover:gap-3 transition-all">
                  Conocer Equipo <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Card 2: Mission */}
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl group cursor-pointer">
              <Image
                src="/mission_card_bg_1768264489656.png"
                alt="Nuestra Misión"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/90 to-[#0c2340]/20 group-hover:from-[#0c2340]/95 transition-all duration-300" />

              <div className="absolute bottom-0 left-0 p-8 w-full z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-3xl font-bold text-white mb-4">Nuestra Misión</h3>
                <p className="text-slate-200 mb-6 text-lg leading-relaxed opacity-90">
                  Nos comprometemos a brindar una atención inigualable e innovadora a las comunidades a las que servimos. Desde el diagnóstico hasta el tratamiento.
                </p>
                <div className="flex items-center gap-2 text-[#c8a882] font-bold group-hover:gap-3 transition-all">
                  Leer Más <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-3xl md:text-5xl font-bold text-center text-[#0c2340] mb-16">
            Nuestros Servicios
          </h2>

          <div className="flex flex-wrap justify-center gap-8 mb-16">
            {services.map((service, idx) => (
              <div key={idx} className="relative h-[350px] w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] rounded-2xl overflow-hidden shadow-lg group cursor-pointer hover:shadow-2xl transition-all duration-300">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2340]/90 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                <div className="absolute bottom-0 left-0 p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <h4 className="text-2xl font-bold text-white mb-2">{service.title}</h4>

                  <Link href={service.link} className="inline-flex items-center gap-2 text-[#c8a882] font-bold group-hover:gap-3 transition-all">
                    Conocer más <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/servicios">
              <Button size="lg" className="bg-[#c8a882] hover:bg-[#028b89] text-white font-semibold rounded-full shadow-md px-10">
                Ver Todos los Servicios
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-slate-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#0c2340] mb-12">Testimonios de Pacientes</h2>
          <TestimonialCarousel />
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/landing_footer_v3.png"
            alt="Medical Facility"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#0c2340]/70" /> {/* Dark overlay for text readability */}
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Tu Salud, Nuestra Prioridad
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-slate-200">
            Atención médica de primer nivel con especialistas dedicados a tu bienestar y el de tu familia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book">
              <Button size="lg" className="bg-[#c8a882] hover:bg-[#b89772] text-white w-full sm:w-auto text-lg px-8">
                Reservar Cita
              </Button>
            </Link>
            <Link href="/medicos">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 w-full sm:w-auto text-lg px-8">
                Conocer Especialistas
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

function Badge({ text }: { text: React.ReactNode }) {
  return (
    <div className="h-16 w-24 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-center text-[10px] font-bold text-[#0c2340] shadow-sm">
      {text}
    </div>
  );
}
