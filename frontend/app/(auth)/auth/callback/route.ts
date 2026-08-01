import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Create user record in DB if they don't exist? (Assuming Option B)
      // For this implementation, we assume we might need a webhook or trigger in the backend. 
      // But we can also make a fetch call here to a backend endpoint if required. 
      // Since it's outside the scope of "don't touch backend", we assume Supabase triggers handle the database sync or we skip manual insert if we don't have access to the public.users table.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`)
}
