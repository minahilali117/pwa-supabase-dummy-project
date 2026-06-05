import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export default async function LoginPage() {
  async function signInWithGoogle() {
    'use server'
    const requestHeaders = await headers()
    const forwardedHost =
      requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host')
    const forwardedProto = requestHeaders.get('x-forwarded-proto') ?? 'https'
    const origin =
      requestHeaders.get('origin') ??
      (forwardedHost
        ? `${forwardedProto}://${forwardedHost}`
        : process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000')

    const supabase = await createClient()
    const { data } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    })

    if (data.url) {
      redirect(data.url)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 w-full max-w-sm text-center">
        <h1 className="text-2xl font-bold mb-2">🍔 Lunch Picker</h1>
        <p className="text-gray-500 mb-8">Sign in to manage your restaurants</p>
        <form action={signInWithGoogle}>
          <button
            type="submit"
            className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-colors"
          >
            Sign in with Google
          </button>
        </form>
      </div>
    </div>
  )
}
