'use server'

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Schema for validation
const claimSchema = z.object({
  firstName: z.string().min(1, "El nombre es obligatorio"),
  paternalSurname: z.string().min(1, "El apellido paterno es obligatorio"),
  maternalSurname: z.string().min(1, "El apellido materno es obligatorio"),
  documentType: z.enum(["DNI", "CE", "PASSPORT"], { required_error: "Seleccione un tipo de documento" }),
  documentNumber: z.string().min(8, "Número de documento inválido"),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  cellphone: z.string().min(9, "Celular inválido"),
  address: z.string().min(5, "Dirección obligatoria"),
  district: z.string().min(1, "Distrito obligatorio"),
  department: z.string().min(1, "Departamento obligatorio"),
  isMinor: z.boolean().default(false),
  affectedPersonType: z.enum(["PATIENT", "THIRD_PARTY"]),
  claimType: z.enum(["CLAIM", "COMPLAINT"]),
  claimDetail: z.string().min(20, "El detalle debe tener al menos 20 caracteres"),
  // We don't validate files in Zod here as we handle them from FormData directly, 
  // but we could add basic checks if needed.
});

export type ClaimState = {
  errors?: {
    [key: string]: string[];
  };
  message?: string;
  success?: boolean;
};

export async function submitClaim(prevState: ClaimState, formData: FormData): Promise<ClaimState> {
  // Extract scalar data
  const rawData = {
    firstName: formData.get('firstName'),
    paternalSurname: formData.get('paternalSurname'),
    maternalSurname: formData.get('maternalSurname'),
    documentType: formData.get('documentType'),
    documentNumber: formData.get('documentNumber'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    cellphone: formData.get('cellphone'),
    address: formData.get('address'),
    district: formData.get('district'),
    department: formData.get('department'),
    isMinor: formData.get('isMinor') === 'on',
    affectedPersonType: formData.get('affectedPersonType'),
    claimType: formData.get('claimType') || 'CLAIM',
    claimDetail: formData.get('claimDetail'),
  };

  // Validate scalars
  const validatedFields = claimSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Por favor revise los campos del formulario.',
      success: false
    };
  }

  // Handle Files
  const files = formData.getAll('files') as File[];
  const storedFilePaths: string[] = [];

  try {
    if (files && files.length > 0) {
      const uploadDir = join(process.cwd(), 'public', 'uploads', 'claims');
      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        if (file.size > 0 && file.name !== 'undefined') {
          const buffer = Buffer.from(await file.arrayBuffer());
          // Unique filename: timestamp-sanitized_name
          const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
          const filePath = join(uploadDir, uniqueName);

          await writeFile(filePath, buffer);
          storedFilePaths.push(`/uploads/claims/${uniqueName}`);
        }
      }
    }

    const data = validatedFields.data;

    // Save to DB
    await prisma.claim.create({
      data: {
        firstName: data.firstName,
        paternalSurname: data.paternalSurname,
        maternalSurname: data.maternalSurname,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        email: data.email,
        phone: data.phone || null,
        cellphone: data.cellphone,
        address: data.address,
        district: data.district,
        department: data.department,
        isMinor: data.isMinor,
        affectedPersonType: data.affectedPersonType as any,
        claimType: data.claimType as any,
        claimDetail: data.claimDetail,
        attachmentPath: storedFilePaths.length > 0 ? storedFilePaths.join(',') : null,
      }
    });

    return {
      success: true,
      message: "Su reclamo ha sido registrado correctamente."
    };

  } catch (error) {
    console.error("Error creating claim:", error);
    return {
      success: false,
      message: 'Ocurrió un error al registrar el reclamo. Inténtelo nuevamente.'
    };
  }
}
