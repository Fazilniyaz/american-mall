"use client";

import {
  useEffect,
  useRef,
  useState,
  memo,
} from "react";
import Image from "next/image";
import EventsPanel from "./EventsPanel";
import DiningShoppingPanel from "./DiningShoppingPanel";
import { useScroller } from "@/components/ScrollerContext";

// ── Lazy GSAP + D3 loaders (same pattern as WhosHereSection / SponsorshipSection)
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
  const { ScrollTrigger } = stMod;
  _ST = ScrollTrigger;
  _gsap.registerPlugin(_ST);
  return { gsap: _gsap, ScrollTrigger: _ST };
};

const loadD3 = async () => import("d3");

// ─── Text-only panels (dining, events) ───────────────────────────────────────
// Dining only — Events is now EventsPanel component
const TEXT_PANELS = [
  {
    id: "dining",
    category: "Dining & Lifestyle",
    headline: "50+ restaurants.",
    sub: "Every cuisine. One destination.",
    stat: "2.8M",
    statLabel: "Dining visits per year",
    body: "From Michelin-calibre dining to fast-casual, the food ecosystem at Mall of America keeps visitors on-property longer — and spending more.",
    bg: "linear-gradient(135deg, #0a0400 0%, #140800 40%, #080300 100%)",
    panelNum: "03",
  },
];

// ─── Nickelodeon stats ────────────────────────────────────────────────────────
const NICK_STATS = [
  { value: "7", label: "Roller Coasters" },
  { value: "30+", label: "Rides & Attractions" },
  { value: "12M+", label: "Rides taken yearly" },
  { value: "#1", label: "Largest indoor park" },
];

// ─── Nickelodeon thumbnails ───────────────────────────────────────────────────
const NICK_THUMBS = [
  { src: "/photos/nickelodeon-arcade.jpg", label: "Arcade Zone", desc: "Neon-lit gaming world" },
  { src: "/photos/nickelodeon-ride.jpg", label: "Ride World", desc: "30+ rides & attractions" },
];

// ─── Aquarium stats ───────────────────────────────────────────────────────────
const AQUA_STATS = [
  { value: "10K+", label: "Sea Creatures" },
  { value: "1.2M", label: "Annual Visitors" },
  { value: "300+", label: "Species" },
  { value: "Top 5", label: "US Aquariums" },
];

// ─── Footfall data ────────────────────────────────────────────────────────────
const FOOTFALL_DATA = [
  { month: "Jan", retail: 2.1, entertainment: 1.8 },
  { month: "Feb", retail: 2.4, entertainment: 2.0 },
  { month: "Mar", retail: 2.8, entertainment: 2.5 },
  { month: "Apr", retail: 3.1, entertainment: 2.9 },
  { month: "May", retail: 3.6, entertainment: 3.4 },
  { month: "Jun", retail: 4.2, entertainment: 4.0 },
  { month: "Jul", retail: 4.8, entertainment: 4.6 },
  { month: "Aug", retail: 4.5, entertainment: 4.3 },
  { month: "Sep", retail: 3.2, entertainment: 3.0 },
  { month: "Oct", retail: 3.5, entertainment: 3.3 },
  { month: "Nov", retail: 4.1, entertainment: 3.8 },
  { month: "Dec", retail: 4.9, entertainment: 4.7 },
];

// ─── Three.js particle ring (lazy-loaded) ─────────────────────────────────────
function PanelParticles({ color }: { color: string }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const isVis = useRef(true);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    let cancelled = false;

    import("three").then((THREE) => {
      if (cancelled || !el) return;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
      camera.position.z = 4;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
      renderer.setSize(W, H);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setClearColor(0x000000, 0);
      el.appendChild(renderer.domElement);
      const count = 800;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(count * 3);
      const cols = new Float32Array(count * 3);
      const c = new THREE.Color(color);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const radius = 2.2 + (Math.random() - 0.5) * 1.2;
        const spread = (Math.random() - 0.5) * 0.6;
        pos[i * 3] = Math.cos(angle) * radius;
        pos[i * 3 + 1] = spread;
        pos[i * 3 + 2] = Math.sin(angle) * radius;
        cols[i * 3] = c.r + (Math.random() - 0.5) * 0.2;
        cols[i * 3 + 1] = c.g + (Math.random() - 0.5) * 0.2;
        cols[i * 3 + 2] = c.b;
      }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("color", new THREE.BufferAttribute(cols, 3));
      const mat = new THREE.PointsMaterial({ size: 0.018, vertexColors: true, transparent: true, opacity: 0.55 });
      const ring = new THREE.Points(geo, mat);
      scene.add(ring);
      const obs = new IntersectionObserver(([e]) => { isVis.current = e.isIntersecting; }, { threshold: 0.1 });
      obs.observe(el);
      const animate = () => {
        rafRef.current = requestAnimationFrame(animate);
        if (!isVis.current) return;
        ring.rotation.y += 0.0015;
        ring.rotation.x = 0.3;
        renderer.render(scene, camera);
      };
      animate();

      // Store cleanup ref on the element for the outer cleanup
      (el as any).__threeCleanup = () => {
        cancelAnimationFrame(rafRef.current);
        obs.disconnect();
        mat.dispose(); geo.dispose(); renderer.dispose();
        if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
      };
    });

    return () => {
      cancelled = true;
      if ((el as any)?.__threeCleanup) (el as any).__threeCleanup();
    };
  }, [color]);

  return (
    <div ref={mountRef} style={{
      position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", opacity: 0.45,
    }} />
  );
}

