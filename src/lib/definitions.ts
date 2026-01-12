import { z } from 'zod';
import { Role } from '@prisma/client';

export const SignupSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }).trim().toLowerCase(),
  password: z.string()
    .min(8, { message: 'Be at least 8 characters long' })
    .regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
    .regex(/[0-9]/, { message: 'Contain at least one number.' }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }).trim().toLowerCase(),
  password: z.string().min(1, { message: 'Password field must not be empty.' }),
});

export type SignupFormState = {
  errors?: {
    name?: string[];
    email?: string[];
    password?: string[];
  };
  message?: string;
} | undefined;

// Session payload type
export type SessionPayload = {
  userId: string;
  role: Role;
  expiresAt: Date;
};
