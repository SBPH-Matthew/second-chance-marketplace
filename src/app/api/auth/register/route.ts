import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/password'
import { registerSchema } from '@/features/auth/validation'

function getBaseUsername(email: string) {
  return email.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() || 'user'
}

async function createUniqueUsername(base: string) {
  let candidate = base.slice(0, 18)
  let attempt = 0

  while (attempt < 10) {
    const existing = await prisma.profile.findUnique({ where: { username: candidate } })
    if (!existing) return candidate
    attempt += 1
    candidate = `${base.slice(0, 14)}${Math.floor(1000 + Math.random() * 9000)}`
  }

  return `${base.slice(0, 10)}${Date.now().toString().slice(-6)}`
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: 'Registration requires database setup in this environment.' },
      { status: 503 },
    )
  }

  const parsed = registerSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { firstName, lastName, email, phone, password, role, goals } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json(
      {
        code: 'ALREADY_REGISTERED',
        message: 'This email is already registered. Sign in instead.',
      },
      { status: 409 },
    )
  }

  const username = await createUniqueUsername(getBaseUsername(email))

  const user = await prisma.user.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      passwordHash: hashPassword(password),
      profile: {
        create: {
          username,
          phone,
          bio: `Role: ${role}. Goals: ${(goals ?? []).join(', ')}`,
        },
      },
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  })

  return NextResponse.json({ user }, { status: 201 })
}
