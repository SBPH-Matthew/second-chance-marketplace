'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { RegisterOnboardingDialog } from '@/features/auth/components/register-onboarding'

export function OnboardingEntry({
  defaultOpen = false,
  label = 'Join Second Chance',
  variant = 'outline',
}: {
  defaultOpen?: boolean
  label?: string
  variant?: 'default' | 'outline' | 'ghost' | 'danger'
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <>
      <Button size="sm" variant={variant} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <RegisterOnboardingDialog open={open} onOpenChange={setOpen} />
    </>
  )
}
