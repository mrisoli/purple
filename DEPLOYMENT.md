# Deployment Guide 🚀

This guide covers deploying Purple to production using recommended services.

## Prerequisites

- GitHub repository with your Purple code
- Domain name (optional but recommended)
- Credit card for service signups (most have free tiers)

## Services Overview

| Service | Purpose | Free Tier | Pricing |
|---------|---------|-----------|---------|
| **Vercel** | Frontend hosting | Yes (100GB bandwidth) | $20/month Pro |
| **Convex** | Backend/Database | Yes (1M reads/month) | $25/month Pro |
| **Clerk** | Authentication | Yes (10k MAU) | $25/month Pro |
| **Stripe** | Payments | Yes (no monthly fee) | 2.9% + 30¢ per transaction |
| **Resend** | Email delivery | Yes (3k emails/month) | $20/month Pro |

## Step 1: Deploy Backend (Convex)

1. **Install Convex CLI**
```bash
npm install -g convex
```

2. **Deploy to production**
```bash
cd packages/backend
convex deploy --prod
```

3. **Configure environment variables in Convex Dashboard**
   - `CLERK_JWT_ISSUER_DOMAIN`
   - Any other backend environment variables

4. **Note your production Convex URL**
   - Will look like: `https://your-project.convex.cloud`

## Step 2: Deploy Frontend (Vercel)

1. **Connect GitHub repository to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `apps/web` directory as the root

2. **Configure build settings**
   - Framework Preset: **Next.js**
   - Build Command: `cd ../.. && bun run build --filter=web`
   - Output Directory: `apps/web/.next`
   - Install Command: `bun install`

3. **Set environment variables in Vercel**
   ```bash
   NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   
   # Optional - Stripe
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Optional - Resend
   RESEND_API_KEY=re_...
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

4. **Deploy**
   - Vercel will automatically deploy on push to main branch

## Step 3: Configure Authentication (Clerk)

1. **Update Clerk settings**
   - Add your production domain to allowed origins
   - Update redirect URLs to your production domain
   - Switch to production keys

2. **Configure Convex integration**
   - In Convex dashboard, add your Clerk JWT issuer
   - Ensure `CLERK_JWT_ISSUER_DOMAIN` matches your Clerk domain

## Step 4: Configure Payments (Stripe)

1. **Create production products**
   - Create Premium subscription product ($9/month)
   - Note the price ID for environment variables

2. **Configure webhooks**
   - Endpoint: `https://your-domain.com/api/stripe/webhook`
   - Events to select:
     - `checkout.session.completed`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
     - `customer.subscription.deleted`

3. **Test payments**
   - Use Stripe's test cards in development
   - Switch to live mode for production

## Step 5: Configure Email (Resend)

1. **Verify domain**
   - Add your domain to Resend
   - Configure DNS records for better deliverability

2. **Update FROM addresses**
   - Update email templates in `apps/web/src/lib/email.ts`
   - Use your verified domain

## Step 6: Custom Domain (Optional)

1. **Add domain to Vercel**
   - In Vercel dashboard, add your custom domain
   - Configure DNS records as instructed

2. **Update environment variables**
   - Update `NEXT_PUBLIC_APP_URL` to your custom domain
   - Update Clerk redirect URLs

## Step 7: Monitor and Test

### Health Checks
- [ ] Landing page loads correctly
- [ ] Authentication works (sign up/sign in)
- [ ] Project creation works
- [ ] Buddy invitations work
- [ ] Email notifications sent
- [ ] Premium upgrade flow works
- [ ] Payment webhooks processed

### Performance
- [ ] Core Web Vitals are good
- [ ] Images optimized
- [ ] Bundle size reasonable
- [ ] Loading times acceptable

### Security
- [ ] HTTPS enabled
- [ ] Security headers configured
- [ ] No sensitive data in client bundles
- [ ] API routes protected

## Troubleshooting

### Common Issues

**Authentication not working**
- Check Clerk domain configuration
- Verify JWT issuer domain in Convex
- Ensure environment variables are correct

**Database queries failing**
- Check Convex function deployment
- Verify schema is up to date
- Check authentication in Convex functions

**Payments not working**
- Verify Stripe webhook endpoint
- Check webhook secret is correct
- Ensure test/live mode consistency

**Emails not sending**
- Check Resend API key
- Verify domain verification
- Check email template syntax

### Debugging Tools

**Logs**
- Vercel Function Logs
- Convex Function Logs  
- Stripe Dashboard Events
- Resend Activity Feed

**Testing**
- Vercel Preview Deployments
- Stripe Test Mode
- Resend Test Emails

## Production Checklist

### Pre-Launch
- [ ] All environment variables configured
- [ ] Services connected and tested
- [ ] Domain configured (if using custom domain)
- [ ] SSL certificate active
- [ ] Error tracking configured
- [ ] Analytics configured
- [ ] Backup strategy in place

### Post-Launch
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Verify payment processing
- [ ] Monitor email deliverability
- [ ] Set up alerts for critical issues
- [ ] Document any production-specific configurations

## Scaling Considerations

### Traffic Growth
- Vercel auto-scales frontend
- Convex auto-scales backend
- Monitor usage limits on free tiers

### Database
- Convex handles scaling automatically
- Monitor query performance
- Consider data archiving strategies

### Email
- Monitor sending limits
- Consider dedicated IP for high volume
- Implement email preferences/unsubscribe

---

💡 **Tip**: Deploy to a staging environment first to test the entire flow before going to production.

🔒 **Security**: Always use live/production keys only in production environments. Keep development and production completely separate.