"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as d3 from "d3";

gsap.registerPlugin(ScrollTrigger);

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
    name:    "Samsung",
    category: "Technology",
    quote:   "Samsung chose Mall of America to launch their Galaxy Experience Store — their first in the Midwest.",
    stat:    "2.1M",
    statLabel: "Yearly brand touchpoints",
    reach:   92,
    color:   "#1428A0",
    accent:  "#C9A84C",
  },
  {
    name:    "Apple",
    category: "Technology",
    quote:   "Apple Store at Mall of America consistently ranks among the highest-traffic Apple locations in North America.",
    stat:    "3.4M",
    statLabel: "Annual store visits",
    reach:   98,
    color:   "#1d1d1f",
    accent:  "#C9A84C",
  },
  {
    name:    "Nike",
    category: "Sportswear",
    quote:   "Nike's flagship presence drives the highest conversion rate of any apparel brand in the property.",
    stat:    "1.8M",
    statLabel: "Yearly footfall",
    reach:   85,
    color:   "#111",
    accent:  "#C9A84C",
  },
  {
    name:    "Lego",
    category: "Entertainment Retail",
    quote:   "The Mall of America LEGO store is one of the top-performing experiential retail locations in the US.",
    stat:    "900K",
    statLabel: "Family visits per year",
    reach:   74,
    color:   "#006DB7",
    accent:  "#C9A84C",
  },
];

