import DeckShell from "@/components/Deck/DeckShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mall Map — Explore 5.6M sq ft across 4 Floors | Mall of America",
  description:
    "Navigate the 5.6 million sq ft Mall of America across 4 floors of retail, dining, entertainment and events. Explore the interactive 3D building map.",
};

export default function MallMapPage() {
  return <DeckShell />;
}
