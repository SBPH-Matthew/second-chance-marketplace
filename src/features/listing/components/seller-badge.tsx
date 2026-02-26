import { ShieldCheck } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

export function SellerBadge({
  username,
  verified,
  responseRate,
}: {
  username: string
  verified: boolean
  responseRate: number
}) {
  return (
    <div className="space-y-2 rounded-lg border border-gray-300 bg-white p-4 shadow-lg shadow-gray-200">
      <p className="text-sm font-semibold text-black">@{username}</p>
      <div className="flex items-center gap-2">
        {verified && (
          <Badge tone="success">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Verified Seller
            </span>
          </Badge>
        )}
        <Badge>{responseRate}% response rate</Badge>
      </div>
    </div>
  )
}
