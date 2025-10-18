import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const steps = [
	{
		step: "01",
		title: "Choose Your Template",
		description:
			"Select from professionally designed templates optimized for different industries and roles.",
	},
	{
		step: "02",
		title: "Fill in Your Details",
		description:
			"Add your experience, education, skills, and achievements using our intuitive forms.",
	},
	{
		step: "03",
		title: "AI Optimization",
		description:
			"Our AI analyzes and enhances your content for impact and ATS compatibility.",
	},
	{
		step: "04",
		title: "Download & Apply",
		description:
			"Export your polished resume in PDF format and start applying with confidence.",
	},
];

export function HowItWorksSection() {
	return (
		<section className="py-20 bg-muted/50">
			<div className="container mx-auto px-4">
				<div className="text-center mb-16">
					<h2 className="text-3xl lg:text-4xl font-bold mb-4">
						Build Your Perfect Resume in 4 Simple Steps
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						From blank page to interview-ready resume in minutes
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
					{steps.map((step, index) => (
						<Card key={index} className="text-center">
							<CardHeader>
								<div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
									{step.step}
								</div>
								<CardTitle className="text-xl">
									{step.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<CardDescription className="text-base">
									{step.description}
								</CardDescription>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</section>
	);
}
