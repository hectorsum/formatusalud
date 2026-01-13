'use client';

import { Button } from '@/components/ui/core';
import Link from 'next/link';
import Image from 'next/image';
import { Stethoscope, Activity, Scissors, Heart, UserPlus, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ServicesWizard() {
  const [activeCategory, setActiveCategory] = useState("urologia");
  const [currentSlide, setCurrentSlide] = useState(0);

  const services = [
    {
      category: "Urología",
      id: "urologia",
      image: "/service-urologia.jpg",
      icon: <UserPlus className="h-6 w-6" />,
      items: [
        "Cirugía laparoscópica", "Cirugía de Hiperplasia de próstata", "Mallas anti-incontinencia",
        "Tratamiento invasivo de disfunción eréctil", "Vasectomía", "Circuncisión",
        "Cirugía de tumores del riñon, vejiga y próstata", "Cirugía de cálculos renales", "Urodinamia", "Biopsia de próstata"
      ]
    },
    {
      category: "Ginecología",
      id: "ginecologia",
      image: "/service-ginecologia.png",
      icon: <Activity className="h-6 w-6" />,
      items: [
        "Reparación de fistulas", "Ligadura de trompas", "Implante anticonceptivo", "Histerectomía",
        "Fisioterapia piso pélvico", "Examen de Papanicolaou", "Dispositivos intrauterinos",
        "Conización", "Cirugia de prolapso uterino", "Cesarea"
      ]
    },
    {
      category: "Dermatología",
      id: "dermatologia",
      image: "/service-dermatologia.png",
      icon: <Stethoscope className="h-6 w-6" />,
      items: [
        "Electrocauterización", "Crioterapia", "Revisión de cicatrices", "Inyección de Botox",
        "Extracción de quistes cutáneos", "Extirpación de lunar", "Dermoabrasión",
        "Cirugía dermatológica", "Exfoliación facial", "Vitíligo"
      ]
    },
    {
      category: "Cirugía General",
      id: "cirugia-general",
      image: "/service-cirugia.png",
      icon: <Scissors className="h-6 w-6" />,
      items: [
        "Cirugía laparoscópica", "Reparación de hernias", "Colecistectomía", "Cirugía de hígado y vías biliares",
        "Apendicectomía", "Quemaduras corporales", "Obstrucción intestinal", "Plicomas",
        "Apendicitis", "Colecistitis"
      ]
    },
    {
      category: "Cardiología",
      id: "cardiologia",
      image: "/service-cardiologia.png",
      icon: <Heart className="h-6 w-6" />,
      items: [
        "Prueba de esfuerzo", "Holter", "Riesgos cardiológicos", "Síndrome metabólico", "Miocarditis",
        "Defectos congénitos", "Edema pulmonar", "Taquicardia", "Bradicardia", "Angina de pecho"
      ]
    }
  ];

  const carouselImages = [
    { src: "/carousel-tower-real.jpg", title: "Torre de Consultorios El Golf", description: "Infraestructura antisísmica con comunicación directa a la Clínica. Seguridad garantizada en todos los niveles." },
    { src: "/landing_hero_bg_v2_1768264302036.png", title: "Espacios Amplios y Seguros", description: "Recepción ventilada y protocolos rigurosos para su tranquilidad y seguridad." },
    { src: "/carousel-staff-real.png", title: "Calidad Humana y Profesional", description: "Personal de salud de alto nivel comprometido con una atención rápida, innovadora y eficaz." },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeService = services.find(s => s.id === activeCategory) || services[0];

  return (
    <>
      {/* Wizard Categories & Service Detail */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Wizard Tabs */}
          <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveCategory(service.id)}
                className={`flex items-center gap-2 px-6 py-4 rounded-full text-sm md:text-base font-bold transition-all duration-300 shadow-md transform hover:-translate-y-1 ${activeCategory === service.id
                  ? 'bg-[#c8a882] text-white ring-4 ring-[#c8a882]/20 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
              >
                {service.icon}
                {service.category}
              </button>
            ))}
          </div>

          {/* Service Content Board */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 min-h-[500px] flex flex-col lg:flex-row">
            {/* Left: Image */}
            <div className="relative w-full lg:w-5/12 h-64 lg:h-auto overflow-hidden">
              <Image
                src={activeService.image}
                alt={activeService.category}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0c2340]/60 to-transparent lg:bg-gradient-to-t lg:from-[#0c2340]/80 lg:to-transparent" />
              <div className="absolute bottom-6 left-6 text-white z-10">
                <h3 className="text-3xl font-bold mb-2">{activeService.category}</h3>
                <p className="text-slate-200 text-sm font-medium opacity-90">Especialidad Clínica</p>
              </div>
            </div>

            {/* Right: Treatments List */}
            <div className="w-full lg:w-7/12 p-8 md:p-12">
              <h3 className="text-2xl font-bold text-[#0c2340] mb-8 flex items-center gap-3">
                <span className="p-2 bg-[#c8a882]/10 rounded-lg text-[#c8a882]">{activeService.icon}</span>
                Tratamientos y Procedimientos
              </h3>

              <div className="grid md:grid-cols-2 gap-4">
                {activeService.items.map((item, i) => (
                  <div key={i} className="flex items-center p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-[#c8a882]/30 hover:shadow-md transition-all duration-200 group">
                    <span className="w-2 h-2 rounded-full bg-[#c8a882] mr-3 group-hover:scale-125 transition-transform" />
                    <span className="text-slate-700 font-medium text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-slate-100 flex justify-end">
                <Link href="/book">
                  <Button className="bg-[#0c2340] hover:bg-[#1a3a5f] text-white rounded-full px-8 py-6 h-auto text-lg shadow-lg hover:shadow-xl transition-all">
                    Agendar Cita en {activeService.category}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Full Width Carousel */}
      <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-slate-900">
        {carouselImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Image
              src={img.src}
              alt={img.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute inset-0 flex items-center justify-center text-center p-4">
              <div className="max-w-4xl animate-fade-in-up">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-xl">{img.title}</h2>
                <p className="text-xl text-slate-200 mb-8 font-light tracking-wide max-w-2xl mx-auto">{img.description}</p>
                <Link href="/contacto">
                  <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900 rounded-full px-8">
                    Contáctanos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all">
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all">
          <ChevronRight className="w-8 h-8" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {carouselImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}
