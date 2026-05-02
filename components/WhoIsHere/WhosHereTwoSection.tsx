"use client";

import { useEffect, useRef, useState, memo } from "react";

// ── Lazy GSAP loader ──────────────────────────────────────────────────────
type GsapType = typeof import("gsap")["default"];
type ScrollTriggerType = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];
let _gsap: GsapType | null = null;
let _ST: ScrollTriggerType | null = null;
const loadGsap = async () => {
  if (_gsap && _ST) return { gsap: _gsap, ScrollTrigger: _ST };
  const [gsapMod, stMod] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
  _gsap = gsapMod.default;
  _ST = stMod.ScrollTrigger;
  _gsap.registerPlugin(_ST);
  return { gsap: _gsap, ScrollTrigger: _ST };
};

// ─── Brand events data (extracted from EventsSection) ─────────────────────
const BRAND_EVENTS = [
  { brand: "Samsung", event: "Galaxy Experience Store Launch", year: "2025", stat: "22K attendees", category: "Product Launch", gradient: "linear-gradient(135deg, #1428A0 0%, #0a1560 100%)", logo: "/svg/samsung.svg", logoStyle: { width: "72%", height: "auto" } as React.CSSProperties },
  { brand: "Nike", event: "Air Max Day Activation", year: "2024", stat: "18K attendees", category: "Brand Activation", gradient: "linear-gradient(135deg, #111111 0%, #2a2a2a 100%)", logo: "/svg/nike.svg", logoStyle: { width: "52%", height: "auto" } as React.CSSProperties },
  { brand: "Lego", event: "Flagship Store Opening", year: "2024", stat: "14K attendees", category: "Store Launch", gradient: "linear-gradient(135deg, #006DB7 0%, #003d6b 100%)", logo: "/svg/lego.svg", logoFilter: "brightness(0) invert(1) drop-shadow(0 0 18px rgba(255,255,255,0.15))", logoStyle: { width: "62%", height: "auto" } as React.CSSProperties },
  { brand: "Coca-Cola", event: "Summer Sponsorship Takeover", year: "2024", stat: "31K reach", category: "Sponsorship", gradient: "linear-gradient(135deg, #c8102e 0%, #6b0018 100%)", logo: "/svg/coca-cola.svg", logoStyle: { width: "76%", height: "auto" } as React.CSSProperties },
  { brand: "Marvel", event: "Avengers Promotional Event", year: "2023", stat: "27K attendees", category: "Entertainment", gradient: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)", logo: "/svg/marvel.svg", logoStyle: { width: "66%", height: "auto" } as React.CSSProperties },
  { brand: "Tesla", event: "Model Y Showcase Experience", year: "2023", stat: "12K visitors", category: "Product Experience", gradient: "linear-gradient(135deg, #1a1a1a 0%, #0a0000 100%)", logo: "/svg/tesla.svg", logoStyle: { width: "60%", height: "auto" } as React.CSSProperties },
  { brand: "Apple", event: "iPhone 15 Launch Event", year: "2023", stat: "19K attendees", category: "Product Launch", gradient: "linear-gradient(135deg, #1c1c1e 0%, #000000 100%)", logo: "/svg/apple.svg", logoStyle: { width: "28%", height: "auto" } as React.CSSProperties },
];

// ─── Brand event carousel card ────────────────────────────────────────────
const BrandEventCard = memo(function BrandEventCard({ evt }: { evt: typeof BRAND_EVENTS[0] }) {
  return (
    <div className="wh2-brand-evt-card" style={{
      minWidth: "clamp(200px, 28vw, 290px)", height: "clamp(185px, 22vw, 245px)",
      background: evt.gradient, border: "1px solid rgba(201,168,76,0.1)",
      padding: "1.4rem", display: "flex", flexDirection: "column",
      justifyContent: "space-between", flexShrink: 0, position: "relative",
      overflow: "hidden", cursor: "default", transition: "border-color 0.25s ease",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)";
        loadGsap().then(({ gsap }) => gsap.to(e.currentTarget, { scale: 1.025, duration: 0.28, ease: "power2.out" }));
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)";
        loadGsap().then(({ gsap }) => gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: "power2.out" }));
      }}
    >
      <div style={{ display: "inline-flex", alignSelf: "flex-start", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(201,168,76,0.2)", color: "rgba(201,168,76,0.85)", fontSize: "0.52rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 700, padding: "3px 8px", position: "relative", zIndex: 2 }}>
        {evt.category}
      </div>
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, pointerEvents: "none" }}>
        <img src={evt.logo} alt={evt.brand} style={{ ...evt.logoStyle, opacity: 0.9, filter: (evt as any).logoFilter ?? "brightness(0) invert(1) drop-shadow(0 0 18px rgba(255,255,255,0.15))", objectFit: "contain" }} />
      </div>
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "52%", background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)", zIndex: 1, pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.64rem", fontFamily: "var(--font-montserrat)", fontWeight: 400, lineHeight: 1.4, marginBottom: "0.4rem" }}>{evt.event}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <span style={{ color: "#C9A84C", fontSize: "0.64rem", fontWeight: 700, fontFamily: "var(--font-montserrat)", letterSpacing: "0.1em" }}>{evt.stat}</span>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.58rem", fontFamily: "var(--font-montserrat)", fontWeight: 500, letterSpacing: "0.1em" }}>· {evt.year}</span>
        </div>
      </div>
    </div>
  );
});

