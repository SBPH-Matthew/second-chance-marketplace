import { NextResponse } from 'next/server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hasDatabase } from '@/lib/env'
import { reportSchema } from '@/features/safety/validation'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const parsed = reportSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      {
        id: `demo-report-${Date.now()}`,
        reporterId: session.user.id,
        ...parsed.data,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    )
  }

  const report = await prisma.report.create({
    data: {
      reporterId: session.user.id,
      targetType: parsed.data.targetType,
      targetId: parsed.data.targetId,
      reason: parsed.data.reason,
      listingId: parsed.data.targetType === 'LISTING' ? parsed.data.targetId : null,
      messageId: parsed.data.targetType === 'MESSAGE' ? parsed.data.targetId : null,
    },
  })

  return NextResponse.json(report, { status: 201 })
}
