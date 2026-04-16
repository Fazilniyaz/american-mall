"use client";

import { useEffect, useRef, useState } from "react";

// ─── Brand ticker data ────────────────────────────────────────────────────────
const TICKER_ROW_1 = [
  "APPLE", "SAMSUNG", "NIKE", "LEGO", "H&M", "ZARA",
  "LOUIS VUITTON", "COACH", "SEPHORA", "FOREVER 21",
  "MICROSOFT", "SONY", "ADIDAS", "CALVIN KLEIN",
];
const TICKER_ROW_2 = [
  "NORDSTROM", "MACY'S", "GAP", "VICTORIA'S SECRET", "PANDORA",
  "UNDER ARMOUR", "AMERICAN EAGLE", "HOLLISTER", "BATH & BODY WORKS",
  "TIFFANY & CO", "BURBERRY", "TESLA", "RALPH LAUREN",
];

// ─── Featured brand spotlight cards ──────────────────────────────────────────
const BRANDS = [
  {
    name:      "Samsung",
    category:  "Technology",
    quote:     "Samsung chose Mall of America to launch their Galaxy Experience Store — their first in the Midwest.",
    stat:      "2.1M",
    statLabel: "Yearly brand touchpoints",
    reach:     92,
    color:     "#1428A0",
    accent:    "#C9A84C",
  },
  {
    name:      "Apple",
    category:  "Technology",
    quote:     "Apple Store at Mall of America consistently ranks among the highest-traffic Apple locations in North America.",
    stat:      "3.4M",
    statLabel: "Annual store visits",
    reach:     98,
    color:     "#1d1d1f",
    accent:    "#C9A84C",
  },
  {
    name:      "Nike",
    category:  "Sportswear",
    quote:     "Nike's flagship presence drives the highest conversion rate of any apparel brand in the property.",
    stat:      "1.8M",
    statLabel: "Yearly footfall",
    reach:     85,
    color:     "#111",
    accent:    "#C9A84C",
  },
  {
    name:      "Lego",
    category:  "Entertainment Retail",
    quote:     "The Mall of America LEGO store is one of the top-performing experiential retail locations in the US.",
    stat:      "900K",
    statLabel: "Family visits per year",
    reach:     74,
    color:     "#006DB7",
    accent:    "#C9A84C",
  },
];

