import DeckShell from "@/components/Deck/DeckShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entertainment & Gaming — Galaxy Gaming & Arcade | Mall of America",
  description:
    "The most immersive gaming floor in the Midwest. 80+ arcade machines, 24 esports stations, and 3K+ daily players. Activate your brand where every visitor becomes a player.",
};

export default function EntertainmentAndGamingPage() {
  return <DeckShell />;
}
