import DeckShell from "@/components/Deck/DeckShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sea Life Minnesota Aquarium — Sharks Swim Overhead | Mall of America",
  description:
    "1.2 million visitors annually walk through the Sea Life Minnesota Aquarium tunnel inside Mall of America. 10,000+ sea creatures, 300+ species. Brand your presence steps from the action.",
};

export default function AquariumPage() {
  return <DeckShell />;
}