// ─── D3 footfall chart (lazy-loaded) ──────────────────────────────────────────
const FootfallChart = memo(function FootfallChart({ scrollerEl }: { scrollerEl: HTMLElement | null }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!svgRef.current || !scrollerEl) return;
    const el = svgRef.current;
    let cancelled = false;

    Promise.all([loadD3(), loadGsap()]).then(([d3, { gsap, ScrollTrigger }]) => {
      if (cancelled || !el) return;
      const W = el.parentElement?.clientWidth || 600;
      const H = 220; const mb = 32; const ml = 36; const mr = 16; const mt = 16;
      const iW = W - ml - mr; const iH = H - mt - mb;
      const svg = d3.select(el).attr("width", W).attr("height", H).attr("viewBox", `0 0 ${W} ${H}`);
      const x = d3.scalePoint().domain(FOOTFALL_DATA.map(d => d.month)).range([0, iW]).padding(0.3);
      const y = d3.scaleLinear().domain([0, 6]).range([iH, 0]);
      const g = svg.append("g").attr("transform", `translate(${ml},${mt})`);
      y.ticks(4).forEach(tick => {
        g.append("line").attr("x1", 0).attr("x2", iW).attr("y1", y(tick)).attr("y2", y(tick))
          .attr("stroke", "rgba(255,255,255,0.06)").attr("stroke-width", 1);
      });
      FOOTFALL_DATA.forEach(d => {
        g.append("text").attr("x", x(d.month) ?? 0).attr("y", iH + 18)
          .attr("text-anchor", "middle").attr("font-size", "9px")
          .attr("font-family", "var(--font-montserrat)").attr("font-weight", "600")
          .attr("fill", "rgba(255,255,255,0.28)").attr("letter-spacing", "0.06em")
          .text(d.month.toUpperCase());
      });
      y.ticks(4).forEach(tick => {
        g.append("text").attr("x", -8).attr("y", y(tick) + 4)
          .attr("text-anchor", "end").attr("font-size", "9px")
          .attr("font-family", "var(--font-montserrat)").attr("fill", "rgba(255,255,255,0.22)")
          .text(tick + "M");
      });
      const areaGen = d3.area<typeof FOOTFALL_DATA[0]>().x(d => x(d.month) ?? 0).y0(iH).y1(d => y(d.retail)).curve(d3.curveCatmullRom);
      const lineGen = d3.line<typeof FOOTFALL_DATA[0]>().x(d => x(d.month) ?? 0).y(d => y(d.retail)).curve(d3.curveCatmullRom);
      const lineGen2 = d3.line<typeof FOOTFALL_DATA[0]>().x(d => x(d.month) ?? 0).y(d => y(d.entertainment)).curve(d3.curveCatmullRom);
      const defs = svg.append("defs");
      const grad = defs.append("linearGradient").attr("id", "ent-area-grad3")
        .attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", "#C9A84C").attr("stop-opacity", "0.18");
      grad.append("stop").attr("offset", "100%").attr("stop-color", "#C9A84C").attr("stop-opacity", "0.0");
      g.append("path").datum(FOOTFALL_DATA).attr("d", areaGen).attr("fill", "url(#ent-area-grad3)");
      const rPath = g.append("path").datum(FOOTFALL_DATA).attr("d", lineGen)
        .attr("fill", "none").attr("stroke", "#C9A84C").attr("stroke-width", "2").attr("stroke-linecap", "round");
      const ePath = g.append("path").datum(FOOTFALL_DATA).attr("d", lineGen2)
        .attr("fill", "none").attr("stroke", "rgba(201,168,76,0.4)")
        .attr("stroke-width", "1.5").attr("stroke-dasharray", "4 3").attr("stroke-linecap", "round");
      const setDash = (p: d3.Selection<SVGPathElement, unknown, null, undefined>) => {
        const len = (p.node() as SVGPathElement).getTotalLength();
        p.attr("stroke-dasharray", `${len} ${len}`).attr("stroke-dashoffset", len);
      };
      setDash(rPath as d3.Selection<SVGPathElement, unknown, null, undefined>);
      setDash(ePath as d3.Selection<SVGPathElement, unknown, null, undefined>);
      const dots = g.selectAll(".fcd").data(FOOTFALL_DATA).enter()
        .append("circle").attr("cx", d => x(d.month) ?? 0).attr("cy", d => y(d.retail))
        .attr("r", 3).attr("fill", "#C9A84C").attr("opacity", 0);
      ScrollTrigger.create({
        trigger: el, start: "top 85%", once: true, ...(scrollerEl ? { scroller: scrollerEl } : {}),
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          gsap.to(rPath.node(), { strokeDashoffset: 0, duration: 1.6, ease: "power2.out" });
          gsap.to(ePath.node(), { strokeDashoffset: 0, duration: 1.8, ease: "power2.out", delay: 0.2 });
          dots.each(function (_, i) { gsap.to(this, { opacity: 1, duration: 0.3, delay: 0.8 + i * 0.06 }); });
        },
      });
    });

    return () => {
      cancelled = true;
      loadGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().filter(st => st.vars.trigger === el).forEach(st => st.kill());
      });
    };
  }, [scrollerEl]);

  return (
    <svg ref={svgRef}
      style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
      aria-label="Monthly footfall — retail vs entertainment"
    />
  );
});

