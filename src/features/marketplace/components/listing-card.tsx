import Link from 'next/link'
import { Eye, Heart, Clock, ShieldCheck } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'

type ListingCardProps = {
  listing: {
    id: string
    title: string
    priceCents: number
    location: string
    createdAt: Date | string
    likesCount: number
    viewsCount: number
    images: Array<{ url: string }>
  }
}

export function ListingCard({ listing }: ListingCardProps) {
  const createdAt = new Date(listing.createdAt)
  const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  
  // Determine condition based on price (demo logic)
  const condition = listing.priceCents > 50000 ? 'Like New' : 'Used'
  const isRecent = daysSince <= 2
  const isPopular = listing.viewsCount > 10

  return (
    <Link href={`/listing/${listing.id}`}>
      <Card className="group relative flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-300">
        {/* Badge Section */}
        <div className="absolute inset-0 flex justify-between items-start p-3 z-10 pointer-events-none">
          <div className="flex flex-col gap-2">
            {/* Condition Badge */}
            <div className="bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-black inline-w-fit">
              {condition}
            </div>
          </div>
          <button 
            onClick={(e) => e.preventDefault()}
            className="bg-white/90 backdrop-blur rounded-full p-2 hover:bg-white transition hover:scale-110 pointer-events-auto"
          >
            <Heart className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Image */}
        <img
          src={`${listing.images[0]?.url}?auto=format&fit=crop&w=600&q=70`}
          alt={listing.title}
          className="aspect-square w-full object-cover"
        />
        <CardContent className="flex flex-col gap-2 p-3">
          <p className="line-clamp-3 text-sm font-semibold text-black">{listing.title}</p>
          <p className="text-lg font-bold text-black">{formatCurrency(listing.priceCents)}</p>
          
          {/* Metadata */}
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Seller</span>
            </div>
            <div className="flex items-center justify-between">
              <span>{listing.location}</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {isRecent && <span className="text-amber-600 font-medium">Just listed</span>}
              </div>
            </div>
          </div>

          {/* Engagement Stats */}
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-gray-200 pt-2 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> {listing.viewsCount}
            </span>
            {isPopular && <span className="text-amber-600 font-medium text-xs">⭐ Popular</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
