import HeroSection from "@/components/Hero/HeroSection";
import Navbar from "@/components/Navbar/Navbar";
import LazySection from "@/components/Performance/LazySection";
import dynamic from "next/dynamic";

// ── Below-fold components — dynamically imported for code splitting ──
// Each dynamic() call creates a separate JS chunk that only loads when
// the component is about to render. This keeps GSAP, D3, Three.js etc.
// OUT of the initial bundle, dramatically reducing FCP/LCP/TBT.
const NumbersSection = dynamic(() => import("@/components/Numbers/NumbersSection"));
const WhosHereSection = dynamic(() => import("@/components/WhoIsHere/WhosHereSection"));
const MallMapSection = dynamic(() => import("@/components/MallMap/MallMapSection"));
const EntertainmentSection = dynamic(() => import("@/components/Entertainment/EntertainmentSection"));
const EventsSection = dynamic(() => import("@/components/Event/EventsSection"));
const SponsorshipSection = dynamic(() => import("@/components/Sponsorship/SponsorshipSection"));
const CTASection = dynamic(() => import("@/components/CTA/CTASection"));

export const metadata = {
  title: "The American Mall Experience",
  description: "An immersive exploration of the American mall phenomenon, blending nostalgia with modernity through interactive design and storytelling.",
};

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <LazySection placeholderHeight="80vh">
        <NumbersSection />
      </LazySection>
      <LazySection placeholderHeight="90vh">
        <WhosHereSection />
      </LazySection>
      <LazySection placeholderHeight="100vh">
        <MallMapSection />
      </LazySection>
      <LazySection placeholderHeight="100vh">
        <EntertainmentSection />
      </LazySection>
      <LazySection placeholderHeight="90vh">
        <EventsSection />
      </LazySection>
      <LazySection placeholderHeight="90vh">
        <SponsorshipSection />
      </LazySection>
      <LazySection placeholderHeight="70vh">
        <CTASection />
      </LazySection>
    </main>
  );
}