// ─── Text panel (panels 2,3,4) ────────────────────────────────────────────────
function TextPanel({ panel, index, scrollerEl }: { panel: typeof TEXT_PANELS[0]; index: number; scrollerEl: HTMLElement | null }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!panelRef.current || !scrollerEl) return;
    let cancelled = false;
    const el = panelRef.current;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !el) return;
      ScrollTrigger.create({
        trigger: el, start: "top 72%", once: true, ...(scrollerEl ? { scroller: scrollerEl } : {}),
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          gsap.timeline()
            .to(`.tp-cat-${index}`, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
            .to(`.tp-headline-${index}`, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.25")
            .to(`.tp-sub-${index}`, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
            .to(`.tp-body-${index}`, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.25");
        },
      });
    });
    return () => {
      cancelled = true;
      loadGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().filter(st => st.vars.trigger === el).forEach(st => st.kill());
      });
    };
  }, [index, scrollerEl]);

  return (
    <div ref={panelRef} style={{
      position: "relative", width: "100%", minHeight: "100vh",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: panel.bg, overflow: "hidden",
    }}>
      <div className="ent-particles-wrap"><PanelParticles color="#C9A84C" /></div>
      <div style={{
        position: "absolute", inset: 0, zIndex: 2,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        backgroundSize: "200px 200px", pointerEvents: "none", opacity: 0.6,
      }} />
      <div style={{
        position: "relative", zIndex: 3,
        padding: "4rem clamp(1.5rem,6vw,6rem)", maxWidth: "900px", width: "100%",
      }}>
        <p className={`tp-cat-${index}`} style={{
          color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.4em",
          textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
          fontWeight: 700, margin: "0 0 1.2rem", opacity: 0, transform: "translateY(16px)",
        }}>{panel.category}</p>
        <h2 className={`tp-headline-${index}`} style={{
          color: "#ffffff", fontSize: "clamp(2.2rem,6vw,5.5rem)",
          fontWeight: 800, fontFamily: "var(--font-montserrat)",
          margin: "0 0 0.1rem", lineHeight: 1.0, opacity: 0, transform: "translateY(24px)",
        }}>{panel.headline}</h2>
        <h2 className={`tp-sub-${index}`} style={{
          color: "rgba(255,255,255,0.45)", fontSize: "clamp(1.4rem,3.5vw,3rem)",
          fontWeight: 800, fontFamily: "var(--font-montserrat)",
          margin: "0 0 2.5rem", lineHeight: 1.1, opacity: 0, transform: "translateY(20px)",
        }}>{panel.sub}</h2>
        <div className={`tp-body-${index}`} style={{
          display: "flex", gap: "3rem", flexWrap: "wrap", alignItems: "flex-start",
          opacity: 0, transform: "translateY(16px)",
        }}>
          <div style={{ borderLeft: "2px solid #C9A84C", paddingLeft: "1.2rem", flexShrink: 0 }}>
            <div style={{
              color: "#C9A84C", fontSize: "clamp(2rem,4vw,3.2rem)",
              fontWeight: 800, fontFamily: "var(--font-montserrat)", lineHeight: 1, fontVariantNumeric: "tabular-nums",
            }}>{panel.stat}</div>
            <div style={{
              color: "rgba(255,255,255,0.38)", fontSize: "0.62rem", letterSpacing: "0.18em",
              textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, marginTop: "0.4rem",
            }}>{panel.statLabel}</div>
          </div>
          <p style={{
            color: "rgba(255,255,255,0.52)", fontSize: "clamp(0.82rem,1.4vw,1rem)",
            fontFamily: "var(--font-montserrat)", fontWeight: 400,
            lineHeight: 1.75, margin: 0, maxWidth: "440px", paddingTop: "0.3rem",
          }}>{panel.body}</p>
        </div>
        <div style={{
          position: "absolute", right: "clamp(1.5rem,6vw,6rem)", bottom: "2rem",
          color: "rgba(201,168,76,0.18)", fontSize: "clamp(4rem,10vw,8rem)",
          fontWeight: 800, fontFamily: "var(--font-montserrat)",
          lineHeight: 1, userSelect: "none", pointerEvents: "none",
        }}>{panel.panelNum}</div>
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "120px",
        background: "linear-gradient(to bottom,transparent,rgba(5,4,2,0.5))",
        zIndex: 4, pointerEvents: "none",
      }} />
    </div>
  );
}

