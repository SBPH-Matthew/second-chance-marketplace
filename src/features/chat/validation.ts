import { z } from 'zod'

export const createMessageSchema = z.object({
  conversationId: z.string().min(1),
  body: z.string().min(1).max(1000),
})
