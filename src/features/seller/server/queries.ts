import { prisma } from '@/lib/prisma'

export async function getSellerLeads(sellerId: string) {
  if (!process.env.DATABASE_URL) {
    return [
      {
        score: 60,
        conversation: {
          id: 'demo-conversation',
          listing: { title: 'Heritage Leather Weekender', viewsCount: 210 },
          buyer: { name: 'Alex Ramos', profile: { username: 'alexbuys' } },
        },
      },
    ]
  }

  const conversations = await prisma.conversation.findMany({
    where: { sellerId, isClosed: false },
    include: {
      buyer: { include: { profile: true } },
      listing: true,
      offers: { orderBy: { createdAt: 'desc' }, take: 1 },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  return conversations
    .map((conversation) => {
      const latestOffer = conversation.offers[0]
      const latestMessage = conversation.messages[0]
      const score =
        (latestOffer?.status === 'PENDING' ? 40 : 0) +
        (latestOffer?.status === 'COUNTERED' ? 30 : 0) +
        (latestMessage ? 20 : 0) +
        (conversation.listing.viewsCount > 100 ? 10 : 0)

      return { conversation, score }
    })
    .sort((a, b) => b.score - a.score)
}
