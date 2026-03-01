'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Star, ChevronLeft } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

const categories = ['All', 'Fashion', 'Electronics', 'Home', 'Cars', 'Collectibles', 'Toys']
const conditions = ['New', 'Like New', 'Good', 'Fair']

export function SidebarFilters() {
    const router = useRouter()
    const params = useSearchParams()

    function updateParam(key: string, value: string) {
        const next = new URLSearchParams(params.toString())
        if (!value || value === 'All') next.delete(key)
        else next.set(key, value)
        router.push(`/marketplace?${next.toString()}`)
    }

    const currentCategory = params.get('category') || 'All'
    const currentCondition = params.get('condition') || ''

    return (
        <aside className="w-full max-w-[240px] flex-shrink-0 pr-4 hidden md:block text-sm">
            {/* Categories */}
            <div className="mb-6">
                <h3 className="font-bold text-black mb-2 flex items-center gap-1">
                    {currentCategory !== 'All' && (
                        <button onClick={() => updateParam('category', 'All')} className="hover:text-amber-600">
                            <ChevronLeft className="w-4 h-4 inline" />
                            Any Category
                        </button>
                    )}
                    {currentCategory === 'All' && 'Categories'}
                </h3>
                <ul className="space-y-1.5 ml-1">
                    {categories.filter(c => c !== 'All').map((category) => {
                        if (currentCategory !== 'All' && currentCategory !== category) return null
                        return (
                            <li key={category}>
                                <button
                                    className={`hover:text-amber-600 hover:underline ${currentCategory === category ? 'font-bold text-black' : 'text-gray-700'}`}
                                    onClick={() => updateParam('category', category)}
                                >
                                    {category}
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>

            {/* Seller Rating */}
            <div className="mb-6">
                <h3 className="font-bold text-black mb-2">Seller Rating</h3>
                <ul className="space-y-1.5 ml-1">
                    {[4, 3, 2, 1].map((rating) => (
                        <li key={`rating-${rating}`}>
                            <button className="flex items-center gap-1 hover:text-amber-600 group">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                                <span className="text-gray-700 group-hover:underline">&amp; Up</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Condition */}
            <div className="mb-6">
                <h3 className="font-bold text-black mb-2">Condition</h3>
                <ul className="space-y-2 ml-1">
                    {conditions.map((condition) => (
                        <li key={condition} className="flex items-center gap-2">
                            <Checkbox
                                id={`condition-${condition}`}
                                checked={currentCondition === condition}
                                onCheckedChange={(checked: boolean | 'indeterminate') => {
                                    updateParam('condition', checked === true ? condition : '')
                                }}
                            />
                            <label
                                htmlFor={`condition-${condition}`}
                                className="text-gray-700 hover:text-amber-600 hover:underline cursor-pointer"
                            >
                                {condition}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Price */}
            <div className="mb-6">
                <h3 className="font-bold text-black mb-2">Price</h3>
                <ul className="space-y-1.5 ml-1 mb-2">
                    <li><button className="text-gray-700 hover:text-amber-600 hover:underline" onClick={() => updateParam('price', 'under_1000')}>Under ₱1,000</button></li>
                    <li><button className="text-gray-700 hover:text-amber-600 hover:underline" onClick={() => updateParam('price', '1000_5000')}>₱1,000 - ₱5,000</button></li>
                    <li><button className="text-gray-700 hover:text-amber-600 hover:underline" onClick={() => updateParam('price', '5000_10000')}>₱5,000 - ₱10,000</button></li>
                    <li><button className="text-gray-700 hover:text-amber-600 hover:underline" onClick={() => updateParam('price', 'over_10000')}>Over ₱10,000</button></li>
                </ul>
                <div className="flex items-center gap-2 mt-3">
                    <Input placeholder="Min" className="h-8 text-xs w-16 px-2" />
                    <span className="text-gray-500">-</span>
                    <Input placeholder="Max" className="h-8 text-xs w-16 px-2" />
                    <button className="border border-gray-300 rounded px-3 h-8 hover:bg-gray-100 transition shadow-sm bg-white font-medium text-xs">
                        Go
                    </button>
                </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
                <h3 className="font-bold text-black mb-2">Availability</h3>
                <ul className="space-y-2 ml-1">
                    <li className="flex items-center gap-2">
                        <Checkbox id="avail-local" />
                        <label htmlFor="avail-local" className="text-gray-700 hover:text-amber-600 hover:underline cursor-pointer">
                            Local pickup only
                        </label>
                    </li>
                    <li className="flex items-center gap-2">
                        <Checkbox id="avail-ship" />
                        <label htmlFor="avail-ship" className="text-gray-700 hover:text-amber-600 hover:underline cursor-pointer">
                            Open to shipping
                        </label>
                    </li>
                </ul>
            </div>
        </aside>
    )
}
