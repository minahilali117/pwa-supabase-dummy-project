'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

export async function addRestaurant(name: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  const { error } = await supabase.from('restaurants').insert({ name })
  if (error) return { error: error.message }
  revalidatePath('/')
  return { error: null }
}

export async function deleteRestaurant(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('restaurants').delete().eq('id', id).eq('user_id', user.id)
  revalidatePath('/')
}

export async function savePick(restaurantName: string) {
  const supabase = await createClient()
  await supabase.from('picks').insert({ restaurant_name: restaurantName })
  revalidatePath('/')
}

export async function clearHistory() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('picks').delete().eq('user_id', user.id)
  revalidatePath('/')
}