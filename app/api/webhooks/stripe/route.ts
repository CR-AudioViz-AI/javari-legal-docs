import { NextRequest, NextResponse } from 'next/server';
import { stripe, constructWebhookEvent, getCreditAmount, getSubscriptionTier } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  try {
    const event = constructWebhookEvent(body, signature);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer as string;
        const customerEmail = session.customer_email || session.customer_details?.email;

        // Find user by email
        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('*')
          .eq('email', customerEmail)
          .single();

        if (profile) {
          const credits = getCreditAmount(session.line_items?.data[0]?.price?.id || '');
          
          // Update credits
          await supabaseAdmin
            .from('user_profiles')
            .update({
              credits: profile.credits + credits,
              stripe_customer_id: customerId,
            })
            .eq('id', profile.id);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        const { data: profile } = await supabaseAdmin
          .from('user_profiles')
          .select('*')
          .eq('stripe_customer_id', customerId)
          .single();

        if (profile) {
          const priceId = subscription.items.data[0].price.id;
          const tier = getSubscriptionTier(priceId);
          const credits = getCreditAmount(priceId);

          await supabaseAdmin
            .from('user_profiles')
            .update({
              subscription_tier: tier,
              subscription_status: subscription.status,
              stripe_subscription_id: subscription.id,
              credits: profile.credits + credits,
            })
            .eq('id', profile.id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer as string;

        await supabaseAdmin
          .from('user_profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'canceled',
            stripe_subscription_id: null,
          })
          .eq('stripe_customer_id', customerId);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Webhook failed' },
      { status: 400 }
    );
  }
}
