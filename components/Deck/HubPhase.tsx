"use client";

import { useState } from "react";
import Image from "next/image";

const SLIDES = [
  { id: "intro", label: "Intro & Stats", chapter: "01", path: "/intro" },
  { id: "whos-here", label: "Who's Here", chapter: "02", path: "/WhosHereSection" },
  { id: "explore", label: "Explore", chapter: "03", path: "/explore" },
  { id: "entertainment", label: "Entertainment", chapter: "04", path: "/Entertainment" },
  { id: "events", label: "Events", chapter: "05", path: "/events" },
  { id: "take-action", label: "Take Action", chapter: "06", path: "/takeAction" },
];

const SLIDE_IMAGES: Record<string, string> = {
  "intro": "/photos/intro&stats.webp",
  "whos-here": "/photos/main_hub_whosHere.webp",
  "explore": "/photos/main_hub_explore.webp",
  "entertainment": "/photos/main_hub_entertainment.webp",
  "events": "/photos/main_hub_events.webp",
  "take-action": "/photos/main_hub_action.webp",
};

const SUB_ITEMS: Record<string, { label: string; slideIndex: number; indent?: boolean }[]> = {
  "intro": [
    { label: "Hero", slideIndex: 0 },
    { label: "Stats", slideIndex: 1 },
  ],
  "whos-here": [
    { label: "Who's Here (Overview)", slideIndex: 2 },
    { label: "They Chose to be here", slideIndex: 3 },
    { label: "Brands that trusted us", slideIndex: 4 },
  ],
  "explore": [
    { label: "Explore", slideIndex: 5 },
    { label: "Mall Map", slideIndex: 6 },
    { label: "Where Your Brand Lives", slideIndex: 7 },
  ],
  "entertainment": [
    { label: "Nickelodeon Universe", slideIndex: 9 },
    { label: "Sea Life Aquarium", slideIndex: 10 },
    { label: "Dining & Restaurants", slideIndex: 11 },
    { label: "Shopping", slideIndex: 12 },
  ],
  "events": [
    // Overview + stats
    { label: "Events Overview",        slideIndex: 13 },
    { label: "Events Stats",           slideIndex: 14 },
    // Tech Events — parent
    { label: "Tech Events",            slideIndex: 15 },
    { label: "  Vision Pro Demo",      slideIndex: 16, indent: true },
    { label: "  Samsung Store Opening",slideIndex: 17, indent: true },
    { label: "  VR & Gaming Zones",    slideIndex: 18, indent: true },
    // Entertainment & Gaming — parent
    { label: "Entertainment & Gaming", slideIndex: 19 },
    { label: "  Nike Sneaker Launch",  slideIndex: 20, indent: true },
    { label: "  Adidas Fan Engagement",slideIndex: 21, indent: true },
    { label: "  Xbox Gaming Events",   slideIndex: 22, indent: true },
    // Footfall → Revenue
    { label: "Footfall → Revenue",     slideIndex: 23 },
  ],
  "take-action": [
    { label: "Overview",           slideIndex: 24 },
    { label: "Partnership",        slideIndex: 25 },
    { label: "Lease a Space",      slideIndex: 26 },
    { label: "Become a Sponsor",   slideIndex: 27 },
    { label: "Host an Event",      slideIndex: 28 },
    { label: "Final Actions",      slideIndex: 29 },
  ],
};

// Map hub slide id → deck slide index for direct clicks (no sub-items)
const SLIDE_INDEX_MAP: Record<string, number> = {
  "intro": 0,
  "whos-here": 2,
  "explore": 5,
  "entertainment": 8,
  "events": 13,
  "take-action": 24,
};

interface Props {
  onEnterDeck: (index: number) => void;
}

