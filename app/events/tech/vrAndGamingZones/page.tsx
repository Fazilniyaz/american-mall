import DeckShell from "@/components/Deck/DeckShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VR & Gaming Experience Zones — Immersive Galaxy | Mall of America",
  description:
    "15K+ VR sessions, 8 full-scale demo pods, 500+ live competitors. Oculus, HTC Vive and next-gen gaming activated across Mall of America's central atrium.",
};

export default function VRAndGamingZonesPage() {
  return <DeckShell />;
}
