import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.block.deleteMany()
  await prisma.report.deleteMany()
  await prisma.contactRevealEvent.deleteMany()
  await prisma.offerEvent.deleteMany()
  await prisma.offer.deleteMany()
  await prisma.message.deleteMany()
  await prisma.conversation.deleteMany()
  await prisma.listingImage.deleteMany()
  await prisma.listing.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  const [seller, buyer] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Mika Santos',
        email: 'seller@secondchance.dev',
        profile: {
          create: {
            username: 'mika_sells',
            bio: 'Curated bags, gadgets, and home finds.',
            phone: '+639178359800',
            emailPublic: 'mika.sells@example.com',
            city: 'Makati City',
            isVerifiedSeller: true,
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        name: 'Alex Ramos',
        email: 'buyer@secondchance.dev',
        profile: {
          create: {
            username: 'alexbuys',
            city: 'Quezon City',
          },
        },
      },
    }),
  ])

  const listings = await Promise.all([
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Leather Weekender Bag',
        description: 'Genuine leather duffle in excellent condition.',
        category: 'Fashion',
        priceCents: 145000,
        location: 'Makati City',
        viewsCount: 210,
        likesCount: 14,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa', sortOrder: 0 },
          ],
        },
      },
    }),
    prisma.listing.create({
      data: {
        sellerId: seller.id,
        title: 'Vintage Desk Lamp',
        description: 'Warm brass finish, fully working.',
        category: 'Home',
        priceCents: 39000,
        location: 'Taguig',
        viewsCount: 97,
        likesCount: 8,
        images: {
          create: [
            { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', sortOrder: 0 },
          ],
        },
      },
    }),
  ])

  const conversation = await prisma.conversation.create({
    data: {
      listingId: listings[0].id,
      buyerId: buyer.id,
      sellerId: seller.id,
      messages: {
        create: [
          {
            senderId: buyer.id,
            body: 'Is this still available?',
          },
          {
            senderId: seller.id,
            body: 'Yes, available and negotiable.',
          },
        ],
      },
    },
  })

  const offer = await prisma.offer.create({
    data: {
      listingId: listings[0].id,
      conversationId: conversation.id,
      buyerId: buyer.id,
      sellerId: seller.id,
      amountCents: 130000,
      status: 'COUNTERED',
      events: {
        create: [
          { actorId: buyer.id, type: 'OFFER_MADE' },
          { actorId: seller.id, type: 'COUNTERED', note: 'Can do 138,000.' },
        ],
      },
    },
  })

  await prisma.offer.update({
    where: { id: offer.id },
    data: {
      amountCents: 138000,
    },
  })

  console.log({ seller: seller.email, buyer: buyer.email, listings: listings.length })
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
