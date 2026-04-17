import NumbersSection from "@/components/Numbers/NumbersSection";
import HeroSection from "@/components/Hero/HeroSection";
import Navbar from "@/components/Navbar/Navbar";
import dynamic from "next/dynamic";
import EntertainmentSection from "@/components/Entertainment/EntertainmentSection";
import EventsSection from "@/components/Event/EventsSection";

// Lazy load WhosHereSection — it's heavy and below the fold
// Dynamic import without ssr:false will still lazy load the component code
const WhosHereSection = dynamic(() => import("@/components/WhoIsHere/WhosHereSection"));

// Lazy load MallMapSection — heaviest component (Three.js + D3 + GSAP),
// always below the fold. Code-split into a separate chunk.
const MallMapSection = dynamic(() => import("@/components/MallMap/MallMapSection"));

export const metadata = {
  title: "The American Mall Experience",
  description: "An immersive exploration of the American mall phenomenon, blending nostalgia with modernity through interactive design and storytelling.",
};

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <NumbersSection />
      <WhosHereSection />
      <MallMapSection />
      <EntertainmentSection />
      <EventsSection />
    </main>
  );
}