import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function AISection() {
	return (
		<section className="py-20 bg-primary text-primary-foreground">
			<div className="container mx-auto px-4">
				<div className="grid lg:grid-cols-2 gap-12 items-center">
					<div className="space-y-6">
						<h2 className="text-3xl lg:text-4xl font-bold">
							Smart AI That Understands Your Career
						</h2>

						<p className="text-xl text-primary-foreground/80">
							Our advanced AI analyzes your experience and
							provides personalized suggestions to make your
							resume more effective.
						</p>

						<div className="space-y-4">
							{[
								"Keyword optimization for ATS systems",
								"Content enhancement with action-oriented language",
								"Industry-specific terminology suggestions",
								"Formatting optimization for readability",
								"Skill gap analysis and recommendations",
								"Achievement impact quantification",
							].map((item, index) => (
								<div
									key={index}
									className="flex items-center gap-3"
								>
									<CheckCircle className="w-5 h-5 text-primary-foreground/80 flex-shrink-0" />
									<span className="text-primary-foreground/90">
										{item}
									</span>
								</div>
							))}
						</div>

						<Button
							asChild
							size="lg"
							variant="secondary"
							className="gap-2 mt-6"
						>
							<Link href="/signup">
								Try AI Features
								<ArrowRight className="w-4 h-4" />
							</Link>
						</Button>
					</div>

					<div className="grid gap-6">
						<Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20">
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
										<CheckCircle className="w-6 h-6 text-primary" />
									</div>
									<div>
										<h4 className="font-semibold mb-2">
											Before AI
										</h4>
										<p className="text-primary-foreground/80 text-sm">
											&quot;Managed a team of developers
											and delivered projects&quot;
										</p>
										<div className="mt-3">
											<h4 className="font-semibold mb-2 text-primary-foreground">
												After AI
											</h4>
											<p className="text-primary-foreground text-sm">
												&quot;Led a cross-functional
												team of 8 developers to deliver
												15+ projects 20% ahead of
												schedule, improving team
												velocity by 35%&quot;
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						<Card className="bg-primary-foreground/10 backdrop-blur border-primary-foreground/20">
							<CardContent className="p-6">
								<div className="flex items-start gap-4">
									<div className="w-10 h-10 bg-primary-foreground rounded-full flex items-center justify-center flex-shrink-0">
										<CheckCircle className="w-6 h-6 text-primary" />
									</div>
									<div>
										<h4 className="font-semibold mb-2">
											ATS Score Improvement
										</h4>
										<div className="flex items-center gap-4 mt-3">
											<div className="text-center">
												<div className="text-2xl font-bold text-destructive">
													45%
												</div>
												<div className="text-xs text-primary-foreground/80">
													Before
												</div>
											</div>
											<ArrowRight className="w-6 h-6 text-primary-foreground/60" />
											<div className="text-center">
												<div className="text-2xl font-bold text-primary-foreground">
													92%
												</div>
												<div className="text-xs text-primary-foreground/80">
													After AI
												</div>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</section>
	);
}
