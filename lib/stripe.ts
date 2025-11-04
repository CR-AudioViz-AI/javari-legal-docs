import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-10-28.acacia',
  typescript: true,
});

export const PRICE_IDS = {
  PROFESSIONAL: 'price_professional_monthly',
  ENTERPRISE: 'price_enterprise_monthly',
  CREDITS_100: 'price_100_credits',
  CREDITS_500: 'price_500_credits',
};

export async function createCheckoutSession(
  priceId: string,
  customerId: string | null,
  customerEmail: string,
  successUrl: string,
  cancelUrl: string
): Promise<Stripe.Checkout.Session> {
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: priceId.includes('monthly') ? 'subscription' : 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerId ? undefined : customerEmail,
    ...(customerId && { customer: customerId }),
  };

  return await stripe.checkout.sessions.create(sessionParams);
}

export async function createCustomer(email: string, name?: string): Promise<Stripe.Customer> {
  return await stripe.customers.create({
    email,
    ...(name && { name }),
  });
}

export async function getCustomer(customerId: string): Promise<Stripe.Customer> {
  return await stripe.customers.retrieve(customerId) as Stripe.Customer;
}

export async function createSubscription(
  customerId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
    payment_behavior: 'default_incomplete',
    payment_settings: { save_default_payment_method: 'on_subscription' },
    expand: ['latest_invoice.payment_intent'],
  });
}

export async function cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.cancel(subscriptionId);
}

export async function updateSubscription(
  subscriptionId: string,
  priceId: string
): Promise<Stripe.Subscription> {
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  return await stripe.subscriptions.update(subscriptionId, {
    items: [
      {
        id: subscription.items.data[0].id,
        price: priceId,
      },
    ],
    proration_behavior: 'create_prorations',
  });
}

export async function getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
  return await stripe.subscriptions.retrieve(subscriptionId);
}

export async function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Promise<Stripe.Event> {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
}

export function getCreditAmount(priceId: string): number {
  switch (priceId) {
    case PRICE_IDS.PROFESSIONAL:
      return 500;
    case PRICE_IDS.ENTERPRISE:
      return 2000;
    case PRICE_IDS.CREDITS_100:
      return 100;
    case PRICE_IDS.CREDITS_500:
      return 500;
    default:
      return 0;
  }
}

export function getSubscriptionTier(priceId: string): 'free' | 'professional' | 'enterprise' {
  if (priceId === PRICE_IDS.PROFESSIONAL) return 'professional';
  if (priceId === PRICE_IDS.ENTERPRISE) return 'enterprise';
  return 'free';
}