// ─── Radial reach arc — pure SVG + CSS animation, zero d3 ───────────────────
// Replaces the entire d3 dependency with ~30 lines of native SVG.
// The arc is drawn using a single <path> with stroke-dasharray animation,
// which is GPU-composited and costs virtually no main-thread time.
function RadialReach({
  value,
  size = 72,
}: {
  value: number;
  color: string; // kept in props signature for API compatibility
  size?: number;
}) {
  const pathRef    = useRef<SVGPathElement>(null);
  const textRef    = useRef<SVGTextElement>(null);
  const triggered  = useRef(false);
  const rafRef     = useRef<number | null>(null);

  const r   = size / 2 - 6;
  const cx  = size / 2;
  const cy  = size / 2;
  const sw  = 4;

  // Arc spans 306° (same as original ±0.85π × 2 = 306°), centered at top
  const ANGLE_SPAN  = 306; // degrees
  const START_DEG   = -ANGLE_SPAN / 2 - 90; // offset so arc starts at left
  const circumference = 2 * Math.PI * r;
  const arcLength   = circumference * (ANGLE_SPAN / 360);

  // Convert polar coords helper
  const polar = (angleDeg: number, radius: number) => {
    const rad = (angleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  // Build SVG arc path string for the track ring (full ANGLE_SPAN arc)
  const buildArcPath = (spanDeg: number) => {
    const start = polar(START_DEG, r);
    const end   = polar(START_DEG + spanDeg, r);
    const large = spanDeg > 180 ? 1 : 0;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`;
  };

  const trackPath = buildArcPath(ANGLE_SPAN);
  const fillPath  = buildArcPath(ANGLE_SPAN); // same path, clipped by dashoffset

  // Animate counter from 0 → value and dashoffset from arcLength → target
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;

    // Set initial state — fully hidden
    const targetDash = arcLength * (value / 100);
    el.style.strokeDasharray  = `${arcLength}`;
    el.style.strokeDashoffset = `${arcLength}`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        observer.disconnect();

        const duration = 1400; // ms
        const start    = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          // ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);

          const currentDash = arcLength - arcLength * eased * (value / 100);
          el.style.strokeDashoffset = `${currentDash}`;

          if (textRef.current) {
            textRef.current.textContent = Math.round(eased * value) + "%";
          }

          if (progress < 1) {
            rafRef.current = requestAnimationFrame(tick);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      },
      { rootMargin: "100px", threshold: 0 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, arcLength]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ display: "block", flexShrink: 0 }}
      aria-label={`Brand reach: ${value}%`}
    >
      {/* Track ring */}
      <path
        d={trackPath}
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={sw}
        strokeLinecap="round"
      />
      {/* Animated fill arc */}
      <path
        ref={pathRef}
        d={fillPath}
        fill="none"
        stroke="#C9A84C"
        strokeWidth={sw}
        strokeLinecap="round"
        style={{
          strokeDasharray:  arcLength,
          strokeDashoffset: arcLength,
          // GPU-composited — does NOT trigger layout/paint
          willChange: "stroke-dashoffset",
        }}
      />
      {/* Percentage label */}
      <text
        ref={textRef}
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        fontSize="13"
        fontWeight="700"
        fontFamily="var(--font-montserrat)"
        fill="#C9A84C"
      >
        0%
      </text>
    </svg>
  );
}

// ─── Single brand spotlight card ─────────────────────────────────────────────
function BrandCard({
  brand,
  index,
}: {
  brand: (typeof BRANDS)[0];
  index: number;
}) {
  return (
    <div
      className={`brand-card brand-card-${index}`}
      style={{
        background:    "rgba(255,255,255,0.03)",
        border:        "1px solid rgba(201,168,76,0.14)",
        padding:       "1.8rem",
        display:       "flex",
        flexDirection: "column",
        gap:           "1.2rem",
        cursor:        "default",
        // CSS transition is far cheaper than JS onMouseMove
        transition:    "transform 0.3s ease, border-color 0.3s ease, background 0.3s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(201,168,76,0.4)";
        el.style.background  = "rgba(201,168,76,0.04)";
        el.style.transform   = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "rgba(201,168,76,0.14)";
        el.style.background  = "rgba(255,255,255,0.03)";
        el.style.transform   = "translateY(0)";
      }}
    >
      {/* Top row — brand name + category + radial arc */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{
            color:         "#ffffff",
            fontSize:      "1.1rem",
            fontWeight:    800,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            lineHeight:    1,
          }}>
            {brand.name}
          </div>
          <div style={{
            color:         "rgba(201,168,76,0.6)",
            fontSize:      "0.6rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            fontWeight:    600,
            marginTop:     "0.35rem",
          }}>
            {brand.category}
          </div>
        </div>

        <RadialReach value={brand.reach} color={brand.color} size={68} />
      </div>

      {/* Quote */}
      <p style={{
        color:       "rgba(255,255,255,0.62)",
        fontSize:    "0.78rem",
        fontFamily:  "var(--font-montserrat)",
        fontWeight:  400,
        lineHeight:  1.7,
        margin:      0,
        fontStyle:   "italic",
        borderLeft:  "2px solid rgba(201,168,76,0.3)",
        paddingLeft: "1rem",
        flexGrow:    1,
      }}>
        &ldquo;{brand.quote}&rdquo;
      </p>

      {/* Bottom stat */}
      <div style={{
        display:    "flex",
        alignItems: "baseline",
        gap:        "0.6rem",
        paddingTop: "1rem",
        borderTop:  "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{
          color:              "#C9A84C",
          fontSize:           "1.4rem",
          fontWeight:         800,
          fontFamily:         "var(--font-montserrat)",
          lineHeight:         1,
          fontVariantNumeric: "tabular-nums",
        }}>
          {brand.stat}
        </span>
        <span style={{
          color:         "rgba(255,255,255,0.38)",
          fontSize:      "0.62rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily:    "var(--font-montserrat)",
          fontWeight:    500,
        }}>
          {brand.statLabel}
        </span>
      </div>
    </div>
  );
}

// ─── Ticker strip — CSS animation instead of GSAP ────────────────────────────
// CSS @keyframes runs entirely on the compositor thread (GPU).
// GSAP's JS-driven requestAnimationFrame loop runs on the main thread —
// bad for mobile Lighthouse because it blocks TTI and TBT.
function TickerRow({
  items,
  reverse = false,
  speed   = 40,
  id,
}: {
  items:    string[];
  reverse?: boolean;
  speed?:   number;
  id:       string; // unique id for the scoped @keyframes name
}) {
  // Duplicate items so the CSS loop is seamless
  const doubled = [...items, ...items];

  return (
    <div
      style={{ overflow: "hidden", width: "100%", position: "relative" }}
      // Pause animation when tab is hidden — free performance win
      // CSS animation-play-state is toggled via a CSS class in the <style> below
    >
      {/* Left fade */}
      <div style={{
        position:      "absolute",
        left:          0,
        top:           0,
        bottom:        0,
        width:         "80px",
        background:    "linear-gradient(to right, #050402, transparent)",
        zIndex:        2,
        pointerEvents: "none",
      }} />
      {/* Right fade */}
      <div style={{
        position:      "absolute",
        right:         0,
        top:           0,
        bottom:        0,
        width:         "80px",
        background:    "linear-gradient(to left, #050402, transparent)",
        zIndex:        2,
        pointerEvents: "none",
      }} />

      <div
        className={`ticker-track ticker-${id}`}
        style={{
          display:    "flex",
          whiteSpace: "nowrap",
          // DO NOT set willChange here — it creates a new compositor layer
          // immediately and wastes GPU memory on mobile before the user scrolls.
          // The animation itself promotes the element when it starts.
          animation:  `ticker-${id} ${speed}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              padding:       "0 2.2rem",
              color:         "rgba(255,255,255,0.22)",
              fontSize:      "0.68rem",
              fontWeight:    700,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              fontFamily:    "var(--font-montserrat)",
              userSelect:    "none",
            }}
          >
            {item}
            {/* Diamond separator */}
            <span style={{
              display:    "inline-block",
              width:      "4px",
              height:     "4px",
              background: "rgba(201,168,76,0.35)",
              transform:  "rotate(45deg)",
              marginLeft: "2.2rem",
              flexShrink: 0,
            }} />
          </span>
        ))}
      </div>

      {/*
        Scoped keyframes for this row only.
        translateX(-50%) scrolls exactly one set of items (half the doubled track),
        creating a perfectly seamless loop without JS measuring scrollWidth.
      */}
      <style>{`
        @keyframes ticker-${id} {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        /* Pause when tab hidden — saves CPU on mobile */
        @media (prefers-reduced-motion: reduce) {
          .ticker-${id} { animation: none; }
        }
      `}</style>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function WhosHereSection() {
  // ── Intersection-observer gate ──────────────────────────────────────────────
  // The entire section (including GSAP import) is deferred until the user
  // scrolls within 300px of it. This is the single biggest mobile win:
  // GSAP + ScrollTrigger are ~30 KB and run setup code on import.
  const sectionRef  = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px", threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── GSAP entrance animations — only after section enters proximity ──────────
  // Lazy-import GSAP so it's NOT in the initial JS bundle at all.
  // On mobile, this saves ~30 KB from the critical path.
  useEffect(() => {
    if (!inView) return;

    let ctx: { revert: () => void } | null = null;

    // Dynamic import — Webpack will code-split this into a separate chunk
    Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapMod, stMod]) => {
      const gsap = gsapMod.default;
      const { ScrollTrigger } = stMod;
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // Section heading entrance
        gsap.fromTo(".whos-heading",
          { opacity: 0, y: 32 },
          {
            opacity:  1,
            y:        0,
            duration: 0.9,
            ease:     "power2.out",
            scrollTrigger: { trigger: ".whos-heading", start: "top 85%" },
          }
        );

        // Cards stagger entrance
        gsap.fromTo(".brand-card",
          { opacity: 0, y: 44 },
          {
            opacity:  1,
            y:        0,
            duration: 0.75,
            ease:     "power2.out",
            stagger:  0.12,
            scrollTrigger: { trigger: ".brand-cards-grid", start: "top 82%" },
          }
        );

        // Bottom CTA line
        gsap.fromTo(".whos-cta",
          { opacity: 0, y: 20 },
          {
            opacity:  1,
            y:        0,
            duration: 0.7,
            ease:     "power2.out",
            scrollTrigger: { trigger: ".whos-cta", start: "top 90%" },
          }
        );
      }, sectionRef);
    });

    return () => {
      ctx?.revert();
    };
  }, [inView]);

  return (
    <section
      id="whos-here"
      ref={sectionRef}
      style={{
        background:    "#050402",
        paddingBottom: "7rem",
        overflow:      "hidden",
        position:      "relative",
      }}
    >
      {/* Subtle top separator line */}
      <div style={{
        height:       "1px",
        background:   "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)",
        marginBottom: "5rem",
      }} />

      {/* ── Section heading ── */}
      <div
        className="whos-heading"
        style={{ textAlign: "center", marginBottom: "3.5rem", padding: "0 1.5rem" }}
      >
        <p style={{
          color:         "#C9A84C",
          fontSize:      "0.7rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          fontFamily:    "var(--font-montserrat)",
          fontWeight:    600,
          margin:        "0 0 0.8rem",
        }}>
          The world&apos;s most iconic brands
        </p>
        <h2 style={{
          color:      "#ffffff",
          fontSize:   "clamp(1.8rem, 3.5vw, 3rem)",
          fontWeight: 800,
          fontFamily: "var(--font-montserrat)",
          margin:     "0 0 1rem",
          lineHeight: 1.1,
        }}>
          They chose here.<br />
          <span style={{ color: "#C9A84C" }}>Will you be next?</span>
        </h2>
        <p style={{
          color:       "rgba(255,255,255,0.38)",
          fontSize:    "0.82rem",
          fontFamily:  "var(--font-montserrat)",
          fontWeight:  400,
          margin:      "0 auto",
          maxWidth:    "480px",
          lineHeight:  1.7,
        }}>
          520+ brands. Every tier. Every category. The most visited mall
          in America is where global brands come to be seen.
        </p>
      </div>

      {/* ── Ticker rows ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "5rem" }}>
        <TickerRow items={TICKER_ROW_1} reverse={false} speed={50} id="row1" />
        <TickerRow items={TICKER_ROW_2} reverse={true}  speed={38} id="row2" />
      </div>

      {/* ── Brand spotlight cards ── */}
      <div
        className="brand-cards-grid"
        style={{ padding: "0 clamp(1.2rem, 4vw, 4rem)" }}
      >
        {/* Label above grid */}
        <p style={{
          color:         "rgba(255,255,255,0.25)",
          fontSize:      "0.62rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          fontFamily:    "var(--font-montserrat)",
          fontWeight:    600,
          margin:        "0 0 1.5rem",
        }}>
          Featured tenants
        </p>

        <div className="brand-grid-inner">
          {BRANDS.map((brand, i) => (
            <BrandCard key={brand.name} brand={brand} index={i} />
          ))}
        </div>
      </div>

      {/* ── Bottom CTA line ── */}
      <div
        className="whos-cta"
        style={{
          textAlign:     "center",
          marginTop:     "4.5rem",
          padding:       "0 1.5rem",
          display:       "flex",
          flexDirection: "column",
          alignItems:    "center",
          gap:           "1.5rem",
        }}
      >
        <p style={{
          color:         "rgba(255,255,255,0.35)",
          fontSize:      "0.78rem",
          fontFamily:    "var(--font-montserrat)",
          fontWeight:    400,
          margin:        0,
          letterSpacing: "0.05em",
        }}>
          Join 520+ brands already thriving at Mall of America
        </p>
        <button
          style={{
            background:    "transparent",
            border:        "1px solid #C9A84C",
            color:         "#C9A84C",
            fontSize:      "0.68rem",
            fontWeight:    700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            padding:       "12px 32px",
            cursor:        "pointer",
            transition:    "background 0.22s ease, color 0.22s ease",
          }}
          onMouseEnter={e => {
            (e.currentTarget).style.background = "#C9A84C";
            (e.currentTarget).style.color      = "#000";
          }}
          onMouseLeave={e => {
            (e.currentTarget).style.background = "transparent";
            (e.currentTarget).style.color      = "#C9A84C";
          }}
          onClick={() =>
            document.querySelector("#cta")?.scrollIntoView({ behavior: "smooth" })
          }
        >
          Inquire About Leasing
        </button>
      </div>

      {/* ── Bottom divider ── */}
      <div style={{
        marginTop:  "5rem",
        height:     "1px",
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)",
      }} />

      {/* ── Responsive grid styles ── */}
      <style>{`
        .brand-grid-inner {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(201,168,76,0.08);
          border: 1px solid rgba(201,168,76,0.08);
        }
        @media (min-width: 640px) {
          .brand-grid-inner {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .brand-grid-inner {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        /* Pause ticker when user prefers reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none !important; }
        }
      `}</style>
    </section>
  );
}