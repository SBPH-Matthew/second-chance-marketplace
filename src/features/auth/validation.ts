import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2).max(60),
    lastName: z.string().trim().min(2).max(60),
    email: z.string().trim().email(),
    phone: z.string().trim().min(7).max(20),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
    role: z.enum(['BUYER', 'SELLER']),
    goals: z.array(z.string().min(2).max(60)).max(8).optional(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
