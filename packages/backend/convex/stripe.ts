import { v } from 'convex/values';
import { internal } from './_generated/api';
import { action } from './_generated/server';

// Handle successful payment from Stripe webhook
export const handleSuccessfulPayment = action({
  args: {
    clerkUserId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<{ success: boolean; userId?: string; error?: string }> => {
    // For checkout.session.completed events
    if (args.clerkUserId) {
      // Find user by Clerk ID
      const user = await ctx.runQuery(internal.users.findByClerkIdInternal, {
        clerkId: args.clerkUserId,
      });

      if (user) {
        // Upgrade user to premium
        await ctx.runMutation(internal.users.upgradeToPremiumInternal, {
          userId: user._id,
        });

        // Store Stripe customer ID for future reference
        if (args.stripeCustomerId) {
          await ctx.runMutation(internal.users.updateStripeCustomerIdInternal, {
            userId: user._id,
            stripeCustomerId: args.stripeCustomerId,
          });
        }

        return { success: true, userId: user._id };
      }
    }

    // For invoice.payment_succeeded events
    if (args.stripeCustomerId) {
      const user = await ctx.runQuery(internal.users.findByStripeCustomerIdInternal, {
        stripeCustomerId: args.stripeCustomerId,
      });

      if (user && !user.premium) {
        await ctx.runMutation(internal.users.upgradeToPremiumInternal, {
          userId: user._id,
        });
      }

      return { success: true, userId: user?._id };
    }

    return { success: false, error: 'No user identifier provided' };
  },
});

// Handle failed payment from Stripe webhook
export const handleFailedPayment = action({
  args: {
    stripeCustomerId: v.string(),
    invoiceId: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; userId?: string; action?: string; error?: string }> => {
    const user = await ctx.runQuery(internal.users.findByStripeCustomerIdInternal, {
      stripeCustomerId: args.stripeCustomerId,
    });

    if (user) {
      // For now, we'll keep the user premium but this could be extended
      // to implement grace periods or immediate downgrades based on business rules
      return { success: true, userId: user._id, action: 'logged_failure' };
    }

    return { success: false, error: 'User not found' };
  },
});

// Handle subscription cancellation from Stripe webhook
export const handleSubscriptionCanceled = action({
  args: {
    stripeCustomerId: v.string(),
    subscriptionId: v.string(),
  },
  handler: async (ctx, args): Promise<{ success: boolean; userId?: string; action?: string; error?: string }> => {
    const user = await ctx.runQuery(internal.users.findByStripeCustomerIdInternal, {
      stripeCustomerId: args.stripeCustomerId,
    });

    if (user?.premium) {
      // Downgrade user from premium
      await ctx.runMutation(internal.users.downgradeFromPremiumInternal, {
        userId: user._id,
      });

      return { success: true, userId: user._id, action: 'downgraded' };
    }

    return { success: false, error: 'User not found or not premium' };
  },
});
