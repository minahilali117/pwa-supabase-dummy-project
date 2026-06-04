'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Restaurant, Pick } from '@/types'

export default function LunchPicker({
  restaurants,
  lastPick,
}: {
  restaurants: Restaurant[]
  lastPick: Pick | null
}) {
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [finalPick, setFinalPick] = useState<string | null>(null)
  const [spinning, setSpinning] = useState(false)
  const router = useRouter()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  async function handlePick() {
    if (spinning) return

    // Exclude last winner unless only one restaurant
    const pool =
      restaurants.length > 1
        ? restaurants.filter((r) => r.name !== lastPick?.restaurant_name)
        : restaurants

    if (pool.length === 0) return

    setSpinning(true)
    setFinalPick(null)

    const winner = pool[Math.floor(Math.random() * pool.length)]

    // Cycle through names rapidly
    let elapsed = 0
    const totalDuration = 1800
    let interval = 80

    function cycle() {
      const random = restaurants[Math.floor(Math.random() * restaurants.length)]
      setDisplayName(random.name)
      elapsed += interval

      if (elapsed < totalDuration) {
        // Gradually slow down in the last 600ms
        if (elapsed > totalDuration - 600) {
          interval = 180
        }
        intervalRef.current = setTimeout(cycle, interval)
      } else {
        // Reveal winner
        setDisplayName(winner.name)
        setFinalPick(winner.name)
        setSpinning(false)

        const supabase = createClient()
        supabase.from('picks').insert({ restaurant_name: winner.name }).then(() => {
          router.refresh()
        })
      }
    }

    cycle()
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-4 text-center">
      <button
        onClick={handlePick}
        disabled={spinning || restaurants.length === 0}
        className="w-full bg-black text-white py-3 px-4 rounded-xl font-semibold text-base hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {spinning ? 'Picking...' : 'Pick For Me'}
      </button>

      {restaurants.length === 0 && (
        <p className="text-sm text-gray-500 mt-3">Add some restaurants first</p>
      )}

      {displayName && (
        <div className="mt-5">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">
            {finalPick ? "Today's Pick" : 'Choosing...'}
          </p>
          <p
            className={`text-3xl font-bold transition-all duration-150 ${
              finalPick ? 'text-gray-900' : 'text-gray-400'
            }`}
          >
            {finalPick ? '🍕 ' : ''}{displayName}
          </p>
        </div>
      )}
    </div>
  )
}