import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import ServicesWizard from './services-client';

export default function ServiciosPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0c2340] text-white py-24 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2 animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">Nuestros Servicios Médicos</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Excelencia médica y tecnología de vanguardia al servicio de tu salud.
          </p>
        </div>
      </section>

      {/* Client-side Wizard & Carousel */}
      <ServicesWizard />

      <Footer />
    </div>
  );
}
