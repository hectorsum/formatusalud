import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/core';
import Link from 'next/link';
import { TestimonialCarousel } from '@/components/ui/testimonial-carousel';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

// Colors: 
// Navy (Primary Text/Headings): #0c2340  (Tailwind closest: slate-900 or custom)
// Teal (Branding): #029d9b
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
          backgroundImage: `linear-gradient(rgba(12, 35, 64, 0.7), rgba(12, 35, 64, 0.7)), url('/clinic-building.jpg')`
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
            {/* Card 1 */}
            <div className="rounded-xl overflow-hidden shadow-lg bg-white group hover:-translate-y-1 transition duration-300">
              <div className="h-64 bg-gradient-to-br from-[#667eea] to-[#764ba2]"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#0c2340] mb-4">Nuestros Especialistas</h3>
                <p className="text-slate-600 mb-6">
                  Nuestros médicos están capacitados en prácticamente todas las subespecialidades. Ofrecemos los servicios más completos de la región.
                </p>
                <a href="#" className="text-[#029d9b] font-semibold hover:text-[#0c2340] transition">Leer Más →</a>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl overflow-hidden shadow-lg bg-white group hover:-translate-y-1 transition duration-300">
              <div className="h-64 bg-gradient-to-br from-[#a1c4fd] to-[#c2e9fb]"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-[#0c2340] mb-4">Nuestra Misión</h3>
                <p className="text-slate-600 mb-6">
                  Nos comprometemos a brindar una atención inigualable e innovadora a las comunidades a las que servimos. Desde el diagnóstico hasta el tratamiento.
                </p>
                <a href="#" className="text-[#029d9b] font-semibold hover:text-[#0c2340] transition">Leer Más →</a>
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
              <div key={idx} className="w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-2rem)] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden">
                <div className="relative h-64 overflow-hidden">
                  <div className="absolute inset-0 bg-[#0c2340]/10 group-hover:bg-[#0c2340]/0 transition-colors z-10" />
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div className="relative bg-white pt-8 pb-8 px-6 text-center">
                  <div className="absolute top-[-20px] left-0 right-0 h-[40px] bg-white rounded-t-[50%] transform scale-x-150 z-20"></div>
                  <h4 className="relative z-30 text-xl font-bold text-[#0c2340] mb-3">{service.title}</h4>

                  <Link href={service.link} className="relative z-30 inline-flex items-center gap-2 text-sm font-bold text-[#c8a882] hover:text-[#b89772] transition-colors group-hover:gap-3">
                    Conocer más <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/servicios">
              <Button size="lg" className="bg-[#029d9b] hover:bg-[#028b89] text-white font-semibold rounded-full shadow-md px-10">
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
            src="/hero-bg.png"
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
