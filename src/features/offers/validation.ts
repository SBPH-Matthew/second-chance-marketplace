import { z } from 'zod'

export const createOfferSchema = z.object({
  listingId: z.string().min(1),
  amountCents: z.number().int().positive(),
})

export const updateOfferSchema = z.object({
  offerId: z.string().min(1),
  action: z.enum(['EDIT', 'CANCEL', 'COUNTER', 'ACCEPT', 'DECLINE']),
  amountCents: z.number().int().positive().optional(),
  note: z.string().max(200).optional(),
})

export const revealContactSchema = z.object({
  listingId: z.string().min(1),
  field: z.enum(['phone', 'email']),
})
