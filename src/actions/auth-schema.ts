import { z } from 'zod';

export const documentTypes = ['DNI', 'CE', 'PASAPORTE'] as const;
export const sexTypes = ['Masculino', 'Femenino'] as const;

export const signupSchemaStep1 = z.object({
  documentType: z.enum(documentTypes, {
    errorMap: () => ({ message: 'Seleccione un tipo de documento válido.' }),
  }),
  documentNumber: z.string().min(1, 'El número de documento es requerido.'),
  birthdate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Ingrese una fecha válida.',
  }),
  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'Debe aceptar los términos y condiciones.' }),
  }),
  consentAccepted: z.boolean().optional(),
});

export const signupSchemaStep2 = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  paternalSurname: z.string().min(2, 'El apellido paterno es requerido.'),
  maternalSurname: z.string().min(2, 'El apellido materno es requerido.'),
  sex: z.enum(sexTypes, {
    errorMap: () => ({ message: 'Seleccione su sexo.' }),
  }),
  country: z.string().min(1, 'Seleccione un país.'),
  department: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  address: z.string().min(5, 'Ingrese una dirección válida.'),
});

// Refinement to ensure location fields are present if country is Peru
// Note: Implementation might vary, handled in UI or refined here.
// For now, allow optional in schema but enforce in UI conditionally.

export const signupSchemaStep3 = z.object({
  email: z.string().email('Ingrese un correo electrónico válido.'),
  countryCode: z.string().default('+51'),
  phoneNumber: z.string().regex(/^\d{9,}$/, 'Ingrese un número de celular válido (mínimo 9 dígitos).'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres.')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula.')
    .regex(/[a-z]/, 'Debe contener al menos una minúscula.')
    .regex(/[0-9]/, 'Debe contener al menos un número.')
    .regex(/[@$!%*?&]/, 'Debe contener al menos un carácter especial (@$!%*?&).'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden.",
  path: ["confirmPassword"],
});

export const signupSchema = z.intersection(
  z.intersection(signupSchemaStep1, signupSchemaStep2),
  signupSchemaStep3
);

export type SignupFormData = z.infer<typeof signupSchema>;
