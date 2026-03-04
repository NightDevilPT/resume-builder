"use client";

import React from "react";
import Link from "next/link";
import { 
	ArrowRight,
	Brain,
	PenTool,
	Layout,
	TrendingUp,
	Sparkles,
	FileText,
	Palette,
	Globe,
	CheckCircle,
	Rocket,
	Target,
	LineChart,
	CreditCard
} from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function HomePage() {
	return (
		<main className="w-full">
			{/* Hero Section */}
			<section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-background py-24 lg:py-36">
				<div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
				<div className="container relative mx-auto px-4">
					<div className="grid lg:grid-cols-2 gap-12 items-center">
						<div className="space-y-8">
							<Badge className="mb-2" variant="outline">
								<span className="flex items-center gap-2">
									<Rocket className="h-3 w-3" />
									Launching the Future of Resume Building
								</span>
							</Badge>
							<h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
								Create, Sell, and
								<span className="text-primary"> Scale</span>
							</h1>
							<p className="text-xl text-muted-foreground max-w-lg">
								The first complete marketplace where job seekers meet creators, powered by AI to help you land your dream job.
							</p>
							<div className="flex flex-col sm:flex-row gap-4">
								<Button size="lg" className="gap-2 px-8" asChild>
									<Link href="/signup">
										Start Building
										<ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" className="gap-2" asChild>
									<Link href="/explore">
										Explore Templates
									</Link>
								</Button>
							</div>
							<div className="flex items-center gap-6 pt-4">
								<div className="flex items-center gap-2">
									<CheckCircle className="h-5 w-5 text-primary" />
									<span className="text-sm text-muted-foreground">AI-Powered</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle className="h-5 w-5 text-primary" />
									<span className="text-sm text-muted-foreground">Marketplace</span>
								</div>
								<div className="flex items-center gap-2">
									<CheckCircle className="h-5 w-5 text-primary" />
									<span className="text-sm text-muted-foreground">Creator First</span>
								</div>
							</div>
						</div>
						<div className="relative hidden lg:block">
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl" />
							<div className="relative bg-card border rounded-2xl p-6 shadow-2xl">
								<div className="grid grid-cols-2 gap-4">
									{[...Array(4)].map((_, i) => (
										<div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Core Features */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<Badge variant="outline" className="mb-4">Platform Capabilities</Badge>
						<h2 className="text-4xl font-bold mb-4">Everything You Need to Succeed</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							A comprehensive ecosystem for both job seekers and creators
						</p>
					</div>

					<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[
							{
								icon: Brain,
								title: "AI Resume Builder",
								desc: "Generate optimized resumes with AI that scores high on ATS systems",
								color: "from-blue-500/20 to-blue-500/0"
							},
							{
								icon: Layout,
								title: "Template Marketplace",
								desc: "Browse hundreds of free & premium templates from creators worldwide",
								color: "from-purple-500/20 to-purple-500/0"
							},
							{
								icon: PenTool,
								title: "Create & Sell",
								desc: "Design your own templates and earn 90-95% commission on every sale",
								color: "from-green-500/20 to-green-500/0"
							},
							{
								icon: TrendingUp,
								title: "Creator Dashboard",
								desc: "Track sales, analytics, and earnings with real-time insights",
								color: "from-orange-500/20 to-orange-500/0"
							}
						].map((feature, index) => (
							<Card key={index} className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
								<CardHeader>
									<div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
										<feature.icon className="h-7 w-7 text-primary" />
									</div>
									<CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
									<CardDescription className="text-base">{feature.desc}</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Value Proposition Grid */}
			<section className="py-24 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="grid lg:grid-cols-2 gap-12">
						{/* For Job Seekers */}
						<div className="space-y-8">
							<div>
								<Badge className="mb-4" variant="secondary">For Job Seekers</Badge>
								<h3 className="text-3xl font-bold mb-4">Land Your Dream Job Faster</h3>
								<p className="text-muted-foreground text-lg">
									Combine the power of AI with professional templates to create resumes that stand out.
								</p>
							</div>
							<div className="grid sm:grid-cols-2 gap-4">
								{[
									{
										icon: Brain,
										title: "AI Optimization",
										desc: "ATS-friendly content with real-time scoring"
									},
									{
										icon: FileText,
										title: "Free Templates",
										desc: "Quality templates at zero cost"
									},
									{
										icon: Sparkles,
										title: "Premium Designs",
										desc: "Exclusive templates from top creators"
									},
									{
										icon: Target,
										title: "Industry Specific",
										desc: "Templates tailored for your field"
									}
								].map((item, i) => (
									<div key={i} className="flex gap-3">
										<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
											<item.icon className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="font-semibold">{item.title}</p>
											<p className="text-sm text-muted-foreground">{item.desc}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* For Creators */}
						<div className="space-y-8">
							<div>
								<Badge className="mb-4" variant="secondary">For Creators</Badge>
								<h3 className="text-3xl font-bold mb-4">Monetize Your Creativity</h3>
								<p className="text-muted-foreground text-lg">
									Turn your design skills into a revenue stream with our creator-first platform.
								</p>
							</div>
							<div className="grid sm:grid-cols-2 gap-4">
								{[
									{
										icon: TrendingUp,
										title: "90-95% Commission",
										desc: "Keep most of what you earn"
									},
									{
										icon: Globe,
										title: "Global Reach",
										desc: "Sell to users worldwide"
									},
									{
										icon: LineChart,
										title: "Analytics",
										desc: "Real-time sales insights"
									},
									{
										icon: CreditCard,
										title: "Easy Payouts",
										desc: "Monthly payments, no holds"
									}
								].map((item, i) => (
									<div key={i} className="flex gap-3">
										<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
											<item.icon className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="font-semibold">{item.title}</p>
											<p className="text-sm text-muted-foreground">{item.desc}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* AI Feature Highlight */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-3xl p-12">
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<div className="space-y-6">
								<Badge className="mb-2" variant="outline">AI-Powered</Badge>
								<h2 className="text-4xl font-bold">Smart Resume Optimization</h2>
								<p className="text-lg text-muted-foreground">
									Our AI analyzes your resume against job descriptions and provides real-time feedback to improve your ATS score.
								</p>
								<ul className="space-y-3">
									{[
										"Real-time ATS score calculation",
										"Keyword optimization suggestions",
										"Industry-specific recommendations",
										"Format and structure improvements"
									].map((item, i) => (
										<li key={i} className="flex items-center gap-2">
											<CheckCircle className="h-5 w-5 text-primary" />
											<span>{item}</span>
										</li>
									))}
								</ul>
								<Button size="lg" className="mt-4" asChild>
									<Link href="/ai-builder">
										Try AI Builder
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
							</div>
							<div className="relative">
								<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent rounded-full blur-3xl" />
								<Card className="relative border-2">
									<CardContent className="p-6">
										<div className="space-y-4">
											<div className="h-4 w-3/4 bg-muted rounded-full" />
											<div className="h-4 w-1/2 bg-muted rounded-full" />
											<Separator />
											<div className="flex items-center justify-between">
												<span className="text-sm font-medium">ATS Score</span>
												<span className="text-2xl font-bold text-primary">92%</span>
											</div>
											<div className="w-full bg-muted rounded-full h-2">
												<div className="bg-primary rounded-full h-2 w-[92%]" />
											</div>
										</div>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Commission & Marketplace */}
			<section className="py-24 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<Badge variant="outline" className="mb-4">Creator Economy</Badge>
						<h2 className="text-4xl font-bold mb-4">Fair, Transparent, Creator-First</h2>
						<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
							We take a small cut to keep the platform running. You keep the rest.
						</p>
					</div>

					<div className="grid lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
						<Card className="border-2 border-primary/20 text-center">
							<CardContent className="p-8">
								<div className="text-5xl font-bold text-primary mb-2">90-95%</div>
								<p className="font-semibold mb-2">Your Earnings</p>
								<p className="text-sm text-muted-foreground">Keep most of what you sell</p>
							</CardContent>
						</Card>
						<Card className="border-2 border-primary/20 text-center">
							<CardContent className="p-8">
								<div className="text-5xl font-bold text-primary mb-2">5-10%</div>
								<p className="font-semibold mb-2">Platform Fee</p>
								<p className="text-sm text-muted-foreground">Covers payments & hosting</p>
							</CardContent>
						</Card>
						<Card className="border-2 border-primary/20 text-center">
							<CardContent className="p-8">
								<div className="text-5xl font-bold text-primary mb-2">$0</div>
								<p className="font-semibold mb-2">Listing Fee</p>
								<p className="text-sm text-muted-foreground">Free to list your templates</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-24">
				<div className="container mx-auto px-4">
					<Card className="bg-primary text-primary-foreground border-none overflow-hidden">
						<div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
						<CardContent className="relative p-16 text-center">
							<h2 className="text-4xl font-bold mb-4">Ready to Transform Your Career?</h2>
							<p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
								Join thousands of users who are already building better resumes and growing their income.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" variant="secondary" className="gap-2 px-8" asChild>
									<Link href="/signup">
										Get Started Free
										<ArrowRight className="h-4 w-4" />
									</Link>
								</Button>
								<Button 
									size="lg" 
									variant="outline" 
									className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" 
									asChild
								>
									<Link href="/become-creator">
										Become a Creator
									</Link>
								</Button>
							</div>
						</CardContent>
					</Card>
				</div>
			</section>

			{/* Footer */}
			<footer className="py-8 border-t">
				<div className="container mx-auto px-4">
					<div className="flex flex-col md:flex-row justify-between items-center gap-4">
						<p className="text-sm text-muted-foreground">
							© 2024 ResumeBuilder. All rights reserved.
						</p>
						<div className="flex gap-6">
							<Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
								Terms
							</Link>
							<Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
								Privacy
							</Link>
							<Link href="/creators" className="text-sm text-muted-foreground hover:text-primary">
								Creators
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</main>
	);
}

export default HomePage;