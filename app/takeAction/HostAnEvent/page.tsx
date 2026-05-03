import DeckShell from "@/components/Deck/DeckShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Host an Event — Book Your Brand Moment | Mall of America",
  description:
    "From intimate press moments to full-scale flagship activations — no venue in America delivers footfall, prestige, and brand impact the way Mall of America does.",
};

export default function HostAnEventPage() {
  return <DeckShell />;
}
