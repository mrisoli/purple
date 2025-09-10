'use client';
import { SignUpButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated } from 'convex/react';
import { ArrowRight, Check, X } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      billing: 'Forever',
      description:
        'Perfect for getting started with your first accountability goal',
      features: [
        '1 accountability project',
        'Connect with 1 accountability buddy',
        'Progress tracking and action log',
        'Basic milestone celebrations',
        'Community support',
      ],
      limitations: [
        'Limited to 1 project',
        'No priority features',
        'No advanced analytics',
      ],
      recommended: false,
      buttonText: 'Get Started Free',
    },
    {
      name: 'Premium',
      price: '$9',
      billing: 'per month',
      description:
        'Unlock unlimited accountability projects and advanced features',
      features: [
        'Unlimited accountability projects',
        'Connect with multiple buddies',
        'Advanced progress analytics',
        'Custom milestone tracking',
        'Priority support',
        'Goal achievement insights',
        'Weekly accountability reports',
        'Mobile notifications',
      ],
      limitations: [],
      recommended: true,
      buttonText: 'Start Premium',
    },
    {
      name: 'Team',
      price: '$25',
      billing: 'per month',
      description: 'Perfect for organizations promoting accountability culture',
      features: [
        'Everything in Premium',
        'Team accountability dashboard',
        'Up to 10 team members',
        'Group goal tracking',
        'Team analytics and insights',
        'Admin management tools',
        'Custom branding options',
        'Dedicated account support',
      ],
      limitations: [],
      recommended: false,
      buttonText: 'Contact Sales',
    },
  ] as const;

  const faqs = [
    {
      question: 'How does the accountability buddy system work?',
      answer:
        'You invite friends, family, or colleagues by email to be your accountability buddies. They can see your progress, encourage you, and help keep you motivated to reach your goals.',
    },
    {
      question: 'Can I have multiple accountability projects?',
      answer:
        'Free users can create 1 project, while Premium users get unlimited projects. This lets you work on multiple goals simultaneously with different accountability buddies.',
    },
    {
      question: "What if my buddy doesn't respond?",
      answer:
        'You can always invite new buddies to your projects. We also provide community support and gentle reminders to keep everyone engaged in the accountability process.',
    },
    {
      question: 'Is my progress data private?',
      answer:
        'Yes! Your progress is only visible to you and the accountability buddies you specifically invite to each project. We take privacy seriously.',
    },
    {
      question: 'Can I upgrade from Free to Premium anytime?',
      answer:
        'Absolutely! You can upgrade to Premium at any time to unlock unlimited projects and advanced features. Your existing project and data will remain intact.',
    },
    {
      question: 'Do you offer refunds?',
      answer:
        "Yes, we offer a 30-day money-back guarantee for Premium subscriptions. If you're not satisfied, we'll provide a full refund within 30 days.",
    },
  ] as const;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Header Section */}
      <section className="space-y-4 py-16 text-center">
        <h1 className="font-bold text-4xl tracking-tight lg:text-6xl">
          Achieve More With Accountability
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground text-xl">
          Start with one free project, then upgrade to unlock unlimited
          accountability goals. All plans include buddy connections and progress
          tracking.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="grid grid-cols-1 gap-8 py-8 md:grid-cols-3">
        {plans.map(
          ({
            name,
            price,
            billing,
            description,
            features,
            limitations,
            recommended,
            buttonText,
          }) => (
            <Card
              className={`relative ${recommended ? 'scale-105 border-2 border-primary shadow-xl' : ''}`}
              key={name}
            >
              {recommended && (
                <div className="-top-4 -translate-x-1/2 absolute left-1/2 transform">
                  <span className="rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground text-sm">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="pb-8 text-center">
                <CardTitle className="text-2xl">{name}</CardTitle>
                <div className="space-y-4">
                  <div className="font-bold text-4xl">
                    {price}
                    {price !== 'Custom' && (
                      <span className="font-normal text-lg text-muted-foreground">
                        /{billing}
                      </span>
                    )}
                  </div>
                  {price === 'Custom' && (
                    <div className="text-muted-foreground text-sm">
                      {billing}
                    </div>
                  )}
                </div>
                <CardDescription className="text-base">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Authenticated>
                  <Button
                    asChild
                    className="w-full"
                    size="lg"
                    variant={recommended ? 'default' : 'outline'}
                  >
                    <Link href="/dashboard">Go to Dashboard</Link>
                  </Button>
                </Authenticated>
                <Unauthenticated>
                  {buttonText === 'Start Free Trial' ? (
                    <SignUpButton mode="modal">
                      <Button
                        className="w-full"
                        size="lg"
                        variant={recommended ? 'default' : 'outline'}
                      >
                        {buttonText}
                      </Button>
                    </SignUpButton>
                  ) : buttonText === 'Get Started Free' ? (
                    <SignUpButton mode="modal">
                      <Button className="w-full" size="lg" variant="outline">
                        {buttonText}
                      </Button>
                    </SignUpButton>
                  ) : (
                    <Button className="w-full" size="lg" variant="outline">
                      {buttonText}
                    </Button>
                  )}
                </Unauthenticated>

                <div className="space-y-4">
                  <h4 className="font-semibold text-sm uppercase tracking-wider">
                    What's included:
                  </h4>
                  <ul className="space-y-3">
                    {features.map((feature) => (
                      <li
                        className="flex items-start gap-3 text-sm"
                        key={feature}
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {limitations.length > 0 && (
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">
                        Not included:
                      </h4>
                      <ul className="space-y-3">
                        {limitations.map((limitation) => (
                          <li
                            className="flex items-start gap-3 text-muted-foreground text-sm"
                            key={limitation}
                          >
                            <X className="mt-0.5 h-4 w-4 flex-shrink-0" />
                            <span>{limitation}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        )}
      </section>

      {/* Features Comparison */}
      <section className="py-16">
        <h2 className="mb-12 text-center font-bold text-3xl">
          Core Accountability Features
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Buddy Connections</h3>
            <p className="text-muted-foreground text-sm">
              Invite friends, family, or colleagues to keep you accountable.
            </p>
          </div>
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Progress Tracking</h3>
            <p className="text-muted-foreground text-sm">
              Log updates, milestones, and challenges with detailed timelines.
            </p>
          </div>
          <div className="space-y-3 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Check className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Goal Achievement</h3>
            <p className="text-muted-foreground text-sm">
              Stay motivated with milestone celebrations and achievement
              insights.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="rounded-2xl bg-muted/30 py-16">
        <h2 className="mb-12 text-center font-bold text-3xl">
          Frequently Asked Questions
        </h2>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {faqs.map(({ question, answer }) => (
            <div className="space-y-3" key={question}>
              <h3 className="font-semibold text-lg">{question}</h3>
              <p className="text-muted-foreground">{answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-6">
          <h2 className="font-bold text-3xl">30-Day Money-Back Guarantee</h2>
          <p className="text-lg text-muted-foreground">
            Try Premium risk-free. If you haven't achieved better accountability
            results within 30 days, we'll refund your money, no questions asked.
          </p>
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Authenticated>
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </Authenticated>
            <Unauthenticated>
              <SignUpButton mode="modal">
                <Button size="lg">
                  Start Your First Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignUpButton>
              <Button asChild size="lg" variant="outline">
                <Link href="/about">Learn More</Link>
              </Button>
            </Unauthenticated>
          </div>
        </div>
      </section>
    </div>
  );
}