// ─── D3 Radial reach arc drawn into an SVG ref ───────────────────────────────
function RadialReach({
  value,
  color,
  size = 72,
}: {
  value: number;
  color: string;
  size?: number;
}) {
  const svgRef  = useRef<SVGSVGElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const r   = size / 2 - 6;
    const cx  = size / 2;
    const cy  = size / 2;
    const sw  = 4;

    const svg = d3.select(svgRef.current)
      .attr("width",   size)
      .attr("height",  size)
      .attr("viewBox", `0 0 ${size} ${size}`);

    // Track ring
    const arcTrack = d3.arc<unknown>()
      .innerRadius(r - sw / 2)
      .outerRadius(r + sw / 2)
      .startAngle(-Math.PI * 0.85)
      .endAngle(Math.PI * 0.85)
      .cornerRadius(4);

    svg.append("path")
      // @ts-expect-error d3 arc no-datum call
      .attr("d", arcTrack())
      .attr("transform", `translate(${cx},${cy})`)
      .attr("fill", "rgba(255,255,255,0.07)");

    // Fill arc
    const arcFill = d3.arc<unknown>()
      .innerRadius(r - sw / 2)
      .outerRadius(r + sw / 2)
      .startAngle(-Math.PI * 0.85)
      .cornerRadius(4);

    const fillPath = svg.append("path")
      .attr("transform", `translate(${cx},${cy})`)
      .attr("fill", "#C9A84C");

    // Percentage text
    const label = svg.append("text")
      .attr("x", cx)
      .attr("y", cy + 5)
      .attr("text-anchor", "middle")
      .attr("font-size", "13px")
      .attr("font-weight", "700")
      .attr("font-family", "var(--font-montserrat)")
      .attr("fill", "#C9A84C")
      .text("0%");

    // Animate on scroll
    ScrollTrigger.create({
      trigger: svgRef.current,
      start:   "top 88%",
      once:    true,
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;

        const endAngle = -Math.PI * 0.85 + Math.PI * 1.7 * (value / 100);

        gsap.to({ v: 0, a: -Math.PI * 0.85 }, {
          v:        value,
          a:        endAngle,
          duration: 1.5,
          ease:     "power2.out",
          onUpdate: function () {
            const t  = this.targets()[0] as { v: number; a: number };
            // @ts-expect-error d3 arc endAngle
            fillPath.attr("d", arcFill.endAngle(t.a)());
            label.text(Math.round(t.v) + "%");
          },
        });
      },
    });

    return () => {
      ScrollTrigger.getAll()
        .filter(st => st.vars.trigger === svgRef.current)
        .forEach(st => st.kill());
    };
  }, [value, color, size]);

  return (
    <svg
      ref={svgRef}
      style={{ display: "block", flexShrink: 0 }}
      aria-label={`Brand reach: ${value}%`}
    />
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
  const cardRef = useRef<HTMLDivElement>(null);

  // Simple CSS hover effect — no expensive mouse tracking
  // This is much better than onMouseMove which fires 60x per second
  
  return (
    <div
      ref={cardRef}
      className={`brand-card brand-card-${index}`}
      style={{
        background:    "rgba(255,255,255,0.03)",
        border:        "1px solid rgba(201,168,76,0.14)",
        padding:       "1.8rem",
        display:       "flex",
        flexDirection: "column",
        gap:           "1.2rem",
        cursor:        "default",
        transition:    "all 0.3s ease, border-color 0.3s ease, background 0.3s ease",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)";
        (e.currentTarget as HTMLElement).style.background  = "rgba(201,168,76,0.04)";
        (e.currentTarget as HTMLElement).style.transform  = "translateY(-4px)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.14)";
        (e.currentTarget as HTMLElement).style.background  = "rgba(255,255,255,0.03)";
        (e.currentTarget as HTMLElement).style.transform  = "translateY(0)";
      }}
    >
      {/* Top row — brand name + category */}
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

        {/* D3 radial reach */}
        <RadialReach value={brand.reach} color={brand.color} size={68} />
      </div>

      {/* Quote */}
      <p style={{
        color:      "rgba(255,255,255,0.62)",
        fontSize:   "0.78rem",
        fontFamily: "var(--font-montserrat)",
        fontWeight: 400,
        lineHeight: 1.7,
        margin:     0,
        fontStyle:  "italic",
        borderLeft: "2px solid rgba(201,168,76,0.3)",
        paddingLeft:"1rem",
        flexGrow:   1,
      }}>
        &ldquo;{brand.quote}&rdquo;
      </p>

      {/* Bottom stat */}
      <div style={{
        display:       "flex",
        alignItems:    "baseline",
        gap:           "0.6rem",
        paddingTop:    "1rem",
        borderTop:     "1px solid rgba(255,255,255,0.06)",
      }}>
        <span style={{
          color:      "#C9A84C",
          fontSize:   "1.4rem",
          fontWeight: 800,
          fontFamily: "var(--font-montserrat)",
          lineHeight: 1,
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

// ─── Ticker strip (one row) ───────────────────────────────────────────────────
function TickerRow({
  items,
  reverse = false,
  speed   = 40,
}: {
  items:   string[];
  reverse?: boolean;
  speed?:  number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tlRef    = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Total width of one set of items
    const totalW = track.scrollWidth / 2;

    // Start position
    gsap.set(track, { x: reverse ? -totalW : 0 });

    tlRef.current = gsap.to(track, {
      x:        reverse ? 0 : -totalW,
      duration: speed,
      ease:     "none",
      repeat:   -1,
      // Pause when tab hidden — saves CPU
      paused:   document.hidden,
    });

    // Pause/resume on visibility change
    const onVis = () => {
      if (document.hidden) tlRef.current?.pause();
      else tlRef.current?.resume();
    };
    document.addEventListener("visibilitychange", onVis);

    // Slow down on hover
    const onEnter = () => gsap.to(tlRef.current, { timeScale: 0.3, duration: 0.5 });
    const onLeave = () => gsap.to(tlRef.current, { timeScale: 1,   duration: 0.5 });
    track.parentElement?.addEventListener("mouseenter", onEnter);
    track.parentElement?.addEventListener("mouseleave", onLeave);

    return () => {
      tlRef.current?.kill();
      document.removeEventListener("visibilitychange", onVis);
      track.parentElement?.removeEventListener("mouseenter", onEnter);
      track.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, [reverse, speed]);

  // Duplicate items so loop is seamless
  const doubled = [...items, ...items];

  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      {/* Left fade */}
      <div style={{
        position:   "absolute", left: 0, top: 0, bottom: 0, width: "120px",
        background: "linear-gradient(to right, #050402, transparent)",
        zIndex:     2, pointerEvents: "none",
      }} />
      {/* Right fade */}
      <div style={{
        position:   "absolute", right: 0, top: 0, bottom: 0, width: "120px",
        background: "linear-gradient(to left, #050402, transparent)",
        zIndex:     2, pointerEvents: "none",
      }} />

      <div
        ref={trackRef}
        style={{
          display:    "flex",
          gap:        "0",
          whiteSpace: "nowrap",
          willChange: "transform",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "0",
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
              display:     "inline-block",
              width:       "4px",
              height:      "4px",
              background:  "rgba(201,168,76,0.35)",
              transform:   "rotate(45deg)",
              marginLeft:  "2.2rem",
              flexShrink:  0,
            }} />
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function WhosHereSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Section heading entrance
      gsap.fromTo(".whos-heading",
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
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
          opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
          scrollTrigger: { trigger: ".whos-cta", start: "top 90%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="whos-here"
      ref={sectionRef}
      style={{
        background: "#050402",
        paddingBottom: "7rem",
        overflow:   "hidden",
        position:   "relative",
      }}
    >
      {/* Subtle top separator line */}
      <div style={{
        height:     "1px",
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)",
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
          marginBottom:  "0.8rem",
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
          color:      "rgba(255,255,255,0.38)",
          fontSize:   "0.82rem",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 400,
          margin:     0,
          maxWidth:   "480px",
          marginLeft: "auto",
          marginRight:"auto",
          lineHeight: 1.7,
        }}>
          520+ brands. Every tier. Every category. The most visited mall
          in America is where global brands come to be seen.
        </p>
      </div>

      {/* ── Ticker rows ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", marginBottom: "5rem" }}>
        <TickerRow items={TICKER_ROW_1} reverse={false} speed={50} />
        <TickerRow items={TICKER_ROW_2} reverse={true}  speed={38} />
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
          marginBottom:  "1.5rem",
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
          textAlign:  "center",
          marginTop:  "4.5rem",
          padding:    "0 1.5rem",
          display:    "flex",
          flexDirection: "column",
          alignItems: "center",
          gap:        "1.5rem",
        }}
      >
        <p style={{
          color:      "rgba(255,255,255,0.35)",
          fontSize:   "0.78rem",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 400,
          margin:     0,
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

      {/* ── Responsive styles ── */}
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
      `}</style>
    </section>
  );
}