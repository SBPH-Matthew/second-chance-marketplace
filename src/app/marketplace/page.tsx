import Image from 'next/image'
import Link from 'next/link'
import { Recycle, ShieldCheck, Users } from 'lucide-react'

import { SearchFilters } from '@/features/marketplace/components/search-filters'
import { FeedClient } from '@/features/marketplace/components/feed-client'
import { getMarketplaceFeed } from '@/features/marketplace/server/queries'
import { OnboardingEntry } from '@/features/auth/components/onboarding-entry'

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams

  const feed = await getMarketplaceFeed({
    q: typeof params.q === 'string' ? params.q : undefined,
    category: typeof params.category === 'string' ? params.category : undefined,
    sort: typeof params.sort === 'string' ? (params.sort as 'latest' | 'price_asc' | 'price_desc') : 'latest',
  })

  const categories = [
    { name: 'Fashion', iconSrc: '/icons/streamline-duo/fashion.svg' },
    { name: 'Electronics', iconSrc: '/icons/streamline-duo/electronics.svg' },
    { name: 'Toys', iconSrc: '/icons/streamline-duo/toys.svg' },
    { name: 'Cars', iconSrc: '/icons/streamline-duo/cars.svg' },
  ]

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-6">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold text-black">Second chances for great finds</h1>
            <p className="mt-2 text-gray-600">Discover quality items near you from trusted sellers</p>
          </div>
          <OnboardingEntry defaultOpen={params.join === '1'} />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {categories.map((cat) => {
            return (
              <Link key={cat.name} href={`/marketplace?category=${cat.name}`}>
                <div className="cursor-pointer rounded-xl border border-gray-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-gray-400 hover:shadow-md">
                  <Image
                    src={cat.iconSrc}
                    alt={`${cat.name} category icon`}
                    width={40}
                    height={40}
                    className="mx-auto mb-2 h-10 w-10"
                  />
                  <p className="text-sm font-semibold text-black">{cat.name}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <Recycle className="mt-1 h-5 w-5 flex-shrink-0 text-gray-700" />
            <div>
              <p className="text-sm font-semibold text-black">Sustainable Buying</p>
              <p className="text-xs text-gray-600">Give items a second life, reduce waste</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-1 h-5 w-5 flex-shrink-0 text-gray-700" />
            <div>
              <p className="text-sm font-semibold text-black">Buyer Protection</p>
              <p className="text-xs text-gray-600">Safe transactions, verified sellers</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="mt-1 h-5 w-5 flex-shrink-0 text-gray-700" />
            <div>
              <p className="text-sm font-semibold text-black">Local Community</p>
              <p className="text-xs text-gray-600">Buy from neighbors, build connections</p>
            </div>
          </div>
        </div>
      </section>

      <SearchFilters />

      <FeedClient
        initialData={feed}
        searchParams={{
          q: typeof params.q === 'string' ? params.q : undefined,
          category: typeof params.category === 'string' ? params.category : undefined,
          sort: typeof params.sort === 'string' ? params.sort : undefined,
        }}
      />
    </main>
  )
}
