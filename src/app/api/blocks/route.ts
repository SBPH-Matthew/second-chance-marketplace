import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasDatabase } from '@/lib/env'
import { blockSchema } from '@/features/safety/validation'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = blockSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      {
        id: `demo-block-${Date.now()}`,
        blockerId: session.user.id,
        blockedId: parsed.data.blockedId,
        reason: parsed.data.reason,
      },
      { status: 201 },
    )
  }

  const block = await prisma.block.upsert({
    where: {
      blockerId_blockedId: {
        blockerId: session.user.id,
        blockedId: parsed.data.blockedId,
      },
    },
    create: {
      blockerId: session.user.id,
      blockedId: parsed.data.blockedId,
      reason: parsed.data.reason,
    },
    update: {
      reason: parsed.data.reason,
    },
  })

  return NextResponse.json(block, { status: 201 })
}
