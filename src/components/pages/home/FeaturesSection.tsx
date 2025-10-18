import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Brain, Target, Zap, Shield, TrendingUp, Users } from "lucide-react";

const features = [
	{
		icon: Brain,
		title: "AI Content Optimization",
		description:
			"Get intelligent suggestions to improve your resume content and make it more impactful.",
	},
	{
		icon: Target,
		title: "ATS Score Optimization",
		description:
			"Ensure your resume passes through Applicant Tracking Systems with high scores.",
	},
	{
		icon: Zap,
		title: "One-Click Formatting",
		description:
			"Professional formatting automatically applied. No design skills required.",
	},
	{
		icon: Shield,
		title: "Error Detection",
		description:
			"AI-powered grammar and spelling checks with contextual improvements.",
	},
	{
		icon: TrendingUp,
		title: "Performance Analytics",
		description:
			"Get insights on how to improve your resume for better response rates.",
	},
	{
		icon: Users,
		title: "Industry Templates",
		description:
			"Templates tailored for different industries and experience levels.",
	},
];

export function FeaturesSection() {
	return (
		<section className="py-20 bg-background">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-3xl lg:text-4xl font-bold mb-4">
						Everything You Need for the Perfect Resume
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Our AI-powered platform provides all the tools to create
						resumes that stand out
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<Card
							key={index}
							className="hover:shadow-lg transition-shadow"
						>
							<CardHeader>
								<div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
									<feature.icon className="w-6 h-6 text-primary" />
								</div>
								<CardTitle className="text-xl">
									{feature.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-base">
									{feature.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
