"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type GsapType = typeof import("gsap")["default"];
let _gsap: GsapType | null = null;
const loadGsap = async () => {
  if (_gsap) return _gsap;
  const m = await import("gsap");
  _gsap = m.default;
  return _gsap;
};

const REST_STATS = [
  { value: "50+", label: "Restaurants" },
  { value: "2.8M", label: "Dining visits/yr" },
  { value: "15+", label: "Cuisines" },
  { value: "Top 3", label: "US Mall Dining" },
];

const REST_THUMBS = [
  { src: "/photos/restaurant-thumb-1.jpg", alt: "Fine dining", label: "Fine Dining", desc: "Premium table service" },
  { src: "/photos/restaurant-thumb-2.jpg", alt: "Bar", label: "Bars & Lounge", desc: "Craft cocktails, live energy" },
  { src: "/photos/restaurant-thumb-3.jpg", alt: "Gourmet", label: "Gourmet", desc: "Every cuisine imaginable" },
];

function ThumbStack({ thumbs, accentColor, stripLabel, animClass }: {
  thumbs: { src: string; alt: string; label: string; desc: string }[];
  accentColor: string; stripLabel: string; animClass: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px", alignSelf: "center" }}>
      {thumbs.map(t => (
        <div key={t.src} className={animClass} style={{
          position: "relative", width: "100%",
          height: `clamp(100px, ${thumbs.length === 2 ? "14vw" : "11.5vw"}, ${thumbs.length === 2 ? "175px" : "148px"})`,
          overflow: "hidden", opacity: 0, transform: "translateX(40px)",
        }}>
          <Image src={t.src} alt={t.alt} fill loading="lazy" sizes="(max-width:768px) 100vw, 35vw"
            style={{ objectFit: "cover", transition: "transform 0.55s ease" }}
            onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.06)"; }}
            onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(5,4,2,0.8) 0%, transparent 55%)" }} />
          <div style={{ position: "absolute", bottom: "0.6rem", left: "0.75rem", zIndex: 2 }}>
            <div style={{ color: accentColor, fontSize: "0.54rem", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", lineHeight: 1 }}>{t.label}</div>
            <div style={{ color: "rgba(255,255,255,0.42)", fontSize: "0.5rem", fontFamily: "var(--font-montserrat)", marginTop: "0.14rem" }}>{t.desc}</div>
          </div>
          <div style={{ position: "absolute", top: "6px", right: "6px", width: "10px", height: "10px", borderTop: `1px solid ${accentColor}80`, borderRight: `1px solid ${accentColor}80` }} />
        </div>
      ))}
      <div style={{ borderTop: `1px solid ${accentColor}20`, paddingTop: "0.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: `${accentColor}55`, fontSize: "0.52rem", letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600 }}>{stripLabel}</span>
        <span style={{ color: accentColor, fontSize: "0.65rem", opacity: 0.6 }}>→</span>
      </div>
    </div>
  );
}

export default function RestaurantPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (!ref.current || ran.current) return;
    let c = false;
    loadGsap().then(gsap => {
      if (c || ran.current) return;
      ran.current = true;
      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(".rest-cat", { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
        .to(".rest-headline", { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.25")
        .to(".rest-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
        .to(".rest-divider", { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
        .to(".rest-body", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
        .to(".rest-stat", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.09 }, "-=0.2")
        .to(".rest-thumb", { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 }, "-=0.35");
    });
    return () => { c = true; };
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", width: "100%", height: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#080501" }}>
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <Image src="/photos/restaurant-bg.jpg" alt="Mall of America dining" fill loading="lazy" sizes="100vw" style={{ objectFit: "cover", objectPosition: "center 25%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(110deg, rgba(8,5,1,0.96) 0%, rgba(12,7,2,0.88) 38%, rgba(16,9,3,0.5) 64%, rgba(8,5,1,0.15) 100%)", zIndex: 2 }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(30,15,0,0.35), rgba(15,8,0,0.55))", zIndex: 2 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "140px", background: "linear-gradient(to bottom, transparent, #050402)", zIndex: 3 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "70px", background: "linear-gradient(to bottom, #050402, transparent)", zIndex: 3 }} />
      </div>

      <div className="rest-grid" style={{ position: "relative", zIndex: 4, width: "100%", padding: "clamp(3.5rem, 5.5vh, 5rem) clamp(1.3rem, 5vw, 5rem)", display: "grid", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxWidth: "480px" }}>
          <p className="rest-cat" style={{ color: "#E8A84C", fontSize: "0.6rem", letterSpacing: "0.38em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 700, margin: 0, opacity: 0, transform: "translateY(14px)" }}>Dining &amp; Lifestyle · 50+ Restaurants</p>
          <h2 className="rest-headline" style={{ color: "#ffffff", fontSize: "clamp(2rem, 4.8vw, 4.5rem)", fontWeight: 800, fontFamily: "var(--font-montserrat)", margin: 0, lineHeight: 0.95, opacity: 0, transform: "translateY(20px)" }}>50 restaurants.<br />Every cuisine.</h2>
          <h3 className="rest-sub" style={{ color: "rgba(255,255,255,0.38)", fontSize: "clamp(0.95rem, 2.2vw, 1.65rem)", fontWeight: 800, fontFamily: "var(--font-montserrat)", margin: 0, lineHeight: 1.1, opacity: 0, transform: "translateY(16px)" }}>One destination.</h3>
          <div className="rest-divider" style={{ width: "40px", height: "2px", background: "linear-gradient(to right, #E8A84C, rgba(232,168,76,0.1))", transform: "scaleX(0)", transformOrigin: "left" }} />
          <p className="rest-body" style={{ color: "rgba(255,255,255,0.52)", fontSize: "clamp(0.74rem, 1.15vw, 0.86rem)", fontFamily: "var(--font-montserrat)", fontWeight: 400, lineHeight: 1.7, margin: 0, maxWidth: "390px", opacity: 0, transform: "translateY(14px)" }}>From Michelin-calibre tasting menus to fast-casual street food, the dining ecosystem at Mall of America keeps visitors on-property longer — and spending more. Every hour spent dining is an hour spent steps from your store.</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.45rem", marginTop: "0.25rem" }}>
            {REST_STATS.map(s => (
              <div key={s.value} className="rest-stat" style={{ background: "rgba(232,168,76,0.06)", border: "1px solid rgba(232,168,76,0.18)", padding: "0.55rem 0.8rem", opacity: 0, transform: "translateY(10px)" }}>
                <div style={{ color: "#E8A84C", fontSize: "clamp(0.95rem, 1.7vw, 1.3rem)", fontWeight: 800, fontFamily: "var(--font-montserrat)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, marginTop: "0.18rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rest-thumbs-col">
          <ThumbStack thumbs={REST_THUMBS} accentColor="#E8A84C" stripLabel="Mall of America dining" animClass="rest-thumb" />
        </div>
      </div>

      <div style={{ position: "absolute", right: "clamp(1.3rem,4.5vw,3.5rem)", bottom: "2.5rem", color: "rgba(232,168,76,0.06)", fontSize: "clamp(4rem,10vw,8rem)", fontWeight: 800, fontFamily: "var(--font-montserrat)", lineHeight: 1, userSelect: "none", pointerEvents: "none", zIndex: 4 }}>03</div>

      <style>{`
        @media (max-width:767px) { .rest-thumbs-col { display:none !important; } .rest-grid { grid-template-columns:1fr !important; } }
        @media (min-width:768px) { .rest-grid { grid-template-columns: 1fr 1fr !important; align-items: center; } .rest-thumbs-col { display:block !important; } }
        @media (min-width:1100px) { .rest-grid { grid-template-columns: 55fr 45fr !important; } }
      `}</style>
    </div>
  );
}
