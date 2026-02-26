'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function OfferActions({ listingId }: { listingId: string }) {
  const [amount, setAmount] = useState('')
  const [offerId, setOfferId] = useState('')

  async function makeOffer() {
    await fetch('/api/offers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, amountCents: Number(amount) * 100 }),
    })
  }

  async function update(action: 'EDIT' | 'CANCEL') {
    if (!offerId) return
    await fetch('/api/offers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        offerId,
        action,
        amountCents: action === 'EDIT' ? Number(amount) * 100 : undefined,
      }),
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="Offer amount" className="w-40" />
      <Input value={offerId} onChange={(event) => setOfferId(event.target.value)} placeholder="Offer ID for edit/cancel" className="w-56" />
      <Button size="sm" onClick={makeOffer}>
        Make offer
      </Button>
      <Button size="sm" variant="outline" onClick={() => update('EDIT')}>
        Edit offer
      </Button>
      <Button size="sm" variant="outline" onClick={() => update('CANCEL')}>
        Cancel offer
      </Button>
    </div>
  )
}
