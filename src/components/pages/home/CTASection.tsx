import { Zap, Shield, Clock } from "lucide-react";

const features = [
	{
		icon: Zap,
		text: "Build your first resume in 10 minutes",
	},
	{
		icon: Shield,
		text: "No credit card required to start",
	},
	{
		icon: Clock,
		text: "Free plan with essential features",
	},
];

export function CTASection() {
	return (
		<section className="py-20 bg-primary text-primary-foreground">
			<div className="container mx-auto px-4">
				<div className="max-w-4xl mx-auto text-center">
					<h2 className="text-3xl lg:text-5xl font-bold mb-6">
						Ready to Transform Your Career?
					</h2>

					<p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
						Join thousands of professionals who have landed their
						dream jobs with AI-optimized resumes. Start building
						your future today.
					</p>

					{/* Feature Highlights */}
					<div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
						{features.map((feature, index) => (
							<div
								key={index}
								className="flex items-center gap-2 text-primary-foreground/80"
							>
								<feature.icon className="w-5 h-5 text-primary-foreground" />
								<span className="text-sm font-medium">
									{feature.text}
								</span>
							</div>
						))}
					</div>

					{/* CTA Buttons */}
					{/* <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
						<Button
							asChild
							size="lg"
							className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 text-lg px-8 py-6"
						>
							<Link href="/signup">
								Start Building Free Resume
								<ArrowRight className="w-5 h-5" />
							</Link>
						</Button>

						<Button
							asChild
							variant="outline"
							size="lg"
							className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 gap-2 text-lg px-8 py-6"
						>
							<Link href="/templates">View All Templates</Link>
						</Button>
					</div> */}

					{/* Guarantee Card */}
					{/* <Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20 max-w-md mx-auto">
						<CardContent className="p-6">
							<div className="flex items-center gap-3">
								<CheckCircle className="w-8 h-8 text-primary-foreground flex-shrink-0" />
								<div className="text-left">
									<div className="font-semibold">
										30-Day Satisfaction Guarantee
									</div>
									<div className="text-sm text-primary-foreground/80">
										Love it or get a full refund
									</div>
								</div>
							</div>
						</CardContent>
					</Card> */}

					{/* Trust Indicators */}
					{/* <div className="mt-12 pt-8 border-t border-primary-foreground/20">
						<p className="text-primary-foreground/80 mb-6">
							Trusted by professionals at
						</p>
						<div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
							<div className="text-xl font-bold text-primary-foreground/80">
								Google
							</div>
							<div className="text-xl font-bold text-primary-foreground/80">
								Microsoft
							</div>
							<div className="text-xl font-bold text-primary-foreground/80">
								Amazon
							</div>
							<div className="text-xl font-bold text-primary-foreground/80">
								Meta
							</div>
							<div className="text-xl font-bold text-primary-foreground/80">
								Netflix
							</div>
						</div>
					</div> */}
				</div>
			</div>
		</section>
	);
}
