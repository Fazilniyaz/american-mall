"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

// ─── Section definitions ──────────────────────────────────────────────────────
const SECTIONS = [
  { id: "hero",          label: "Intro",         chapter: "01" },
  { id: "numbers",       label: "Scale",          chapter: "02" },
  { id: "whos-here",     label: "Who's Here",     chapter: "03" },
  { id: "mall-map",      label: "Explore",        chapter: "04" },
  { id: "entertainment", label: "Entertainment",  chapter: "05" },
  { id: "events",        label: "Events",         chapter: "06" },
  { id: "sponsorship",   label: "Sponsorship",    chapter: "07" },
  { id: "cta",           label: "Get Started",    chapter: "08" },
];

export default function Navbar() {
  const [activeId,   setActiveId]   = useState("hero");
  const [hoveredId,  setHoveredId]  = useState<string | null>(null);
  const [visible,    setVisible]    = useState(false);
  const ratiosRef    = useRef<Record<string, number>>({});
  const navRef       = useRef<HTMLElement>(null);
  const prevActiveRef = useRef("hero");

  // ── Entrance animation ────────────────────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      if (navRef.current) {
        gsap.fromTo(navRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.8, ease: "power2.out", delay: 1.2 }
        );
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // ── IntersectionObserver — tracks which section is most visible ───────────
  useEffect(() => {
    const targets = SECTIONS
      .map(s => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!targets.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          ratiosRef.current[entry.target.id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        });

        let nextId    = prevActiveRef.current;
        let bestRatio = 0;
        for (const [id, ratio] of Object.entries(ratiosRef.current)) {
          if (ratio > bestRatio) { bestRatio = ratio; nextId = id; }
        }

        if (nextId !== prevActiveRef.current) {
          prevActiveRef.current = nextId;
          setActiveId(nextId);
        }
      },
      {
        rootMargin: "-35% 0px -35% 0px",
        threshold:  [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7],
      }
    );

    targets.forEach(t => observer.observe(t));
    return () => observer.disconnect();
  }, []);

  // ── Smooth scroll to section ──────────────────────────────────────────────
  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const activeIndex = SECTIONS.findIndex(s => s.id === activeId);

  return (
    <>
      <nav
        ref={navRef}
        aria-label="Deck navigation"
        style={{
          position:      "fixed",
          right:         "clamp(1rem, 2.2vw, 1.8rem)",
          top:           "50%",
          transform:     "translateY(-50%)",
          zIndex:        100,
          opacity:       0,
          display:       "flex",
          flexDirection: "column",
          alignItems:    "flex-end",
          gap:           0,
        }}
        className="deck-nav"
      >
        {/* Chapter counter — top */}
        <div className="deck-nav-counter" style={{
          display:       "flex",
          flexDirection: "column",
          alignItems:    "flex-end",
          marginBottom:  "1.2rem",
          gap:           "2px",
        }}>
          <span style={{
            color:         "#C9A84C",
            fontSize:      "0.55rem",
            fontWeight:    800,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            lineHeight:    1,
          }}>
            {SECTIONS[activeIndex]?.chapter}
          </span>
          <span style={{
            color:         "rgba(255,255,255,0.18)",
            fontSize:      "0.5rem",
            fontWeight:    600,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            lineHeight:    1,
          }}>
            / {String(SECTIONS.length).padStart(2, "0")}
          </span>
        </div>

        {/* Rail container */}
        <div style={{
          position:      "relative",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "flex-end",
          gap:           "0",
        }}>
          {/* Vertical connector line — behind the dots */}
          <div style={{
            position:   "absolute",
            right:      "6px",
            top:        "6px",
            bottom:     "6px",
            width:      "1px",
            background: "rgba(201,168,76,0.12)",
            zIndex:     0,
          }} />

          {/* Active progress fill */}
          <div style={{
            position:   "absolute",
            right:      "6px",
            top:        "6px",
            width:      "1px",
            height:     `${(activeIndex / (SECTIONS.length - 1)) * 100}%`,
            background: "linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.4))",
            zIndex:     0,
            transition: "height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          }} />

          {/* Dots */}
          {SECTIONS.map((section, i) => {
            const isActive  = activeId   === section.id;
            const isHovered = hoveredId  === section.id;
            const isPast    = i < activeIndex;

            return (
              <button
                key={section.id}
                onClick={() => scrollTo(section.id)}
                onMouseEnter={() => setHoveredId(section.id)}
                onMouseLeave={() => setHoveredId(null)}
                aria-label={`Go to ${section.label}`}
                title={section.label}
                style={{
                  position:       "relative",
                  zIndex:         1,
                  display:        "flex",
                  alignItems:     "center",
                  gap:            "0.6rem",
                  background:     "none",
                  border:         "none",
                  cursor:         "pointer",
                  padding:        "0.42rem 0",
                  paddingRight:   "0",
                }}
              >
                {/* Label — slides in on hover */}
                <span
                  className="deck-nav-label"
                  style={{
                    color:         isActive ? "#C9A84C" : "rgba(255,255,255,0.45)",
                    fontFamily:    "var(--font-montserrat)",
                    fontSize:      "0.55rem",
                    fontWeight:    isActive ? 700 : 500,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity:       isHovered || isActive ? 1 : 0,
                    transform:     isHovered || isActive ? "translateX(0)" : "translateX(6px)",
                    transition:    "opacity 0.2s ease, transform 0.2s ease, color 0.2s ease",
                    whiteSpace:    "nowrap",
                    pointerEvents: "none",
                  }}
                >
                  {section.label}
                </span>

                {/* Dot */}
                <span style={{
                  flexShrink:    0,
                  width:         isActive ? "13px" : isHovered ? "10px" : isPast ? "6px" : "6px",
                  height:        isActive ? "13px" : isHovered ? "10px" : "6px",
                  borderRadius:  "999px",
                  border:        `1px solid ${
                    isActive  ? "#C9A84C" :
                    isHovered ? "rgba(201,168,76,0.7)" :
                    isPast    ? "rgba(201,168,76,0.35)" :
                                "rgba(201,168,76,0.2)"
                  }`,
                  background:    isActive
                    ? "#C9A84C"
                    : isPast
                    ? "rgba(201,168,76,0.25)"
                    : "transparent",
                  boxShadow:     isActive
                    ? "0 0 0 3px rgba(201,168,76,0.12), 0 0 12px rgba(201,168,76,0.3)"
                    : "none",
                  transition:    "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  display:       "block",
                }} />
              </button>
            );
          })}
        </div>

        {/* Section label — bottom */}
        <div className="deck-nav-section-label" style={{
          marginTop:     "1.2rem",
          textAlign:     "right",
        }}>
          <span style={{
            color:         "rgba(201,168,76,0.5)",
            fontSize:      "0.5rem",
            fontWeight:    600,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            lineHeight:    1,
            transition:    "color 0.3s ease",
          }}>
            {SECTIONS[activeIndex]?.label}
          </span>
        </div>
      </nav>

      {/* Mobile bottom pill nav */}
      <nav
        aria-label="Deck navigation mobile"
        className="deck-nav-mobile-pill"
        style={{
          position:       "fixed",
          bottom:         "1.2rem",
          left:           "50%",
          transform:      "translateX(-50%)",
          zIndex:         100,
          display:        "none",
          alignItems:     "center",
          gap:            "0.5rem",
          padding:        "0.55rem 1rem",
          background:     "rgba(5,4,2,0.82)",
          border:         "1px solid rgba(201,168,76,0.15)",
          borderRadius:   "999px",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {SECTIONS.map((section, i) => {
          const isActive = activeId === section.id;
          const isPast   = i < activeIndex;
          return (
            <button
              key={section.id}
              onClick={() => scrollTo(section.id)}
              aria-label={section.label}
              style={{
                width:      isActive ? "18px" : "6px",
                height:     "6px",
                borderRadius: "999px",
                border:     `1px solid ${isActive ? "#C9A84C" : isPast ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.2)"}`,
                background: isActive ? "#C9A84C" : isPast ? "rgba(201,168,76,0.2)" : "transparent",
                cursor:     "pointer",
                padding:    0,
                transition: "all 0.25s ease",
                flexShrink: 0,
              }}
            />
          );
        })}
      </nav>

      <style>{`
        /* ── Hide browser scrollbar ── */
        html { scrollbar-width: none; }
        html::-webkit-scrollbar { display: none; }

        /* ── Desktop nav visible, mobile pill hidden ── */
        .deck-nav { display: flex !important; }
        .deck-nav-mobile-pill { display: none !important; }

        /* ── Tablet: hide labels ── */
        @media (max-width: 1024px) {
          .deck-nav-label { display: none !important; }
          .deck-nav-counter { display: none !important; }
          .deck-nav-section-label { display: none !important; }
        }

        /* ── Mobile: hide desktop rail, show pill ── */
        @media (max-width: 767px) {
          .deck-nav { display: none !important; }
          .deck-nav-mobile-pill { display: flex !important; }
        }

        /* ── Short screens: compress gap ── */
        @media (max-height: 700px) {
          .deck-nav button { padding-top: 0.28rem !important; padding-bottom: 0.28rem !important; }
        }
      `}</style>
    </>
  );
}