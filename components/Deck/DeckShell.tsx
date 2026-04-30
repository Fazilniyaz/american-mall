"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { ScrollerContext } from "@/components/ScrollerContext";

// ── Phase components — dynamic + ssr:false ────────────────────────────
// Previously statically imported, these ran JS during initial page parse
// contributing ~150ms to TBT. Now code-split and client-only.
const SplashPhase      = dynamic(() => import("./SplashPhase"),     { ssr: false });
const IntroVideoPhase  = dynamic(() => import("./IntroVideoPhase"), { ssr: false });
const HubPhase         = dynamic(() => import("./HubPhase"),        { ssr: false });
const HeroSection      = dynamic(() => import("@/components/Hero/HeroSection"), { ssr: false });

// ── Deck slides — lazy loaded + ssr:false ─────────────────────────────
const NumbersSection       = dynamic(() => import("@/components/Numbers/NumbersSection"),       { ssr: false });
const WhosHereSection      = dynamic(() => import("@/components/WhoIsHere/WhosHereSection"),    { ssr: false });
const MallMapSection       = dynamic(() => import("@/components/MallMap/MallMapSection"),       { ssr: false });
const EntertainmentSection = dynamic(() => import("@/components/Entertainment/EntertainmentSection"), { ssr: false });
const EventsSection        = dynamic(() => import("@/components/Event/EventsSection"),          { ssr: false });
const SponsorshipSection   = dynamic(() => import("@/components/Sponsorship/SponsorshipSection"), { ssr: false });
const CTASection           = dynamic(() => import("@/components/CTA/CTASection"),               { ssr: false });

const SLIDES = [
  { id: "intro",         label: "Intro",        chapter: "01" },
  { id: "scale",         label: "Scale",         chapter: "02" },
  { id: "whos-here",     label: "Who's Here",    chapter: "03" },
  { id: "explore",       label: "Explore",       chapter: "04" },
  { id: "entertainment", label: "Entertainment", chapter: "05" },
  { id: "events",        label: "Events",        chapter: "06" },
  { id: "sponsorship",   label: "Sponsorship",   chapter: "07" },
  { id: "get-started",   label: "Get Started",   chapter: "08" },
];

type Phase = "splash" | "intro-video" | "hub" | "deck";

