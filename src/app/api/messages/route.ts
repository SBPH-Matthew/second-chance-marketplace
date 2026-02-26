import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasDatabase } from '@/lib/env'
import { createMessageSchema } from '@/features/chat/validation'
import { publishConversationEvent } from '@/features/chat/server/realtime'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = createMessageSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      {
        id: `demo-${Date.now()}`,
        ...parsed.data,
        senderId: session.user.id,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    )
  }

  const message = await prisma.message.create({
    data: {
      ...parsed.data,
      senderId: session.user.id,
    },
  })

  await prisma.conversation.update({
    where: { id: parsed.data.conversationId },
    data: { updatedAt: new Date() },
  })

  await publishConversationEvent(parsed.data.conversationId, 'message.created', message)

  return NextResponse.json(message)
}
