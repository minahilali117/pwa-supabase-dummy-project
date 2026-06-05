'use client'

import { useState } from 'react'
import { addRestaurant } from '@/app/actions'

export default function AddRestaurantForm({ existingNames }: { existingNames: string[] }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return

    const trimmed = name.trim()
    const isDuplicate = existingNames.some(
      (n) => n.toLowerCase() === trimmed.toLowerCase()
    )

    if (isDuplicate) {
      setError('Restaurant already exists.')
      return
    }

    setLoading(true)
    setError(null)

    const result = await addRestaurant(trimmed)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    setName('')
    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Restaurant</h2>
      {error && (
        <p className="text-red-600 text-sm mb-3 font-medium">{error}</p>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(null)
          }}
          placeholder="e.g. Pizza Hut"
          className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
        />
        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-black text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add'}
        </button>
      </form>
    </div>
  )
}