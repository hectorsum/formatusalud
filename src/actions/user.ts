'use server'

import { prisma } from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const profileSchema = z.object({
  phoneNumber: z.string().min(9, "El número debe tener al menos 9 dígitos").optional().or(z.literal('')),
  address: z.string().min(5, "La dirección es muy corta").optional().or(z.literal('')),
  department: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
});

export type ProfileState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function updateProfile(prevState: ProfileState, formData: FormData): Promise<ProfileState> {
  const session = await verifySession();
  if (!session || !session.userId) {
    return { message: 'No autenticado', success: false };
  }

  const rawData = {
    phoneNumber: formData.get('phoneNumber'),
    address: formData.get('address'),
    department: formData.get('department'),
    province: formData.get('province'),
    district: formData.get('district'),
  };

  const validated = profileSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      errors: validated.error.flatten().fieldErrors,
      message: 'Revise los campos del formulario.',
      success: false
    };
  }

  try {
    await prisma.user.update({
      where: { id: session.userId },
      data: {
        phoneNumber: validated.data.phoneNumber,
        address: validated.data.address,
        department: validated.data.department,
        province: validated.data.province,
        district: validated.data.district,
      }
    });

    revalidatePath('/perfil');
    return { success: true, message: 'Perfil actualizado correctamente.' };
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Error al actualizar el perfil.' };
  }
}
