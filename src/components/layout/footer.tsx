import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0c2340] text-slate-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="block relative w-48 h-12">
              <Image
                src="/logo-white.svg"
                alt="FormatuSalud Logo"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              Transformando la experiencia médica con tecnología y calidez humana. Su salud es nuestra prioridad absoluta.
            </p>
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-[#c8a882] hover:text-white transition"><Facebook size={18} /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-[#c8a882] hover:text-white transition"><Instagram size={18} /></a>
              <a href="#" className="bg-slate-800 p-2 rounded-full hover:bg-[#c8a882] hover:text-white transition"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Enlaces Rápidos</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-[#766341] transition">Inicio</Link></li>
              <li><Link href="/nosotros" className="hover:text-[#766341] transition">Nosotros</Link></li>
              <li><Link href="/medicos" className="hover:text-[#766341] transition">Especialistas</Link></li>
              <li><Link href="/servicios" className="hover:text-[#766341] transition">Servicios Médicos</Link></li>
              <li><Link href="/book" className="hover:text-[#766341] transition">Reserva de Citas</Link></li>
              <li><Link href="/contacto" className="hover:text-[#766341] transition">Contacto</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-[#766341] transition">Términos y Condiciones</Link></li>
              <li><Link href="#" className="hover:text-[#766341] transition">Política de Privacidad</Link></li>
              <li><Link href="#" className="hover:text-[#766341] transition">Libro de Reclamaciones</Link></li>
              <li><Link href="#" className="hover:text-[#766341] transition">Política de Cookies</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-6">Contacto</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="text-[#c8a882] shrink-0 mt-1" size={18} />
                <span>Av. Aurelio Miró Quesada N° 1048<br />San Isidro, Lima - Perú</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-[#c8a882] shrink-0" size={18} />
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-[#c8a882] shrink-0" size={18} />
                <span>contacto@formatusalud.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} FormatuSalud. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
