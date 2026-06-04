'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Restaurant } from '@/types'

export default function RestaurantList({ restaurants }: { restaurants: Restaurant[] }) {
  const router = useRouter()

  async function handleDelete(id: string) {
    const supabase = createClient()
    await supabase.from('restaurants').delete().eq('id', id)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Restaurants</h2>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {restaurants.length} available
        </span>
      </div>
      {restaurants.length === 0 ? (
        <p className="text-gray-500 text-sm">No restaurants yet. Add one below.</p>
      ) : (
        <ul className="space-y-2">
          {restaurants.map((r) => (
            <li
              key={r.id}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-gray-800 font-medium">{r.name}</span>
              <button
                onClick={() => handleDelete(r.id)}
                className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}