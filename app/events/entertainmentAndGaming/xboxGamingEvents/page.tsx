import DeckShell from "@/components/Deck/DeckShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Xbox Gaming Events — Partner Preview | Mall of America",
  description:
    "Xbox brought its partner preview showcase to Mall of America. 6,200+ gamers, 14 unreleased titles, and an exclusive Series X hardware drop.",
};

export default function XboxGamingEventsPage() {
  return <DeckShell />;
}
