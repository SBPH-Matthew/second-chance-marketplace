import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, Sparkles, Clock, Compass, Heart } from 'lucide-react'

import { SearchFilters } from '@/features/marketplace/components/search-filters'
import { FeedClient } from '@/features/marketplace/components/feed-client'
import { getMarketplaceFeed } from '@/features/marketplace/server/queries'
import { OnboardingEntry } from '@/features/auth/components/onboarding-entry'
import { ListingCard } from '@/features/marketplace/components/listing-card'

// Format currency helper to avoid importing if not necessary, but better to import from lib/utils if available.
// I will just use raw to avoid missing imports, but usually it's in lib/utils
import { formatCurrency } from '@/lib/utils'

export default async function HomePage({
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

  // Safe slicing for demo sections
  const dataLen = feed.data.length
  const quad1 = feed.data.slice(0, Math.min(4, dataLen))
  const quad2 = feed.data.slice(Math.min(4, dataLen), Math.min(8, dataLen))
  const quad3 = feed.data.slice(Math.min(8, dataLen), Math.min(12, dataLen))

  const recentlyViewed = feed.data.slice(0, Math.min(8, dataLen))
  const recommendedItems = feed.data.slice(Math.max(0, dataLen - 8), dataLen).reverse()

  const categories = [
    { name: 'Fashion', iconSrc: '/icons/streamline-duo/fashion.svg' },
    { name: 'Electronics', iconSrc: '/icons/streamline-duo/electronics.svg' },
    { name: 'Toys', iconSrc: '/icons/streamline-duo/toys.svg' },
    { name: 'Cars', iconSrc: '/icons/streamline-duo/cars.svg' },
  ]

  // Render a quad card
  const QuadCard = ({ title, items, linkText, category }: { title: string, items: typeof feed.data, linkText: string, category: string }) => (
    <div className="flex flex-col bg-white p-5 shadow-sm rounded-md h-full">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      {items.length === 4 ? (
        <div className="grid grid-cols-2 gap-3 flex-grow z-10">
          {items.map((item) => (
            <Link key={item.id} href={`/listing/${item.id}`} className="group flex flex-col items-start">
              <div className="aspect-square w-full relative mb-1 bg-gray-50 rounded-sm overflow-hidden">
                <Image
                  src={`${item.images[0]?.url}?auto=format&fit=crop&w=300&q=70`}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-xs text-gray-700 truncate w-full group-hover:text-blue-600 transition-colors">{item.title}</span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center bg-gray-50 rounded-sm text-sm text-gray-400">
          Not enough items
        </div>
      )}
      <Link href={`/?category=${category}`} className="text-sm text-blue-600 hover:text-red-500 hover:underline mt-4 font-medium flex items-center gap-1 w-fit">
        {linkText}
      </Link>
    </div>
  )

  return (
    <main className="bg-[#eaeded] min-h-screen pb-12 w-full">
      {/* Hero Banner Area */}
      <div className="w-full relative bg-gradient-to-r from-blue-900 via-purple-800 to-indigo-900 h-[350px]">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1555620958-857e4e892cfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center mix-blend-overlay" />
        <div className="mx-auto max-w-[1500px] px-4 pt-12 relative z-10 flex justify-between items-start">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 drop-shadow-md">
              Unearth local treasures. <br /> Sustainably sourced.
            </h1>
            <p className="text-lg md:text-xl text-blue-100 font-medium mb-6 drop-shadow">
              Join thousands of neighbors giving great items a second chance.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content constraints - negatively margined to overlap the banner like Amazon */}
      <div className="mx-auto max-w-[1500px] px-4 -mt-32 relative z-20 space-y-6">

        {/* Quad Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <QuadCard
            title="New finds near you"
            items={quad1}
            linkText="Explore local hits"
            category="Fashion"
          />
          <QuadCard
            title="Pick up where you left off"
            items={quad2}
            linkText="View your history"
            category="Electronics"
          />
          <QuadCard
            title="Pre-owned vehicles"
            items={quad3}
            linkText="Shop cars and trucks"
            category="Cars"
          />
          <div className="flex flex-col bg-white p-5 shadow-sm rounded-md h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Categories</h2>
            <div className="grid grid-cols-2 gap-3 flex-grow z-10">
              {categories.map((cat) => (
                <Link key={cat.name} href={`/?category=${cat.name}`} className="group flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-lg p-3 hover:border-blue-300 hover:shadow-sm transition-all text-center">
                  <div className="relative h-12 w-12 mb-2">
                    <Image
                      src={cat.iconSrc}
                      alt={`${cat.name} icon`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-xs font-semibold text-gray-800">{cat.name}</span>
                </Link>
              ))}
            </div>
            <Link href="/?category=all" className="text-sm text-blue-600 hover:text-red-500 hover:underline mt-4 font-medium flex items-center gap-1 w-fit">
              Explore all categories
            </Link>
          </div>
        </div>

        {/* Horizontal Carousel: Recently Viewed */}
        <div className="bg-white p-5 xl:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recently viewed items</h2>
            <Link href="/" className="text-sm text-blue-600 hover:text-red-500 hover:underline ml-2">
              View your browsing history
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {recentlyViewed.map((item) => (
              <Link
                key={`recent-${item.id}`}
                href={`/listing/${item.id}`}
                className="flex-shrink-0 w-44 snap-start group"
              >
                <div className="aspect-square w-full relative bg-gray-50 rounded-sm mb-2 overflow-hidden">
                  <Image
                    src={`${item.images[0]?.url}?auto=format&fit=crop&w=300&q=70`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-blue-600 group-hover:text-red-600 truncate">{item.title}</span>
                  <span className="text-lg font-semibold text-black">{formatCurrency(item.priceCents)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Horizontal Carousel: Based on your likings */}
        <div className="bg-white p-5 xl:p-6 shadow-[0_1px_4px_rgba(0,0,0,0.05)] rounded-md">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recommended for you</h2>
            <Link href="/" className="text-sm text-blue-600 hover:text-red-500 hover:underline ml-2">
              See more personalized picks
            </Link>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x no-scrollbar" style={{ scrollbarWidth: 'none' }}>
            {recommendedItems.map((item) => (
              <Link
                key={`rec-${item.id}`}
                href={`/listing/${item.id}`}
                className="flex-shrink-0 w-[200px] snap-start group border border-gray-100 p-2 rounded-md hover:border-gray-300 transition-colors"
              >
                <div className="aspect-square w-full relative bg-gray-50 rounded-sm mb-3 overflow-hidden">
                  <Image
                    src={`${item.images[0]?.url}?auto=format&fit=crop&w=400&q=70`}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-1 right-1 bg-white/90 backdrop-blur rounded-full p-1.5 shadow-sm text-gray-400 group-hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] leading-tight mb-1 group-hover:text-blue-600">{item.title}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <span className="text-xl font-bold text-red-700">{formatCurrency(item.priceCents)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Existing Feed / Search Area */}
        <div className="bg-white p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)] rounded-md border-t-4 border-blue-600">
          <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Explore more deals</h2>
              <p className="text-gray-500 text-sm mt-1">Browse our full marketplace for unique second-hand finds.</p>
            </div>
            <SearchFilters />
          </div>

          <FeedClient
            initialData={feed}
            searchParams={{
              q: typeof params.q === 'string' ? params.q : undefined,
              category: typeof params.category === 'string' ? params.category : undefined,
              sort: typeof params.sort === 'string' ? params.sort : undefined,
            }}
          />
        </div>
      </div>
    </main>
  )
}
