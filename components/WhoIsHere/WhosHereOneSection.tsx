"use client";

import { useEffect, useRef, useState } from "react";

const TICKER_ROW_1 = [
  "APPLE", "SAMSUNG", "NIKE", "LEGO", "H&M", "ZARA",
  "LOUIS VUITTON", "COACH", "SEPHORA", "FOREVER 21",
];
const TICKER_ROW_2 = [
  "NORDSTROM", "MACY'S", "GAP", "VICTORIA'S SECRET", "PANDORA",
  "UNDER ARMOUR", "AMERICAN EAGLE", "BATH & BODY WORKS",
  "TIFFANY & CO", "TESLA", "RALPH LAUREN",
];

const BRANDS = [
  { name: "Samsung", category: "Technology", quote: "Samsung chose Mall of America to launch their Galaxy Experience Store — their first in the Midwest.", stat: "2.1M", statLabel: "Yearly brand touchpoints", reach: 92, color: "#1428A0", image: "/photos/samsung_lauch-opt.webp" },
  { name: "Apple", category: "Technology", quote: "Apple Store at Mall of America consistently ranks among the highest-traffic Apple locations in North America.", stat: "3.4M", statLabel: "Annual store visits", reach: 98, color: "#1d1d1f", image: "/photos/apple_activation-opt.webp" },
  { name: "Nike", category: "Sportswear", quote: "Nike's flagship presence drives the highest conversion rate of any apparel brand in the property.", stat: "1.8M", statLabel: "Yearly footfall", reach: 85, color: "#111", image: "/photos/nike_activation-opt.webp" },
  { name: "Lego", category: "Entertainment Retail", quote: "The Mall of America LEGO store is one of the top-performing experiential retail locations in the US.", stat: "900K", statLabel: "Family visits per year", reach: 74, color: "#006DB7", image: "/photos/lego_activation-opt.webp" },
];

