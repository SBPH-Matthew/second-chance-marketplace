'use client'

import { useInfiniteQuery } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import { ListingCard } from '@/features/marketplace/components/listing-card'

type FeedClientProps = {
  initialData: {
    data: Array<{
      id: string
      title: string
      priceCents: number
      location: string
      createdAt: Date | string
      likesCount: number
      viewsCount: number
      images: Array<{ url: string }>
    }>
    nextCursor: string | null
  }
  searchParams: Record<string, string | undefined>
}

export function FeedClient({ initialData, searchParams }: FeedClientProps) {
  const feedQuery = useInfiniteQuery({
    queryKey: ['feed', searchParams],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams()
      if (searchParams.q) params.set('q', searchParams.q)
      if (searchParams.category) params.set('category', searchParams.category)
      if (searchParams.sort) params.set('sort', searchParams.sort)
      if (pageParam) params.set('cursor', pageParam)

      const response = await fetch(`/api/listings?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to load listings')
      return response.json() as Promise<FeedClientProps['initialData']>
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialData: {
      pages: [initialData],
      pageParams: [null],
    },
  })

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {feedQuery.data?.pages.flatMap((page) => page.data).map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>

      {feedQuery.hasNextPage && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={() => feedQuery.fetchNextPage()} disabled={feedQuery.isFetchingNextPage}>
            {feedQuery.isFetchingNextPage ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </section>
  )
}
