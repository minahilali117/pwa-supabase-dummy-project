import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  console.log('Callback hit, origin:', origin)
  console.log('Code:', code)

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Exchange result:', data?.user?.email, 'Error:', error)
  }

  console.log('Redirecting to:', `${origin}/`)
  return NextResponse.redirect(`${origin}/`)
}