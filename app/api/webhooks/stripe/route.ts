import { NextRequest, NextResponse } from 'next/server'
import { stripe, PRICING_PLANS } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.client_reference_id || session.metadata?.userId

        if (!userId) {
          console.error('No user ID found in session')
          break
        }

        const planName = session.metadata?.planName as keyof typeof PRICING_PLANS

        if (planName && PRICING_PLANS[planName]) {
          const credits = PRICING_PLANS[planName].credits

          // Update user's plan and add credits
          await supabaseAdmin
            .from('users')
            .update({
              plan: planName,
              credits: credits,
            })
            .eq('id', userId)

          console.log(`Updated user ${userId} to ${planName} plan with ${credits} credits`)
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        // Handle subscription updates if needed
        console.log('Subscription updated:', subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const userId = subscription.metadata?.userId

        if (userId) {
          // Downgrade user to free plan
          await supabaseAdmin
            .from('users')
            .update({
              plan: 'free',
              credits: 100, // Reset to free tier credits
            })
            .eq('id', userId)

          console.log(`Downgraded user ${userId} to free plan`)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        // Handle successful payment - could be monthly renewal
        console.log('Payment succeeded for invoice:', invoice.id)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        // Handle failed payment
        console.error('Payment failed for invoice:', invoice.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: error.message || 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
