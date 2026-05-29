import { LandingCtaSection } from "./landing-cta-section";
import { LandingFooter } from "./landing-footer";
import { LandingGamificationSection } from "./landing-gamification-section";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { LandingHowItWorks } from "./landing-how-it-works";
import { LandingTestimonials } from "./landing-testimonials";
import { LandingTracksSection } from "./landing-tracks-section";

export function LandingPage() {
  return (
    <div className="overflow-x-hidden bg-surface text-on-surface">
      <LandingHeader />
      <main>
        <LandingHero />
        <LandingTracksSection />
        <LandingGamificationSection />
        <LandingHowItWorks />
        <LandingTestimonials />
        <LandingCtaSection />
      </main>
      <LandingFooter />
    </div>
  );
}
