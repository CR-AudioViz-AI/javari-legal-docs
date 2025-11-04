import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password required' },
        { status: 400 }
      )
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Create user record in database
    const { error: dbError } = await supabase.from('users').insert({
      id: authData.user.id,
      email: authData.user.email!,
      name: name || null,
      credits: 100, // Free tier starts with 100 credits
      plan: 'free',
    })

    if (dbError) {
      console.error('Database error:', dbError)
      // Auth user created but database insert failed
      // You might want to handle this differently in production
    }

    return NextResponse.json({
      success: true,
      user: authData.user,
      session: authData.session,
    })
  } catch (error: any) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: error.message || 'Signup failed' },
      { status: 500 }
    )
  }
}
