import { AISection } from "./AISection";
import { CTASection } from "./CTASection";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { TestimonialsSection } from "./TestimonialsSection";

export function Homepage() {
	return (
		<main>
			<HeroSection />
			<FeaturesSection />
			<AISection />
			<HowItWorksSection />
			<TestimonialsSection />
			<CTASection />
		</main>
	);
}
