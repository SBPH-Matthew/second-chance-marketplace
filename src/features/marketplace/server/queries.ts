import { prisma } from '@/lib/prisma'
import { demoFeed } from '@/features/marketplace/server/demo-data'

type FeedInput = {
  q?: string
  category?: string
  sort?: 'latest' | 'price_asc' | 'price_desc'
  cursor?: string
  limit?: number
}

export async function getMarketplaceFeed(input: FeedInput) {
  const limit = input.limit ?? 24

  if (!process.env.DATABASE_URL) {
    return {
      data: demoFeed,
      nextCursor: null,
    }
  }

  const listings = await prisma.listing.findMany({
    where: {
      isSold: false,
      title: input.q ? { contains: input.q, mode: 'insensitive' } : undefined,
      category: input.category || undefined,
    },
    include: {
      images: {
        orderBy: { sortOrder: 'asc' },
        take: 1,
      },
      seller: {
        include: { profile: true },
      },
    },
    orderBy:
      input.sort === 'price_asc'
        ? { priceCents: 'asc' }
        : input.sort === 'price_desc'
          ? { priceCents: 'desc' }
          : { createdAt: 'desc' },
    take: limit + 1,
    cursor: input.cursor ? { id: input.cursor } : undefined,
    skip: input.cursor ? 1 : 0,
  })

  const hasMore = listings.length > limit
  const data = hasMore ? listings.slice(0, limit) : listings

  return {
    data,
    nextCursor: hasMore ? data[data.length - 1]?.id : null,
  }
}
