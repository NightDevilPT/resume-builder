import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background to-muted py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-sm font-medium text-primary">
              <Sparkles className="w-4 h-4" />
              AI-Powered Resume Builder
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
              Build Resumes That
              <span className="text-primary block">
                Get You Hired
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              Create professional, ATS-optimized resumes with AI assistance. 
              Land more interviews with resumes tailored for both humans and algorithms.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/templates">
                  View Templates
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div>✓ No credit card required</div>
              <div>✓ 10+ Professional Templates</div>
              <div>✓ AI-Powered Optimization</div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 bg-card rounded-2xl shadow-2xl p-8 transform rotate-2 border">
              {/* Resume preview image/component */}
              <div className="bg-gradient-to-br from-primary to-primary/70 h-80 rounded-lg flex items-center justify-center">
                <div className="text-primary-foreground text-center">
                  <div className="w-16 h-16 bg-primary-foreground/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <p className="font-semibold">Professional Resume Preview</p>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/50 rounded-2xl transform -rotate-2 scale-105 opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  );
}