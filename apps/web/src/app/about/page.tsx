'use client';
import { SignUpButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated } from 'convex/react';
import { ArrowRight, Award, Heart, Target, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AboutPage() {
  const stats = [
    { number: '5,000+', label: 'Goal Achievers' },
    { number: '2,500+', label: 'Buddy Pairs' },
    { number: '85%', label: 'Success Rate' },
    { number: '10,000+', label: 'Goals Completed' },
  ] as const;

  const values = [
    {
      icon: Target,
      title: 'Goal-Focused',
      description:
        'We believe everyone has the potential to achieve their dreams with the right support and accountability.',
    },
    {
      icon: Users,
      title: 'Community-Driven',
      description:
        'Success is better when shared. We foster a supportive community where accountability partners thrive together.',
    },
    {
      icon: Award,
      title: 'Achievement-Oriented',
      description:
        'We celebrate every milestone, big or small, because progress deserves recognition and motivation.',
    },
    {
      icon: Heart,
      title: 'Supportive',
      description:
        "We're passionate about creating meaningful connections that help people stay committed to their goals.",
    },
  ] as const;

  const team = [
    {
      name: 'Alex Johnson',
      role: 'CEO & Founder',
      background:
        'Life coach and accountability expert with 8+ years helping people achieve their goals',
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      background:
        'Ex-Microsoft engineer, specialized in building community-driven platforms',
    },
    {
      name: 'David Rodriguez',
      role: 'Head of Design',
      background:
        'UX designer focused on motivational and behavior-change applications',
    },
    {
      name: 'Emma Williams',
      role: 'Community Manager',
      background:
        'Psychology background with expertise in peer support and accountability systems',
    },
  ] as const;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      {/* Hero Section */}
      <section className="space-y-6 py-16 text-center">
        <h1 className="font-bold text-4xl tracking-tight lg:text-6xl">
          About Our Mission
        </h1>
        <p className="mx-auto max-w-3xl text-muted-foreground text-xl">
          We're building the future of accountability. Our mission is to help
          people achieve their goals through meaningful partnerships, consistent
          support, and proven accountability systems.
        </p>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map(({ number, label }) => (
            <div className="space-y-2 text-center" key={label}>
              <div className="font-bold text-4xl text-primary">{number}</div>
              <div className="text-muted-foreground text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="font-bold text-3xl">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Our platform was founded in 2022 when our team experienced
                firsthand the challenge of staying accountable to personal
                goals. We realized that having the right accountability partner
                could make all the difference between giving up and achieving
                success.
              </p>
              <p>
                Starting with a simple idea—what if accountability was as easy
                as finding a workout buddy?—we set out to build something
                different. We wanted to create a platform that would connect
                people with shared goals and provide the tools they need to
                support each other.
              </p>
              <p>
                Today, thousands of goal-oriented individuals around the world
                use our platform to find accountability partners, track their
                progress, and achieve their most important goals. We're just
                getting started.
              </p>
            </div>
          </div>
          <div className="space-y-4 rounded-lg bg-muted/30 p-8 text-center">
            <h3 className="font-semibold text-2xl">Founded in 2022</h3>
            <p className="text-muted-foreground">
              Born from the belief that accountability partnerships can
              transform lives and help people achieve their biggest dreams.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <div className="text-center">
                <div className="font-bold text-lg text-primary">Community</div>
                <div className="text-muted-foreground text-sm">Driven</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-lg text-primary">
                  Goal-Focused
                </div>
                <div className="text-muted-foreground text-sm">Platform</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16">
        <h2 className="mb-12 text-center font-bold text-3xl">Our Values</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, description }) => (
            <Card className="text-center" key={title}>
              <CardHeader>
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="rounded-2xl bg-muted/30 py-16">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="font-bold text-3xl">Meet Our Team</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We're a diverse group of builders, designers, and problem-solvers
            united by our passion for creating exceptional products.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {team.map(({ name, role, background }) => (
            <Card className="text-center" key={name}>
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription className="font-medium text-primary">
                  {role}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">{background}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-4xl space-y-6">
          <h2 className="font-bold text-3xl">Our Mission</h2>
          <blockquote className="text-muted-foreground text-xl italic">
            "To empower individuals worldwide with meaningful accountability
            partnerships that unlock their potential and help them achieve their
            most important goals through consistent support and shared
            commitment."
          </blockquote>
          <div className="pt-6">
            <p className="text-muted-foreground">
              We believe that when people have the right accountability partner,
              they can accomplish extraordinary things. That's why we're
              committed to building the best platform for creating lasting
              accountability relationships.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="space-y-6 py-16 text-center">
        <h2 className="font-bold text-3xl">
          Start Your Accountability Journey
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Ready to achieve your goals with the power of accountability? Join
          thousands of goal achievers who have transformed their lives with the
          right support.
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
              <span className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground text-sm ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </span>
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
