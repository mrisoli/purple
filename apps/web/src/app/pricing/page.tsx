"use client";
import Link from "next/link";
import { Check, X, ArrowRight } from "lucide-react";
import { SignUpButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PricingPage() {
	const plans = [
		{
			name: "Starter",
			price: "$0",
			billing: "Forever",
			description: "Perfect for individuals getting started with productivity tools",
			features: [
				"Up to 3 projects",
				"Basic task management",
				"5GB file storage",
				"Email support",
				"Mobile app access",
			],
			limitations: [
				"No team collaboration",
				"No advanced analytics",
				"No integrations",
				"No priority support",
			],
			recommended: false,
			buttonText: "Get Started Free",
		},
		{
			name: "Professional",
			price: "$12",
			billing: "per month",
			description: "Ideal for professionals and small teams who need more power",
			features: [
				"Unlimited projects",
				"Advanced task management",
				"50GB file storage",
				"Team collaboration (up to 10 members)",
				"Priority email support",
				"Integrations with popular tools",
				"Advanced analytics",
				"Custom workflows",
			],
			limitations: [
				"Limited to 10 team members",
				"No white-label options",
			],
			recommended: true,
			buttonText: "Start Free Trial",
		},
		{
			name: "Enterprise",
			price: "Custom",
			billing: "Contact us",
			description: "Perfect for large organizations with advanced needs",
			features: [
				"Everything in Professional",
				"Unlimited team members",
				"500GB file storage",
				"24/7 phone & chat support",
				"Custom integrations",
				"White-label options",
				"Advanced security features",
				"Dedicated account manager",
				"Custom onboarding",
				"SLA guarantee",
			],
			limitations: [],
			recommended: false,
			buttonText: "Contact Sales",
		},
	] as const;

	const faqs = [
		{
			question: "Can I change my plan at any time?",
			answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle, and we'll prorate any differences.",
		},
		{
			question: "Is there a free trial?",
			answer: "Yes! We offer a 14-day free trial for the Professional plan. No credit card required to start your trial.",
		},
		{
			question: "What happens if I exceed my plan limits?",
			answer: "We'll notify you when you're approaching your limits. You can upgrade your plan or we'll help you optimize your usage.",
		},
		{
			question: "Do you offer discounts for annual billing?",
			answer: "Yes, we offer 2 months free when you pay annually. That's a 17% discount compared to monthly billing.",
		},
		{
			question: "What payment methods do you accept?",
			answer: "We accept all major credit cards, PayPal, and wire transfers for Enterprise customers. All payments are processed securely.",
		},
		{
			question: "Can I cancel anytime?",
			answer: "Absolutely. You can cancel your subscription at any time. Your account will remain active until the end of your current billing period.",
		},
	] as const;

	return (
		<div className="container mx-auto max-w-6xl px-4 py-8">
			{/* Header Section */}
			<section className="text-center space-y-4 py-16">
				<h1 className="text-4xl font-bold tracking-tight lg:text-6xl">Simple, Transparent Pricing</h1>
				<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
					Choose the plan that's right for you. Start free, then scale as you grow. 
					All plans include our core features and 24/7 support.
				</p>
			</section>

			{/* Pricing Cards */}
			<section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
				{plans.map(({ name, price, billing, description, features, limitations, recommended, buttonText }) => (
					<Card 
						key={name} 
						className={`relative ${recommended ? "border-2 border-primary shadow-xl scale-105" : ""}`}
					>
						{recommended && (
							<div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
								<span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
									Most Popular
								</span>
							</div>
						)}
						<CardHeader className="text-center pb-8">
							<CardTitle className="text-2xl">{name}</CardTitle>
							<div className="space-y-4">
								<div className="text-4xl font-bold">
									{price}
									{price !== "Custom" && <span className="text-lg font-normal text-muted-foreground">/{billing}</span>}
								</div>
								{price === "Custom" && <div className="text-sm text-muted-foreground">{billing}</div>}
							</div>
							<CardDescription className="text-base">{description}</CardDescription>
						</CardHeader>
						<CardContent className="space-y-6">
							<Authenticated>
								<Button 
									className="w-full" 
									variant={recommended ? "default" : "outline"}
									size="lg"
									asChild
								>
									<Link href="/dashboard">Go to Dashboard</Link>
								</Button>
							</Authenticated>
							<Unauthenticated>
								{buttonText === "Start Free Trial" ? (
									<SignUpButton mode="modal">
										<Button 
											className="w-full" 
											variant={recommended ? "default" : "outline"}
											size="lg"
										>
											{buttonText}
										</Button>
									</SignUpButton>
								) : buttonText === "Get Started Free" ? (
									<SignUpButton mode="modal">
										<Button 
											className="w-full" 
											variant="outline"
											size="lg"
										>
											{buttonText}
										</Button>
									</SignUpButton>
								) : (
									<Button 
										className="w-full" 
										variant="outline"
										size="lg"
									>
										{buttonText}
									</Button>
								)}
							</Unauthenticated>
							
							<div className="space-y-4">
								<h4 className="font-semibold text-sm uppercase tracking-wider">What's included:</h4>
								<ul className="space-y-3">
									{features.map((feature) => (
										<li key={feature} className="flex items-start gap-3 text-sm">
											<Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
											<span>{feature}</span>
										</li>
									))}
								</ul>
								
								{limitations.length > 0 && (
									<div className="space-y-4 pt-4 border-t">
										<h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Not included:</h4>
										<ul className="space-y-3">
											{limitations.map((limitation) => (
												<li key={limitation} className="flex items-start gap-3 text-sm text-muted-foreground">
													<X className="h-4 w-4 flex-shrink-0 mt-0.5" />
													<span>{limitation}</span>
												</li>
											))}
										</ul>
									</div>
								)}
							</div>
						</CardContent>
					</Card>
				))}
			</section>

			{/* Features Comparison */}
			<section className="py-16">
				<h2 className="text-3xl font-bold text-center mb-12">All Plans Include</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
					<div className="text-center space-y-3">
						<div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
							<Check className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold">99.9% Uptime SLA</h3>
						<p className="text-sm text-muted-foreground">
							Reliable service you can count on with minimal downtime.
						</p>
					</div>
					<div className="text-center space-y-3">
						<div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
							<Check className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold">Data Security</h3>
						<p className="text-sm text-muted-foreground">
							Enterprise-grade security with encryption and regular backups.
						</p>
					</div>
					<div className="text-center space-y-3">
						<div className="h-12 w-12 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
							<Check className="h-6 w-6 text-primary" />
						</div>
						<h3 className="font-semibold">Regular Updates</h3>
						<p className="text-sm text-muted-foreground">
							Continuous improvements and new features at no extra cost.
						</p>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
			<section className="py-16 bg-muted/30 rounded-2xl">
				<h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
					{faqs.map(({ question, answer }) => (
						<div key={question} className="space-y-3">
							<h3 className="font-semibold text-lg">{question}</h3>
							<p className="text-muted-foreground">{answer}</p>
						</div>
					))}
				</div>
			</section>

			{/* Money Back Guarantee */}
			<section className="py-16 text-center">
				<div className="space-y-6 max-w-2xl mx-auto">
					<h2 className="text-3xl font-bold">30-Day Money-Back Guarantee</h2>
					<p className="text-muted-foreground text-lg">
						Try Purple risk-free. If you're not completely satisfied within the first 30 days, 
						we'll refund your money, no questions asked.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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
									Start Free Trial
									<ArrowRight className="ml-2 h-4 w-4" />
								</Button>
							</SignUpButton>
							<Button variant="outline" size="lg" asChild>
								<Link href="/about">Learn More About Us</Link>
							</Button>
						</Unauthenticated>
					</div>
				</div>
			</section>
		</div>
	);
}