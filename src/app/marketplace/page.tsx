import { SidebarFilters } from '@/features/marketplace/components/sidebar-filters'
import { FeedClient } from '@/features/marketplace/components/feed-client'
import { getMarketplaceFeed } from '@/features/marketplace/server/queries'

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

    // Construct search summary
    const queryTerm = params.q || params.category || 'everything'

    return (
        <div className="bg-white min-h-screen">
            {/* Top Results Bar */}
            <div className="border-b border-gray-200 bg-white shadow-sm text-sm hidden md:block">
                <div className="max-w-[1500px] mx-auto px-4 py-2 flex justify-between items-center text-gray-700">
                    <span>1-24 of local results for <span className="font-bold text-amber-700">"{queryTerm}"</span></span>
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-50 px-3 py-1.5 rounded shadow-sm border border-gray-300 cursor-pointer pointer flex items-center gap-1 hover:bg-gray-100 hover:border-gray-400 transition">
                            Sort by: <span className="font-semibold text-black">Newest listings</span>
                        </span>
                    </div>
                </div>
            </div>

            <main className="mx-auto max-w-[1500px] px-4 py-6 flex flex-col md:flex-row gap-8">

                {/* Left Sidebar Filter Section */}
                <SidebarFilters />

                {/* Main Feed Content Area */}
                <div className="flex-1 w-full min-w-0">
                    {/* Main Results Title */}
                    <div className="mb-4">
                        <h2 className="text-xl font-bold flex flex-col tracking-tight text-gray-900 border-b border-gray-100 pb-2">
                            Results
                            <span className="text-sm tracking-normal text-gray-500 font-normal mt-1">Check individual item pages for pickup options, chat instructions, and detailed seller ratings.</span>
                        </h2>
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
            </main>
        </div>
    )
}
