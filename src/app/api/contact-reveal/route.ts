import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasDatabase } from '@/lib/env'
import { enforceSimpleRateLimit } from '@/lib/rate-limit'
import { revealContactSchema } from '@/features/offers/validation'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = revealContactSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  enforceSimpleRateLimit(`contact:${session.user.id}`, 10, 24 * 60 * 60 * 1000)

  if (!hasDatabase()) {
    const value = parsed.data.field === 'phone' ? '+639178359800' : 'mika.sells@example.com'
    return NextResponse.json({ field: parsed.data.field, value })
  }

  const listing = await prisma.listing.findUnique({
    where: { id: parsed.data.listingId },
    include: { seller: { include: { profile: true } } },
  })

  if (!listing) return NextResponse.json({ error: 'Listing not found' }, { status: 404 })

  const value =
    parsed.data.field === 'phone' ? listing.seller.profile?.phone : listing.seller.profile?.emailPublic

  if (!value) return NextResponse.json({ error: 'No contact available' }, { status: 404 })

  await prisma.contactRevealEvent.create({
    data: {
      listingId: listing.id,
      viewerId: session.user.id,
      sellerId: listing.sellerId,
      field: parsed.data.field,
      ipAddress: request.headers.get('x-forwarded-for'),
      userAgent: request.headers.get('user-agent'),
    },
  })

  return NextResponse.json({ field: parsed.data.field, value })
}
