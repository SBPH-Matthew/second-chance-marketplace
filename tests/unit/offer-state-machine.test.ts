import { describe, expect, it } from 'vitest'

import { canTransition, getNextStatus } from '@/features/offers/state-machine'

describe('offer state machine', () => {
  it('allows editing and cancelling pending offers', () => {
    expect(canTransition('PENDING', 'EDIT')).toBe(true)
    expect(canTransition('PENDING', 'CANCEL')).toBe(true)
  })

  it('moves to accepted state', () => {
    expect(getNextStatus('PENDING', 'ACCEPT')).toBe('ACCEPTED')
  })

  it('moves to countered state and can be accepted later', () => {
    const next = getNextStatus('PENDING', 'COUNTER')
    expect(next).toBe('COUNTERED')
    expect(getNextStatus(next, 'ACCEPT')).toBe('ACCEPTED')
  })

  it('throws on invalid terminal transition', () => {
    expect(() => getNextStatus('ACCEPTED', 'EDIT')).toThrowError('Invalid action EDIT for ACCEPTED')
  })
})
