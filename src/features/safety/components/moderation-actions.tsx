'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

export function ModerationActions({ targetType, targetId }: { targetType: 'USER' | 'LISTING' | 'MESSAGE'; targetId: string }) {
  const [busy, setBusy] = useState(false)

  async function report() {
    setBusy(true)
    await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetType,
        targetId,
        reason: 'Suspicious behavior reported by buyer.',
      }),
    })
    setBusy(false)
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={report} disabled={busy}>
        Report
      </Button>
    </div>
  )
}
