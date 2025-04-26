"use client";

import { CTASection } from "../cta-section";
import { FeaturesSection } from "../features-section";
import { HeroSection } from "../hero-section";
import { HowItWorksSection } from "../how-it-works-section";
import { Navbar } from "../navbar";
import { TestimonialsSection } from "../testimonials-section";

export default function LearnFlowLanding() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl bg-gradient-to-br from-[#f5f5ff] to-[#e4dfff] dark:from-slate-900 dark:to-[#6e56cf]">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
