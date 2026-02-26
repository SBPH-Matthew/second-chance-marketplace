'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

type MaskedContactPanelProps = {
  listingId: string
  maskedPhone: string
  maskedEmail: string
}

export function MaskedContactPanel({ listingId, maskedPhone, maskedEmail }: MaskedContactPanelProps) {
  const [phone, setPhone] = useState(maskedPhone)
  const [email, setEmail] = useState(maskedEmail)
  const [loading, setLoading] = useState<'phone' | 'email' | null>(null)

  async function reveal(field: 'phone' | 'email') {
    setLoading(field)
    const response = await fetch('/api/contact-reveal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ listingId, field }),
    })

    if (!response.ok) {
      setLoading(null)
      return
    }

    const data = (await response.json()) as { value: string; field: 'phone' | 'email' }

    if (data.field === 'phone') setPhone(data.value)
    if (data.field === 'email') setEmail(data.value)
    setLoading(null)
  }

  return (
    <div className="rounded-lg border border-gray-300 bg-white p-4 shadow-lg shadow-gray-200">
      <p className="text-sm font-semibold text-black">Seller contact</p>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-black">{phone}</span>
          <Button variant="outline" size="sm" onClick={() => reveal('phone')} disabled={loading === 'phone'}>
            Reveal phone
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-black">{email}</span>
          <Button variant="outline" size="sm" onClick={() => reveal('email')} disabled={loading === 'email'}>
            Reveal email
          </Button>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-600">Reveals are monitored for anti-spam and abuse prevention.</p>
    </div>
  )
}