// ─── Radial reach arc ────────────────────────────────────────────────
function RadialReach({ value, size = 56 }: { value: number; color: string; size?: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const triggered = useRef(false);
  const rafRef = useRef<number | null>(null);
  const r = size / 2 - 5, cx = size / 2, cy = size / 2, sw = 3;
  const ANGLE_SPAN = 306, START_DEG = -ANGLE_SPAN / 2 - 90;
  const circumference = 2 * Math.PI * r;
  const arcLength = circumference * (ANGLE_SPAN / 360);
  const polar = (deg: number, rad: number) => ({ x: cx + rad * Math.cos((deg * Math.PI) / 180), y: cy + rad * Math.sin((deg * Math.PI) / 180) });
  const buildArc = (span: number) => { const s = polar(START_DEG, r), e = polar(START_DEG + span, r); return `M ${s.x} ${s.y} A ${r} ${r} 0 ${span > 180 ? 1 : 0} 1 ${e.x} ${e.y}`; };
  const trackPath = buildArc(ANGLE_SPAN), fillPath = buildArc(ANGLE_SPAN);

  useEffect(() => {
    const el = pathRef.current; if (!el) return;
    el.style.strokeDasharray = `${arcLength}`; el.style.strokeDashoffset = `${arcLength}`;
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || triggered.current) return;
      triggered.current = true; obs.disconnect();
      const dur = 1400, start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.style.strokeDashoffset = `${arcLength - arcLength * e * (value / 100)}`;
        if (textRef.current) textRef.current.textContent = Math.round(e * value) + "%";
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, { rootMargin: "100px", threshold: 0 });
    obs.observe(el);
    return () => { obs.disconnect(); if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, [value, arcLength]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block", flexShrink: 0 }}>
      <path d={trackPath} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={sw} strokeLinecap="round" />
      <path ref={pathRef} d={fillPath} fill="none" stroke="#C9A84C" strokeWidth={sw} strokeLinecap="round" style={{ strokeDasharray: arcLength, strokeDashoffset: arcLength, willChange: "stroke-dashoffset" }} />
      <text ref={textRef} x={cx} y={cy + 4} textAnchor="middle" fontSize="10" fontWeight="700" fontFamily="var(--font-montserrat)" fill="#C9A84C">0%</text>
    </svg>
  );
}

// ─── Brand card ─────────────────────────────────────────────────────
function BrandCard({ brand, index }: { brand: typeof BRANDS[0]; index: number }) {
  return (
    <div className={`wh1-brand-card wh1-brand-card-${index}`} style={{
      background: "rgba(255,255,255,0.03)", border: "1px solid rgba(201,168,76,0.14)",
      padding: "clamp(1rem,1.8vh,1.4rem) clamp(1rem,1.5vw,1.4rem)",
      display: "flex", flexDirection: "column", gap: "clamp(0.5rem,1vh,0.8rem)",
      cursor: "default", transition: "transform 0.3s ease, border-color 0.3s ease, background 0.3s ease",
      opacity: 0,
    }}
      onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "rgba(201,168,76,0.4)"; el.style.background = "rgba(201,168,76,0.04)"; el.style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "rgba(201,168,76,0.14)"; el.style.background = "rgba(255,255,255,0.03)"; el.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ color: "#ffffff", fontSize: "clamp(0.85rem,1.2vw,1rem)", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", lineHeight: 1 }}>{brand.name}</div>
          <div style={{ color: "rgba(201,168,76,0.6)", fontSize: "clamp(0.48rem,0.7vw,0.55rem)", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, marginTop: "0.25rem" }}>{brand.category}</div>
        </div>
        <RadialReach value={brand.reach} color={brand.color} size={56} />
      </div>
      {brand.image && (
        <div className="wh1-desktop-img" style={{ position: "relative", width: "100%", flexGrow: 1, minHeight: "80px", borderRadius: "4px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }}>
          <img src={brand.image} alt={brand.name} loading={index < 2 ? "eager" : "lazy"} fetchPriority={index === 0 ? "high" : "auto"} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,4,2,0.8), transparent)" }} />
          <p style={{ position: "absolute", bottom: "0.5rem", left: "0.5rem", right: "0.5rem", color: "rgba(255,255,255,0.8)", fontSize: "clamp(0.55rem,0.7vw,0.65rem)", fontFamily: "var(--font-montserrat)", fontWeight: 500, lineHeight: 1.4, margin: 0, fontStyle: "italic", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            &ldquo;{brand.quote}&rdquo;
          </p>
        </div>
      )}
      <p className={brand.image ? "wh1-mobile-quote" : ""} style={{ color: "rgba(255,255,255,0.55)", fontSize: "clamp(0.62rem,0.85vw,0.72rem)", fontFamily: "var(--font-montserrat)", fontWeight: 400, lineHeight: 1.6, margin: 0, fontStyle: "italic", borderLeft: "2px solid rgba(201,168,76,0.3)", paddingLeft: "0.8rem", flexGrow: 1 }}>
        &ldquo;{brand.quote}&rdquo;
      </p>
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", paddingTop: "clamp(0.4rem,0.8vh,0.7rem)", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <span style={{ color: "#C9A84C", fontSize: "clamp(1rem,1.5vw,1.2rem)", fontWeight: 800, fontFamily: "var(--font-montserrat)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{brand.stat}</span>
        <span style={{ color: "rgba(255,255,255,0.38)", fontSize: "clamp(0.5rem,0.7vw,0.58rem)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 500 }}>{brand.statLabel}</span>
      </div>
    </div>
  );
}

// ─── Ticker strip ───────────────────────────────────────────────────
function TickerRow({ items, reverse = false, speed = 40, id }: { items: string[]; reverse?: boolean; speed?: number; id: string }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to right, #050402, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "80px", background: "linear-gradient(to left, #050402, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div className={`wh1-ticker-track wh1-ticker-${id}`} style={{ display: "flex", whiteSpace: "nowrap", animation: `wh1-ticker-${id} ${speed}s linear infinite`, animationDirection: reverse ? "reverse" : "normal" }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", padding: "0 2.2rem", color: "rgba(255,255,255,0.22)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", userSelect: "none" }}>
            {item}
            <span style={{ display: "inline-block", width: "4px", height: "4px", background: "rgba(201,168,76,0.35)", transform: "rotate(45deg)", marginLeft: "2.2rem", flexShrink: 0 }} />
          </span>
        ))}
      </div>
      <style>{`
        @keyframes wh1-ticker-${id} { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .wh1-ticker-${id} { animation: none; } }
      `}</style>
    </div>
  );
}

// ─── Main section ───────────────────────────────────────────────────
export default function WhosHereOneSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin: "300px", threshold: 0 });
    obs.observe(el); return () => obs.disconnect();
  }, []);

  // Removed heavy GSAP import block — relying purely on CSS animations when inView becomes true.

  return (
    <section id="whos-here-one" ref={sectionRef} style={{
      background: "#050402", width: "100%", height: "100vh", overflow: "hidden",
      position: "relative", display: "flex", flexDirection: "column",
    }}>
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)", flexShrink: 0 }} />

      {/* Heading */}
      <div className={`wh1-heading ${inView ? "animate-in" : ""}`} style={{ textAlign: "center", padding: "clamp(1.5rem,3vh,2.5rem) 1.5rem clamp(1rem,2vh,1.5rem)", flexShrink: 0, opacity: 0 }}>
        <p style={{ color: "#C9A84C", fontSize: "clamp(0.55rem,0.85vw,0.65rem)", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, margin: "0 0 0.5rem" }}>The world&apos;s most iconic brands</p>
        <h2 style={{ color: "#ffffff", fontSize: "clamp(1.4rem,3vw,2.4rem)", fontWeight: 800, fontFamily: "var(--font-montserrat)", margin: "0 0 0.6rem", lineHeight: 1.1 }}>
          They chose here.<br /><span style={{ color: "#C9A84C" }}>Will you be next?</span>
        </h2>
        <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "clamp(0.68rem,0.95vw,0.78rem)", fontFamily: "var(--font-montserrat)", fontWeight: 400, margin: "0 auto", maxWidth: "460px", lineHeight: 1.6 }}>
          520+ brands. Every tier. Every category. The most visited mall in America is where global brands come to be seen.
        </p>
      </div>

      {/* Tickers */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginBottom: "clamp(1rem,2.5vh,2rem)", flexShrink: 0 }}>
        <TickerRow items={TICKER_ROW_1} reverse={false} speed={50} id="wh1row1" />
        <TickerRow items={TICKER_ROW_2} reverse={true} speed={38} id="wh1row2" />
      </div>

      {/* Brand cards */}
      <div style={{ flex: 1, minHeight: 0, padding: "0 clamp(1.2rem,4vw,4rem)", display: "flex", flexDirection: "column" }}>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.58rem", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, margin: "0 0 clamp(0.6rem,1.2vh,1rem)", flexShrink: 0 }}>Featured tenants</p>
        <div className={`wh1-brand-grid-inner ${inView ? "animate-in" : ""}`} style={{ flex: 1, minHeight: 0 }}>
          {BRANDS.map((brand, i) => (<BrandCard key={brand.name} brand={brand} index={i} />))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "clamp(0.8rem,1.5vh,1.2rem) 1.5rem", flexShrink: 0 }}>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontFamily: "var(--font-montserrat)", fontWeight: 400, margin: "0 0 0.3rem", letterSpacing: "0.05em" }}>
          Join 520+ brands already thriving at Mall of America
        </p>
      </div>

      <style>{`
        .wh1-brand-grid-inner { display: grid; grid-template-columns: 1fr; gap: 1px; background: rgba(201,168,76,0.08); border: 1px solid rgba(201,168,76,0.08); }
        .wh1-desktop-img { display: none; }
        @media (min-width: 640px) { .wh1-brand-grid-inner { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 1024px) { 
          .wh1-brand-grid-inner { grid-template-columns: repeat(4, 1fr); }
          .wh1-desktop-img { display: block; }
          .wh1-mobile-quote { display: none; }
        }
        @media (prefers-reduced-motion: reduce) { .wh1-ticker-track { animation: none !important; } }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Heading animation */
        .wh1-heading.animate-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        /* Staggered card animations */
        .wh1-brand-grid-inner.animate-in .wh1-brand-card-0 { animation: fadeInUp 0.6s ease-out 0.2s forwards; }
        .wh1-brand-grid-inner.animate-in .wh1-brand-card-1 { animation: fadeInUp 0.6s ease-out 0.3s forwards; }
        .wh1-brand-grid-inner.animate-in .wh1-brand-card-2 { animation: fadeInUp 0.6s ease-out 0.4s forwards; }
        .wh1-brand-grid-inner.animate-in .wh1-brand-card-3 { animation: fadeInUp 0.6s ease-out 0.5s forwards; }
      `}</style>
    </section>
  );
}
