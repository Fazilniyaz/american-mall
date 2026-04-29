"use client";

import { useCallback, useEffect, useRef } from "react";
import { useScroller } from "@/components/ScrollerContext";

// ── Lazy GSAP loader ─────────────────────────────────────────────────────────────
type GsapType = typeof import("gsap")["default"];
type ScrollTriggerType = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];

let _gsap: GsapType | null = null;
let _ST: ScrollTriggerType | null = null;

const loadGsap = async () => {
  if (_gsap && _ST) return { gsap: _gsap, ScrollTrigger: _ST };
  const [gsapMod, stMod] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  _gsap = gsapMod.default;
  _ST = stMod.ScrollTrigger;
  _gsap.registerPlugin(_ST);
  return { gsap: _gsap, ScrollTrigger: _ST };
};

// ── Three action paths ───────────────────────────────────────────────────────
const PATHS = [
  {
    number: "01",
    title: "Lease a Space",
    sub: "Find your flagship location",
    body: "520+ stores. Room for one more iconic brand. From luxury flagships to pop-up concepts — find the space that fits your ambition.",
    arrow: "→",
  },
  {
    number: "02",
    title: "Host an Event",
    sub: "Book your brand moment",
    body: "300+ events a year. 40 million witnesses. Whether it's a product launch or a global convention — this is the stage.",
    arrow: "→",
  },
  {
    number: "03",
    title: "Become a Sponsor",
    sub: "Own your audience",
    body: "No platform delivers more impressions. Platinum, Gold, or Partner — own a zone, own a moment, own a conversation.",
    arrow: "→",
  },
];

type ActionTone = "mail" | "download";

type DeckAction = {
  label: string;
  description: string;
  href?: string;
  tone: ActionTone;
};

const ACTIONS: DeckAction[] = [
  {
    label: "Schedule a Call",
    description: "Open a direct line to the commercial team.",
    href: "mailto:medi@liat.ai?subject=Mall%20of%20America%20Deck%20-%20Schedule%20a%20Call",
    tone: "mail",
  },
  {
    label: "Download Deck",
    description: "Save a printable summary of the presentation.",
    tone: "download",
  },
  {
    label: "Book a Meeting",
    description: "Send a note to lock in next steps.",
    href: "mailto:medi@liat.ai?subject=Mall%20of%20America%20Deck%20-%20Book%20a%20Meeting",
    tone: "mail",
  },
];

