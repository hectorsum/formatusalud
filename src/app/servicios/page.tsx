import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/core';
import Link from 'next/link';
import { Stethoscope, Activity, Scissors, Heart, UserPlus } from 'lucide-react'; // Icons

export default function ServiciosPage() {
  const services = [
    {
      category: "Urología",
      id: "urologia",
      icon: <UserPlus className="h-8 w-8 text-[#029d9b]" />,
      items: [
        "Cirugía laparoscópica",
        "Cirugía de Hiperplasia de próstata",
        "Mallas anti-incontinencia",
        "Tratamiento invasivo de disfunción eréctil",
        "Vasectomía",
        "Circuncisión",
        "Cirugía de tumores del riñon, vejiga y próstata",
        "Cirugía de cálculos renales",
        "Urodinamia",
        "Biopsia de próstata"
      ]
    },
    {
      category: "Ginecología",
      id: "ginecologia",
      icon: <Activity className="h-8 w-8 text-[#029d9b]" />,
      items: [
        "Reparación de fistulas",
        "Ligadura de trompas",
        "Implante anticonceptivo",
        "Histerectomía",
        "Fisioterapia piso pélvico",
        "Examen de Papanicolaou",
        "Dispositivos intrauterinos",
        "Conización",
        "Cirugia de prolapso uterino",
        "Cesarea"
      ]
    },
    {
      category: "Dermatología",
      id: "dermatologia",
      icon: <Stethoscope className="h-8 w-8 text-[#029d9b]" />,
      items: [
        "Electrocauterización",
        "Crioterapia",
        "Revisión de cicatrices",
        "Inyección de Botox",
        "Extracción de quistes cutáneos",
        "Extirpación de lunar",
        "Dermoabrasión",
        "Cirugía dermatológica",
        "Exfoliación facial",
        "Vitíligo"
      ]
    },
    {
      category: "Cirugía General",
      id: "cirugia-general",
      icon: <Scissors className="h-8 w-8 text-[#029d9b]" />,
      items: [
        "Cirugía laparoscópica",
        "Reparación de hernias",
        "Colecistectomía",
        "Cirugía de hígado y vías biliares",
        "Apendicectomía",
        "Quemaduras corporales",
        "Obstrucción intestinal",
        "Plicomas",
        "Apendicitis",
        "Colecistitis"
      ]
    },
    {
      category: "Cardiología",
      id: "cardiologia",
      icon: <Heart className="h-8 w-8 text-[#029d9b]" />,
      items: [
        "Prueba de esfuerzo",
        "Holter",
        "Riesgos cardiológicos",
        "Síndrome metabólico",
        "Miocarditis",
        "Defectos congénitos",
        "Edema pulmonar",
        "Taquicardia",
        "Bradicardia",
        "Angina de pecho"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0c2340] text-white py-20 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Nuestros Servicios Médicos</h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Ofrecemos una amplia gama de especialidades con tecnología de punta y profesionales expertos para cuidar de su bienestar integral.
          </p>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="space-y-16">
            {services.map((service, idx) => (
              <div key={service.id} id={service.id} className="scroll-mt-28">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100">
                    {service.icon}
                  </div>
                  <h2 className="text-3xl font-bold text-[#0c2340]">{service.category}</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {service.items.map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-lg border border-slate-200 hover:border-teal-400 hover:shadow-md transition duration-200 group">
                      <div className="flex items-start gap-3">
                        <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-500 group-hover:bg-[#0c2340] transition duration-300"></span>
                        <span className="text-slate-700 font-medium">{item}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {idx < services.length - 1 && <hr className="mt-16 border-t border-slate-200" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="bg-[#029d9b] py-16 text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">¿Necesita atención especializada?</h2>
          <p className="text-lg text-teal-100 mb-8 max-w-2xl mx-auto text-center">
            No espere más. Agende su cita hoy mismo con nuestros expertos.
          </p>
          <Link href="/book">
            <Button size="lg" className="bg-white text-[#029d9b] hover:bg-slate-100 shadow-xl border-none">
              Agendar Cita Ahora
            </Button>
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
