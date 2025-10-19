import { AISection } from "./AISection";
import { CTASection } from "./CTASection";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TestimonialsSection } from "./TestimonialsSection";
import { HowItWorksSection } from "./HowItWorksSection";

export function Homepage() {
	return (
		<ScrollArea className="w-full h-full overflow-y-auto">
			<HeroSection />
			<FeaturesSection />
			<AISection />
			<HowItWorksSection />
			<TestimonialsSection />
			<CTASection />
		</ScrollArea>
	);
}