export default function HubPhase({ onEnterDeck }: Props) {
  const [hoveredId, setHoveredId] = useState<string>("intro");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [bgImage, setBgImage] = useState(SLIDE_IMAGES["intro"]);
  const [fadeKey, setFadeKey] = useState(0);
  const [mobilePreviewId, setMobilePreviewId] = useState<string>("intro");

  const handleHover = (id: string) => {
    setHoveredId(id);
    setBgImage(SLIDE_IMAGES[id]);
    setFadeKey(k => k + 1);
  };

  const handleMobileTouch = (id: string) => {
    setMobilePreviewId(id);
    setBgImage(SLIDE_IMAGES[id]);
    setFadeKey(k => k + 1);
  };

  const handleClick = (id: string) => {
    if (SUB_ITEMS[id]) {
      setExpandedId(prev => prev === id ? null : id);
    } else {
      onEnterDeck(SLIDE_INDEX_MAP[id] ?? 0);
    }
  };

  const handleSubItemClick = (sub: { label: string; slideIndex: number }) => {
    onEnterDeck(sub.slideIndex);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#0a0805",
      display: "flex",
      zIndex: 1000,
      overflow: "hidden",
    }}>

      {/* ── LEFT ACCENT BARS ── */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: "5px", zIndex: 10,
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ flex: 1, background: "#C9A84C" }} />
        <div style={{ flex: 1, background: "rgba(201,168,76,0.35)" }} />
        <div style={{ flex: 1, background: "#C9A84C" }} />
      </div>

      {/* ══════════════════════════════════════════════
          DESKTOP LAYOUT
      ══════════════════════════════════════════════ */}
      <div className="hub-desktop" style={{ display: "flex", width: "100%", height: "100%" }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          width: "clamp(280px, 32vw, 440px)",
          flexShrink: 0,
          background: "rgba(5,4,2,0.97)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 5,
          paddingLeft: "5px",
          overflowY: "auto",
          overflowX: "hidden",
        }}>

          {/* Logo area */}
          <div style={{
            padding: "clamp(1.4rem, 3vh, 2.2rem) clamp(1.4rem, 2.8vw, 2.2rem)",
            borderBottom: "1px solid rgba(201,168,76,0.1)",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}>
            <div style={{
              width: "clamp(52px, 7vw, 72px)",
              height: "clamp(52px, 7vw, 72px)",
              borderRadius: "50%",
              border: "1.5px solid rgba(201,168,76,0.5)",
              background: "rgba(201,168,76,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 44 44" width="clamp(32px,4.5vw,46px)" height="clamp(32px,4.5vw,46px)">
                <defs>
                  <linearGradient id="hub-logo-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0D988" />
                    <stop offset="50%" stopColor="#C9A84C" />
                    <stop offset="100%" stopColor="#8A6820" />
                  </linearGradient>
                </defs>
                <circle cx="22" cy="22" r="14" fill="none" stroke="url(#hub-logo-g)" strokeWidth="1.5" opacity="0.9" />
                <polygon points="22,14 30,22 22,30 14,22" fill="none" stroke="url(#hub-logo-g)" strokeWidth="1.8" opacity="0.95" />
                <polygon points="22,17 27,22 22,27 17,22" fill="url(#hub-logo-g)" />
                <circle cx="22" cy="22" r="2" fill="#0a0805" opacity="0.7" />
              </svg>
            </div>
            <div>
              <p style={{
                color: "#C9A84C", fontSize: "0.58rem",
                letterSpacing: "0.32em", textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)", fontWeight: 700, margin: 0,
              }}>
                Interactive Deck
              </p>
              <p style={{
                color: "rgba(255,255,255,0.75)", fontSize: "clamp(0.85rem,1.4vw,1rem)",
                fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)", margin: "0.15rem 0 0",
              }}>
                Mall of America
              </p>
            </div>
          </div>

          {/* Navigation menu */}
          <nav style={{ flex: 1, padding: "0.5rem 0" }}>
            {SLIDES.map((slide) => {
              const isActive = hoveredId === slide.id;
              const isExpanded = expandedId === slide.id;
              const hasSubs = !!SUB_ITEMS[slide.id];

              return (
                <div key={slide.id}>
                  <button
                    onMouseEnter={() => handleHover(slide.id)}
                    onClick={() => handleClick(slide.id)}
                    style={{
                      display: "flex", alignItems: "center",
                      width: "100%",
                      background: isActive || isExpanded ? "rgba(201,168,76,0.08)" : "transparent",
                      border: "none",
                      borderLeft: isActive || isExpanded ? "3px solid #C9A84C" : "3px solid transparent",
                      padding: "clamp(0.65rem,1.4vh,0.95rem) clamp(1.2rem,2.4vw,2rem)",
                      cursor: "pointer", textAlign: "left",
                      transition: "all 0.2s ease", gap: "1rem",
                    }}
                  >
                    <span style={{
                      color: isActive || isExpanded ? "#C9A84C" : "rgba(201,168,76,0.35)",
                      fontSize: "clamp(0.52rem,0.85vw,0.62rem)",
                      fontWeight: 700, letterSpacing: "0.2em",
                      fontFamily: "var(--font-montserrat)",
                      flexShrink: 0, width: "24px",
                      transition: "color 0.2s ease",
                    }}>
                      {slide.chapter}
                    </span>
                    <span style={{
                      color: isActive || isExpanded ? "#ffffff" : "rgba(255,255,255,0.58)",
                      fontSize: "clamp(0.78rem,1.25vw,0.92rem)",
                      fontWeight: isActive || isExpanded ? 800 : 600,
                      letterSpacing: "0.08em", textTransform: "uppercase",
                      fontFamily: "var(--font-montserrat)", flexGrow: 1,
                      transition: "all 0.2s ease",
                    }}>
                      {slide.label}
                    </span>
                    {hasSubs ? (
                      <span style={{
                        color: "#C9A84C", fontSize: "0.65rem",
                        opacity: isActive || isExpanded ? 1 : 0,
                        transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                        transition: "all 0.25s ease",
                      }}>▶</span>
                    ) : (
                      <span style={{
                        color: "#C9A84C", fontSize: "0.88rem",
                        opacity: isActive ? 1 : 0,
                        transition: "opacity 0.2s ease",
                      }}>→</span>
                    )}
                  </button>

                  {/* Sub-items */}
                  {hasSubs && isExpanded && (
                    <div style={{
                      background: "rgba(0,0,0,0.28)",
                      borderLeft: "3px solid rgba(201,168,76,0.28)",
                    }}>
                      {SUB_ITEMS[slide.id].map(sub => (
                        <button
                          key={sub.label}
                          onClick={() => handleSubItemClick(sub)}
                          style={{
                            width: "100%",
                            background: "transparent", border: "none",
                            padding: sub.indent
                              ? "0.4rem clamp(1.2rem,2.4vw,2rem) 0.4rem clamp(3rem,5.5vw,4.5rem)"
                              : "0.55rem clamp(1.2rem,2.4vw,2rem) 0.55rem clamp(2rem,4vw,3.2rem)",
                            textAlign: "left", cursor: "pointer",
                            color: sub.indent ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.52)",
                            fontSize: sub.indent
                              ? "clamp(0.58rem,0.9vw,0.68rem)"
                              : "clamp(0.7rem,1.05vw,0.8rem)",
                            fontFamily: "var(--font-montserrat)", fontWeight: sub.indent ? 400 : 500,
                            letterSpacing: "0.04em", transition: "color 0.15s ease",
                            display: "flex", alignItems: "center", gap: "0.5rem",
                          }}
                          onMouseEnter={e => { e.currentTarget.style.color = sub.indent ? "rgba(201,168,76,0.7)" : "#C9A84C"; }}
                          onMouseLeave={e => { e.currentTarget.style.color = sub.indent ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.52)"; }}
                        >
                          {sub.indent ? (
                            <span style={{
                              width: "3px", height: "3px",
                              background: "rgba(201,168,76,0.35)",
                              borderRadius: "50%", flexShrink: 0, display: "inline-block",
                            }} />
                          ) : (
                            <span style={{
                              width: "4px", height: "1px",
                              background: "rgba(201,168,76,0.5)",
                              flexShrink: 0, display: "inline-block",
                            }} />
                          )}
                          {sub.label.trim()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right border accent */}
          <div style={{
            position: "absolute", right: 0, top: "15%", bottom: "15%",
            width: "1px",
            background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.28), transparent)",
            pointerEvents: "none",
          }} />
        </div>

        {/* ── RIGHT IMAGE PANEL ── */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div key={fadeKey} style={{
            position: "absolute", inset: 0,
            animation: "hubImgFade 0.55s ease forwards",
            zIndex: 1,
          }}>
            <Image
              src={bgImage} alt="" fill sizes="70vw" quality={80}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          {/* Overlays */}
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            background: "linear-gradient(90deg, rgba(5,4,2,0.65) 0%, rgba(5,4,2,0.15) 35%, rgba(5,4,2,0.04) 100%)",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "20%", zIndex: 2,
            background: "linear-gradient(to bottom, rgba(5,4,2,0.5), transparent)",
          }} />
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "25%", zIndex: 2,
            background: "linear-gradient(to top, rgba(5,4,2,0.75), transparent)",
          }} />

          {/* Chapter counter — top right */}
          <div style={{
            position: "absolute",
            top: "clamp(1.2rem,3.5vh,2.2rem)",
            right: "clamp(1.2rem,3.5vw,2.5rem)",
            zIndex: 3,
          }}>
            <span style={{
              color: "rgba(201,168,76,0.6)", fontSize: "clamp(0.52rem,0.82vw,0.62rem)",
              fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)",
            }}>
              {SLIDES.find(s => s.id === hoveredId)?.chapter} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>

          {/* Brand — bottom right */}
          <div style={{
            position: "absolute",
            bottom: "clamp(1.2rem,4vh,2.5rem)",
            right: "clamp(1.2rem,3.5vw,2.5rem)",
            zIndex: 3, textAlign: "right",
          }}>
            <p style={{
              color: "#ffffff",
              fontSize: "clamp(1.2rem,3vw,2.5rem)",
              fontWeight: 800, fontFamily: "var(--font-montserrat)",
              letterSpacing: "0.08em", textTransform: "uppercase",
              margin: 0, lineHeight: 1,
              textShadow: "0 2px 20px rgba(0,0,0,0.8)",
            }}>
              Mall of America
            </p>
            <p style={{
              color: "rgba(201,168,76,0.65)",
              fontSize: "clamp(0.5rem,0.85vw,0.65rem)",
              letterSpacing: "0.35em", textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)", fontWeight: 600,
              margin: "0.28rem 0 0",
            }}>
              Bloomington · Minnesota
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE LAYOUT
      ══════════════════════════════════════════════ */}
      <div className="hub-mobile" style={{
        display: "none", flexDirection: "column",
        width: "100%", height: "100%",
      }}>

        {/* Top — image preview */}
        <div style={{ position: "relative", height: "38vh", flexShrink: 0, overflow: "hidden" }}>
          <div key={`m-${fadeKey}`} style={{
            position: "absolute", inset: 0,
            animation: "hubImgFade 0.55s ease forwards", zIndex: 1,
          }}>
            <Image
              src={bgImage} alt="" fill sizes="100vw" quality={70}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <div style={{
            position: "absolute", inset: 0, zIndex: 2,
            background: "linear-gradient(to bottom, rgba(5,4,2,0.3) 0%, rgba(5,4,2,0.7) 100%)",
          }} />

          {/* Logo overlay */}
          <div style={{
            position: "absolute", bottom: "1.2rem", left: "1.2rem", zIndex: 3,
            display: "flex", alignItems: "center", gap: "0.75rem",
          }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "50%",
              border: "1.5px solid rgba(201,168,76,0.55)",
              background: "rgba(201,168,76,0.08)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <svg viewBox="0 0 44 44" width="26" height="26">
                <defs>
                  <linearGradient id="hub-mob-g" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F0D988" />
                    <stop offset="100%" stopColor="#C9A84C" />
                  </linearGradient>
                </defs>
                <circle cx="22" cy="22" r="14" fill="none" stroke="url(#hub-mob-g)" strokeWidth="1.5" />
                <polygon points="22,14 30,22 22,30 14,22" fill="none" stroke="url(#hub-mob-g)" strokeWidth="1.6" />
                <polygon points="22,17 27,22 22,27 17,22" fill="url(#hub-mob-g)" />
              </svg>
            </div>
            <div>
              <p style={{
                color: "#C9A84C", fontSize: "0.5rem",
                letterSpacing: "0.3em", textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)", fontWeight: 700, margin: 0,
              }}>Interactive Deck</p>
              <p style={{
                color: "#ffffff", fontSize: "0.88rem",
                fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)", margin: "0.1rem 0 0",
              }}>Mall of America</p>
            </div>
          </div>

          <div style={{ position: "absolute", top: "1rem", right: "1rem", zIndex: 3 }}>
            <span style={{
              color: "rgba(201,168,76,0.7)", fontSize: "0.52rem",
              fontWeight: 700, letterSpacing: "0.28em",
              textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
            }}>
              {SLIDES.find(s => s.id === mobilePreviewId)?.chapter} / {String(SLIDES.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Bottom — scrollable nav */}
        <div style={{
          flex: 1, background: "rgba(5,4,2,0.98)",
          overflowY: "auto", overflowX: "hidden",
          paddingBottom: "env(safe-area-inset-bottom, 1rem)",
          scrollbarWidth: "none",
        }}>
          {SLIDES.map((slide) => {
            const isExpanded = expandedId === slide.id;
            const hasSubs = !!SUB_ITEMS[slide.id];

            return (
              <div key={slide.id}>
                <button
                  onTouchStart={() => handleMobileTouch(slide.id)}
                  onClick={() => handleClick(slide.id)}
                  style={{
                    display: "flex", alignItems: "center", width: "100%",
                    background: isExpanded ? "rgba(201,168,76,0.07)" : "transparent",
                    border: "none",
                    borderLeft: isExpanded ? "3px solid #C9A84C" : "3px solid transparent",
                    borderBottom: "1px solid rgba(201,168,76,0.07)",
                    padding: "1rem 1.2rem",
                    cursor: "pointer", textAlign: "left",
                    gap: "1rem", transition: "all 0.18s ease",
                  }}
                >
                  <span style={{
                    color: isExpanded ? "#C9A84C" : "rgba(201,168,76,0.4)",
                    fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.18em",
                    fontFamily: "var(--font-montserrat)", flexShrink: 0, width: "22px",
                  }}>
                    {slide.chapter}
                  </span>
                  <span style={{
                    color: isExpanded ? "#ffffff" : "rgba(255,255,255,0.65)",
                    fontSize: "0.88rem", fontWeight: isExpanded ? 800 : 600,
                    letterSpacing: "0.07em", textTransform: "uppercase",
                    fontFamily: "var(--font-montserrat)", flexGrow: 1,
                  }}>
                    {slide.label}
                  </span>
                  {hasSubs ? (
                    <span style={{
                      color: "#C9A84C", fontSize: "0.62rem",
                      transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.25s ease", opacity: 0.8,
                    }}>▶</span>
                  ) : (
                    <span style={{ color: "#C9A84C", fontSize: "0.88rem", opacity: 0.7 }}>→</span>
                  )}
                </button>

                {/* Mobile sub-items */}
                {hasSubs && isExpanded && (
                  <div style={{
                    background: "rgba(0,0,0,0.22)",
                    borderLeft: "3px solid rgba(201,168,76,0.25)",
                  }}>
                    {SUB_ITEMS[slide.id].map(sub => (
                      <button
                        key={sub.label}
                        onClick={() => handleSubItemClick(sub)}
                        style={{
                          display: "flex", alignItems: "center",
                          width: "100%", background: "transparent", border: "none",
                          borderBottom: "1px solid rgba(201,168,76,0.05)",
                          padding: sub.indent
                            ? "0.55rem 1.2rem 0.55rem 3.2rem"
                            : "0.75rem 1.2rem 0.75rem 2.4rem",
                          textAlign: "left", cursor: "pointer",
                          color: sub.indent ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.5)",
                          fontSize: sub.indent ? "0.7rem" : "0.8rem",
                          fontFamily: "var(--font-montserrat)",
                          fontWeight: sub.indent ? 400 : 500,
                          letterSpacing: "0.04em", gap: "0.5rem",
                        }}
                      >
                        <span style={{
                          width: sub.indent ? "3px" : "4px",
                          height: sub.indent ? "3px" : "4px",
                          background: sub.indent ? "rgba(201,168,76,0.3)" : "rgba(201,168,76,0.4)",
                          borderRadius: "50%", flexShrink: 0,
                          display: "inline-block",
                        }} />
                        {sub.label.trim()}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ height: "2rem" }} />
        </div>
      </div>

      {/* ── ANIMATIONS + RESPONSIVE ── */}
      <style>{`
        @keyframes hubImgFade {
          from { opacity: 0; transform: scale(1.03); }
          to   { opacity: 1; transform: scale(1); }
        }
        @media (min-width: 768px) {
          .hub-desktop { display: flex !important; }
          .hub-mobile  { display: none  !important; }
        }
        @media (max-width: 767px) {
          .hub-desktop { display: none  !important; }
          .hub-mobile  { display: flex  !important; }
        }
        .hub-mobile div::-webkit-scrollbar { display: none; }
        .hub-mobile button { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}