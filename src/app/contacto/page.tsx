import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/core';
import Link from 'next/link';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';

export default function ContactoPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header Section */}
      <section className="bg-[#0c2340] text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contáctanos</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Estamos aquí para atender tus consultas y brindarte la mejor atención médica.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-16">
        {/* Contact Info - Horizontal Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#0c2340] mb-10 text-center">Información de Contacto</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Phone */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-[#c8a882] p-4 rounded-full text-white mb-4">
                <Phone size={24} />
              </div>
              <h3 className="font-bold text-[#0c2340] text-lg mb-2">Teléfonos</h3>
              <div className="space-y-1">
                <p className="text-slate-600">(01) 3405653</p>
                <p className="text-slate-600">949 487 979</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-[#c8a882] p-4 rounded-full text-white mb-4">
                <Mail size={24} />
              </div>
              <h3 className="font-bold text-[#0c2340] text-lg mb-2">Correo</h3>
              <div className="space-y-1">
                <p className="text-slate-600 text-sm">formatusalud@gmail.com</p>
                <p className="text-slate-600 text-sm">contacto@formatusalud.com</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-[#c8a882] p-4 rounded-full text-white mb-4">
                <MapPin size={24} />
              </div>
              <h3 className="font-bold text-[#0c2340] text-lg mb-2">Ubicación</h3>
              <div className="space-y-1">
                <p className="text-slate-600 text-sm">Av. Aurelio Miró Quesada 1048</p>
                <p className="text-slate-600 text-sm">San Isidro, Lima - Perú</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-xl border border-slate-100 hover:shadow-md transition-shadow">
              <div className="bg-[#c8a882] p-4 rounded-full text-white mb-4">
                <Clock size={24} />
              </div>
              <h3 className="font-bold text-[#0c2340] text-lg mb-2">Horario</h3>
              <div className="space-y-1">
                <p className="text-slate-600 text-sm">Lun - Vie: 8:00 AM - 8:00 PM</p>
                <p className="text-slate-600 text-sm">Sábados: 8:00 AM - 1:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        {/* Map - Full Width */}
        <div className="h-[500px] w-full bg-slate-100 rounded-2xl overflow-hidden shadow-lg border border-slate-200 mb-20">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.666013627993!2d-77.05445222409745!3d-12.091157988147253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c9b4e7604f33%3A0x6331823000676451!2sAv.%20Aurelio%20Mir%C3%B3%20Quesada%201048%2C%20San%20Isidro%2015073!5e0!3m2!1ses-419!2spe!4v1715537500000!5m2!1ses-419!2spe"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* CTA Section */}
        <section className="bg-teal-50 rounded-3xl p-8 md:p-12 text-center border border-teal-100">
          <h2 className="text-3xl font-bold text-[#0c2340] mb-4">¿Listo para agendar tu cita?</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mb-8 text-lg">
            Nuestros especialistas están listos para atenderte. Reserva tu cita en línea de manera rápida y sencilla.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/book">
              <Button size="lg" className="bg-[#c8a882] hover:bg-[#b89772] text-white w-full sm:w-auto text-lg px-8">
                Reservar Cita Ahora
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="lg" variant="outline" className="border-[#0c2340] text-[#0c2340] hover:bg-[#0c2340] hover:text-white w-full sm:w-auto text-lg px-8">
                Crear Cuenta (Portal Paciente)
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