export default function DeckShell() {
  const [phase, setPhase]         = useState<Phase>("splash");
  const [current, setCurrent]     = useState(0);
  const [prev, setPrev]           = useState<number | null>(null);
  const [animDir, setAnimDir]     = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [hoveredDot, setHoveredDot] = useState<number | null>(null);
  const [scrollerEl, setScrollerEl] = useState<HTMLElement | null>(null);

  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Keyboard nav ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "deck") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft"  || e.key === "ArrowUp")   goPrev();
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, current, isAnimating]);

  // ── Transitions ───────────────────────────────────────────────────
  const goTo = useCallback((index: number) => {
    if (isAnimating || index === current) return;
    if (animTimeout.current) clearTimeout(animTimeout.current);
    setAnimDir(index > current ? "next" : "prev");
    setPrev(current);
    setIsAnimating(true);
    setCurrent(index);
    animTimeout.current = setTimeout(() => {
      setPrev(null);
      setIsAnimating(false);
    }, 600);
  }, [isAnimating, current]);

  const goNext = useCallback(() => {
    if (current < SLIDES.length - 1) goTo(current + 1);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    if (current > 0) goTo(current - 1);
  }, [current, goTo]);

  const enterDeck = useCallback((startIndex = 0) => {
    setCurrent(startIndex);
    setPrev(null);
    setIsAnimating(false);
    setMenuOpen(false);
    setPhase("deck");
  }, []);

  // ── Slide renderer ────────────────────────────────────────────────
  const renderSlide = (index: number) => {
    switch (index) {
      case 0: return <HeroSection />;
      case 1: return <NumbersSection />;
      case 2: return <WhosHereSection />;
      case 3: return <MallMapSection />;
      case 4: return <EntertainmentSection />;
      case 5: return <EventsSection />;
      case 6: return <SponsorshipSection />;
      case 7: return <CTASection />;
      default: return null;
    }
  };

  // ── Phase routing ─────────────────────────────────────────────────
  if (phase === "splash")
    return <SplashPhase onEnter={() => setPhase("intro-video")} />;

  if (phase === "intro-video")
    return <IntroVideoPhase onSkip={() => setPhase("hub")} />;

  if (phase === "hub")
    return <HubPhase onEnterDeck={enterDeck} />;

  // ── DECK phase ────────────────────────────────────────────────────
  return (
    <div style={{ position: "fixed", inset: 0, background: "#050402", overflow: "hidden", zIndex: 0 }}>

      {/* Slide viewport */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>

        {/* Outgoing slide */}
        {prev !== null && isAnimating && (
          <div key={`prev-${prev}`} style={{
            position: "absolute", inset: 0, overflow: "hidden", zIndex: 1,
            animation: `slideOut${animDir === "next" ? "Left" : "Right"} 0.6s cubic-bezier(0.76,0,0.24,1) forwards`,
          }}>
            <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
              {renderSlide(prev)}
            </div>
          </div>
        )}

        {/* Incoming slide */}
        <div key={`slide-${current}`} style={{
          position: "absolute", inset: 0, overflow: "hidden", zIndex: 2,
          animation: isAnimating
            ? `slideIn${animDir === "next" ? "Right" : "Left"} 0.6s cubic-bezier(0.76,0,0.24,1) forwards`
            : "none",
        }}>
          <div
            ref={el => { if (el && el !== scrollerEl) setScrollerEl(el); }}
            style={{ width: "100%", height: "100%", overflow: "auto" }}
          >
            <ScrollerContext.Provider value={scrollerEl}>
              {renderSlide(current)}
            </ScrollerContext.Provider>
          </div>
        </div>
      </div>

      {/* Top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: "56px",
        zIndex: 50, display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 1.4rem",
        background: "linear-gradient(to bottom, rgba(5,4,2,0.85), transparent)",
        pointerEvents: "none",
      }}>
        {/* Hamburger */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{ pointerEvents: "all", background: "none", border: "none", cursor: "pointer", padding: "6px", display: "flex", flexDirection: "column", gap: "4px" }}
          aria-label="Open menu"
        >
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: "20px", height: "1.5px", background: "#C9A84C",
              transition: "all 0.25s ease",
              transform: menuOpen
                ? i === 0 ? "rotate(45deg) translate(4px,4px)"
                : i === 1 ? "scaleX(0)"
                : "rotate(-45deg) translate(4px,-4px)"
                : "none",
            }} />
          ))}
        </button>

        {/* Logo — click → hub */}
        <div
          style={{ pointerEvents: "all", cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => setPhase("hub")}
        >
          <svg viewBox="0 0 44 44" width="24" height="24">
            <defs>
              <linearGradient id="top-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0D988" />
                <stop offset="100%" stopColor="#C9A84C" />
              </linearGradient>
            </defs>
            <circle cx="22" cy="22" r="14" fill="none" stroke="url(#top-g)" strokeWidth="1" opacity="0.6" />
            <polygon points="22,14 30,22 22,30 14,22" fill="none" stroke="url(#top-g)" strokeWidth="1.3" />
            <polygon points="22,17 27,22 22,27 17,22" fill="url(#top-g)" />
          </svg>
        </div>

        {/* Prev / Next */}
        <div style={{ pointerEvents: "all", display: "flex", gap: "0.5rem" }}>
          {[
            { label: "‹", action: goPrev, disabled: current === 0 },
            { label: "›", action: goNext, disabled: current === SLIDES.length - 1 },
          ].map(({ label, action, disabled }) => (
            <button key={label} onClick={action} disabled={disabled} style={{
              background: "none",
              border: "1px solid rgba(201,168,76,0.25)",
              color: disabled ? "rgba(201,168,76,0.2)" : "#C9A84C",
              width: "32px", height: "32px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.9rem",
              cursor: disabled ? "default" : "pointer",
              transition: "all 0.2s ease",
            }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Right dot rail */}
      <nav style={{
        position: "fixed", right: "clamp(1rem,2.2vw,1.8rem)",
        top: "50%", transform: "translateY(-50%)",
        zIndex: 50, display: "flex", flexDirection: "column", alignItems: "flex-end",
      }} className="deck-dot-rail">
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", marginBottom: "1.2rem", gap: "2px" }}>
          <span style={{ color: "#C9A84C", fontSize: "0.55rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", lineHeight: 1 }}>
            {SLIDES[current]?.chapter}
          </span>
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", lineHeight: 1 }}>
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <div style={{ position: "absolute", right: "6px", top: "6px", bottom: "6px", width: "1px", background: "rgba(201,168,76,0.12)", zIndex: 0 }} />
          <div style={{
            position: "absolute", right: "6px", top: "6px", width: "1px",
            height: `${(current / (SLIDES.length - 1)) * 100}%`,
            background: "linear-gradient(to bottom, #C9A84C, rgba(201,168,76,0.4))",
            zIndex: 0, transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
          }} />

          {SLIDES.map((slide, i) => {
            const isActive  = current === i;
            const isHovered = hoveredDot === i;
            const isPast    = i < current;
            return (
              <button key={slide.id}
                onClick={() => goTo(i)}
                onMouseEnter={() => setHoveredDot(i)}
                onMouseLeave={() => setHoveredDot(null)}
                aria-label={`Go to ${slide.label}`}
                style={{
                  position: "relative", zIndex: 1,
                  display: "flex", alignItems: "center", gap: "0.6rem",
                  background: "none", border: "none",
                  cursor: "pointer", padding: "0.42rem 0",
                }}
              >
                <span style={{
                  color: isActive ? "#C9A84C" : "rgba(255,255,255,0.45)",
                  fontFamily: "var(--font-montserrat)",
                  fontSize: "0.55rem", fontWeight: isActive ? 700 : 500,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  opacity: (isHovered || isActive) ? 1 : 0,
                  transform: (isHovered || isActive) ? "translateX(0)" : "translateX(6px)",
                  transition: "opacity 0.2s ease, transform 0.2s ease",
                  whiteSpace: "nowrap", pointerEvents: "none",
                }}>
                  {slide.label}
                </span>
                <span style={{
                  flexShrink: 0,
                  width:  isActive ? "13px" : isHovered ? "10px" : "6px",
                  height: isActive ? "13px" : isHovered ? "10px" : "6px",
                  borderRadius: "999px",
                  border: `1px solid ${isActive ? "#C9A84C" : isHovered ? "rgba(201,168,76,0.7)" : isPast ? "rgba(201,168,76,0.35)" : "rgba(201,168,76,0.2)"}`,
                  background: isActive ? "#C9A84C" : isPast ? "rgba(201,168,76,0.25)" : "transparent",
                  boxShadow: isActive ? "0 0 0 3px rgba(201,168,76,0.12),0 0 12px rgba(201,168,76,0.3)" : "none",
                  transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)",
                  display: "block",
                }} />
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: "1.2rem", textAlign: "right" }}>
          <span style={{ color: "rgba(201,168,76,0.5)", fontSize: "0.5rem", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", lineHeight: 1 }}>
            {SLIDES[current]?.label}
          </span>
        </div>
      </nav>

      {/* Hamburger overlay */}
      {menuOpen && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 40,
          background: "rgba(5,4,2,0.97)",
          display: "flex", alignItems: "center", justifyContent: "center",
          animation: "fadeIn 0.25s ease forwards",
        }}>
          <div style={{ display: "flex", flexDirection: "column", width: "clamp(260px,48vw,460px)" }}>
            <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.58rem", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, margin: "0 0 1.4rem" }}>
              Navigate
            </p>
            {SLIDES.map((slide, i) => (
              <button key={slide.id}
                onClick={() => { goTo(i); setMenuOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: "1.4rem",
                  background: "transparent", border: "none",
                  borderTop: "1px solid rgba(201,168,76,0.08)",
                  padding: "1rem 0", cursor: "pointer", width: "100%",
                  transition: "padding-left 0.18s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.paddingLeft = "0.7rem"; }}
                onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0"; }}
              >
                <span style={{ color: current === i ? "#C9A84C" : "rgba(201,168,76,0.35)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.2em", fontFamily: "var(--font-montserrat)", width: "26px", flexShrink: 0 }}>
                  {slide.chapter}
                </span>
                <span style={{ color: current === i ? "#C9A84C" : "rgba(255,255,255,0.6)", fontSize: "clamp(0.95rem,1.8vw,1.25rem)", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)" }}>
                  {slide.label}
                </span>
                {current === i && <span style={{ color: "#C9A84C", fontSize: "0.6rem", marginLeft: "auto" }}>◆</span>}
              </button>
            ))}
            <div style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }} />
            <button
              onClick={() => { setPhase("hub"); setMenuOpen(false); }}
              style={{
                marginTop: "1.8rem", background: "none",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "rgba(201,168,76,0.6)", padding: "0.65rem 1.2rem",
                fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.25em",
                textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
                cursor: "pointer", alignSelf: "flex-start", transition: "all 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#C9A84C"; e.currentTarget.style.color = "#C9A84C"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; e.currentTarget.style.color = "rgba(201,168,76,0.6)"; }}
            >
              ← Back to Hub
            </button>
          </div>
        </div>
      )}

      {/* Mobile pill */}
      <nav className="deck-mobile-pill" style={{
        position: "fixed", bottom: "1.2rem", left: "50%",
        transform: "translateX(-50%)", zIndex: 50,
        display: "none", alignItems: "center", gap: "0.5rem",
        padding: "0.55rem 1rem",
        background: "rgba(5,4,2,0.82)",
        border: "1px solid rgba(201,168,76,0.15)",
        borderRadius: "999px", backdropFilter: "blur(16px)",
      }}>
        {SLIDES.map((slide, i) => (
          <button key={slide.id} onClick={() => goTo(i)} aria-label={slide.label} style={{
            width: current === i ? "18px" : "6px", height: "6px",
            borderRadius: "999px",
            border: `1px solid ${current === i ? "#C9A84C" : i < current ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.2)"}`,
            background: current === i ? "#C9A84C" : i < current ? "rgba(201,168,76,0.2)" : "transparent",
            cursor: "pointer", padding: 0, transition: "all 0.25s ease", flexShrink: 0,
          }} />
        ))}
      </nav>

      <style>{`
        @keyframes slideInRight  { from { transform:translateX(100%);  opacity:0.4; } to { transform:translateX(0);    opacity:1; } }
        @keyframes slideOutLeft  { from { transform:translateX(0);      opacity:1;   } to { transform:translateX(-100%); opacity:0.4; } }
        @keyframes slideInLeft   { from { transform:translateX(-100%);  opacity:0.4; } to { transform:translateX(0);    opacity:1; } }
        @keyframes slideOutRight { from { transform:translateX(0);      opacity:1;   } to { transform:translateX(100%);  opacity:0.4; } }
        @keyframes fadeIn        { from { opacity:0; } to { opacity:1; } }
        @media (max-width:767px) {
          .deck-dot-rail   { display:none !important; }
          .deck-mobile-pill{ display:flex !important; }
        }
        html, body { overflow:hidden !important; }
      `}</style>
    </div>
  );
}