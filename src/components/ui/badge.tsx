import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning'
}) {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2 py-1 text-xs font-medium',
        tone === 'neutral' && 'bg-gray-200 text-gray-700',
        tone === 'success' && 'bg-emerald-100 text-emerald-700',
        tone === 'warning' && 'bg-amber-100 text-amber-700',
      )}
    >
      {children}
    </span>
  )
}
