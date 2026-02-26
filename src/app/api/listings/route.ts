import { NextResponse } from 'next/server'

import { getMarketplaceFeed } from '@/features/marketplace/server/queries'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const data = await getMarketplaceFeed({
    q: searchParams.get('q') ?? undefined,
    category: searchParams.get('category') ?? undefined,
    sort: (searchParams.get('sort') as 'latest' | 'price_asc' | 'price_desc' | null) ?? 'latest',
    cursor: searchParams.get('cursor') ?? undefined,
  })

  return NextResponse.json(data)
}
