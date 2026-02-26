import Link from 'next/link'
import { notFound } from 'next/navigation'

import { auth } from '@/lib/auth'
import { formatCurrency } from '@/lib/utils'
import { maskEmail, maskPhone } from '@/lib/mask'
import { Button } from '@/components/ui/button'
import { SellerBadge } from '@/features/listing/components/seller-badge'
import { MaskedContactPanel } from '@/features/listing/components/masked-contact-panel'
import { ModerationActions } from '@/features/safety/components/moderation-actions'
import { getListingById } from '@/features/listing/server/queries'

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const listing = await getListingById(id)
  const session = await auth()

  if (!listing) notFound()

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1.6fr,1fr]">
      <section className="space-y-4">
        <img
          src={`${listing.images[0]?.url}?auto=format&fit=crop&w=1200&q=75`}
          alt={listing.title}
          className="aspect-video w-full rounded-xl object-cover"
        />
        <div className="rounded-lg border border-gray-300 bg-white p-5 shadow-lg shadow-gray-200">
          <h1 className="text-2xl font-bold text-black">{listing.title}</h1>
          <p className="mt-2 text-3xl font-extrabold text-black">{formatCurrency(listing.priceCents)}</p>
          <p className="mt-4 text-sm text-gray-600">{listing.description}</p>
          <p className="mt-4 text-sm text-gray-600">{listing.location}</p>
          <div className="mt-4 flex gap-2">
            <Button asChild>
              <Link href="/inbox">Start chat</Link>
            </Button>
            <ModerationActions targetType="LISTING" targetId={listing.id} />
          </div>
        </div>
      </section>
      <aside className="space-y-4">
        <SellerBadge
          username={listing.seller.profile?.username ?? listing.seller.name}
          verified={listing.seller.profile?.isVerifiedSeller ?? false}
          responseRate={listing.seller.profile?.responseRate ?? 90}
        />
        <MaskedContactPanel
          listingId={listing.id}
          maskedPhone={maskPhone(listing.seller.profile?.phone)}
          maskedEmail={maskEmail(listing.seller.profile?.emailPublic)}
        />
        {!session && (
          <p className="text-xs text-zinc-500">Sign in to reveal contact details and make an offer.</p>
        )}
      </aside>
    </main>
  )
}
