import { Star } from "lucide-react";

// const testimonials = [
// 	{
// 		name: "Sarah Chen",
// 		role: "Senior Software Engineer",
// 		company: "TechCorp",
// 		image: "/avatars/sarah-chen.jpg",
// 		content:
// 			"The AI optimization helped me transform my resume from generic to outstanding. I went from 0 interview calls to 5 in the first week!",
// 		rating: 5,
// 		achievement: "Landed job with 40% salary increase",
// 	},
// 	{
// 		name: "Marcus Rodriguez",
// 		role: "Product Manager",
// 		company: "StartupXYZ",
// 		image: "/avatars/marcus-rodriguez.jpg",
// 		content:
// 			"The ATS score feature is a game-changer. I finally understood why my resumes weren't getting past the initial screening.",
// 		rating: 5,
// 		achievement: "3 job offers in 2 weeks",
// 	},
// ];

// function StarRating({ rating }: { rating: number }) {
// 	return (
// 		<div className="flex gap-1">
// 			{[...Array(5)].map((_, i) => (
// 				<Star
// 					key={i}
// 					className={`w-4 h-4 ${
// 						i < rating ? "text-primary fill-primary" : "text-muted"
// 					}`}
// 				/>
// 			))}
// 		</div>
// 	);
// }

export function TestimonialsSection() {
	return (
		<section className="py-20 bg-background">
			<div className="container mx-auto px-4">
				{/* <div className="text-center mb-16">
					<h2 className="text-3xl lg:text-4xl font-bold mb-4">
						Trusted by Thousands of Job Seekers
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						See how our AI-powered resume builder has helped
						professionals land their dream jobs
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
					{testimonials.map((testimonial, index) => (
						<Card
							key={index}
							className="hover:shadow-lg transition-shadow"
						>
							<CardContent className="p-6">
								<div className="flex gap-1 mb-4">
									<StarRating rating={testimonial.rating} />
								</div>

								<p className="text-foreground mb-6 text-lg leading-relaxed">
									"{testimonial.content}"
								</p>

								<div className="flex items-center gap-4">
									<Avatar className="w-12 h-12">
										<AvatarImage
											src={testimonial.image}
											alt={testimonial.name}
										/>
										<AvatarFallback className="bg-primary/10 text-primary font-semibold">
											{testimonial.name
												.split(" ")
												.map((n) => n[0])
												.join("")}
										</AvatarFallback>
									</Avatar>

									<div className="flex-1">
										<div className="font-semibold text-foreground">
											{testimonial.name}
										</div>
										<div className="text-sm text-muted-foreground">
											{testimonial.role} at{" "}
											{testimonial.company}
										</div>
									</div>
								</div>

								<div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
									<div className="text-sm font-semibold text-primary">
										🎯 {testimonial.achievement}
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div> */}

				{/* Stats Section */}
				<div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
					<div>
						<div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
							10K+
						</div>
						<div className="text-muted-foreground">
							Resumes Created
						</div>
					</div>
					<div>
						<div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
							94%
						</div>
						<div className="text-muted-foreground">
							ATS Score Improvement
						</div>
					</div>
					<div>
						<div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
							5K+
						</div>
						<div className="text-muted-foreground">Jobs Landed</div>
					</div>
					<div>
						<div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
							4.9/5
						</div>
						<div className="text-muted-foreground">User Rating</div>
					</div>
				</div>
			</div>
		</section>
	);
}
