"use client";

// ── EventsStatsSlide ──────────────────────────────────────────────────────────
// Wraps the existing EventsSection as a standalone 100vh deck slide.
// No scroll dependency — mounts in-place inside DeckShell.
import EventsSection from "@/components/Event/EventsSection";

export default function EventsStatsSlide() {
  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
      <EventsSection />
    </div>
  );
}
