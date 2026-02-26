import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Facebook from 'next-auth/providers/facebook'
import Google from 'next-auth/providers/google'

import { verifyPassword } from '@/lib/password'
import { prisma } from '@/lib/prisma'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
    } & DefaultSession['user']
  }
}

const providers = [
  Credentials({
    name: 'Email login',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    authorize: async (credentials) => {
      if (!credentials?.email || typeof credentials.email !== 'string') return null
      if (!credentials?.password || typeof credentials.password !== 'string') return null

      if (!process.env.DATABASE_URL) {
        const email = credentials.email
        const password = credentials.password
        if (email === 'buyer@secondchance.dev' && password === 'demo12345') {
          return { id: 'demo-buyer', email, name: 'Alex Ramos' }
        }
        if (email === 'seller@secondchance.dev' && password === 'demo12345') {
          return { id: 'demo-seller', email, name: 'Mika Santos' }
        }
        return null
      }

      const user = await prisma.user.findUnique({
        where: { email: credentials.email },
      })

      if (!user?.passwordHash) return null
      if (!verifyPassword(credentials.password, user.passwordHash)) return null

      return user
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  )
}

if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
  providers.push(
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET ?? 'dev-only-secret-change-me',
  session: { strategy: 'jwt' },
  providers,
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) token.id = user.id
      return token
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
