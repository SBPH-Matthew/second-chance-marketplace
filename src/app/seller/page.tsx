import { auth } from '@/lib/auth'
import { getSellerLeads } from '@/features/seller/server/queries'
import { LeadCard } from '@/features/seller/components/lead-card'

export default async function SellerWorkspacePage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <main className="mx-auto max-w-5xl px-4 py-8">Please sign in to access seller workspace.</main>
  }

  const leads = await getSellerLeads(session.user.id)

  return (
    <main className="mx-auto max-w-6xl space-y-4 px-4 py-6">
      <section className="rounded-lg border border-gray-300 bg-white p-4 shadow-lg shadow-gray-200">
        <h1 className="text-2xl font-bold text-black">Seller Workspace</h1>
        <p className="text-sm text-gray-600">Prioritized leads and quick negotiation controls.</p>
      </section>

      <section className="space-y-3">
        {leads.map(({ conversation, score }) => (
          <LeadCard
            key={conversation.id}
            score={score}
            title={conversation.listing.title}
            buyer={conversation.buyer.profile?.username ?? conversation.buyer.name}
          />
        ))}
      </section>
    </main>
  )
}
