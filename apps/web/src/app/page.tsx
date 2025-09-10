"use client";
import Link from "next/link";
import { ArrowRight, Zap, Shield, Users, CheckCircle } from "lucide-react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
	const features = [
		{
			icon: Users,
			title: "Find Your Buddy",
			description: "Connect with accountability partners who will keep you motivated and on track",
		},
		{
			icon: CheckCircle,
			title: "Track Progress",
			description: "Log updates, celebrate milestones, and see your growth over time",
		},
		{
			icon: Zap,
			title: "Stay Motivated",
			description: "Real-time notifications and friendly nudges from your accountability buddy",
		},
	] as const;

	const benefits = [
		"Turn your goals into achievements",
		"Get support from dedicated accountability buddies",
		"Track progress with detailed action logs", 
		"Set and reach meaningful milestones",
		"Stay motivated with regular check-ins",
		"Build lasting habits with consistent support",
	] as const;

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			{/* Hero Section */}
			<section className="text-center space-y-8 py-16">
				<div className="space-y-6">
					<h1 className="text-5xl font-bold tracking-tight lg:text-7xl">
						Achieve Your Goals with
						<span className="text-primary block lg:inline"> Accountability Buddies</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						Transform your ambitions into achievements. Connect with accountability partners who will support, 
						motivate, and celebrate your progress every step of the way.
					</p>
				</div>

				{/* CTA Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Authenticated>
						<Button size="lg" asChild>
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
							<Button variant="outline" size="lg">
								Sign In
							</Button>
						</SignInButton>
					</Unauthenticated>
				</div>

				<p className="text-sm text-muted-foreground">
					Free to start • Create your first project • Find your accountability buddy today
				</p>
			</section>

			{/* Features Section */}
			<section className="py-16">
				<div className="text-center space-y-4 mb-12">
					<h2 className="text-3xl font-bold">How It Works</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Simple steps to turn your goals into reality with the power of accountability.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{features.map(({ icon: Icon, title, description }) => (
						<Card key={title} className="text-center border-0 shadow-lg">
							<CardHeader>
								<div className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-primary/10">
									<Icon className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-xl">{title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-base">{description}</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Benefits Section */}
			<section className="py-16 bg-muted/30 rounded-2xl">
				<div className="text-center space-y-4 mb-12">
					<h2 className="text-3xl font-bold">Everything You Need to Succeed</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Built-in features to help you stay accountable, track progress, and achieve your most important goals.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
					{benefits.map((benefit) => (
						<div key={benefit} className="flex items-center gap-3">
							<CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
							<span className="text-sm">{benefit}</span>
						</div>
					))}
				</div>
			</section>

			{/* Social Proof */}
			<section className="py-16 text-center">
				<div className="space-y-8">
					<h2 className="text-3xl font-bold">Join Goal Achievers Everywhere</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
						<div className="p-6 bg-muted/50 rounded-lg">
							<p className="text-sm text-muted-foreground mb-4">
								"Having an accountability buddy completely changed how I approach my goals. I finally finished my side project!"
							</p>
							<p className="font-medium">Sarah K.</p>
						</div>
						<div className="p-6 bg-muted/50 rounded-lg">
							<p className="text-sm text-muted-foreground mb-4">
								"The progress tracking keeps me motivated. Seeing my buddy's updates pushes me to keep going too."
							</p>
							<p className="font-medium">Mike T.</p>
						</div>
						<div className="p-6 bg-muted/50 rounded-lg">
							<p className="text-sm text-muted-foreground mb-4">
								"Simple, effective, and exactly what I needed to stay consistent with my fitness goals."
							</p>
							<p className="font-medium">Anna L.</p>
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-16 text-center space-y-6">
				<h2 className="text-3xl font-bold">Ready to Achieve Your Goals?</h2>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Start your accountability journey today. Create your first project and find your perfect accountability buddy.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Authenticated>
						<Button size="lg" asChild>
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
						<Button variant="outline" size="lg" asChild>
							<Link href="/pricing">View Pricing</Link>
						</Button>
					</Unauthenticated>
				</div>
			</section>
		</div>
	);
}
