import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasDatabase } from '@/lib/env'
import { ChatComposer } from '@/features/chat/components/chat-composer'
import { OfferCard } from '@/features/chat/components/offer-card'
import { OfferActions } from '@/features/chat/components/offer-actions'

export default async function InboxPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <main className="mx-auto max-w-5xl px-4 py-8">Please sign in to access your inbox.</main>
  }

  const conversations = hasDatabase()
    ? await prisma.conversation.findMany({
        where: {
          OR: [{ buyerId: session.user.id }, { sellerId: session.user.id }],
          isClosed: false,
        },
        include: {
          listing: true,
          messages: { orderBy: { createdAt: 'asc' } },
          offers: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { updatedAt: 'desc' },
      })
    : [
        {
          id: 'demo-conversation',
          listingId: 'demo-1',
          listing: { title: 'Heritage Leather Weekender' },
          messages: [
            { id: 'm1', body: 'Is this still available?' },
            { id: 'm2', body: 'Yes, available and negotiable.' },
          ],
          offers: [{ id: 'o1', amountCents: 130000, status: 'COUNTERED', createdAt: new Date() }],
        },
      ]

  const active = conversations[0]

  return (
    <main className="mx-auto grid max-w-7xl gap-4 px-4 py-6 md:grid-cols-[320px,1fr]">
      <aside className="rounded-lg border border-gray-300 bg-white shadow-lg shadow-gray-200">
        <h1 className="border-b border-gray-300 p-4 text-xl font-bold text-black">Inbox</h1>
        <div className="space-y-1 p-2">
          {conversations.map((conversation) => (
            <div key={conversation.id} className="rounded-md p-3 hover:bg-gray-100 transition-colors">
              <p className="truncate text-sm font-semibold text-black">{conversation.listing.title}</p>
              <p className="truncate text-xs text-gray-600">{conversation.messages.at(-1)?.body}</p>
            </div>
          ))}
        </div>
      </aside>
      <section className="rounded-lg border border-gray-300 bg-white shadow-lg shadow-gray-200">
        {active ? (
          <>
            <header className="flex items-center justify-between border-b border-gray-300 p-4">
              <div>
                <p className="text-lg font-semibold text-black">{active.listing.title}</p>
                <p className="text-sm text-gray-600">Conversation #{active.id.slice(0, 6)}</p>
              </div>
              <OfferActions listingId={active.listingId} />
            </header>
            <div className="space-y-3 p-4">
              {active.messages.map((message) => (
                <div key={message.id} className="max-w-xl rounded-md bg-white p-3 text-sm text-black border border-gray-300">
                  {message.body}
                </div>
              ))}
              {active.offers.map((offer) => (
                <OfferCard key={offer.id} amountCents={offer.amountCents} status={offer.status} createdAt={offer.createdAt} />
              ))}
            </div>
            <ChatComposer conversationId={active.id} />
          </>
        ) : (
          <div className="p-8 text-ink/60">No active chats.</div>
        )}
      </section>
    </main>
  )
}
