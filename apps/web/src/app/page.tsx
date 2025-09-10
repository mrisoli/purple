'use client';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated } from 'convex/react';
import { ArrowRight, CheckCircle, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Home() {
  const features = [
    {
      icon: Users,
      title: 'Find Your Buddy',
      description:
        'Connect with accountability partners who will keep you motivated and on track',
    },
    {
      icon: CheckCircle,
      title: 'Track Progress',
      description:
        'Log updates, celebrate milestones, and see your growth over time',
    },
    {
      icon: Zap,
      title: 'Stay Motivated',
      description:
        'Real-time notifications and friendly nudges from your accountability buddy',
    },
  ] as const;

  const benefits = [
    'Turn your goals into achievements',
    'Get support from dedicated accountability buddies',
    'Track progress with detailed action logs',
    'Set and reach meaningful milestones',
    'Stay motivated with regular check-ins',
    'Build lasting habits with consistent support',
  ] as const;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Hero Section */}
      <section className="space-y-8 py-16 text-center">
        <div className="space-y-6">
          <h1 className="font-bold text-5xl tracking-tight lg:text-7xl">
            Achieve Your Goals with
            <span className="block text-primary lg:inline">
              {' '}
              Accountability Buddies
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-muted-foreground text-xl">
            Transform your ambitions into achievements. Connect with
            accountability partners who will support, motivate, and celebrate
            your progress every step of the way.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </SignInButton>
          </Unauthenticated>
        </div>

        <p className="text-muted-foreground text-sm">
          Free to start • Create your first project • Find your accountability
          buddy today
        </p>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="font-bold text-3xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Simple steps to turn your goals into reality with the power of
            accountability.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card className="border-0 text-center shadow-lg" key={title}>
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="rounded-2xl bg-muted/30 py-16">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="font-bold text-3xl">Everything You Need to Succeed</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Built-in features to help you stay accountable, track progress, and
            achieve your most important goals.
          </p>
        </div>
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          {benefits.map((benefit) => (
            <div className="flex items-center gap-3" key={benefit}>
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-500" />
              <span className="text-sm">{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-16 text-center">
        <div className="space-y-8">
          <h2 className="font-bold text-3xl">Join Goal Achievers Everywhere</h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-muted/50 p-6">
              <p className="mb-4 text-muted-foreground text-sm">
                "Having an accountability buddy completely changed how I
                approach my goals. I finally finished my side project!"
              </p>
              <p className="font-medium">Sarah K.</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-6">
              <p className="mb-4 text-muted-foreground text-sm">
                "The progress tracking keeps me motivated. Seeing my buddy's
                updates pushes me to keep going too."
              </p>
              <p className="font-medium">Mike T.</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-6">
              <p className="mb-4 text-muted-foreground text-sm">
                "Simple, effective, and exactly what I needed to stay consistent
                with my fitness goals."
              </p>
              <p className="font-medium">Anna L.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="space-y-6 py-16 text-center">
        <h2 className="font-bold text-3xl">Ready to Achieve Your Goals?</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Start your accountability journey today. Create your first project and
          find your perfect accountability buddy.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </SignUpButton>
            <Button asChild size="lg" variant="outline">
              <Link href="/pricing">View Pricing</Link>
            </Button>
          </Unauthenticated>
        </div>
      </section>
    </div>
  );
}
