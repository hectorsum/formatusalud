'use client';

import { useState, useEffect } from 'react';
import { DoctorWithUser } from './booking-wizard';
import { AvailabilitySlot } from '@prisma/client';
import { getAvailableSlots } from '@/actions/appointment';
import { Button, Input } from '@/components/ui/core';
import { Calendar, ChevronRight } from 'lucide-react';

interface StepAvailabilityProps {
  doctor: DoctorWithUser;
  date: string;
  setDate: (date: string) => void;
  onSelectSlot: (slot: AvailabilitySlot) => void;
}

export function StepAvailability({ doctor, date, setDate, onSelectSlot }: StepAvailabilityProps) {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<'today' | 'week' | 'month' | null>(null);

  useEffect(() => {
    // If no date is manually selected, default to today
    if (!date) {
        setDate(new Date().toISOString().split('T')[0]);
        setPeriodFilter('today');
    }
  }, []);

  useEffect(() => {
    if (date && doctor.id) {
      const fetchSlots = async () => {
        setLoading(true);
        try {
          let fetched: AvailabilitySlot[] = [];
          if (periodFilter === 'week') {
              // Calculate end of week (Start Date + 6 days to show a full week from the selected date)
              const startDate = new Date(date);
              const endDate = new Date(startDate);
              endDate.setDate(startDate.getDate() + 6);
              const endDateStr = endDate.toISOString().split('T')[0];
              fetched = await getAvailableSlots(doctor.id, date, endDateStr);
          } else {
              fetched = await getAvailableSlots(doctor.id, date);
          }
          setSlots(fetched);
        } catch (error) {
          console.error("Failed to fetch slots", error);
        } finally {
          setLoading(false);
        }
      };
      fetchSlots();
    }
  }, [date, doctor.id, periodFilter]);

  const handlePeriodClick = (daysToAdd: number, filter: 'today' | 'week' | 'month') => {
    const d = new Date(); // Always relative to today for "Next Week/Month" buttons logic if meant to be "from now"
    // However, user said "This Week" (Esta Semana). 
    // Let's assume "Esta Semana" means starting from Today or the current week start. 
    // For simplicity and availability context, let's start from Today.
    d.setDate(d.getDate() + daysToAdd);
    setDate(d.toISOString().split('T')[0]);
    setPeriodFilter(filter);
  };

  // Group slots by date for week view
  const groupedSlots = slots.reduce((acc, slot) => {
      const slotDate = new Date(slot.startTime).toISOString().split('T')[0];
      if (!acc[slotDate]) {
          acc[slotDate] = [];
      }
      acc[slotDate].push(slot);
      return acc;
  }, {} as Record<string, AvailabilitySlot[]>);

  // Generate array of dates for the week view columns
  const weekDates = [];
  if (periodFilter === 'week' && date) {
      for (let i = 0; i < 7; i++) {
          const d = new Date(date);
          d.setDate(d.getDate() + i);
          weekDates.push(d.toISOString().split('T')[0]);
      }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Seleccione Fecha y Hora</h2>
        <p className="text-slate-600">Verificando disponibilidad para <span className="font-semibold text-teal-700">Dr. {doctor.user.name}</span></p>
      </div>

      {/* Date Controls */}
      <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-6">
            <div className="flex gap-2">
            <button
                onClick={() => handlePeriodClick(0, 'today')}
                className={`px-4 py-2 text-sm rounded-full transition-all font-medium ${periodFilter === 'today' ? 'bg-white border-2 border-[#c8a882] text-[#c8a882] shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                Hoy
            </button>
            <button
                onClick={() => handlePeriodClick(0, 'week')}
                className={`px-4 py-2 text-sm rounded-full transition-all font-medium ${periodFilter === 'week' ? 'bg-[#c8a882] text-white shadow-md' : 'bg-[#c8a882]/80 text-white hover:bg-[#c8a882]'}`}
            >
                Esta Semana
            </button>
             {/* "Next Month" logic is a bit ambiguous with exact dates, keeping it simple for now or removing if not critical. 
                 User focused on "This Week". Let's keep "Próximo Mes" as a jump 30 days ahead single day view for now. 
             */}
            <button
                onClick={() => handlePeriodClick(30, 'month')}
                className={`px-4 py-2 text-sm rounded-full transition-all font-medium ${periodFilter === 'month' ? 'bg-white border-2 border-[#c8a882] text-[#c8a882] shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
                Próximo Mes
            </button>
            </div>
            
            <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input 
                type="date" 
                value={date} 
                onChange={(e) => { setDate(e.target.value); setPeriodFilter(null); }}
                min={new Date().toISOString().split('T')[0]}
                className="pl-10 w-full md:w-auto bg-white"
            />
            </div>
        </div>

        {/* Display Logic */}
        <div className="min-h-[200px]">
            {loading ? (
            <div className="flex justify-center items-center h-[200px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
            ) : (
                <>
                 {periodFilter === 'week' ? (
                     // Week View Columns
                     <div className="overflow-x-auto pb-4">
                         <div className="flex gap-4 min-w-max">
                             {weekDates.map((d) => {
                                 const dayDate = new Date(d);
                                 // Adjust for timezone offset issue if necessary, or just use simple formatting
                                 // Using UTC methods or splitting string prevents local timezone shift issues effectively for headers
                                 const dayParts = d.split('-');
                                 const dayObj = new Date(parseInt(dayParts[0]), parseInt(dayParts[1])-1, parseInt(dayParts[2]));
                                 
                                 const dayName = dayObj.toLocaleDateString('es-ES', { weekday: 'long' });
                                 const dateDisplay = dayObj.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                 
                                 const daySlots = groupedSlots[d] || [];

                                 return (
                                     <div key={d} className="w-40 flex-shrink-0 flex flex-col gap-2">
                                         <div className="text-center mb-2">
                                             <p className="font-bold text-slate-900 capitalize">{dayName}</p>
                                             <div className="flex items-center justify-center gap-1 text-xs text-slate-500">
                                                 <Calendar className="w-3 h-3" /> {dateDisplay}
                                             </div>
                                         </div>
                                         <div className="space-y-2">
                                             {daySlots.length > 0 ? (
                                                 daySlots.map(slot => (
                                                     <button
                                                        key={slot.id}
                                                        onClick={() => onSelectSlot(slot)}
                                                        className="w-full py-2 px-1 text-sm rounded-md border border-slate-200 bg-white hover:border-teal-500 hover:text-teal-700 transition"
                                                     >
                                                         {new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                     </button>
                                                 ))
                                             ) : (
                                                 <div className="h-8 flex items-center justify-center">
                                                     <div className="w-4 h-1 bg-slate-200 rounded-full"></div>
                                                 </div>
                                             )}
                                         </div>
                                     </div>
                                 )
                             })}
                         </div>
                     </div>
                 ) : (
                     // Single Day View (Grid)
                     slots.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {slots.map((slot) => {
                            const timeString = new Date(slot.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            return (
                                <button
                                key={slot.id}
                                onClick={() => onSelectSlot(slot)}
                                className="px-4 py-3 rounded-lg border border-slate-200 text-slate-700 font-medium hover:border-teal-500 hover:bg-teal-50 hover:text-teal-700 transition-all focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white"
                                >
                                {timeString}
                                </button>
                            );
                            })}
                        </div>
                     ) : (
                        <div className="text-center py-12">
                            <p className="text-slate-500 mb-4">No hay horarios disponibles para esta fecha.</p>
                            <Button variant="outline" onClick={() => setDate('')}>Limpiar Fecha</Button>
                        </div>
                     )
                 )}
                </>
            )}
        </div>
      </div>
    </div>
  );
}
