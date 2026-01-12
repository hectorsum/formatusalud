'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/core';
import { X, Award, FileBadge, CheckCircle, GraduationCap } from 'lucide-react';
import Image from 'next/image';

interface Doctor {
  name: string;
  specialty: string;
  cmp: string;
  rne: string;
  bio: string;
  image: string;
  education: string[];
  services: string[];
}

const doctors: Doctor[] = [
  {
    name: "Dr. Kilder García Murga",
    specialty: "Urólogo",
    cmp: "55789", // Placeholder
    rne: "34211", // Placeholder
    bio: "Urólogo peruano con más de 7 años de experiencia. Miembro asociado de la Sociedad Peruana de Urología y Confederación Americana de Urología. Especialista en Endourología y Urología General.",
    image: "/dr-kilder-garcia.jpg",
    education: [
      "Médico Cirujano - Universidad Nacional de Trujillo",
      "Especialidad en Urología - Hospital Belén de Trujillo",
      "Miembro Sociedad Peruana de Urología"
    ],
    services: [
      "Cirugía de cálculos renales",
      "Tratamiento de próstata (Láser/RTU)",
      "Cirugía laparoscópica",
      "Vasectomía sin bisturí"
    ]
  },
  {
    name: "Dra. Laura Romero",
    specialty: "Dermatóloga",
    cmp: "66712", // Placeholder
    rne: "40123", // Placeholder
    bio: "Estudió medicina humana en la Universidad San Martín de Porres (quinto superior). Especialista en Dermatología por el Hospital Víctor Lazarte Echegaray. Capacitada en Dermatopatología y Dermatocirugía en México.",
    image: "/dra-laura-romero.jpg",
    education: [
      "Médico Cirujano - Universidad San Martín de Porres",
      "Especialidad en Dermatología - Hospital Víctor Lazarte",
      "Rotación Internacional - Instituto Dermatológico de Jalisco, México"
    ],
    services: [
      "Dermatología Clínica y Estética",
      "Biopsias de piel",
      "Tratamiento de acné y secuelas",
      "Rejuvenecimiento facial"
    ]
  },
  {
    name: "Dr. Juan Carlos Valverde",
    specialty: "Coloproctólogo y Cirujano General",
    cmp: "71234", // Placeholder
    rne: "39876", // Placeholder
    bio: "Médico cirujano especializado en Coloproctología (Cólon y recto) en la Universidad Peruana Cayetano Heredia y en Brasil. Cirujano General Laparoscopista egresado de la Universidad Nacional Mayor de San Marcos.",
    image: "/dr-juan-valverde.jpg",
    education: [
      "Cirujano General - Universidad Nacional Mayor de San Marcos",
      "Subespecialidad Coloproctología - UPCH / Brasil",
      "Cirugía Laparoscópica Avanzada"
    ],
    services: [
      "Cirugía de colon y recto",
      "Tratamiento de hemorroides y fístulas",
      "Colonoscopia",
      "Cirugía de vesícula biliar"
    ]
  }
];

export function DoctorsList() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState<string>('ALL');

  // Extract unique specialties
  const specialties = Array.from(new Set(doctors.map(d => d.specialty)));

  const filteredDoctors = doctors.filter(doc =>
    filterSpecialty === 'ALL' || doc.specialty === filterSpecialty
  );

  return (
    <>
      {/* Filter Section */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          <button
            onClick={() => setFilterSpecialty('ALL')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${filterSpecialty === 'ALL'
              ? 'bg-[#0c2340] text-white shadow-md'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            Todos
          </button>
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setFilterSpecialty(spec)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${filterSpecialty === spec
                ? 'bg-[#029d9b] text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {spec}
            </button>
          ))}
        </div>
        <div className="text-sm text-slate-500 font-medium">
          Mostrando {filteredDoctors.length} {filteredDoctors.length === 1 ? 'especialista' : 'especialistas'}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-10">
        {filteredDoctors.map((doc, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100 hover:shadow-2xl transition duration-300 group flex flex-col">
            <div className="h-80 relative overflow-hidden bg-slate-100">
              <Image
                src={doc.image}
                alt={doc.name}
                fill
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0c2340]/90 to-transparent opacity-60 group-hover:opacity-80 transition"></div>
            </div>
            <div className="p-6 flex-grow flex flex-col relative">
              <h3 className="text-xl font-bold text-[#0c2340] mb-1">{doc.name}</h3>
              <p className="text-[#029d9b] font-bold text-sm mb-4 uppercase tracking-wide">{doc.specialty}</p>

              <div className="flex gap-4 mb-6 text-xs text-slate-500 font-mono border-t border-b border-slate-100 py-2">
                <span className="flex items-center gap-1"><FileBadge className="w-3 h-3 text-[#c8a882]" /> CMP: {doc.cmp}</span>
                <span className="flex items-center gap-1"><Award className="w-3 h-3 text-[#c8a882]" /> RNE: {doc.rne}</span>
              </div>

              <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                {doc.bio}
              </p>

              <Button
                onClick={() => setSelectedDoctor(doc)}
                className="w-full bg-white text-[#0c2340] border-2 border-[#0c2340] hover:bg-[#0c2340] hover:text-white transition-colors"
              >
                Ver Perfil Completo
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200">
            <Button
              size="sm"
              variant="ghost"
              className="absolute top-4 right-4 z-10 bg-white/50 hover:bg-white rounded-full p-2"
              onClick={() => setSelectedDoctor(null)}
            >
              <X className="w-5 h-5 text-slate-800" />
            </Button>

            <div className="flex flex-col md:flex-row">
              {/* Modal Image */}
              <div className="md:w-2/5 relative h-72 md:h-auto bg-slate-100">
                <Image
                  src={selectedDoctor.image}
                  alt={selectedDoctor.name}
                  fill
                  className="object-cover object-top"
                />
              </div>

              {/* Modal Content */}
              <div className="md:w-3/5 p-8 md:p-10 bg-slate-50">
                <div className="mb-6">
                  <h2 className="text-3xl font-bold text-[#0c2340] mb-2">{selectedDoctor.name}</h2>
                  <p className="text-xl text-[#029d9b] font-medium">{selectedDoctor.specialty}</p>
                  <div className="flex gap-4 mt-3 text-sm font-bold text-slate-600">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm"><FileBadge className="w-4 h-4 text-[#c8a882]" /> CMP: {selectedDoctor.cmp}</span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-white rounded-full shadow-sm"><Award className="w-4 h-4 text-[#c8a882]" /> RNE: {selectedDoctor.rne}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-[#0c2340] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" /> Formación
                    </h4>
                    <ul className="space-y-2">
                      {selectedDoctor.education.map((item, i) => (
                        <li key={i} className="text-slate-600 text-sm flex items-start gap-2">
                          <span className="mt-1.5 w-1.5 h-1.5 bg-slate-400 rounded-full shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#0c2340] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Servicios Destacados
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoctor.services.map((item, i) => (
                        <span key={i} className="text-xs font-semibold text-[#0c2340] bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-md">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <Button className="w-full md:w-auto bg-[#c8a882] hover:bg-[#b89772] text-white">
                      Agendar Cita con {selectedDoctor.name.split(" ")[1]}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
