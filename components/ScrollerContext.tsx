"use client";

import { createContext, useContext } from "react";

/**
 * Provides the scroll-container element used by the Deck shell.
 * Section components read this to pass `scroller` to GSAP ScrollTrigger
 * so animations fire when the user scrolls *inside* the slide, not on window.
 *
 * When null (e.g. if sections are rendered outside the deck), ScrollTrigger
 * falls back to its default (window scroll).
 */
export const ScrollerContext = createContext<HTMLElement | null>(null);

export function useScroller() {
  return useContext(ScrollerContext);
}
