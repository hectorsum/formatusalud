'use client'

import { useState, useTransition } from 'react';
// import { Calendar } from '@/components/ui/calendar'; // Removed unused import to fix build
import { format, addDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Loader2, Check } from 'lucide-react';
import { toggleSlot } from '@/actions/availability';
import { cn } from '@/lib/utils'; // Assuming this exists, typical in shadcn

// We'll use a simple native date picker style or a custom calendar if available.
// Let's stick to a robust custom view for the grid.

type Slot = {
  id: string;
  startTime: Date;
  isAvailable: boolean;
};

// Initial state passed from server
export default function AvailabilityManager({ initialSlots, dateStr }: { initialSlots: Slot[], dateStr: string }) {
  // Parse date string as local time explicitly to avoid UTC shift
  const [date, setDate] = useState<Date | undefined>(() => {
    if (!dateStr) return new Date();
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  });

  const [slots, setSlots] = useState<Slot[]>(initialSlots);
  const [isPending, startTransition] = useTransition();

  // Helper to check if a specific hour is available in the current fetched slots
  // We need to compare against the hour in appropriate timezone.
  // Assuming server returns UTC dates, we convert to local hour (or strict timezone if we enforce it)
  const isSlotAvailable = (hour: number) => {
    return slots.some(s => {
      // Convert UTC string to Date, then get hours.
      // If DB has 14:00 UTC (9:00 Peru), getHours() on a machine in Peru gives 9.
      // But we need to be sure.
      const d = new Date(s.startTime);
      return d.getHours() === hour && s.isAvailable;
    });
  };

  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    setDate(newDate);
    // Format as YYYY-MM-DD local
    const y = newDate.getFullYear();
    const m = String(newDate.getMonth() + 1).padStart(2, '0');
    const d = String(newDate.getDate()).padStart(2, '0');
    const formatted = `${y}-${m}-${d}`;

    // Use router for smoother navigation instead of full reload
    // But we need to ensure the page re-renders with new data.
    // Since page.tsx fetches data based on URL, router.push is fine.
    window.location.href = `/disponibilidad?date=${formatted}`;
  };

  const handleToggle = (hour: number) => {
    if (!date) return;
    const isAvailable = isSlotAvailable(hour);

    // Construct date string YYYY-MM-DD
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const dateString = `${y}-${m}-${d}`;

    // Optimistic Update
    const newSlots = isAvailable
      ? slots.filter(s => new Date(s.startTime).getHours() !== hour) // Remove
      : [...slots, {
        id: 'temp',
        // Create a fake date object that returns correct hour locally for immediate UI feedback
        startTime: new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour),
        isAvailable: true
      }];

    setSlots(newSlots as Slot[]);

    startTransition(async () => {
      const result = await toggleSlot(dateString, hour, !isAvailable);
      if (!result.success) {
        alert(result.message || 'Error updating slot');
        window.location.reload();
      }
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {/* Calendar Selector */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 md:col-span-1">
        <h3 className="font-bold text-[#0c2340] mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" /> Seleccionar Fecha
        </h3>
        {/* Simple Date Input for robustness if Calendar component is complex */}
        <input
          type="date"
          value={date ? format(date, 'yyyy-MM-dd') : ''}
          onChange={(e) => {
            if (!e.target.value) return;
            // Manual parse to prevent timezone shift (YYYY-MM-DD to Local Midnight)
            const [y, m, d] = e.target.value.split('-').map(Number);
            handleDateSelect(new Date(y, m - 1, d));
          }}
          className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#c8a882] outline-none"
        />
        <p className="text-xs text-slate-500 mt-4">
          Selecciona un día para gestionar tus horas de atención.
        </p>
      </div>

      {/* Slots Grid */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 md:col-span-2">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-[#0c2340] flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" /> Horarios: {date && format(date, "EEEE d 'de' MMMM", { locale: es })}
            </h3>
          </div>
          {isPending && <Loader2 className="w-4 h-4 animate-spin text-[#c8a882]" />}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 9 }).map((_, i) => {
            const hour = 9 + i; // 9:00 to 17:00
            const active = isSlotAvailable(hour);
            return (
              <button
                key={hour}
                onClick={() => handleToggle(hour)}
                disabled={isPending}
                className={cn(
                  "p-3 rounded-lg border text-center transition-all relative overflow-hidden",
                  active
                    ? "bg-[#c8a882] text-white border-[#c8a882] shadow-sm hover:bg-[#b89772]"
                    : "bg-slate-50 border-slate-200 text-slate-400 hover:border-[#c8a882] hover:text-[#c8a882]"
                )}
              >
                <span className="block font-bold text-lg">{hour}:00</span>
                <span className="text-[10px] uppercase tracking-wider font-medium">
                  {active ? 'Disponible' : 'Cerrado'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
