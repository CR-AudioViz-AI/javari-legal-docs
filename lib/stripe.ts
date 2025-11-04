import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
})

export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 100,
    features: [
      '100 credits/month',
      'Basic document conversion',
      '5 document templates',
      'Email support',
    ],
  },
  starter: {
    name: 'Starter',
    price: 29,
    priceId: 'price_starter', // You'll need to create this in Stripe Dashboard
    credits: 1000,
    features: [
      '1,000 credits/month',
      'Unlimited conversions',
      '15 document templates',
      'Priority email support',
      'Export to PDF/DOCX',
    ],
  },
  professional: {
    name: 'Professional',
    price: 99,
    priceId: 'price_professional', // You'll need to create this in Stripe Dashboard
    credits: 5000,
    features: [
      '5,000 credits/month',
      'Unlimited conversions',
      'All 15+ templates',
      '24/7 priority support',
      'Custom branding',
      'API access',
      'Bulk processing',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    priceId: 'price_enterprise', // You'll need to create this in Stripe Dashboard
    credits: 20000,
    features: [
      '20,000 credits/month',
      'Unlimited conversions',
      'All templates + custom',
      'Dedicated account manager',
      'White-label options',
      'Full API access',
      'Advanced analytics',
      'SLA guarantee',
    ],
  },
} as const

export async function createCheckoutSession(
  userId: string,
  priceId: string,
  planName: string
): Promise<Stripe.Checkout.Session> {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
    client_reference_id: userId,
    metadata: {
      userId,
      planName,
    },
  })

  return session
}

export async function createPortalSession(
  customerId: string
): Promise<Stripe.BillingPortal.Session> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  })

  return session
}

export async function addCreditsToUser(
  userId: string,
  credits: number
): Promise<void> {
  // This will be implemented with Supabase in the webhook handler
  // Just a placeholder for the function signature
  console.log(`Adding ${credits} credits to user ${userId}`)
}

export function calculateCreditsUsed(
  documentLength: number,
  conversionType: 'legal-to-plain' | 'plain-to-legal'
): number {
  // Base credit cost
  const baseCredits = 10
  
  // Additional credits per 1000 characters
  const lengthCredits = Math.ceil(documentLength / 1000) * 5
  
  // Total credits
  return baseCredits + lengthCredits
}
