# DriftMarket

Feature-based marketplace app with conversational buying, offer negotiation, contact privacy controls, and seller lead prioritization.

## Stack

- Next.js App Router + TypeScript + Tailwind + shadcn-style UI primitives
- Prisma + PostgreSQL
- Auth.js (credentials provider for seeded users)
- React Query for marketplace feed pagination and client state
- Zod validation for API inputs
- Pusher integration hooks for realtime conversation events
- Vitest unit tests + Playwright E2E tests

## Architecture (Feature-Based)

```text
src/
  app/
    api/
      listings/            # feed endpoint
      offers/              # create/edit/cancel/accept/counter/decline
      contact-reveal/      # masked contact reveal + audit log
      messages/            # chat message creation
      reports/             # moderation report submission
      blocks/              # user block endpoint
    marketplace/           # discovery page
    listing/[id]/          # listing detail and contact panel
    inbox/                 # conversation workspace
    seller/                # seller lead prioritization workspace
  features/
    marketplace/
      components/
      server/
    listing/
      components/
      server/
    chat/
      components/
      server/
    offers/
      state-machine.ts
      service.ts
      validation.ts
    safety/
      components/
      validation.ts
    seller/
      components/
      server/
  lib/
    auth.ts
    prisma.ts
    mask.ts
    rate-limit.ts
    utils.ts
prisma/
  schema.prisma
  seed.ts
tests/
  unit/
  e2e/
```

## Data Models

Implemented in `prisma/schema.prisma`:

- User
- Profile
- Listing
- ListingImage
- Conversation
- Message
- Offer
- OfferEvent
- ContactRevealEvent
- Report
- Block

## Offer State Rules

- One active offer per `(listingId, buyerId)` where status in `PENDING | COUNTERED`
- Buyer actions: `MAKE`, `EDIT`, `CANCEL`
- Seller actions: `COUNTER`, `ACCEPT`, `DECLINE`
- Terminal statuses: `ACCEPTED`, `CANCELLED`, `DECLINED`, `EXPIRED`
- On `ACCEPTED`: listing is reserved for 24 hours (`isReserved = true`, `reservedUntil` set)

## Contact Privacy

- Phone/email masked on listing detail by default
- Reveal requires authenticated user
- Rate-limited per user (`10 reveals/day` in memory for demo)
- Every reveal creates `ContactRevealEvent` audit record with field, actor, seller, and request metadata

## Role Permissions

- Guest:
  - Browse feed and listing details
  - Cannot reveal contact, chat, offer, report, or block
- Buyer:
  - Reveal contact details (audited)
  - Send chat messages
  - Make/edit/cancel offers on listings
  - Report listing/message/user and block users
- Seller:
  - Review prioritized leads in seller workspace
  - Counter/accept/decline offers via API
  - Mark sold/reserve flow (reservation applied on accepted offer)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure env:

```bash
cp .env.example .env
```

3. Create database schema and generate client:

```bash
npm run db:migrate
npm run db:generate
```

4. Seed demo data:

```bash
npm run db:seed
```

5. Run app:

```bash
npm run dev
```

## Demo Accounts

- `buyer@secondchance.dev`
- `seller@secondchance.dev`

## Tests

Unit tests:

```bash
npm run test
```

E2E tests:

```bash
npm run test:e2e
```

## Notes

- The visual language is original (brand + layout + spacing + motion), inspired by marketplace interaction patterns but not copied from Carousell/OLX.
- Realtime chat events are wired through `publishConversationEvent`; add Pusher credentials in `.env` to enable.
