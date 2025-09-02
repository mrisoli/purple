"use client";
import Link from "next/link";
import { Target, Users, Award, Heart, ArrowRight } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { Unauthenticated, Authenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
	const stats = [
		{ number: "10,000+", label: "Happy Users" },
		{ number: "50+", label: "Countries" },
		{ number: "99.9%", label: "Uptime" },
		{ number: "24/7", label: "Support" },
	] as const;

	const values = [
		{
			icon: Target,
			title: "Mission-Driven",
			description: "We're committed to helping individuals and teams achieve their full potential through innovative productivity solutions.",
		},
		{
			icon: Users,
			title: "User-Centric",
			description: "Every feature we build is designed with our users in mind. Your feedback drives our product development.",
		},
		{
			icon: Award,
			title: "Excellence",
			description: "We strive for excellence in everything we do, from product quality to customer service.",
		},
		{
			icon: Heart,
			title: "Passionate",
			description: "We're passionate about creating tools that make work more enjoyable and meaningful.",
		},
	] as const;

	const team = [
		{
			name: "Alex Johnson",
			role: "CEO & Founder",
			background: "Former product manager at Google with 8+ years building productivity tools",
		},
		{
			name: "Sarah Chen",
			role: "CTO",
			background: "Ex-Microsoft engineer, specialized in scalable systems and user experience",
		},
		{
			name: "David Rodriguez",
			role: "Head of Design",
			background: "Award-winning designer with experience at Apple and Spotify",
		},
		{
			name: "Emma Williams",
			role: "VP of Customer Success",
			background: "Customer experience expert with 10+ years in SaaS companies",
		},
	] as const;

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			{/* Hero Section */}
			<section className="text-center space-y-6 py-16">
				<h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
					About Purple
				</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					We're building the future of productivity. Our mission is to help people and teams 
					work more efficiently, collaborate better, and achieve extraordinary results.
				</p>
			</section>

			{/* Stats Section */}
			<section className="py-16">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					{stats.map(({ number, label }) => (
						<div key={label} className="text-center space-y-2">
							<div className="text-4xl font-bold text-primary">{number}</div>
							<div className="text-sm text-muted-foreground">{label}</div>
						</div>
					))}
				</div>
			</section>

			{/* Our Story Section */}
			<section className="py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-6">
						<h2 className="text-3xl font-bold">Our Story</h2>
						<div className="space-y-4 text-muted-foreground">
							<p>
								Purple was founded in 2022 when our team experienced firsthand the frustration of juggling 
								multiple productivity tools that didn't work well together. We knew there had to be a better way.
							</p>
							<p>
								Starting with a simple idea—what if productivity tools were actually intuitive and enjoyable to use?—we 
								set out to build something different. We wanted to create a platform that would adapt to how people 
								naturally work, not the other way around.
							</p>
							<p>
								Today, thousands of individuals and teams around the world use Purple to streamline their workflows, 
								collaborate more effectively, and achieve their goals. We're just getting started.
							</p>
						</div>
					</div>
					<div className="bg-muted/30 rounded-lg p-8 text-center space-y-4">
						<h3 className="text-2xl font-semibold">Founded in 2022</h3>
						<p className="text-muted-foreground">
							Born from the belief that productivity tools should empower, not overwhelm.
						</p>
						<div className="flex justify-center gap-4 pt-4">
							<div className="text-center">
								<div className="text-lg font-bold text-primary">Series A</div>
								<div className="text-sm text-muted-foreground">Funding</div>
							</div>
							<div className="text-center">
								<div className="text-lg font-bold text-primary">Remote-First</div>
								<div className="text-sm text-muted-foreground">Company</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Our Values */}
			<section className="py-16">
				<h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{values.map(({ icon: Icon, title, description }) => (
						<Card key={title} className="text-center">
							<CardHeader>
								<div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-lg bg-primary/10">
									<Icon className="h-6 w-6 text-primary" />
								</div>
								<CardTitle className="text-lg">{title}</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-sm">{description}</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Team Section */}
			<section className="py-16 bg-muted/30 rounded-2xl">
				<div className="text-center space-y-4 mb-12">
					<h2 className="text-3xl font-bold">Meet Our Team</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						We're a diverse group of builders, designers, and problem-solvers united by our passion for creating exceptional products.
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{team.map(({ name, role, background }) => (
						<Card key={name} className="text-center">
							<CardHeader>
								<div className="mx-auto mb-4 h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
									<Users className="h-8 w-8 text-primary" />
								</div>
								<CardTitle className="text-lg">{name}</CardTitle>
								<CardDescription className="font-medium text-primary">{role}</CardDescription>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">{background}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</section>

			{/* Mission Statement */}
			<section className="py-16 text-center">
				<div className="space-y-6 max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold">Our Mission</h2>
					<blockquote className="text-xl text-muted-foreground italic">
						"To empower individuals and teams worldwide with intuitive, powerful tools that unlock their full potential 
						and help them create meaningful impact in their work and lives."
					</blockquote>
					<div className="pt-6">
						<p className="text-muted-foreground">
							We believe that when people have the right tools, they can accomplish extraordinary things. 
							That's why we're committed to continuous innovation and putting our users at the heart of everything we do.
						</p>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 text-center space-y-6">
				<h2 className="text-3xl font-bold">Join Our Journey</h2>
				<p className="text-muted-foreground max-w-2xl mx-auto">
					Ready to experience the future of productivity? Join thousands of users who have already transformed how they work.
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
								Get Started Free
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