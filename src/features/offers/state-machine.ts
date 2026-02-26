import { z } from 'zod'

export const offerActionSchema = z.enum([
  'MAKE',
  'EDIT',
  'CANCEL',
  'COUNTER',
  'ACCEPT',
  'DECLINE',
  'EXPIRE',
])

export type OfferAction = z.infer<typeof offerActionSchema>
export type OfferStatus = 'PENDING' | 'COUNTERED' | 'ACCEPTED' | 'CANCELLED' | 'DECLINED' | 'EXPIRED'

const transitions: Record<OfferStatus, OfferAction[]> = {
  PENDING: ['EDIT', 'CANCEL', 'COUNTER', 'ACCEPT', 'DECLINE', 'EXPIRE'],
  COUNTERED: ['EDIT', 'CANCEL', 'COUNTER', 'ACCEPT', 'DECLINE', 'EXPIRE'],
  ACCEPTED: [],
  CANCELLED: [],
  DECLINED: [],
  EXPIRED: [],
}

export function canTransition(status: OfferStatus, action: OfferAction) {
  return transitions[status].includes(action)
}

export function getNextStatus(current: OfferStatus, action: OfferAction): OfferStatus {
  if (!canTransition(current, action)) {
    throw new Error(`Invalid action ${action} for ${current}`)
  }

  if (action === 'MAKE' || action === 'EDIT') return 'PENDING'
  if (action === 'COUNTER') return 'COUNTERED'
  if (action === 'ACCEPT') return 'ACCEPTED'
  if (action === 'CANCEL') return 'CANCELLED'
  if (action === 'DECLINE') return 'DECLINED'
  return 'EXPIRED'
}
