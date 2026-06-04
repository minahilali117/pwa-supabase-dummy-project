'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Pick } from '@/types'

export default function RecentPicks({ picks }: { picks: Pick[] }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClearHistory() {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('picks').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    setLoading(false)
    setConfirming(false)
    router.refresh()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Picks</h2>
        {picks.length > 0 && !confirming && (
          <button
            onClick={() => setConfirming(true)}
            className="text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            Clear history
          </button>
        )}
      </div>

      {confirming && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-700 font-medium mb-3">
            Are you sure you want to clear all pick history?
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleClearHistory}
              disabled={loading}
              className="bg-red-600 text-white text-sm px-4 py-1.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Clearing...' : 'Yes, clear it'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-sm px-4 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {picks.length === 0 ? (
        <p className="text-gray-500 text-sm">No picks yet.</p>
      ) : (
        <ul className="space-y-2">
          {picks.map((pick, index) => (
            <li
              key={pick.id}
              className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
            >
              <span className="text-xs font-semibold text-gray-400 w-4">{index + 1}</span>
              <span className="text-gray-800 font-medium">{pick.restaurant_name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}