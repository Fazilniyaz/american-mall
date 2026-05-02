"use client";

import { useEffect, useCallback, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { ScrollerContext } from "@/components/ScrollerContext";

// ── Phase components ──────────────────────────────────────────────────
const SplashPhase = dynamic(() => import("./SplashPhase"), { ssr: false });
const IntroVideoPhase = dynamic(() => import("./IntroVideoPhase"), { ssr: false });
const HubPhase = dynamic(() => import("./HubPhase"), { ssr: false });

// ── Deck slides ───────────────────────────────────────────────────────
const HeroSection = dynamic(() => import("@/components/Hero/HeroSection"), { ssr: false });
const NumbersSection = dynamic(() => import("@/components/Numbers/NumbersSection"), { ssr: false });
const WhosHerePlaceholder = dynamic(() => import("@/components/WhoIsHere/WhosHerePlaceholder"), { ssr: false });
const WhosHereOneSection = dynamic(() => import("@/components/WhoIsHere/WhosHereOneSection"), { ssr: false });
const WhosHereTwoSection = dynamic(() => import("@/components/WhoIsHere/WhosHereTwoSection"), { ssr: false });
const ExplorePlaceholder = dynamic(() => import("@/components/Explore/ExplorePlaceholder"), { ssr: false });
const MallMapSection = dynamic(() => import("@/components/MallMap/MallMapSection"), { ssr: false });
const WhereYourBrandLivesSection = dynamic(() => import("@/components/Explore/WhereYourBrandLivesSection"), { ssr: false });
const EntertainmentPlaceholder = dynamic(() => import("@/components/Entertainment/EntertainmentPlaceholder"), { ssr: false });
const NickelodeonSection = dynamic(() => import("@/components/Entertainment/NickelodeonPanel"), { ssr: false });
const AquariumSection = dynamic(() => import("@/components/Entertainment/AquariumPanel"), { ssr: false });
const RestaurantSection = dynamic(() => import("@/components/Entertainment/RestaurantPanel"), { ssr: false });
const ShoppingSection = dynamic(() => import("@/components/Entertainment/ShoppingPanel"), { ssr: false });
const EventsPanelSlide = dynamic(() => import("@/components/Entertainment/EventsPanel"), { ssr: false });
const EventsStatsSlide = dynamic(() => import("@/components/Event/EventsStatsSlide"), { ssr: false });
const EventsTechSlide = dynamic(() => import("@/components/Event/EventsTechPlaceholder"), { ssr: false });
const AppleVisionSlide = dynamic(() => import("@/components/Event/AppleVisionProPlaceholder"), { ssr: false });
const SamsungStoreSlide = dynamic(() => import("@/components/Event/SamsungStorePlaceholder"), { ssr: false });
const VRGamingSlide = dynamic(() => import("@/components/Event/VRGamingPlaceholder"), { ssr: false });
const EntGamingSlide = dynamic(() => import("@/components/Event/EntertainmentGamingPlaceholder"), { ssr: false });
const NikeSneakerSlide = dynamic(() => import("@/components/Event/NikeSneakerPlaceholder"), { ssr: false });
const AdidasFanSlide = dynamic(() => import("@/components/Event/AdidasFanPlaceholder"), { ssr: false });
const XboxGamingSlide = dynamic(() => import("@/components/Event/XboxGamingPlaceholder"), { ssr: false });
const FootfallRevenueSlide = dynamic(() => import("@/components/FootfallRevenue/FootfallRevenueSlide"), { ssr: false });
const TakeActionOverview = dynamic(() => import("@/components/TakeAction/TakeActionOverview"), { ssr: false });
const PartnershipSlide = dynamic(() => import("@/components/TakeAction/PartnershipPlaceholder"), { ssr: false });
const LeaseASpaceSlide = dynamic(() => import("@/components/TakeAction/LeaseASpacePlaceholder"), { ssr: false });
const BecomeASponsorSlide = dynamic(() => import("@/components/TakeAction/BecomeASponsorPlaceholder"), { ssr: false });
const HostAnEventSlide = dynamic(() => import("@/components/TakeAction/HostAnEventPlaceholder"), { ssr: false });
const FinalActionsSlide = dynamic(() => import("@/components/TakeAction/FinalActionsPlaceholder"), { ssr: false });

// ── Slide definitions ─────────────────────────────────────────────────
const SLIDES = [
  { id: "intro", label: "Intro & Stats", chapter: "01", path: "/intro" },
  { id: "introTwo", label: "Intro Two", chapter: "02", path: "/introTwo" },
  { id: "whos-here", label: "Who's Here", chapter: "03", path: "/WhosHereSection" },
  { id: "whos-here-one", label: "They Chose to be here", chapter: "03", path: "/WhosHereOne" },
  { id: "whos-here-two", label: "Brands that trusted us", chapter: "03", path: "/WhosHereTwo" },
  { id: "explore", label: "Explore", chapter: "04", path: "/explore" },
  { id: "mall-map", label: "Mall Map", chapter: "04", path: "/explore/MallMap" },
  { id: "brand-lives", label: "Where Your Brand Lives", chapter: "04", path: "/explore/whereYourBrandLives" },
  { id: "entertainment", label: "Entertainment", chapter: "05", path: "/Entertainment" },
  { id: "theme-park", label: "Nickelodeon Universe", chapter: "05", path: "/Entertainment/themePark" },
  { id: "aquarium", label: "Sea Life Aquarium", chapter: "05", path: "/Entertainment/Aquarium" },
  { id: "dining", label: "Dining & Restaurants", chapter: "05", path: "/Entertainment/Dining" },
  { id: "shopping", label: "Shopping", chapter: "05", path: "/Entertainment/Shopping" },
  // ── Events (index 13–22) ─────────────────────────────────────────────────
  { id: "events", label: "Events", chapter: "06", path: "/events" },
  { id: "events-stats", label: "Events — Stats", chapter: "06", path: "/events/stats" },
  { id: "events-tech", label: "Tech Events", chapter: "06", path: "/events/tech" },
  { id: "events-apple", label: "Vision Pro Demo", chapter: "06", path: "/events/tech/appleVisionPro" },
  { id: "events-samsung-store", label: "Samsung Store Opening", chapter: "06", path: "/events/tech/samsungGrandStoreOpening" },
  { id: "events-vr", label: "VR & Gaming Zones", chapter: "06", path: "/events/tech/vrAndGamingZones" },
  { id: "events-ent", label: "Entertainment & Gaming", chapter: "06", path: "/events/entertainmentAndGaming" },
  { id: "events-nike", label: "Nike Sneaker Launch", chapter: "06", path: "/events/entertainmentAndGaming/nikeSneakerLaunchEvent" },
  { id: "events-adidas", label: "Adidas Fan Engagement", chapter: "06", path: "/events/entertainmentAndGaming/adidasFanEngagementEvent" },
  { id: "events-xbox", label: "Xbox Gaming Events", chapter: "06", path: "/events/entertainmentAndGaming/xboxGamingEvents" },
  // ── Footfall → Revenue (index 23) ───────────────────────────────────────
  { id: "footfall-revenue", label: "How Footfall Turns Into Revenue", chapter: "06", path: "/footfall-revenue" },
  // ── Take Action (index 24–29) ─────────────────────────────────────────────
  { id: "take-action", label: "Take Action", chapter: "07", path: "/takeAction" },
  { id: "partnership", label: "Partnership", chapter: "07", path: "/takeAction/Partnership" },
  { id: "lease-space", label: "Lease a Space", chapter: "07", path: "/takeAction/LeaseASpace" },
  { id: "become-sponsor", label: "Become a Sponsor", chapter: "07", path: "/takeAction/BecomeASponsor" },
  { id: "host-event", label: "Host an Event", chapter: "07", path: "/takeAction/HostAnEvent" },
  { id: "final-actions", label: "Final Actions", chapter: "07", path: "/takeAction/FinalActions" },
];

type Phase = "splash" | "intro-video" | "hub" | "deck";

function renderSlide(index: number) {
  switch (index) {
    case 0: return <HeroSection />;
    case 1: return <NumbersSection />;
    case 2: return <WhosHerePlaceholder />;
    case 3: return <WhosHereOneSection />;
    case 4: return <WhosHereTwoSection />;
    case 5: return <ExplorePlaceholder />;
    case 6: return <MallMapSection />;
    case 7: return <WhereYourBrandLivesSection />;
    case 8: return <EntertainmentPlaceholder />;
    case 9: return <NickelodeonSection />;
    case 10: return <AquariumSection />;
    case 11: return <RestaurantSection />;
    case 12: return <ShoppingSection />;
    // ── Events ────────────────────────────────────────────────────────────
    case 13: return <EventsPanelSlide />;
    case 14: return <EventsStatsSlide />;
    case 15: return <EventsTechSlide />;
    case 16: return <AppleVisionSlide />;
    case 17: return <SamsungStoreSlide />;
    case 18: return <VRGamingSlide />;
    case 19: return <EntGamingSlide />;
    case 20: return <NikeSneakerSlide />;
    case 21: return <AdidasFanSlide />;
    case 22: return <XboxGamingSlide />;
    // ── Footfall → Revenue ────────────────────────────────────────────────
    case 23: return <FootfallRevenueSlide />;
    // ── Take Action ──────────────────────────────────────────────────────
    case 24: return <TakeActionOverview />;
    case 25: return <PartnershipSlide />;
    case 26: return <LeaseASpaceSlide />;
    case 27: return <BecomeASponsorSlide />;
    case 28: return <HostAnEventSlide />;
    case 29: return <FinalActionsSlide />;
    default: return null;
  }
}

export default function DeckShell() {
  const router = useRouter();
  const pathname = usePathname();

  const [phase, setPhase] = useState<Phase>("splash");
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [animDir, setAnimDir] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollerEl, setScrollerEl] = useState<HTMLElement | null>(null);

  const animTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── On first mount: if URL already matches a slide, jump straight to deck ──
  // This handles direct navigation (e.g. user visits /stats directly)
  useEffect(() => {
    const idx = SLIDES.findIndex(s => s.path === pathname);
    if (idx !== -1) {
      setPhase("deck");
      setCurrent(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs only once on mount

  // ── Sync current slide index from URL path ────────────────────────
  useEffect(() => {
    if (phase !== "deck") return;
    const idx = SLIDES.findIndex(s => s.path === pathname);
    if (idx !== -1 && idx !== current) {
      setCurrent(idx);
    }
  }, [pathname, phase]);

  // ── Keyboard nav ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== "deck") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, current, isAnimating]);

  // ── Navigation ────────────────────────────────────────────────────
  const goTo = useCallback((index: number) => {
    if (isAnimating || index === current) return;
    if (animTimeout.current) clearTimeout(animTimeout.current);
    setAnimDir(index > current ? "next" : "prev");
    setPrev(current);
    setIsAnimating(true);
    setCurrent(index);
    router.push(SLIDES[index].path);
    animTimeout.current = setTimeout(() => {
      setPrev(null);
      setIsAnimating(false);
    }, 600);
  }, [isAnimating, current, router]);

  const goNext = useCallback(() => {
    let nextIdx = current + 1;
    if (nextIdx === 14 && window.innerWidth <= 767) nextIdx = 15;
    if (nextIdx < SLIDES.length) goTo(nextIdx);
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    let prevIdx = current - 1;
    if (prevIdx === 14 && window.innerWidth <= 767) prevIdx = 13;
    if (prevIdx >= 0) goTo(prevIdx);
  }, [current, goTo]);

  const enterDeck = useCallback((startIndex = 0) => {
    setCurrent(startIndex);
    setPrev(null);
    setIsAnimating(false);
    setMenuOpen(false);
    setPhase("deck");
    router.push(SLIDES[startIndex].path);
  }, [router]);

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

      {/* ── Slide viewport ── */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>

        {/* Outgoing slide */}
        {prev !== null && isAnimating && (
          <div key={`prev-${prev}`} style={{
            position: "absolute", inset: 0, overflow: "hidden", zIndex: 1,
            animation: `slideOut${animDir === "next" ? "Left" : "Right"} 0.6s cubic-bezier(0.76,0,0.24,1) forwards`,
          }}>
            <div style={{ width: "100%", height: "100vh", overflow: "hidden" }}>
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
            style={{ width: "100%", height: "100vh", overflow: "hidden" }}
          >
            <ScrollerContext.Provider value={scrollerEl}>
              {renderSlide(current)}
            </ScrollerContext.Provider>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          TOP BAR
          Left: Hamburger  |  Center: Logo  |  Right: Prev/Next
      ════════════════════════════════════════════ */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        height: "56px",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 1.4rem",
        background: "linear-gradient(to bottom, rgba(5,4,2,0.85), transparent)",
        pointerEvents: "none",
      }}>

        {/* ── LEFT: Hamburger ── */}
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            pointerEvents: "all",
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
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

        {/* ── CENTER: Logo → click goes back to hub ── */}
        <div
          style={{ pointerEvents: "all", cursor: "pointer", display: "flex", alignItems: "center" }}
          onClick={() => setPhase("hub")}
        >
          <svg viewBox="0 0 44 44" width="26" height="26">
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

        {/* ── RIGHT: Prev / Next arrows ── */}
        <div style={{ pointerEvents: "all", display: "flex", gap: "0.5rem" }}>
          {[
            { label: "‹", action: goPrev, disabled: current === 0 },
            { label: "›", action: goNext, disabled: current === SLIDES.length - 1 },
          ].map(({ label, action, disabled }) => (
            <button
              key={label}
              onClick={action}
              disabled={disabled}
              style={{
                background: "none",
                border: "1px solid rgba(201,168,76,0.25)",
                color: disabled ? "rgba(201,168,76,0.2)" : "#C9A84C",
                width: "32px", height: "32px",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "1rem",
                cursor: disabled ? "default" : "pointer",
                transition: "all 0.2s ease",
                fontFamily: "var(--font-montserrat)",
              }}
              onMouseEnter={e => {
                if (!disabled) {
                  e.currentTarget.style.background = "rgba(201,168,76,0.1)";
                  e.currentTarget.style.borderColor = "#C9A84C";
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "none";
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Hamburger overlay menu (simplified: prev / current / next + hub) ── */}
      {menuOpen && (() => {
        const prevSlide = current > 0 ? SLIDES[current - 1] : null;
        const currSlide = SLIDES[current];
        const nextSlide = current < SLIDES.length - 1 ? SLIDES[current + 1] : null;

        return (
          <div style={{
            position: "fixed", inset: 0, zIndex: 40,
            background: "rgba(5,4,2,0.97)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "fadeIn 0.25s ease forwards",
          }}>
            <div style={{
              display: "flex", flexDirection: "column",
              alignItems: "center", gap: "0",
              width: "clamp(260px, 48vw, 440px)",
            }}>

              {/* ── Label ── */}
              <p style={{
                color: "rgba(255,255,255,0.22)", fontSize: "0.58rem",
                letterSpacing: "0.35em", textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)", fontWeight: 600,
                margin: "0 0 2rem", alignSelf: "flex-start",
              }}>
                Navigate
              </p>

              {/* ── Previous slide ── */}
              {prevSlide ? (
                <button
                  onClick={() => { goTo(current - 1); setMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    background: "transparent", border: "none",
                    borderBottom: "1px solid rgba(201,168,76,0.08)",
                    padding: "1rem 0", cursor: "pointer", width: "100%",
                    transition: "padding-left 0.18s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.paddingLeft = "0.7rem"; }}
                  onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0"; }}
                >
                  <span style={{
                    color: "rgba(201,168,76,0.35)", fontSize: "0.55rem",
                    fontWeight: 700, letterSpacing: "0.2em",
                    fontFamily: "var(--font-montserrat)", width: "22px", flexShrink: 0,
                  }}>
                    {prevSlide.chapter}
                  </span>
                  <span style={{
                    color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.75rem,1.4vw,1rem)",
                    fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                    fontFamily: "var(--font-montserrat)",
                  }}>
                    ‹ {prevSlide.label}
                  </span>
                </button>
              ) : (
                <div style={{ padding: "1rem 0", width: "100%", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                  <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "0.7rem", fontFamily: "var(--font-montserrat)" }}>
                    No previous slide
                  </span>
                </div>
              )}

              {/* ── Current slide (highlighted) ── */}
              <div style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1.4rem 0",
                width: "100%",
                borderBottom: "1px solid rgba(201,168,76,0.08)",
              }}>
                <span style={{
                  color: "#C9A84C", fontSize: "0.6rem", fontWeight: 700,
                  letterSpacing: "0.2em", fontFamily: "var(--font-montserrat)",
                  width: "22px", flexShrink: 0,
                }}>
                  {currSlide.chapter}
                </span>
                <span style={{
                  color: "#C9A84C",
                  fontSize: "clamp(1rem,1.8vw,1.3rem)", fontWeight: 800,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)", flex: 1,
                }}>
                  {currSlide.label}
                </span>
                <span style={{ color: "#C9A84C", fontSize: "0.6rem" }}>◆</span>
              </div>

              {/* ── Next slide ── */}
              {nextSlide ? (
                <button
                  onClick={() => { goTo(current + 1); setMenuOpen(false); }}
                  style={{
                    display: "flex", alignItems: "center", gap: "1rem",
                    background: "transparent", border: "none",
                    borderBottom: "1px solid rgba(201,168,76,0.08)",
                    padding: "1rem 0", cursor: "pointer", width: "100%",
                    transition: "padding-left 0.18s ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.paddingLeft = "0.7rem"; }}
                  onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0"; }}
                >
                  <span style={{
                    color: "rgba(201,168,76,0.35)", fontSize: "0.55rem",
                    fontWeight: 700, letterSpacing: "0.2em",
                    fontFamily: "var(--font-montserrat)", width: "22px", flexShrink: 0,
                  }}>
                    {nextSlide.chapter}
                  </span>
                  <span style={{
                    color: "rgba(255,255,255,0.4)", fontSize: "clamp(0.75rem,1.4vw,1rem)",
                    fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
                    fontFamily: "var(--font-montserrat)",
                  }}>
                    {nextSlide.label} ›
                  </span>
                </button>
              ) : (
                <div style={{ padding: "1rem 0", width: "100%", borderBottom: "1px solid rgba(201,168,76,0.08)" }}>
                  <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "0.7rem", fontFamily: "var(--font-montserrat)" }}>
                    Last slide
                  </span>
                </div>
              )}

              {/* ── Slide counter ── */}
              <p style={{
                color: "rgba(255,255,255,0.15)", fontSize: "0.52rem",
                fontFamily: "var(--font-montserrat)", fontWeight: 600,
                letterSpacing: "0.18em", margin: "1.5rem 0 0", alignSelf: "flex-start",
              }}>
                Slide {current + 1} of {SLIDES.length}
              </p>

              {/* ── Back to Hub ── */}
              <button
                onClick={() => { setPhase("hub"); setMenuOpen(false); }}
                style={{
                  marginTop: "1.5rem", background: "none",
                  border: "1px solid rgba(201,168,76,0.2)",
                  color: "rgba(201,168,76,0.6)", padding: "0.7rem 1.4rem",
                  fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.25em",
                  textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
                  cursor: "pointer", alignSelf: "flex-start", transition: "all 0.2s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = "#C9A84C";
                  e.currentTarget.style.color = "#C9A84C";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
                  e.currentTarget.style.color = "rgba(201,168,76,0.6)";
                }}
              >
                ← Back to Main Hub
              </button>
            </div>
          </div>
        );
      })()}



      {/* ── Keyframe animations ── */}
      <style>{`
        @keyframes slideInRight  { from { transform:translateX(100%);  opacity:0.4; } to { transform:translateX(0);    opacity:1; } }
        @keyframes slideOutLeft  { from { transform:translateX(0);      opacity:1;   } to { transform:translateX(-100%); opacity:0.4; } }
        @keyframes slideInLeft   { from { transform:translateX(-100%);  opacity:0.4; } to { transform:translateX(0);    opacity:1; } }
        @keyframes slideOutRight { from { transform:translateX(0);      opacity:1;   } to { transform:translateX(100%);  opacity:0.4; } }
        @keyframes fadeIn        { from { opacity:0; } to { opacity:1; } }


        html, body { overflow: hidden !important; }
      `}
      </style>
    </div>
  );
}