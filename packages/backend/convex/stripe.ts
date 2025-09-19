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
  handler: async (ctx, args) => {
    // For checkout.session.completed events
    if (args.clerkUserId) {
      // Find user by Clerk ID
      const user = await ctx.runQuery(internal.users.findByClerkId, {
        clerkId: args.clerkUserId,
      });

      if (user) {
        // Upgrade user to premium
        await ctx.runMutation(internal.users.upgradeToPremium, {
          userId: user._id,
        });

        // Store Stripe customer ID for future reference
        if (args.stripeCustomerId) {
          await ctx.runMutation(internal.users.updateStripeCustomerId, {
            userId: user._id,
            stripeCustomerId: args.stripeCustomerId,
          });
        }

        return { success: true, userId: user._id };
      }
    }

    // For invoice.payment_succeeded events
    if (args.stripeCustomerId) {
      const user = await ctx.runQuery(internal.users.findByStripeCustomerId, {
        stripeCustomerId: args.stripeCustomerId,
      });

      if (user && !user.premium) {
        await ctx.runMutation(internal.users.upgradeToPremium, {
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
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.findByStripeCustomerId, {
      stripeCustomerId: args.stripeCustomerId,
    });

    if (user) {
      // Log the failed payment but don't immediately downgrade
      // This could be enhanced to implement grace periods, retry logic, etc.
      console.log(
        `Payment failed for user ${user._id}, invoice ${args.invoiceId}`
      );

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
  handler: async (ctx, args) => {
    const user = await ctx.runQuery(internal.users.findByStripeCustomerId, {
      stripeCustomerId: args.stripeCustomerId,
    });

    if (user && user.premium) {
      // Downgrade user from premium
      await ctx.runMutation(internal.users.downgradeFromPremium, {
        userId: user._id,
      });

      return { success: true, userId: user._id, action: 'downgraded' };
    }

    return { success: false, error: 'User not found or not premium' };
  },
});
