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
			icon: Zap,
			title: "Lightning Fast",
			description: "Built with modern technologies for optimal performance",
		},
		{
			icon: Shield,
			title: "Secure by Default",
			description: "Enterprise-grade security with best practices built-in",
		},
		{
			icon: Users,
			title: "Team Collaboration",
			description: "Work together seamlessly with powerful collaboration tools",
		},
	] as const;

	const benefits = [
		"Increase productivity by 10x",
		"Seamless team collaboration",
		"Advanced analytics and insights",
		"24/7 customer support",
		"99.9% uptime guarantee",
		"Easy integration with existing tools",
	] as const;

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			{/* Hero Section */}
			<section className="text-center space-y-8 py-16">
				<div className="space-y-6">
					<h1 className="text-5xl font-bold tracking-tight lg:text-7xl">
						Welcome to
						<span className="text-primary block lg:inline"> Purple</span>
					</h1>
					<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
						The ultimate platform to streamline your workflow, boost productivity, and achieve your goals. 
						Join thousands of users who have transformed their work experience.
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
					No credit card required • Free 14-day trial • Cancel anytime
				</p>
			</section>

			{/* Features Section */}
			<section className="py-16">
				<div className="text-center space-y-4 mb-12">
					<h2 className="text-3xl font-bold">Why Choose Purple?</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Powerful features designed to help you work smarter, not harder.
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
						Purple comes with all the tools and features you need to take your productivity to the next level.
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
					<h2 className="text-3xl font-bold">Trusted by Industry Leaders</h2>
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
						<div className="h-12 bg-muted rounded flex items-center justify-center text-sm font-medium">
							Company A
						</div>
						<div className="h-12 bg-muted rounded flex items-center justify-center text-sm font-medium">
							Company B
						</div>
						<div className="h-12 bg-muted rounded flex items-center justify-center text-sm font-medium">
							Company C
						</div>
						<div className="h-12 bg-muted rounded flex items-center justify-center text-sm font-medium">
							Company D
						</div>
					</div>
				</div>
			</section>

			{/* Final CTA */}
			<section className="py-16 text-center space-y-6">
				<h2 className="text-3xl font-bold">Ready to Get Started?</h2>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Join thousands of satisfied users and transform the way you work today.
				</p>
				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<Authenticated>
						<Button size="lg" asChild>
							<Link href="/dashboard">
								Access Your Dashboard
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</Authenticated>
					<Unauthenticated>
						<SignUpButton mode="modal">
							<Button size="lg">
								Start Your Free Trial
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
