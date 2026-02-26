import { Prisma } from '@prisma/client'

import { prisma } from '@/lib/prisma'
import { canTransition, getNextStatus, type OfferAction, type OfferStatus } from '@/features/offers/state-machine'

export async function createOffer(input: {
  listingId: string
  buyerId: string
  amountCents: number
}) {
  return prisma.$transaction(async (tx) => {
    const listing = await tx.listing.findUniqueOrThrow({ where: { id: input.listingId } })

    const existing = await tx.offer.findFirst({
      where: {
        listingId: input.listingId,
        buyerId: input.buyerId,
        status: {
          in: ['PENDING', 'COUNTERED'],
        },
      },
    })

    if (existing) {
      throw new Error('Only one active offer is allowed per listing per buyer.')
    }

    const conversation = await tx.conversation.upsert({
      where: {
        listingId_buyerId: {
          listingId: input.listingId,
          buyerId: input.buyerId,
        },
      },
      create: {
        listingId: input.listingId,
        buyerId: input.buyerId,
        sellerId: listing.sellerId,
      },
      update: {},
    })

    const offer = await tx.offer.create({
      data: {
        listingId: input.listingId,
        conversationId: conversation.id,
        buyerId: input.buyerId,
        sellerId: listing.sellerId,
        amountCents: input.amountCents,
        status: 'PENDING',
        events: {
          create: {
            actorId: input.buyerId,
            type: 'OFFER_MADE',
          },
        },
      },
      include: { events: true },
    })

    return offer
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}

export async function transitionOffer(input: {
  offerId: string
  actorId: string
  action: OfferAction
  amountCents?: number
  note?: string
}) {
  return prisma.$transaction(async (tx) => {
    const offer = await tx.offer.findUniqueOrThrow({ where: { id: input.offerId } })

    if (!canTransition(offer.status as OfferStatus, input.action)) {
      throw new Error('Invalid offer transition')
    }

    const nextStatus = getNextStatus(offer.status as OfferStatus, input.action)

    const isSellerAction = ['COUNTER', 'ACCEPT', 'DECLINE'].includes(input.action)
    if (isSellerAction && input.actorId !== offer.sellerId) {
      throw new Error('Only seller can perform this action')
    }

    if (!isSellerAction && input.actorId !== offer.buyerId) {
      throw new Error('Only buyer can perform this action')
    }

    const nextAmount =
      input.action === 'COUNTER' || input.action === 'EDIT'
        ? (input.amountCents ?? offer.amountCents)
        : offer.amountCents

    const updated = await tx.offer.update({
      where: { id: offer.id },
      data: {
        status: nextStatus,
        amountCents: nextAmount,
        events: {
          create: {
            actorId: input.actorId,
            type: input.action,
            note: input.note,
          },
        },
      },
      include: { events: { orderBy: { createdAt: 'asc' } } },
    })

    if (nextStatus === 'ACCEPTED') {
      await tx.listing.update({
        where: { id: offer.listingId },
        data: {
          isReserved: true,
          reservedUntil: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      })
    }

    return updated
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable })
}
