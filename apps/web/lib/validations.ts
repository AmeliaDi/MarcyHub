import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
});

export const taskSchema = z.object({
  subjectClave: z.string().min(1, 'Materia requerida'),
  title: z.string().min(1, 'Título requerido').max(200),
  desc: z.string().max(1000).optional(),
  due: z.string().refine(val => !isNaN(Date.parse(val)), 'Fecha inválida'),
  completed: z.boolean().default(false),
  fileData: z.string().nullable().optional()
});

export const resourceSchema = z.object({
  subjectClave: z.string().min(1, 'Materia requerida'),
  type: z.enum(['pdf', 'link', 'video', 'other']).default('pdf'),
  title: z.string().min(1, 'Título requerido').max(200),
  author: z.string().max(100).optional(),
  link: z.string().url('URL inválida').optional().or(z.literal('')),
  unit: z.string().max(100).optional(),
  uploadedBy: z.string().max(100).optional(),
  fileData: z.string().nullable().optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
export type ResourceInput = z.infer<typeof resourceSchema>;
