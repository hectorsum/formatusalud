'use client';

import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    id: 1,
    text: "FormatuSalud me brindó una atención rápida y eficiente. Los doctores son muy profesionales y el sistema de citas es increíblemente fácil de usar. Recomiendo totalmente sus servicios a cualquiera que busque calidad.",
    author: "Juan Pérez",
    role: "Paciente de Urología",
    image: "/testimonial-patient.png"
  },
  {
    id: 2,
    text: "Excelente experiencia desde el primer momento. La plataforma es intuitiva y el trato humano del personal médico es insuperable. Me sentí muy cuidada durante todo mi tratamiento ginecológico.",
    author: "María González",
    role: "Paciente de Ginecología",
    image: "/testimonial-patient-female.png"
  },
  {
    id: 3,
    text: "Gracias a la detección temprana y la tecnología de punta que utilizan, pude superar mi condición con éxito. El equipo de cardiología es de primer nivel. ¡Gracias por todo!",
    author: "Carlos Rodríguez",
    role: "Paciente de Cardiología",
    image: "/testimonial-patient-male.png"
  }
];

export function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      // Trigger fade out
      setFade(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
        setFade(false); // Trigger fade in
      }, 300); // 300ms matches transition duration
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Manual navigation handler
  const handleNav = (idx: number) => {
    if (idx === current) return;
    setFade(true);
    setTimeout(() => {
      setCurrent(idx);
      setFade(false);
    }, 300);
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row h-[500px] md:h-[400px]">
        {/* Image Section - Fixed Height */}
        <div className="md:w-2/5 relative h-64 md:h-full shrink-0">
          <Image
            src={testimonials[current].image}
            alt={testimonials[current].author}
            fill
            className={`object-cover transition-opacity duration-300 ${fade ? 'opacity-50' : 'opacity-100'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent md:bg-none" />
        </div>

        {/* Content Section */}
        <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <Quote className="h-12 w-12 text-[#c8a882] mb-6 opacity-80" />

          <div className={`transition-opacity duration-300 ease-in-out ${fade ? 'opacity-0' : 'opacity-100'}`}>
            <p className="text-lg md:text-xl text-[#0c2340] font-medium leading-relaxed italic mb-8 h-[140px] overflow-hidden">
              "{testimonials[current].text}"
            </p>

            <div>
              <h4 className="text-xl font-bold text-[#0c2340]">{testimonials[current].author}</h4>
              <p className="text-sm text-slate-500">{testimonials[current].role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleNav(idx)}
            className={`transition-all duration-300 rounded-full border-2 border-[#c8a882] ${current === idx
              ? 'w-4 h-4 bg-[#c8a882] border-[#c8a882]'
              : 'w-4 h-4 bg-transparent hover:bg-[#c8a882]/20'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
