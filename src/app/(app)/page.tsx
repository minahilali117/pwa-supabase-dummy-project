import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LunchPicker from '@/components/lunch-picker'
import RecentPicks from '@/components/recent-picks'
import RestaurantList from '@/components/restaurant-list'
import AddRestaurantForm from '@/components/add-restaurant-form'
import { signOut } from '@/app/actions'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: restaurants } = await supabase
    .from('restaurants')
    .select('*')
    .order('created_at', { ascending: true })

  const { data: picks } = await supabase
    .from('picks')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(3)

  const lastPick = picks?.[0] ?? null

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">🍔 Lunch Picker</h1>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
            >
              Sign out
            </button>
          </form>
        </div>

        <LunchPicker restaurants={restaurants ?? []} lastPick={lastPick} />
        <RecentPicks picks={picks ?? []} />
        <RestaurantList restaurants={restaurants ?? []} />
        <AddRestaurantForm existingNames={(restaurants ?? []).map((r) => r.name)} />
      </div>
    </main>
  )
}