function DeckActionButton({
  label,
  description,
  href,
  tone,
  onClick,
}: {
  label: string;
  description: string;
  href?: string;
  tone: ActionTone;
  onClick?: () => void;
}) {
  const sharedStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "0.55rem",
    width: "100%",
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(201,168,76,0.18)",
    padding: "1.2rem 1.15rem",
    color: "#fff",
    textAlign: "left",
    textDecoration: "none",
    cursor: "pointer",
    transition: "transform 0.18s ease, border-color 0.18s ease, background 0.18s ease",
  };

  const inner = (
    <>
      <span style={{
        color: "#C9A84C",
        fontSize: "0.62rem",
        fontWeight: 700,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        fontFamily: "var(--font-montserrat)",
      }}>
        {label}
      </span>
      <span style={{
        color: "rgba(255,255,255,0.5)",
        fontSize: "0.76rem",
        fontFamily: "var(--font-montserrat)",
        lineHeight: 1.6,
      }}>
        {description}
      </span>
      <span style={{
        color: tone === "download" ? "#C9A84C" : "rgba(201,168,76,0.8)",
        fontSize: "0.65rem",
        fontWeight: 700,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        fontFamily: "var(--font-montserrat)",
        marginTop: "0.35rem",
      }}>
        {tone === "download" ? "Print to PDF" : "Open email"}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        style={sharedStyle}
        onMouseEnter={e => {
          e.currentTarget.style.background = "rgba(201,168,76,0.05)";
          e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = "rgba(255,255,255,0.02)";
          e.currentTarget.style.borderColor = "rgba(201,168,76,0.18)";
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      style={sharedStyle}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(201,168,76,0.05)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.02)";
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.18)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {inner}
    </button>
  );
}

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerEl = useScroller();

  const handleDownloadDeck = useCallback(() => {
    const summary = [
      "Mall of America Interactive Sales Deck",
      "",
      "Primary business goals:",
      "- Retail leasing",
      "- Sponsorship and partnerships",
      "- Event bookings",
      "",
      "Sections:",
      "- Intro",
      "- Scale",
      "- Who's Here",
      "- Mall Map",
      "- Entertainment",
      "- Events",
      "- Sponsorship",
      "",
      "Prepared for a live pitch or standalone review link.",
    ].join("\n");

    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "mall-of-america-interactive-sales-deck.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      if (cancelled || !sectionRef.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".cta-heading",
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power2.out",
            scrollTrigger: { trigger: ".cta-heading", start: "top 85%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
          }
        );
        gsap.fromTo(
          ".cta-path-card",
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
            ease: "power2.out",
            stagger: 0.14,
            scrollTrigger: { trigger: ".cta-paths-grid", start: "top 82%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
          }
        );
        gsap.fromTo(
          ".cta-action-button",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            stagger: 0.12,
            scrollTrigger: { trigger: ".cta-actions-grid", start: "top 82%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
          }
        );
        gsap.fromTo(
          ".cta-watermark",
          { opacity: 0 },
          {
            opacity: 1,
            duration: 1.4,
            ease: "power2.out",
            scrollTrigger: { trigger: ".cta-watermark", start: "top 90%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
          }
        );
      }, sectionRef);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [scrollerEl]);

  return (
    <section
      id="cta"
      ref={sectionRef}
      style={{
        background: "#050402",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          height: "1px",
          background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "800px",
          height: "800px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,168,76,0.055) 0%, transparent 68%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="cta-heading"
        style={{ textAlign: "center", padding: "5rem 1.5rem 4rem", position: "relative", zIndex: 1 }}
      >
        <p
          style={{
            color: "#C9A84C",
            fontSize: "0.7rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 600,
            margin: "0 0 0.8rem",
          }}
        >
          You&apos;ve seen it all
        </p>
        <h2
          style={{
            color: "#ffffff",
            fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
            fontWeight: 800,
            fontFamily: "var(--font-montserrat)",
            margin: "0 0 1rem",
            lineHeight: 1.1,
          }}
        >
          Now make<br />
          <span style={{ color: "#C9A84C" }}>your move.</span>
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.38)",
            fontSize: "0.82rem",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 400,
            margin: "0 auto",
            maxWidth: "400px",
            lineHeight: 1.7,
          }}
        >
          40 million visitors a year. 520+ brands. The most visited mall in America.
          Your place is waiting.
        </p>
      </div>

      <div
        style={{
          padding: "0 clamp(1.2rem, 4vw, 4rem) 5rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div className="cta-paths-grid">
          {PATHS.map(path => (
            <div
              key={path.number}
              className="cta-path-card"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(201,168,76,0.12)",
                padding: "2.2rem 1.8rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                cursor: "default",
                transition: "border-color 0.25s ease, background 0.25s ease",
                position: "relative",
                overflow: "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.42)";
                e.currentTarget.style.background = "rgba(201,168,76,0.04)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.12)";
                e.currentTarget.style.background = "rgba(255,255,255,0.02)";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: "1rem",
                  top: "1rem",
                  color: "rgba(201,168,76,0.06)",
                  fontSize: "5.5rem",
                  fontWeight: 800,
                  fontFamily: "var(--font-montserrat)",
                  lineHeight: 1,
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              >
                {path.number}
              </div>

              <div
                style={{
                  color: "#C9A84C",
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.3em",
                  fontFamily: "var(--font-montserrat)",
                  opacity: 0.65,
                }}
              >
                {path.number}
              </div>

              <h3
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(1.1rem, 1.8vw, 1.35rem)",
                  fontWeight: 800,
                  fontFamily: "var(--font-montserrat)",
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {path.title}
              </h3>

              <p
                style={{
                  color: "#C9A84C",
                  fontSize: "0.68rem",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  margin: 0,
                  opacity: 0.75,
                }}
              >
                {path.sub}
              </p>

              <p
                style={{
                  color: "rgba(255,255,255,0.45)",
                  fontSize: "0.76rem",
                  fontFamily: "var(--font-montserrat)",
                  fontWeight: 400,
                  lineHeight: 1.7,
                  margin: 0,
                  flexGrow: 1,
                }}
              >
                {path.body}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  paddingTop: "1rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  color: "#C9A84C",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)",
                  cursor: "default",
                }}
              >
                Final option
                <span style={{ fontSize: "0.9rem", marginTop: "1px" }}>{path.arrow}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="cta-actions-grid"
        style={{
          padding: "0 clamp(1.2rem, 4vw, 4rem) 5rem",
          position: "relative",
          zIndex: 1,
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <p
          style={{
            color: "rgba(255,255,255,0.22)",
            fontSize: "0.58rem",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 600,
            margin: "0 0 1.2rem",
          }}
        >
          Final actions
        </p>

        <div
          className="cta-action-cards"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "1rem",
          }}
        >
          {ACTIONS.map(action => (
            <div key={action.label} className="cta-action-button">
              <DeckActionButton
                label={action.label}
                description={action.description}
                href={action.href}
                tone={action.tone}
                onClick={action.tone === "download" ? handleDownloadDeck : undefined}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="cta-watermark"
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "3rem 1.5rem 5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.5rem",
          borderTop: "1px solid rgba(201,168,76,0.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "rgba(201,168,76,0.03)",
            fontSize: "clamp(4rem, 14vw, 10rem)",
            fontWeight: 800,
            fontFamily: "var(--font-montserrat)",
            letterSpacing: "0.05em",
            userSelect: "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            lineHeight: 1,
          }}
        >
          MALL OF AMERICA
        </div>

        <svg viewBox="0 0 44 44" width="36" height="36" aria-hidden="true" style={{ opacity: 0.55 }}>
          <defs>
            <linearGradient id="cta-g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F0D988" />
              <stop offset="50%" stopColor="#C9A84C" />
              <stop offset="100%" stopColor="#8A6820" />
            </linearGradient>
          </defs>
          <circle cx="22" cy="22" r="14" fill="none" stroke="url(#cta-g1)" strokeWidth="1" opacity="0.6" />
          <polygon points="22,14 30,22 22,30 14,22" fill="none" stroke="url(#cta-g1)" strokeWidth="1.3" opacity="0.9" />
          <polygon points="22,17 27,22 22,27 17,22" fill="url(#cta-g1)" />
          <circle cx="22" cy="22" r="1.8" fill="#050402" opacity="0.6" />
        </svg>

        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "#C9A84C",
              fontSize: "0.75rem",
              fontWeight: 800,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)",
              margin: "0 0 0.15rem",
              lineHeight: 1,
            }}
          >
            Mall of America
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.18)",
              fontSize: "0.5rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Bloomington · Minnesota
          </p>
        </div>

        <p
          style={{
            color: "rgba(255,255,255,0.12)",
            fontSize: "0.55rem",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 400,
            margin: 0,
            letterSpacing: "0.06em",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Mall of America · All commercial enquiries treated in strict confidence
        </p>
      </div>

      <style>{`
        .cta-paths-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(201,168,76,0.07);
          border: 1px solid rgba(201,168,76,0.07);
        }

        @media (min-width: 640px) {
          .cta-paths-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .cta-action-cards {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 760px) {
          .cta-action-cards {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </section>
  );
}
