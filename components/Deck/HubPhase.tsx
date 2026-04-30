"use client";

const SLIDES = [
  { id: "intro",         label: "Intro",         chapter: "01" },
  { id: "scale",         label: "Scale",          chapter: "02" },
  { id: "whos-here",     label: "Who's Here",     chapter: "03" },
  { id: "explore",       label: "Explore",        chapter: "04" },
  { id: "entertainment", label: "Entertainment",  chapter: "05" },
  { id: "events",        label: "Events",         chapter: "06" },
  { id: "sponsorship",   label: "Sponsorship",    chapter: "07" },
  { id: "get-started",   label: "Get Started",    chapter: "08" },
];

interface Props {
  onEnterDeck: (index: number) => void;
}

export default function HubPhase({ onEnterDeck }: Props) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "#050402",
      zIndex: 1000, overflow: "hidden",
    }}>

      {/* Background video */}
      <video autoPlay muted loop playsInline
        src="/videos/videoplayback.mp4"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", opacity: 0.2, zIndex: 0,
        }}
      />

      {/* Overlays */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: "linear-gradient(135deg, rgba(5,4,2,0.93) 0%, rgba(5,4,2,0.76) 60%, rgba(5,4,2,0.9) 100%)",
      }} />
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: "radial-gradient(ellipse 55% 45% at 15% 50%, rgba(201,168,76,0.07) 0%, transparent 65%)",
      }} />

      {/* Main grid */}
      <div className="hub-grid" style={{
        position: "relative", zIndex: 2,
        width: "100%", height: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        padding: "3rem clamp(1.5rem, 7vw, 6rem)",
        gap: "3rem",
        overflowY: "auto",
      }}>

        {/* Left — Branding */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>

          {/* Logo */}
          <svg viewBox="0 0 44 44" width="46" height="46" style={{ flexShrink: 0 }}>
            <defs>
              <linearGradient id="hub-g" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F0D988" />
                <stop offset="50%" stopColor="#C9A84C" />
                <stop offset="100%" stopColor="#8A6820" />
              </linearGradient>
            </defs>
            <circle cx="22" cy="22" r="14" fill="none"
              stroke="url(#hub-g)" strokeWidth="1" opacity="0.6"
            />
            <polygon points="22,14 30,22 22,30 14,22"
              fill="none" stroke="url(#hub-g)" strokeWidth="1.3" opacity="0.9"
            />
            <polygon points="22,17 27,22 22,27 17,22" fill="url(#hub-g)" />
            <circle cx="22" cy="22" r="1.8" fill="#050402" opacity="0.6" />
          </svg>

          {/* Title */}
          <div>
            <p style={{
              color: "#C9A84C", fontSize: "0.6rem",
              letterSpacing: "0.42em", textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)", fontWeight: 700,
              margin: "0 0 0.6rem",
            }}>
              Interactive Sales Deck
            </p>
            <h1 style={{
              color: "#ffffff",
              fontSize: "clamp(1.8rem, 4vw, 3.5rem)",
              fontWeight: 800,
              fontFamily: "var(--font-montserrat)",
              lineHeight: 1, margin: "0 0 0.25rem",
            }}>
              Mall of<br />America
            </h1>
            <p style={{
              color: "rgba(201,168,76,0.55)", fontSize: "0.62rem",
              letterSpacing: "0.26em", textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)", fontWeight: 600, margin: 0,
            }}>
              Bloomington · Minnesota
            </p>
          </div>

          {/* Divider */}
          <div style={{
            width: "44px", height: "1px",
            background: "linear-gradient(to right, #C9A84C, transparent)",
          }} />

          {/* Description */}
          <p style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "clamp(0.72rem, 1.1vw, 0.85rem)",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 400, lineHeight: 1.75,
            margin: 0, maxWidth: "340px",
          }}>
            America&apos;s most iconic retail destination — 40M+ visitors,
            520+ brands, and world-class entertainment under one roof.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "1.8rem", flexWrap: "wrap" }}>
            {[
              { val: "40M+", label: "Annual Visitors" },
              { val: "520+", label: "Stores" },
              { val: "#1",   label: "US Mall" },
            ].map(s => (
              <div key={s.label}>
                <div style={{
                  color: "#C9A84C",
                  fontSize: "clamp(1.1rem, 1.8vw, 1.4rem)",
                  fontWeight: 800,
                  fontFamily: "var(--font-montserrat)", lineHeight: 1,
                }}>
                  {s.val}
                </div>
                <div style={{
                  color: "rgba(255,255,255,0.3)", fontSize: "0.55rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)", fontWeight: 600,
                  marginTop: "0.18rem",
                }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Chapter menu */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <p style={{
            color: "rgba(255,255,255,0.2)", fontSize: "0.55rem",
            letterSpacing: "0.35em", textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)", fontWeight: 600,
            margin: "0 0 1rem",
          }}>
            Explore
          </p>

          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => onEnterDeck(i)}
              className="hub-row"
              style={{
                display: "flex", alignItems: "center", gap: "1rem",
                background: "transparent", border: "none",
                borderTop: "1px solid rgba(201,168,76,0.08)",
                padding: "0.85rem 0",
                cursor: "pointer", textAlign: "left", width: "100%",
                transition: "padding-left 0.18s ease, border-color 0.18s ease",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget;
                el.style.paddingLeft = "0.5rem";
                el.style.borderTopColor = "rgba(201,168,76,0.28)";
                const num = el.querySelector(".h-num") as HTMLElement;
                const lbl = el.querySelector(".h-lbl") as HTMLElement;
                const arr = el.querySelector(".h-arr") as HTMLElement;
                if (num) num.style.color = "#C9A84C";
                if (lbl) lbl.style.color = "#ffffff";
                if (arr) arr.style.opacity = "1";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                el.style.paddingLeft = "0";
                el.style.borderTopColor = "rgba(201,168,76,0.08)";
                const num = el.querySelector(".h-num") as HTMLElement;
                const lbl = el.querySelector(".h-lbl") as HTMLElement;
                const arr = el.querySelector(".h-arr") as HTMLElement;
                if (num) num.style.color = "rgba(201,168,76,0.38)";
                if (lbl) lbl.style.color = "rgba(255,255,255,0.52)";
                if (arr) arr.style.opacity = "0";
              }}
            >
              <span className="h-num" style={{
                color: "rgba(201,168,76,0.38)", fontSize: "0.58rem",
                fontWeight: 700, letterSpacing: "0.16em",
                fontFamily: "var(--font-montserrat)",
                width: "24px", flexShrink: 0,
                transition: "color 0.18s ease",
              }}>
                {slide.chapter}
              </span>
              <span className="h-lbl" style={{
                color: "rgba(255,255,255,0.52)",
                fontSize: "clamp(0.78rem, 1.3vw, 0.95rem)",
                fontWeight: 700, letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)",
                transition: "color 0.18s ease", flexGrow: 1,
              }}>
                {slide.label}
              </span>
              <span className="h-arr" style={{
                color: "#C9A84C", fontSize: "0.95rem",
                opacity: 0, transition: "opacity 0.18s ease",
              }}>
                →
              </span>
            </button>
          ))}

          <div style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }} />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hub-grid {
            grid-template-columns: 1fr !important;
            padding: 2rem 1.5rem !important;
            gap: 2rem !important;
          }
        }
        @media (max-width: 480px) {
          .hub-row { padding-top: 0.7rem !important; padding-bottom: 0.7rem !important; }
        }
      `}</style>
    </div>
  );
}