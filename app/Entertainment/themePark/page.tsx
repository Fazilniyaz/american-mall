import DeckShell from "@/components/Deck/DeckShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nickelodeon Universe — 7 Roller Coasters Inside a Mall | Mall of America",
  description:
    "North America's largest indoor theme park lives inside Mall of America. 30+ rides, 7 roller coasters, 12M+ rides taken yearly. Brand your presence steps from the action.",
};

export default function ThemeParkPage() {
  return <DeckShell />;
}
