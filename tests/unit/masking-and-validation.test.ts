import { describe, expect, it } from 'vitest'

import { maskEmail, maskPhone } from '@/lib/mask'
import { createOfferSchema, updateOfferSchema } from '@/features/offers/validation'

describe('masking', () => {
  it('masks phone and email values by default', () => {
    expect(maskPhone('+639178359800')).toBe('***-***-00')
    expect(maskEmail('mika@example.com')).toBe('m***@***')
  })
})

describe('offer validation', () => {
  it('requires positive amount when creating offers', () => {
    const parsed = createOfferSchema.safeParse({ listingId: 'abc', amountCents: -1 })
    expect(parsed.success).toBe(false)
  })

  it('supports edit/cancel actions', () => {
    expect(updateOfferSchema.safeParse({ offerId: 'o1', action: 'CANCEL' }).success).toBe(true)
    expect(updateOfferSchema.safeParse({ offerId: 'o1', action: 'EDIT', amountCents: 1000 }).success).toBe(true)
  })
})
