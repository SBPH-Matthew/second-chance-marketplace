import { z } from 'zod'

export const reportSchema = z.object({
  targetType: z.enum(['USER', 'LISTING', 'MESSAGE']),
  targetId: z.string().min(1),
  reason: z.string().min(10).max(500),
})

export const blockSchema = z.object({
  blockedId: z.string().min(1),
  reason: z.string().max(200).optional(),
})
