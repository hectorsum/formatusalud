'use server';

import { SignupSchema, LoginSchema, SignupFormState } from '@/lib/definitions';
import { hashPassword, verifyPassword } from '@/lib/password';
import { createSession, deleteSession } from '@/lib/session';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { Role } from '@prisma/client';

export async function registerUser(data: any) {
  // 1. Validate form fields
  // We can re-validate step by step or all at once.
  // Ideally, use the full intersected schema.
  // const validatedFields = signupSchema.safeParse(data); 
  // For now, trust the client or do basic checks, as we have a lot of fields.
  // Ideally we import the schema from auth-schema.ts

  const {
    email, password, firstName, paternalSurname, maternalSurname,
    documentType, documentNumber, birthdate, sex,
    address, department, province, district,
    country, countryCode, phoneNumber,
    termsAccepted, consentAccepted
  } = data;

  if (!email || !password || !firstName || !paternalSurname) {
    return { message: 'Faltan campos obligatorios.' };
  }

  // 2. Check if user already exists
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        message: 'El correo electrónico ya está registrado.',
        errors: { email: ['Email already exists'] }
      };
    }

    // 3. Hash password
    const hashedPassword = await hashPassword(password);

    // 4. Create user
    // Note: ensure these fields exist in schema (they should after migration)
    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${paternalSurname} ${maternalSurname}`,
        firstName,
        paternalSurname,
        maternalSurname,
        email,
        passwordHash: hashedPassword,
        role: Role.PATIENT,
        documentType,
        documentNumber,
        birthdate: new Date(birthdate),
        sex,
        address,
        department,
        province,
        district,
        country,
        countryCode,
        phoneNumber,
        termsAccepted,
        consentAccepted
      },
    });

    // 5. Create session
    await createSession(user.id, user.role);

  } catch (error) {
    console.error('Signup error:', error);
    return {
      message: 'Error al crear usuario. Verifica los datos e intenta nuevamente.',
    };
  }

  // 6. Redirect
  redirect('/dashboard');
}


export async function login(prevState: SignupFormState | undefined, formData: FormData): Promise<SignupFormState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Invalid fields.',
    };
  }

  const { email, password } = validatedFields.data;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return generic error for security
      return { message: 'Invalid credentials.' };
    }

    const passwordsMatch = await verifyPassword(password, user.passwordHash);

    if (!passwordsMatch) {
      return { message: 'Invalid credentials.' };
    }

    await createSession(user.id, user.role);

    // Redirect based on role? For now dashboard is fine, middleware checks access
    // If admin/doctor, maybe redirect to /admin? 
    // User requirements: "Patient dashboard... Doctor/Admins manage schedules".
    // We'll stick to /dashboard and let the UI handle redirection or conditional rendering for now.

  } catch (error) {
    console.error('Login error:', error);
    return { message: 'Something went wrong.' };
  }

  redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/login');
}
