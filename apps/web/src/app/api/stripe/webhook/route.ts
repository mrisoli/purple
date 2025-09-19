import { api } from '@purple/backend/convex/_generated/api';
import { ConvexHttpClient } from 'convex/browser';
import { type NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    })
  : null;

const convex = process.env.NEXT_PUBLIC_CONVEX_URL
  ? new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)
  : null;

export async function POST(request: NextRequest) {
  if (!(stripe && convex)) {
    return NextResponse.json(
      { error: 'Stripe or Convex is not configured' },
      { status: 500 }
    );
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: 'Stripe webhook secret is not configured' },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No Stripe signature found' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (_error) {
    return NextResponse.json(
      { error: 'Invalid webhook signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (!userId) {
          break;
        }

        // Find user by Clerk ID and upgrade to premium
        await convex.action(api.stripe.handleSuccessfulPayment, {
          clerkUserId: userId,
          stripeCustomerId: session.customer as string,
          sessionId: session.id,
        });
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Ensure user remains premium if payment succeeds
        await convex.action(api.stripe.handleSuccessfulPayment, {
          stripeCustomerId: customerId,
        });
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Handle failed payment - could downgrade user after grace period
        if (invoice.id) {
          await convex.action(api.stripe.handleFailedPayment, {
            stripeCustomerId: customerId,
            invoiceId: invoice.id,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Downgrade user when subscription is canceled
        await convex.action(api.stripe.handleSubscriptionCanceled, {
          stripeCustomerId: customerId,
          subscriptionId: subscription.id,
        });
        break;
      }

      default:
    }

    return NextResponse.json({ received: true });
  } catch (_error) {
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
