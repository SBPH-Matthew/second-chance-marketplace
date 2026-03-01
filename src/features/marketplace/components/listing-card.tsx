import Link from 'next/link'
import { Eye, Heart, Clock, ShieldCheck, Star } from 'lucide-react'

import { formatCurrency } from '@/lib/utils'

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

  // Fake seller rating generation based on views for demo purposes
  const fakeRating = (listing.viewsCount % 2) === 0 ? 5 : 4
  const fakeReviewsCount = Math.floor(listing.viewsCount * 3.4)

  const condition = listing.priceCents > 50000 ? 'Like New' : 'Used'
  const isRecent = daysSince <= 2
  const isPopular = listing.viewsCount > 10

  return (
    <div className="group relative flex flex-col h-full bg-white transition-all w-full">
      {/* Image Container with Amazon-style uniform gray background */}
      <Link href={`/listing/${listing.id}`} className="block relative w-full aspect-[4/5] bg-gray-50 rounded-sm mb-2 overflow-hidden items-center justify-center flex">
        {/* Badges Overlay */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 pointer-events-none">
          {isPopular && (
            <span className="bg-[#e47911] text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow border border-[#a8590c] rounded-sm">
              Popular
            </span>
          )}
          {isRecent && !isPopular && (
            <span className="bg-[#cc0c39] text-white text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider shadow border border-[#a3092d] rounded-sm">
              Just Listed
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 z-10 pointer-events-auto"
        >
          <Heart className="h-4 w-4 text-gray-500 hover:text-red-500 transition-colors" />
        </button>

        <img
          src={`${listing.images[0]?.url}?auto=format&fit=crop&w=600&q=80`}
          alt={listing.title}
          className="object-contain w-full h-full p-2 group-hover:scale-[1.03] transition-transform duration-300 mix-blend-multiply"
        />
      </Link>

      {/* Content Area */}
      <div className="flex flex-col gap-1 px-1">

        {/* Title */}
        <Link href={`/listing/${listing.id}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 leading-tight group-hover:text-[#c45500] group-hover:underline">
            {listing.title}
          </h3>
        </Link>

        {/* Seller Rating / Trust Indicators */}
        <div className="flex items-center gap-1 mt-0.5">
          <div className="flex items-center text-[#ffa41c]">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${star <= fakeRating ? 'fill-current' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-[#007185] hover:text-[#c45500] hover:underline cursor-pointer ml-1">
            {fakeReviewsCount}
          </span>
        </div>

        {/* Price (Amazon uses big integers usually, but we keep formatCurrency) */}
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-semibold text-black leading-none tracking-tight">
            {formatCurrency(listing.priceCents)}
          </span>
        </div>

        {/* Marketplace Context Details */}
        <div className="text-xs text-gray-600 mt-2 space-y-1.5 flex flex-col justify-end flex-1 mb-2">

          <div className="flex items-center gap-1.5 font-medium text-gray-800 bg-gray-100/80 w-fit px-2 py-0.5 rounded-sm">
            <span className="text-[11px] uppercase tracking-wider">{condition}</span>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-500 line-clamp-1">{listing.location}</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {listing.viewsCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
