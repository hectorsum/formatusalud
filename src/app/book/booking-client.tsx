'use client';

import { useState } from 'react';
import { Doctor, User, AvailabilitySlot } from '@prisma/client';
import { Button, Label, Input } from '@/components/ui/core';
import { getAvailableSlots, bookAppointment } from '@/actions/appointment';
import { Calendar as CalendarIcon, Clock, User as UserIcon, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type DoctorWithUser = Doctor & { user: User };

export function BookingClient({ doctors }: { doctors: DoctorWithUser[] }) {
  const router = useRouter();
  const [filterSpecialty, setFilterSpecialty] = useState<string>('ALL');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'booking' | 'success' | 'date_search'>('idle');
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    setDate(newDate);
    if (selectedDoctorId && newDate) {
      setLoadingSlots(true);
      setBookingStatus('date_search');
      try {
        const fetchedSlots = await getAvailableSlots(selectedDoctorId, newDate);
        setSlots(fetchedSlots);
      } finally {
        setLoadingSlots(false);
        setBookingStatus('idle');
      }
    }
  };

  const handleBook = async () => {
    if (!selectedSlotId) return;
    setBookingStatus('booking');

    const result = await bookAppointment(selectedSlotId);

    if (result.success) {
      setBookingStatus('success');
      setOrderId(result.orderId || null);
      // In real app: Initialize Culqi with result.orderId and result.culqiPublicKey
      // Culqi.settings({ title: 'FormatuSalud', currency: 'PEN', description: 'Consultation', amount: 15000 });
      // Culqi.open();
    } else {
      alert(result.message || 'Booking failed');
      setBookingStatus('idle');
    }
  };

  if (doctors.length === 0) {
    return <div className="text-center text-slate-500">No doctors available.</div>;
  }

  if (bookingStatus === 'success') {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="mx-auto h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Appointment Booked!</h2>
        <p className="text-slate-600">
          Your appointment is pending payment. <br />
          Order ID: <span className="font-mono bg-slate-100 px-2 py-1 rounded">{orderId}</span>
        </p>
        <div className="rounded-md bg-yellow-50 p-4 text-sm text-yellow-800 border border-yellow-200">
          Payment integration is simulated. In production, the Culqi payment modal would open now.
        </div>
        <div className="flex justify-center gap-4 mt-8">
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          <Button variant="outline" onClick={() => window.location.reload()}>Book Another</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 1. Doctor Selection */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-teal-600" /> 1. Select Specialist
          </h3>

          {/* Specialty Filter */}
          <select
            className="rounded-md border-slate-300 py-2 pl-3 pr-10 text-sm focus:border-accent focus:outline-none focus:ring-accent"
            onChange={(e) => {
              // Reset selection when filter changes
              setSelectedDoctorId('');
              setSlots([]);
              setDate('');
              // Filter logic handled in render
              const val = e.target.value;
              // Set a state for filter (need to add this state)
              setFilterSpecialty(val);
            }}
          >
            <option value="ALL">All Specialties</option>
            {Array.from(new Set(doctors.map(d => d.specialty))).map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {doctors
            .filter(doc => filterSpecialty === 'ALL' || doc.specialty === filterSpecialty)
            .map((doc) => (
              <div
                key={doc.id}
                onClick={() => { setSelectedDoctorId(doc.id); setSlots([]); setDate(''); }}
                className={`cursor-pointer rounded-lg border p-4 transition-all ${selectedDoctorId === doc.id
                  ? 'border-accent bg-teal-50 ring-1 ring-accent'
                  : 'border-slate-200 hover:border-teal-200 hover:bg-slate-50'
                  }`}
              >
                <div className="font-medium text-slate-900">{doc.user.name}</div>
                <div className="text-sm text-slate-500">{doc.specialty}</div>
              </div>
            ))}
        </div>
        {doctors.filter(doc => filterSpecialty === 'ALL' || doc.specialty === filterSpecialty).length === 0 && (
          <p className="text-sm text-slate-500 italic">No specialists found for this category.</p>
        )}
      </div>

      {/* 2. Date Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-teal-600" /> 2. Select Date
        </h3>
        <div className="max-w-xs">
          <Input
            type="date"
            value={date}
            onChange={handleDateChange}
            min={new Date().toISOString().split('T')[0]} // Disable past dates
            className="focus:ring-accent focus:border-accent"
          />
        </div>
      </div>

      {/* 3. Slot Selection */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-teal-600" /> 3. Select Time
        </h3>

        {loadingSlots ? (
          <div className="text-slate-500 animate-pulse">Checking availability...</div>
        ) : slots.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {slots.map((slot) => {
              const start = new Date(slot.startTime);
              const timeString = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              return (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlotId(slot.id)}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${selectedSlotId === slot.id
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                    }`}
                >
                  {timeString}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-slate-500 text-sm italic">
            {date ? 'No slots available for this date.' : 'Please select a date.'}
          </div>
        )}
      </div>

      {/* 4. Action */}
      <div className="pt-6 border-t border-slate-200">
        <Button
          size="lg"
          className="w-full sm:w-auto"
          disabled={!selectedSlotId || bookingStatus === 'booking'}
          onClick={handleBook}
        >
          {bookingStatus === 'booking' ? 'Processing...' : 'Confirm Appointment'}
        </Button>
        {selectedSlotId && (
          <p className="mt-2 text-sm text-slate-500">
            Price: <span className="font-semibold text-slate-900">150.00 PEN</span>
          </p>
        )}
      </div>
    </div>
  );
}
