import { prisma } from '@/lib/prisma'
import { demoListings } from '@/features/listing/server/demo-data'

export async function getListingById(listingId: string) {
  if (!process.env.DATABASE_URL) {
    return demoListings.find((item) => item.id === listingId) ?? null
  }

  return prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      seller: {
        include: { profile: true },
      },
      offers: {
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
    },
  })
}
