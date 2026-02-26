import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { hasDatabase } from '@/lib/env'
import { createOfferSchema, updateOfferSchema } from '@/features/offers/validation'
import { createOffer, transitionOffer } from '@/features/offers/service'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = createOfferSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      {
        id: `demo-offer-${Date.now()}`,
        ...parsed.data,
        buyerId: session.user.id,
        sellerId: 'demo-seller',
        status: 'PENDING',
      },
      { status: 201 },
    )
  }

  try {
    const offer = await createOffer({ ...parsed.data, buyerId: session.user.id })
    return NextResponse.json(offer)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = updateOfferSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  if (!hasDatabase()) {
    return NextResponse.json({
      id: parsed.data.offerId,
      status: parsed.data.action === 'CANCEL' ? 'CANCELLED' : parsed.data.action === 'EDIT' ? 'PENDING' : 'COUNTERED',
      amountCents: parsed.data.amountCents,
    })
  }

  try {
    const offer = await transitionOffer({
      ...parsed.data,
      actorId: session.user.id,
    })
    return NextResponse.json(offer)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