// ─── Carousel with GSAP infinite scroll ───────────────────────────────────
function BrandCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Tween | null>(null);
  const isDrag = useRef(false);
  const startX = useRef(0);
  const scrollX = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let cancelled = false;
    loadGsap().then(({ gsap }) => {
      if (cancelled || !track) return;
      const totalW = track.scrollWidth / 2;
      gsap.set(track, { x: 0 });
      tlRef.current = gsap.to(track, {
        x: -totalW, duration: 40, ease: "none", repeat: -1,
        paused: document.hidden,
        modifiers: { x: gsap.utils.unitize(x => parseFloat(x) % totalW) },
      });
      const onVis = () => { if (document.hidden) tlRef.current?.pause(); else tlRef.current?.resume(); };
      document.addEventListener("visibilitychange", onVis);
      const onEnter = () => gsap.to(tlRef.current, { timeScale: 0.2, duration: 0.6 });
      const onLeave = () => gsap.to(tlRef.current, { timeScale: 1, duration: 0.6 });
      track.parentElement?.addEventListener("mouseenter", onEnter);
      track.parentElement?.addEventListener("mouseleave", onLeave);
      const onTouchStart = (e: TouchEvent) => { isDrag.current = true; startX.current = e.touches[0].clientX; scrollX.current = gsap.getProperty(track, "x") as number; tlRef.current?.pause(); };
      const onTouchMove = (e: TouchEvent) => { if (!isDrag.current) return; gsap.set(track, { x: scrollX.current + e.touches[0].clientX - startX.current }); };
      const onTouchEnd = () => { isDrag.current = false; setTimeout(() => tlRef.current?.resume(), 1800); };
      track.addEventListener("touchstart", onTouchStart, { passive: true });
      track.addEventListener("touchmove", onTouchMove, { passive: true });
      track.addEventListener("touchend", onTouchEnd);
      (track as any).__evtCleanup = () => {
        tlRef.current?.kill(); document.removeEventListener("visibilitychange", onVis);
        track.parentElement?.removeEventListener("mouseenter", onEnter);
        track.parentElement?.removeEventListener("mouseleave", onLeave);
        track.removeEventListener("touchstart", onTouchStart);
        track.removeEventListener("touchmove", onTouchMove);
        track.removeEventListener("touchend", onTouchEnd);
      };
    });
    return () => { cancelled = true; if ((trackRef.current as any)?.__evtCleanup) (trackRef.current as any).__evtCleanup(); };
  }, []);

  const doubled = [...BRAND_EVENTS, ...BRAND_EVENTS];
  return (
    <div style={{ overflow: "hidden", position: "relative", width: "100%" }}>
      <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "100px", background: "linear-gradient(to right, #050402, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "100px", background: "linear-gradient(to left, #050402, transparent)", zIndex: 2, pointerEvents: "none" }} />
      <div ref={trackRef} style={{ display: "flex", gap: "1px", willChange: "transform", background: "rgba(201,168,76,0.05)" }}>
        {doubled.map((evt, i) => (<BrandEventCard key={`${evt.brand}-${i}`} evt={evt} />))}
      </div>
    </div>
  );
}

// ─── Main section — "Brands that trusted us" ─────────────────────────────
export default function WhosHereTwoSection() {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } }, { rootMargin: "200px", threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let ctx: { revert: () => void } | null = null;
    loadGsap().then(({ gsap }) => {
      ctx = gsap.context(() => {
        gsap.fromTo(".wh2-heading", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" });
      }, sectionRef);
    });
    return () => { ctx?.revert(); };
  }, [inView]);

  return (
    <section id="whos-here-two" ref={sectionRef} style={{
      background: "#050402", width: "100%", height: "100vh",
      overflow: "hidden", position: "relative",
      display: "flex", flexDirection: "column", justifyContent: "center",
    }}>
      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)", flexShrink: 0 }} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "clamp(2rem, 4vh, 3.5rem)" }}>
        {/* Heading */}
        <div className="wh2-heading" style={{ padding: "0 clamp(1.2rem, 4vw, 4rem)", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <p style={{ color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 700, margin: "0 0 0.5rem" }}>Past activations</p>
            <h3 style={{ color: "#ffffff", fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 800, fontFamily: "var(--font-montserrat)", margin: 0, lineHeight: 1.15 }}>
              Brands that trusted<br /><span style={{ color: "#C9A84C" }}>this stage</span>
            </h3>
          </div>
          <p style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.7rem", fontFamily: "var(--font-montserrat)", fontWeight: 400, margin: 0, maxWidth: "240px", lineHeight: 1.6, textAlign: "right" }}>
            Hover to pause · Drag to explore past brand events and activations.
          </p>
        </div>

        {/* Carousel */}
        <BrandCarousel />

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", padding: "0 1.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))" }} />
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontFamily: "var(--font-montserrat)", fontWeight: 400, margin: 0, letterSpacing: "0.04em", maxWidth: "360px", lineHeight: 1.6 }}>
            Ready to make your brand moment at the most visited mall in America?
          </p>
        </div>
      </div>

      <div style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)", flexShrink: 0 }} />
    </section>
  );
}
