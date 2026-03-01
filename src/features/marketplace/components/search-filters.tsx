'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react'

import { Input } from '@/components/ui/input'

const categories = ['All', 'Fashion', 'Electronics', 'Home', 'Cars', 'Collectibles']

export function SearchFilters() {
  const router = useRouter()
  const params = useSearchParams()

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    if (!value || value === 'All') next.delete(key)
    else next.set(key, value)
    router.push(`/?${next.toString()}`)
  }

  return (
    <section className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="h-5 w-5" />
        </div>
        <Input
          defaultValue={params.get('q') ?? ''}
          placeholder="Search bags, cars, gadgets..."
          className="pl-10"
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              updateParam('q', (event.target as HTMLInputElement).value)
            }
          }}
        />
      </div>

      {/* Quick Filter Pills */}
      <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200">
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition">
          <MapPin className="h-4 w-4" />
          Location
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition">
          <DollarSign className="h-4 w-4" />
          Price
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition">
          <Clock className="h-4 w-4" />
          Recently listed
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-md transition">
          <CheckCircle className="h-4 w-4" />
          Condition
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const active = (params.get('category') ?? 'All') === category
          return (
            <button
              key={category}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition ${active
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              onClick={() => updateParam('category', category)}
            >
              {category}
            </button>
          )
        })}
      </div>
    </section>
  )
}