// ─── Aquarium Panel ───────────────────────────────────────────────────────────
function AquariumPanel({ scrollerEl }: { scrollerEl: HTMLElement | null }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!panelRef.current || !scrollerEl) return;
    let cancelled = false;
    const el = panelRef.current;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !el) return;
      ScrollTrigger.create({
        trigger: el, start: "top 72%", once: true, ...(scrollerEl ? { scroller: scrollerEl } : {}),
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          gsap.timeline()
            .to(".aqua-cat", { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
            .to(".aqua-headline", { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.25")
            .to(".aqua-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
            .to(".aqua-divider", { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
            .to(".aqua-body", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
            .to(".aqua-stat", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.09 }, "-=0.2")
            .to(".aqua-thumb", { opacity: 1, x: 0, duration: 0.65, ease: "power2.out" }, "-=0.3");
        },
      });
    });

    return () => {
      cancelled = true;
      loadGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().filter(st => st.vars.trigger === el).forEach(st => st.kill());
      });
    };
  }, [scrollerEl]);

  return (
    <div ref={panelRef} style={{
      position: "relative", width: "100%", minHeight: "100vh",
      display: "flex", alignItems: "center", overflow: "hidden",
      background: "#000d0f",
    }}>
      {/* ── Hero background — wide tunnel with god rays ── */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <Image
          src="/photos/aquarium-tunnel.jpg"
          alt="Sea Life aquarium tunnel — Mall of America"
          fill
          priority={false}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Teal-blue tinted overlay — dark right for text, open left shows image */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(255deg, rgba(0,13,15,0.95) 0%, rgba(0,18,22,0.85) 35%, rgba(0,26,31,0.45) 62%, rgba(0,13,15,0.12) 100%)",
          zIndex: 2,
        }} />
        {/* Blue colour wash to deepen the teal vibe */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,20,40,0.3), rgba(0,10,20,0.5))",
          zIndex: 2,
          mixBlendMode: "multiply" as React.CSSProperties["mixBlendMode"],
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "160px",
          background: "linear-gradient(to bottom,transparent,#050402)", zIndex: 3,
        }} />
        {/* Top fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "80px",
          background: "linear-gradient(to bottom,rgba(5,4,2,0.6),transparent)", zIndex: 3,
        }} />
      </div>

      {/* ── CSS light ray animation — no Three.js, pure CSS ── */}
      <div className="aqua-rays-wrap" style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", overflow: "hidden",
      }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`aqua-ray aqua-ray-${i}`} style={{
            position: "absolute",
            top: 0,
            left: `${15 + i * 20}%`,
            width: "1px",
            height: "65%",
            background: `linear-gradient(to bottom, rgba(0,180,220,${0.08 + i * 0.02}), transparent)`,
            transformOrigin: "top center",
            transform: `rotate(${-8 + i * 5}deg)`,
          }} />
        ))}
      </div>

      {/* ── Content — text RIGHT, image thumbnail LEFT ── */}
      {/* Reversed from Nickelodeon for visual rhythm variety */}
      <div className="aqua-grid" style={{
        position: "relative", zIndex: 4, width: "100%",
        padding: "6rem clamp(1.5rem,6vw,6rem)",
        display: "grid", gap: "2.5rem",
      }}>

        {/* Left — thumbnail (hidden mobile) */}
        <div className="aqua-thumb-col" style={{
          display: "flex", flexDirection: "column", gap: "0", alignSelf: "center",
        }}>
          <div className="aqua-thumb" style={{
            position: "relative", width: "100%",
            height: "clamp(260px,36vw,420px)", overflow: "hidden",
            opacity: 0, transform: "translateX(-40px)",
          }}>
            <Image
              src="/photos/aquarium-shark.jpg"
              alt="Visitor points at shark — Sea Life aquarium tunnel"
              fill
              sizes="(max-width:768px) 100vw, 38vw"
              style={{ objectFit: "cover", objectPosition: "center 20%", transition: "transform 0.55s ease" }}
              onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.04)"; }}
              onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
            />
            {/* Overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(0,13,15,0.15) 0%, rgba(0,13,15,0.65) 100%)",
            }} />
            {/* Caption */}
            <div style={{ position: "absolute", bottom: "1rem", left: "1rem", zIndex: 2 }}>
              <div style={{
                color: "#C9A84C", fontSize: "0.62rem", fontWeight: 700,
                letterSpacing: "0.2em", textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)", lineHeight: 1,
              }}>Shark Tunnel</div>
              <div style={{
                color: "rgba(255,255,255,0.45)", fontSize: "0.58rem",
                fontFamily: "var(--font-montserrat)", marginTop: "0.2rem",
              }}>Walk beneath the ocean</div>
            </div>
            {/* Corner bracket — bottom left */}
            <div style={{
              position: "absolute", bottom: "8px", left: "8px",
              width: "14px", height: "14px",
              borderBottom: "1px solid rgba(201,168,76,0.5)",
              borderLeft: "1px solid rgba(201,168,76,0.5)",
            }} />
          </div>

          {/* Thin strip below image */}
          <div style={{
            borderTop: "1px solid rgba(0,180,220,0.15)",
            paddingTop: "0.7rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{
              color: "rgba(0,180,220,0.45)", fontSize: "0.58rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)", fontWeight: 600,
            }}>Sea Life Minnesota</span>
            <span style={{ color: "rgba(0,180,220,0.45)", fontSize: "0.75rem" }}>→</span>
          </div>
        </div>

        {/* Right — text block */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", maxWidth: "520px" }}>
          <p className="aqua-cat" style={{
            color: "rgba(0,200,240,0.85)", fontSize: "0.68rem", letterSpacing: "0.42em",
            textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
            fontWeight: 700, margin: 0, opacity: 0, transform: "translateY(16px)",
          }}>
            Aquarium · Sea Life Minnesota
          </p>

          <h2 className="aqua-headline" style={{
            color: "#ffffff", fontSize: "clamp(2.4rem,5.5vw,5.2rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: 0, lineHeight: 0.95, opacity: 0, transform: "translateY(24px)",
          }}>
            Sharks swim<br />overhead.
          </h2>

          <h3 className="aqua-sub" style={{
            color: "rgba(255,255,255,0.38)", fontSize: "clamp(1.2rem,2.8vw,2rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: 0, lineHeight: 1.1, opacity: 0, transform: "translateY(20px)",
          }}>
            1.2 million visitors come to watch.
          </h3>

          {/* Teal divider — matches image palette */}
          <div className="aqua-divider" style={{
            width: "48px", height: "2px",
            background: "linear-gradient(to right, rgba(0,200,240,0.8), rgba(0,200,240,0.1))",
            transform: "scaleX(0)", transformOrigin: "left",
          }} />

          <p className="aqua-body" style={{
            color: "rgba(255,255,255,0.52)", fontSize: "clamp(0.82rem,1.3vw,0.95rem)",
            fontFamily: "var(--font-montserrat)", fontWeight: 400,
            lineHeight: 1.8, margin: 0, maxWidth: "420px",
            opacity: 0, transform: "translateY(16px)",
          }}>
            Sea Life Minnesota Aquarium sits inside Mall of America, drawing
            families year-round. A captive, emotionally engaged audience that
            lingers for hours — and walks directly into your store.
          </p>

          {/* Stat pills — teal accent matching image */}
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "0.6rem", marginTop: "0.4rem",
          }}>
            {AQUA_STATS.map(s => (
              <div key={s.value} className="aqua-stat" style={{
                background: "rgba(0,180,220,0.05)",
                border: "1px solid rgba(0,180,220,0.18)",
                padding: "0.75rem 1rem",
                opacity: 0, transform: "translateY(12px)",
              }}>
                <div style={{
                  color: "rgba(0,200,240,0.9)",
                  fontSize: "clamp(1.1rem,2vw,1.5rem)",
                  fontWeight: 800, fontFamily: "var(--font-montserrat)",
                  lineHeight: 1, fontVariantNumeric: "tabular-nums",
                }}>{s.value}</div>
                <div style={{
                  color: "rgba(255,255,255,0.35)", fontSize: "0.58rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)", fontWeight: 600,
                  marginTop: "0.25rem",
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel number watermark */}
      <div style={{
        position: "absolute", left: "clamp(1.5rem,5vw,4rem)", bottom: "3rem",
        color: "rgba(0,180,220,0.06)", fontSize: "clamp(5rem,12vw,10rem)",
        fontWeight: 800, fontFamily: "var(--font-montserrat)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none", zIndex: 4,
      }}>02</div>

      {/* Light ray CSS animation */}
      <style>{`
        @keyframes aquaRayPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(1) rotate(var(--r)); }
          50%       { opacity: 0.9; transform: scaleY(1.08) rotate(var(--r)); }
        }
        .aqua-ray-0 { --r: -8deg;  animation: aquaRayPulse 4.2s ease-in-out infinite; }
        .aqua-ray-1 { --r: -3deg;  animation: aquaRayPulse 5.1s ease-in-out infinite 0.8s; }
        .aqua-ray-2 { --r:  2deg;  animation: aquaRayPulse 3.8s ease-in-out infinite 1.5s; }
        .aqua-ray-3 { --r:  7deg;  animation: aquaRayPulse 4.6s ease-in-out infinite 0.4s; }
        @media (max-width:767px) {
          .aqua-thumb-col { display:none !important; }
          .aqua-grid      { grid-template-columns:1fr !important; }
          .aqua-rays-wrap { display:none; }
        }
        @media (min-width:768px) {
          .aqua-grid {
            grid-template-columns: 1fr 1fr !important;
            align-items: center;
          }
          .aqua-thumb-col { display:flex !important; }
        }
        @media (min-width:1100px) {
          .aqua-grid { grid-template-columns: 42fr 58fr !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Nickelodeon Panel ────────────────────────────────────────────────────────
function NickelodeonPanel({ scrollerEl }: { scrollerEl: HTMLElement | null }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!panelRef.current || !scrollerEl) return;
    let cancelled = false;
    const el = panelRef.current;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !el) return;
      ScrollTrigger.create({
        trigger: el, start: "top 72%", once: true, ...(scrollerEl ? { scroller: scrollerEl } : {}),
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          gsap.timeline()
            .to(".nick-cat", { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
            .to(".nick-headline", { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.25")
            .to(".nick-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
            .to(".nick-divider", { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
            .to(".nick-body", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
            .to(".nick-stat", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.09 }, "-=0.2")
            .to(".nick-thumb", { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.14 }, "-=0.4");
        },
      });
    });

    return () => {
      cancelled = true;
      loadGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().filter(st => st.vars.trigger === el).forEach(st => st.kill());
      });
    };
  }, [scrollerEl]);

  return (
    <div ref={panelRef} style={{
      position: "relative", width: "100%", minHeight: "100vh",
      display: "flex", alignItems: "center", overflow: "hidden", background: "#050402",
    }}>
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <picture style={{ display: "block", width: "100%", height: "100%" }}>
          <source
            media="(max-width: 767px)"
            srcSet="/photos/nickelodeon-park-mobile.jpg"
          />
          <img
            src="/photos/nickelodeon-park.jpg"
            alt="Nickelodeon Universe — pirate ship atrium at Mall of America"
            loading="eager"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 30%",
            }}
          />
        </picture>
        {/* Gradient overlay — dark left, reveals right */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(105deg, rgba(5,4,2,0.94) 0%, rgba(5,4,2,0.82) 38%, rgba(5,4,2,0.4) 65%, rgba(5,4,2,0.12) 100%)",
          zIndex: 2,
        }} />
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "160px",
          background: "linear-gradient(to bottom,transparent,#050402)", zIndex: 3,
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "80px",
          background: "linear-gradient(to bottom,#050402,transparent)", zIndex: 3,
        }} />
      </div>

      {/* Content */}
      <div className="nick-grid" style={{
        position: "relative", zIndex: 4, width: "100%",
        padding: "6rem clamp(1.5rem,6vw,6rem)",
        display: "grid", gap: "2.5rem",
      }}>
        {/* Left — text */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", maxWidth: "520px" }}>
          <p className="nick-cat" style={{
            color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.42em",
            textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
            fontWeight: 700, margin: 0, opacity: 0, transform: "translateY(16px)",
          }}>
            Theme Park · Nickelodeon Universe
          </p>
          <h2 className="nick-headline" style={{
            color: "#ffffff", fontSize: "clamp(2.4rem,5.5vw,5.2rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: 0, lineHeight: 0.95, opacity: 0, transform: "translateY(24px)",
          }}>
            7 roller<br />coasters.
          </h2>
          <h3 className="nick-sub" style={{
            color: "rgba(255,255,255,0.42)", fontSize: "clamp(1.2rem,2.8vw,2.2rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: 0, lineHeight: 1.1, opacity: 0, transform: "translateY(20px)",
          }}>
            Inside a mall.
          </h3>
          <div className="nick-divider" style={{
            width: "48px", height: "2px",
            background: "linear-gradient(to right,#C9A84C,rgba(201,168,76,0.2))",
            transform: "scaleX(0)", transformOrigin: "left",
          }} />
          <p className="nick-body" style={{
            color: "rgba(255,255,255,0.55)", fontSize: "clamp(0.82rem,1.3vw,0.95rem)",
            fontFamily: "var(--font-montserrat)", fontWeight: 400,
            lineHeight: 1.8, margin: 0, maxWidth: "420px",
            opacity: 0, transform: "translateY(16px)",
          }}>
            Nickelodeon Universe is the largest indoor theme park in North
            America — and it lives inside Mall of America. Your brand sits
            steps away from the most visited attraction in Minnesota, drawing
            families from across the continent every single day.
          </p>
          {/* Stat pills */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginTop: "0.4rem" }}>
            {NICK_STATS.map(s => (
              <div key={s.value} className="nick-stat" style={{
                background: "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.18)",
                padding: "0.75rem 1rem",
                opacity: 0, transform: "translateY(12px)",
              }}>
                <div style={{
                  color: "#C9A84C", fontSize: "clamp(1.1rem,2vw,1.5rem)",
                  fontWeight: 800, fontFamily: "var(--font-montserrat)",
                  lineHeight: 1, fontVariantNumeric: "tabular-nums",
                }}>{s.value}</div>
                <div style={{
                  color: "rgba(255,255,255,0.38)", fontSize: "0.58rem",
                  letterSpacing: "0.14em", textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)", fontWeight: 600, marginTop: "0.25rem",
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — thumbnails */}
        <div className="nick-thumbs-col" style={{
          display: "flex", flexDirection: "column", gap: "1px", alignSelf: "center",
        }}>
          {NICK_THUMBS.map(t => (
            <div key={t.src} className="nick-thumb" style={{
              position: "relative", width: "100%",
              height: "clamp(140px,18vw,220px)", overflow: "hidden",
              opacity: 0, transform: "translateX(40px)",
            }}>
              <Image
                src={t.src} alt={t.label} fill
                sizes="(max-width:768px) 100vw, 35vw"
                style={{ objectFit: "cover", transition: "transform 0.55s ease" }}
                onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.06)"; }}
                onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top,rgba(5,4,2,0.78) 0%,transparent 60%)",
              }} />
              <div style={{ position: "absolute", bottom: "0.8rem", left: "0.9rem", zIndex: 2 }}>
                <div style={{
                  color: "#C9A84C", fontSize: "0.62rem", fontWeight: 700,
                  letterSpacing: "0.2em", textTransform: "uppercase",
                  fontFamily: "var(--font-montserrat)", lineHeight: 1,
                }}>{t.label}</div>
                <div style={{
                  color: "rgba(255,255,255,0.45)", fontSize: "0.58rem",
                  fontFamily: "var(--font-montserrat)", marginTop: "0.2rem",
                }}>{t.desc}</div>
              </div>
              <div style={{
                position: "absolute", top: "8px", right: "8px",
                width: "14px", height: "14px",
                borderTop: "1px solid rgba(201,168,76,0.5)",
                borderRight: "1px solid rgba(201,168,76,0.5)",
              }} />
            </div>
          ))}
          <div style={{
            borderTop: "1px solid rgba(201,168,76,0.12)", paddingTop: "0.8rem",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{
              color: "rgba(255,255,255,0.28)", fontSize: "0.6rem",
              letterSpacing: "0.18em", textTransform: "uppercase",
              fontFamily: "var(--font-montserrat)", fontWeight: 600,
            }}>
              North America&apos;s largest indoor park
            </span>
            <span style={{ color: "#C9A84C", fontSize: "0.75rem", opacity: 0.7 }}>→</span>
          </div>
        </div>
      </div>

      {/* Panel number */}
      <div style={{
        position: "absolute", right: "clamp(1.5rem,5vw,4rem)", bottom: "3rem",
        color: "rgba(201,168,76,0.07)", fontSize: "clamp(5rem,12vw,10rem)",
        fontWeight: 800, fontFamily: "var(--font-montserrat)",
        lineHeight: 1, userSelect: "none", pointerEvents: "none", zIndex: 4,
      }}>01</div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function EntertainmentSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [, setIsMobile] = useState(false);
  const scrollerEl = useScroller();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    if (!scrollerEl) return;
    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !sectionRef.current) return;
      ctx = gsap.context(() => {
        gsap.fromTo(".ent-heading",
          { opacity: 0, y: 28 },
          {
            opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
            scrollTrigger: { trigger: ".ent-heading", start: "top 85%", ...(scrollerEl ? { scroller: scrollerEl } : {}) }
          }
        );
        gsap.fromTo(".ent-chart-head",
          { opacity: 0, y: 24 },
          {
            opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
            scrollTrigger: { trigger: ".ent-chart-head", start: "top 85%", ...(scrollerEl ? { scroller: scrollerEl } : {}) }
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
    <section id="entertainment" ref={sectionRef}
      style={{ background: "#050402", overflow: "hidden" }}
    >
      <div style={{
        height: "1px",
        background: "linear-gradient(to right,transparent,rgba(201,168,76,0.2),transparent)",
      }} />

      <div className="ent-heading" style={{ textAlign: "center", padding: "5rem 1.5rem 4rem" }}>
        <p style={{
          color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.4em",
          textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
          fontWeight: 600, margin: "0 0 0.8rem",
        }}>Beyond retail</p>
        <h2 style={{
          color: "#ffffff", fontSize: "clamp(1.8rem,3.5vw,3rem)",
          fontWeight: 800, fontFamily: "var(--font-montserrat)",
          margin: "0 0 1rem", lineHeight: 1.1,
        }}>
          Entertainment that<br />
          <span style={{ color: "#C9A84C" }}>drives your revenue</span>
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.38)", fontSize: "0.82rem",
          fontFamily: "var(--font-montserrat)", fontWeight: 400,
          margin: "0 auto", maxWidth: "460px", lineHeight: 1.7,
        }}>
          Every attraction brings millions more visitors to your doorstep.
          This isn&apos;t a mall — it&apos;s a destination.
        </p>
      </div>

      {/* All 4 panels */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <NickelodeonPanel scrollerEl={scrollerEl} />
        <AquariumPanel scrollerEl={scrollerEl} />
        <DiningShoppingPanel scrollerEl={scrollerEl} />
        {/* {TEXT_PANELS.map((panel, i) => (
          <TextPanel key={panel.id} panel={panel} index={i} />
        ))} */}
      </div>

      {/* Events panel — full image-driven component */}
      <EventsPanel scrollerEl={scrollerEl} />

      {/* Footfall chart */}
      <div style={{ padding: "6rem clamp(1.5rem,6vw,6rem)", maxWidth: "900px", margin: "0 auto" }}>
        <div className="ent-chart-head" style={{ marginBottom: "2.5rem" }}>
          <p style={{
            color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.35em",
            textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
            fontWeight: 700, margin: "0 0 0.7rem",
          }}>Footfall data</p>
          <h3 style={{
            color: "#ffffff", fontSize: "clamp(1.2rem,2.5vw,1.9rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: "0 0 0.5rem", lineHeight: 1.15,
          }}>
            Entertainment visits<br />
            <span style={{ color: "#C9A84C" }}>directly lift retail footfall</span>
          </h3>
          <p style={{
            color: "rgba(255,255,255,0.35)", fontSize: "0.75rem",
            fontFamily: "var(--font-montserrat)", margin: 0, lineHeight: 1.6,
          }}>Monthly visitor data (millions) — retail vs entertainment correlation</p>
        </div>
        <FootfallChart scrollerEl={scrollerEl} />
        <div style={{ display: "flex", gap: "2rem", marginTop: "1.2rem", flexWrap: "wrap" }}>
          {[
            { color: "#C9A84C", dash: false, label: "Retail footfall" },
            { color: "rgba(201,168,76,0.5)", dash: true, label: "Entertainment footfall" },
          ].map(l => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="24" height="10">
                <line x1="0" y1="5" x2="24" y2="5"
                  stroke={l.color} strokeWidth="2"
                  strokeDasharray={l.dash ? "4 3" : undefined}
                />
              </svg>
              <span style={{
                color: "rgba(255,255,255,0.38)", fontSize: "0.62rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)", fontWeight: 600,
              }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        height: "1px",
        background: "linear-gradient(to right,transparent,rgba(201,168,76,0.15),transparent)",
      }} />

      <style>{`
        .ent-particles-wrap {
          position:absolute; inset:0; z-index:1; pointer-events:none;
        }
        @media (max-width:767px) {
          .ent-particles-wrap { display:none; }
          .nick-thumbs-col    { display:none !important; }
          .nick-grid          { grid-template-columns:1fr !important; }
        }
        @media (min-width:768px) {
          .nick-grid {
            grid-template-columns:1fr 1fr !important;
            align-items:center;
          }
          .nick-thumbs-col { display:flex !important; }
        }
        @media (min-width:1100px) {
          .nick-grid { grid-template-columns:55fr 45fr !important; }
        }
      `}</style>
    </section>
  );
}