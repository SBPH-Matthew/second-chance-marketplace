import Link from 'next/link'
import { ShieldCheck, Plus } from 'lucide-react'

import { auth, signOut } from '@/lib/auth'
import { OnboardingEntry } from '@/features/auth/components/onboarding-entry'
import { Button } from '@/components/ui/button'

export async function SiteHeader() {
  const session = await auth()

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto w-full max-w-7xl px-4">
        <div className="flex h-12 items-center gap-3">
          <ShieldCheck className="h-4 w-4 text-gray-600" />
          <span className="text-xs text-gray-600">✔ Verified Sellers • 🛡 Buyer Protection</span>
        </div>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex flex-col">
              <span className="text-lg font-extrabold text-black">Second Chance</span>
              <span className="text-xs text-gray-600">Buy & sell with confidence</span>
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-black md:flex">
              <Link href="/marketplace" className="transition hover:text-gray-600">
                Marketplace
              </Link>
              <Link href="/inbox" className="transition hover:text-gray-600">
                Inbox
              </Link>
              <Link href="/seller" className="transition hover:text-gray-600">
                Seller
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <form
                action={async () => {
                  'use server'
                  await signOut({ redirectTo: '/' })
                }}
              >
                <Button type="submit" variant="outline" size="sm">
                  Sign out
                </Button>
              </form>
            ) : (
              <OnboardingEntry label="Sign in" variant="outline" />
            )}
            <Button size="sm" className="flex items-center gap-2 bg-black text-white hover:bg-gray-800">
              <Plus className="h-4 w-4" />
              Sell an item
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
