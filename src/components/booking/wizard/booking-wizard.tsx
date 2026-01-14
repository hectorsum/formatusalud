'use client';

import { useState } from 'react';
import { Doctor, User, AvailabilitySlot } from '@prisma/client';
import { AnimatePresence, motion } from 'framer-motion';
import { StepType } from './step-type';
import { StepSearchMethod } from './step-search-method';
import { StepSpecialty } from './step-specialty';
import { StepDoctorSearch } from './step-doctor-search';
import { StepAvailability } from './step-availability';
import { StepConfirmation } from './step-confirmation';
import { Button } from '@/components/ui/core';
import { ChevronLeft } from 'lucide-react';

export type DoctorWithUser = Doctor & { user: User };

export type WizardState = {
  step: number;
  appointmentType: 'virtual' | 'in-person' | null;
  searchMethod: 'specialty' | 'medic' | null;
  selectedSpecialty: string | null;
  selectedDoctor: DoctorWithUser | null;
  selectedDate: string;
  selectedSlot: AvailabilitySlot | null;
};

const STEPS = {
  TYPE: 1,
  SEARCH_METHOD: 2,
  SELECT_SPECIALTY_OR_MEDIC: 3, // Branch point
  SELECT_TIME: 4,
  CONFIRMATION: 5,
};

export function BookingWizard({ doctors }: { doctors: DoctorWithUser[] }) {
  const [state, setState] = useState<WizardState>({
    step: STEPS.TYPE,
    appointmentType: null,
    searchMethod: null,
    selectedSpecialty: null,
    selectedDoctor: null,
    selectedDate: new Date().toISOString().split('T')[0],
    selectedSlot: null,
  });

  const goBack = () => {
    setState((prev) => {
      // Logic to determine where to go back to
      if (prev.step === STEPS.SEARCH_METHOD) return { ...prev, step: STEPS.TYPE };
      if (prev.step === STEPS.SELECT_SPECIALTY_OR_MEDIC) return { ...prev, step: STEPS.SEARCH_METHOD };
      
      // If we are at SELECT_TIME, it implies we came from either Specialty->Doctor or Direct Doctor Search
      // Since select doctor is part of step 3 in both branches (logically), we go back to reset doctor selection if needed
      // Actually, my plan had Specialty -> Doctor as separate sub-steps? 
      // Let's refine: 
      // Step 3 (Branch A): Select Specialty -> Select Doctor
      // Step 3 (Branch B): Search Doctor
      // For simplicity in this container, we can treat "Select Doctor" as the end of Step 3.
      
      if (prev.step === STEPS.SELECT_TIME) return { ...prev, step: STEPS.SELECT_SPECIALTY_OR_MEDIC, selectedSlot: null };
      if (prev.step === STEPS.CONFIRMATION) return { ...prev, step: STEPS.SELECT_TIME };
      
      return { ...prev, step: Math.max(1, prev.step - 1) };
    });
  };

  const updateState = (updates: Partial<WizardState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setState((prev) => ({ ...prev, step: prev.step + 1 }));
  };

  return (
    <div className="max-w-3xl mx-auto min-h-[500px] relative">
      {state.step > 1 && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={goBack} 
          className="absolute top-0 left-0 text-slate-500 hover:text-slate-800"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Atrás
        </Button>
      )}

      <AnimatePresence mode="wait">
        {state.step === STEPS.TYPE && (
          <motion.div
            key="step-type"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepType 
              onSelect={(type) => updateState({ appointmentType: type, step: STEPS.SEARCH_METHOD })} 
            />
          </motion.div>
        )}

        {state.step === STEPS.SEARCH_METHOD && (
          <motion.div
            key="step-method"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepSearchMethod 
              onSelect={(method) => updateState({ searchMethod: method, step: STEPS.SELECT_SPECIALTY_OR_MEDIC })} 
            />
          </motion.div>
        )}

        {state.step === STEPS.SELECT_SPECIALTY_OR_MEDIC && state.searchMethod === 'specialty' && (
          <motion.div
            key="step-specialty"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepSpecialty 
              doctors={doctors}
              onSelect={(doctor) => updateState({ selectedDoctor: doctor, step: STEPS.SELECT_TIME })}
            />
          </motion.div>
        )}

        {state.step === STEPS.SELECT_SPECIALTY_OR_MEDIC && state.searchMethod === 'medic' && (
          <motion.div
            key="step-medic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepDoctorSearch
              doctors={doctors}
              onSelect={(doctor) => updateState({ selectedDoctor: doctor, step: STEPS.SELECT_TIME })}
            />
          </motion.div>
        )}

        {state.step === STEPS.SELECT_TIME && state.selectedDoctor && (
           <motion.div
           key="step-time"
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
         >
           <StepAvailability 
             doctor={state.selectedDoctor}
             date={state.selectedDate}
             setDate={(d) => updateState({ selectedDate: d })}
             onSelectSlot={(slot) => updateState({ selectedSlot: slot, step: STEPS.CONFIRMATION })}
           />
         </motion.div>
        )}

        {state.step === STEPS.CONFIRMATION && state.selectedDoctor && state.selectedSlot && (
           <motion.div
           key="step-confirm"
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
         >
           <StepConfirmation 
             state={state}
             onRestart={() => setState({ ...state, step: STEPS.TYPE, appointmentType: null, searchMethod: null, selectedDoctor: null, selectedSlot: null })}
           />
         </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
