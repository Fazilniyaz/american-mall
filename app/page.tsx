import NumbersSection from "@/components/Numbers/NumbersSection";
import HeroSection from "@/components/Hero/HeroSection";
import Navbar from "@/components/Navbar/Navbar";
import WhosHereSection from "@/components/WhoIsHere/WhosHereSection";

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
    </main>
  );
}