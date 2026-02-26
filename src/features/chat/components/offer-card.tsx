import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils'

export function OfferCard({
  amountCents,
  status,
  createdAt,
}: {
  amountCents: number
  status: 'PENDING' | 'COUNTERED' | 'ACCEPTED' | 'CANCELLED' | 'DECLINED' | 'EXPIRED'
  createdAt: Date
}) {
  const tone =
    status === 'ACCEPTED'
      ? 'success'
      : status === 'COUNTERED' || status === 'PENDING'
        ? 'warning'
        : 'neutral'

  return (
    <div className="max-w-sm rounded-lg border border-gray-300 bg-white p-3 text-sm shadow-lg shadow-gray-200">
      <div className="mb-2 flex items-center justify-between">
        <p className="font-semibold text-black">Offer</p>
        <Badge tone={tone}>{status.toLowerCase()}</Badge>
      </div>
      <p className="text-lg font-bold text-black">{formatCurrency(amountCents)}</p>
      <p className="mt-1 text-xs text-gray-600">{new Date(createdAt).toLocaleString()}</p>
    </div>
  )
}
