"use client";

import {
  useEffect,
  useRef,
  memo,
} from "react";

// ── Lazy GSAP + D3 loaders ─────────────────────────────────────────────────
type GsapType = typeof import("gsap")["default"];
type ScrollTriggerType = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];
type D3Type = typeof import("d3");

let _gsap: GsapType | null = null;
let _ST: ScrollTriggerType | null = null;
let _d3: D3Type | null = null;

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

const loadD3 = async () => {
  if (_d3) return _d3;
  _d3 = await import("d3");
  return _d3;
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const IMPRESSION_DATA = [
  { label: "TV Ad (30s spot)",    value: 0.8,  max: 40 },
  { label: "Billboard (1 year)",  value: 1.2,  max: 40 },
  { label: "Instagram Campaign",  value: 2.4,  max: 40 },
  { label: "Super Bowl Ad",       value: 4.5,  max: 40 },
  { label: "Mall of America",     value: 40,   max: 40, highlight: true },
];

const TIERS = [
  {
    id: "platinum",
    tier: "Platinum",
    tagline: "Total property dominance",
    price: "Custom",
    reach: "40M+ impressions",
    features: [
      "Full atrium naming rights",
      "12 premium digital screens",
      "Seasonal activation space",
      "Co-branded marketing suite",
      "Dedicated account team",
      "Annual impact report",
    ],
    featured: true,
  },
  {
    id: "gold",
    tier: "Gold",
    tagline: "Zone ownership & co-marketing",
    price: "From $250K",
    reach: "18M+ impressions",
    features: [
      "Zone exclusivity rights",
      "4 digital screen placements",
      "Two seasonal activations",
      "Co-branded social campaign",
      "Monthly analytics dashboard",
    ],
    featured: false,
  },
  {
    id: "partner",
    tier: "Partner",
    tagline: "Pop-up presence & event branding",
    price: "From $60K",
    reach: "8M+ impressions",
    features: [
      "Pop-up space allocation",
      "Event co-branding rights",
      "Digital presence package",
      "Quarterly reporting",
    ],
    featured: false,
  },
];

const PLACEMENTS = [
  { name: "Main Atrium",    value: 35, desc: "40M pass-throughs/yr" },
  { name: "North Entrance", value: 18, desc: "Primary access point" },
  { name: "South Entrance", value: 16, desc: "Theme park access" },
  { name: "Food Court",     value: 14, desc: "Highest dwell time" },
  { name: "Digital Screens",value: 10, desc: "12 premium locations" },
  { name: "Event Plaza",    value: 7,  desc: "300+ events/year" },
];

// ─── Impression chart — FIXED ─────────────────────────────────────────────────
// Root cause of the bug: one ScrollTrigger per bar + shared `triggered` flag
// means only the FIRST bar's onEnter runs. Fixed by: single ScrollTrigger
// that fires all bar animations together, staggered by delay.
const ImpressionChart = memo(function ImpressionChart() {
  const svgRef     = useRef<SVGSVGElement>(null);
  const triggered  = useRef(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let cancelled = false;

    Promise.all([loadD3(), loadGsap()]).then(([d3, { gsap, ScrollTrigger }]) => {
      if (cancelled || !el) return;

      const W    = el.parentElement?.clientWidth || 640;
      const rowH = 62;   // taller rows so bars are more dramatic
      const H    = IMPRESSION_DATA.length * rowH + 24;
      const ml   = 172;  // label column width
      const mr   = 80;   // value text column
      const barMaxW = W - ml - mr;

      const svg = d3
        .select(el)
        .attr("width",   W)
        .attr("height",  H)
        .attr("viewBox", `0 0 ${W} ${H}`);

      // Clear any previous render (React StrictMode double-invoke guard)
      svg.selectAll("*").remove();

      const x = d3.scaleLinear().domain([0, 40]).range([0, barMaxW]);

      // ── Build all bar elements first, collect refs ──────────────────────
      type BarRef = {
        bar:     d3.Selection<SVGRectElement, unknown, null, undefined>;
        valText: d3.Selection<SVGTextElement, unknown, null, undefined>;
        targetW: number;
        targetV: number;
        isHL:    boolean;
        delay:   number;
      };
      const barRefs: BarRef[] = [];

      IMPRESSION_DATA.forEach((d, i) => {
        const y    = i * rowH + rowH / 2;
        const isHL = !!d.highlight;

        const labelColor = isHL ? "#C9A84C" : "rgba(255,255,255,0.42)";
        const barColor   = isHL ? "#C9A84C" : "rgba(201,168,76,0.28)";
        const barH       = isHL ? 18 : 12;

        // Label
        svg.append("text")
          .attr("x",            ml - 14)
          .attr("y",            y + 4)
          .attr("text-anchor",  "end")
          .attr("font-size",    isHL ? "11.5px" : "10px")
          .attr("font-weight",  isHL ? "800" : "500")
          .attr("font-family",  "var(--font-montserrat)")
          .attr("fill",         labelColor)
          .attr("letter-spacing", "0.05em")
          .text(d.label);

        // Track background (full width)
        svg.append("rect")
          .attr("x",      ml)
          .attr("y",      y - barH / 2)
          .attr("width",  barMaxW)
          .attr("height", barH)
          .attr("rx",     isHL ? 2 : 1.5)
          .attr("fill",   "rgba(255,255,255,0.04)");

        // Animated bar — starts at width 0
        const bar = svg.append("rect")
          .attr("x",      ml)
          .attr("y",      y - barH / 2)
          .attr("width",  0)               // ← starts at 0, animated to target
          .attr("height", barH)
          .attr("rx",     isHL ? 2 : 1.5)
          .attr("fill",   barColor);

        // Gold glow effect for highlight bar only
        if (isHL) {
          svg.append("rect")
            .attr("x",       ml)
            .attr("y",       y - barH / 2 - 1)
            .attr("width",   0)            // updated alongside bar
            .attr("height",  barH + 2)
            .attr("rx",      2)
            .attr("fill",    "none")
            .attr("stroke",  "rgba(201,168,76,0.4)")
            .attr("stroke-width", 1)
            .attr("class",   "glow-border");
        }

        // Value text — positioned DYNAMICALLY during animation
        const valText = svg.append("text")
          .attr("x",           ml + 8)     // will be updated each frame
          .attr("y",           y + 4)
          .attr("font-size",   isHL ? "11px" : "9.5px")
          .attr("font-weight", "700")
          .attr("font-family", "var(--font-montserrat)")
          .attr("fill",        labelColor)
          .attr("opacity",     0)
          .text("0M");

        barRefs.push({
          bar,
          valText,
          targetW: x(d.value),
          targetV: d.value,
          isHL,
          delay:   i * 0.15,   // stagger delay
        });
      });

      // ── SINGLE ScrollTrigger fires all bars ────────────────────────────
      // FIX: one trigger, one `triggered` guard, all bars animated inside it
      ScrollTrigger.create({
        trigger: el,
        start:   "top 80%",
        once:    true,
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;

          barRefs.forEach(({ bar, valText, targetW, targetV, isHL, delay }) => {
            const proxy = { w: 0, v: 0 };

            gsap.to(proxy, {
              w:        targetW,
              v:        targetV,
              duration: isHL ? 1.8 : 1.2,
              ease:     isHL ? "power3.out" : "power2.out",
              delay,
              onUpdate() {
                // Update bar width
                bar.attr("width", Math.max(0, proxy.w));

                // Keep value text just right of bar leading edge
                valText
                  .attr("x",    ml + proxy.w + 10)
                  .attr("opacity", proxy.w > 4 ? 1 : 0)
                  .text(
                    isHL
                      ? proxy.v.toFixed(0) + "M"
                      : proxy.v.toFixed(1) + "M"
                  );

                // Also update glow border if highlight
                if (isHL) {
                  d3.select(".glow-border").attr("width", Math.max(0, proxy.w));
                }
              },
            });
          });
        },
      });
    });

    return () => {
      cancelled = true;
      loadGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll()
          .filter(st => st.vars.trigger === el)
          .forEach(st => st.kill());
      });
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{ width:"100%", height:"auto", display:"block", overflow:"visible" }}
      aria-label="Sponsorship impression comparison chart"
    />
  );
});

// ─── Placement treemap ────────────────────────────────────────────────────────
const PlacementTreemap = memo(function PlacementTreemap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggered    = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let cancelled = false;

    Promise.all([loadD3(), loadGsap()]).then(([d3, { gsap, ScrollTrigger }]) => {
      if (cancelled || !el) return;

      const W = el.clientWidth  || 500;
      const H = el.clientHeight || 300;

      const svg = d3.select(el)
        .append("svg")
        .attr("width",   W)
        .attr("height",  H)
        .attr("viewBox", `0 0 ${W} ${H}`);

      type PlacementNode = {
        children?: typeof PLACEMENTS;
        name?:     string;
        value?:    number;
        desc?:     string;
      };

      const root = d3.hierarchy<PlacementNode>({ children: PLACEMENTS })
        .sum(d => d.value ?? 0);

      d3.treemap<PlacementNode>()
        .size([W, H])
        .padding(3)
        .round(true)(root);

      const leaves = root.leaves();

      const cell = svg.selectAll("g")
        .data(leaves)
        .enter()
        .append("g")
        .attr("transform", d => {
          const n = d as unknown as d3.HierarchyRectangularNode<typeof PLACEMENTS[0]>;
          return `translate(${n.x0},${n.y0})`;
        });

      cell.append("rect")
        .attr("width",  d => { const n = d as unknown as d3.HierarchyRectangularNode<typeof PLACEMENTS[0]>; return Math.max(0, n.x1 - n.x0); })
        .attr("height", d => { const n = d as unknown as d3.HierarchyRectangularNode<typeof PLACEMENTS[0]>; return Math.max(0, n.y1 - n.y0); })
        .attr("fill",   (_, i) => `rgba(201,168,76,${(0.06 + (i / PLACEMENTS.length) * 0.12).toFixed(2)})`)
        .attr("stroke", "rgba(201,168,76,0.15)")
        .attr("stroke-width", 1)
        .attr("opacity", 0);

      cell.append("text")
        .attr("x", 8).attr("y", 18)
        .attr("font-size", "9px").attr("font-weight", "700")
        .attr("font-family", "var(--font-montserrat)")
        .attr("fill", "rgba(201,168,76,0.9)")
        .attr("letter-spacing", "0.08em")
        .attr("opacity", 0)
        .text(d => (d.data as unknown as { name: string }).name.toUpperCase());

      cell.append("text")
        .attr("x", 8).attr("y", 32)
        .attr("font-size", "8px").attr("font-weight", "400")
        .attr("font-family", "var(--font-montserrat)")
        .attr("fill", "rgba(255,255,255,0.3)")
        .attr("opacity", 0)
        .text(d => (d.data as unknown as { desc: string }).desc);

      ScrollTrigger.create({
        trigger: el,
        start:   "top 82%",
        once:    true,
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          cell.selectAll("rect").each(function (_, i) {
            gsap.to(this, { opacity: 1, duration: 0.5, delay: i * 0.08, ease: "power2.out" });
          });
          cell.selectAll("text").each(function (_, i) {
            gsap.to(this, { opacity: 1, duration: 0.4, delay: 0.3 + i * 0.05, ease: "power2.out" });
          });
        },
      });
    });

    return () => {
      cancelled = true;
      Promise.all([loadD3(), loadGsap()]).then(([d3, { ScrollTrigger }]) => {
        ScrollTrigger.getAll()
          .filter(st => st.vars.trigger === el)
          .forEach(st => st.kill());
        d3.select(el).select("svg").remove();
      });
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width:"100%", height:"280px" }}
      aria-label="Sponsor placement zones at Mall of America" />
  );
});

// ─── Tier card ────────────────────────────────────────────────────────────────
function TierCard({ tier, index }: { tier: typeof TIERS[0]; index: number }) {
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r  = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width  - 0.5) * 8;
    const my = ((e.clientY - r.top)  / r.height - 0.5) * -8;
    loadGsap().then(({ gsap }) => {
      gsap.to(e.currentTarget, {
        rotateY: mx, rotateX: my,
        duration: 0.35, ease: "power2.out",
        transformPerspective: 700,
      });
    });
  };
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    loadGsap().then(({ gsap }) => {
      gsap.to(e.currentTarget, {
        rotateY: 0, rotateX: 0,
        duration: 0.55, ease: "elastic.out(1,0.5)",
        transformPerspective: 700,
      });
    });
  };

  return (
    <div
      className={`spon-tier-card spon-tier-card-${index}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onMouseEnter={e => { if (!tier.featured) e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)"; }}
      style={{
        position:   "relative",
        background: tier.featured
          ? "linear-gradient(160deg,rgba(201,168,76,0.12) 0%,rgba(201,168,76,0.04) 100%)"
          : "rgba(255,255,255,0.02)",
        border: tier.featured
          ? "1px solid rgba(201,168,76,0.5)"
          : "1px solid rgba(201,168,76,0.1)",
        padding:       "2rem 1.8rem",
        display:       "flex",
        flexDirection: "column",
        gap:           "1.2rem",
        willChange:    "transform",
        transformStyle:"preserve-3d",
        transition:    "border-color 0.25s ease",
      }}
    >
      {tier.featured && (
        <div style={{
          position:      "absolute",
          top:           "-1px",
          left:          "50%",
          transform:     "translateX(-50%)",
          background:    "#C9A84C",
          color:         "#000000",
          fontSize:      "0.55rem",
          fontWeight:    800,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontFamily:    "var(--font-montserrat)",
          padding:       "4px 14px",
          whiteSpace:    "nowrap",
        }}>
          Most Exclusive
        </div>
      )}

      <div>
        <p style={{
          color:         tier.featured ? "#C9A84C" : "rgba(201,168,76,0.55)",
          fontSize:      "0.6rem",
          letterSpacing: "0.35em",
          textTransform: "uppercase",
          fontFamily:    "var(--font-montserrat)",
          fontWeight:    700,
          margin:        "0 0 0.4rem",
        }}>
          {tier.tier}
        </p>
        <h3 style={{
          color:      "#ffffff",
          fontSize:   "clamp(1rem,1.8vw,1.25rem)",
          fontWeight: 800,
          fontFamily: "var(--font-montserrat)",
          margin:     "0 0 0.2rem",
          lineHeight: 1.2,
        }}>
          {tier.tagline}
        </h3>
      </div>

      <div style={{
        display:    "inline-flex",
        alignSelf:  "flex-start",
        alignItems: "center",
        gap:        "0.5rem",
        background: "rgba(201,168,76,0.08)",
        border:     "1px solid rgba(201,168,76,0.2)",
        padding:    "5px 12px",
      }}>
        <div style={{ width:"5px", height:"5px", background:"#C9A84C", transform:"rotate(45deg)", flexShrink:0 }} />
        <span style={{ color:"#C9A84C", fontSize:"0.65rem", fontWeight:700, fontFamily:"var(--font-montserrat)", letterSpacing:"0.1em" }}>
          {tier.reach}
        </span>
      </div>

      <ul style={{ listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:"0.6rem", flexGrow:1 }}>
        {tier.features.map(f => (
          <li key={f} style={{ display:"flex", alignItems:"flex-start", gap:"0.6rem",
            color:"rgba(255,255,255,0.55)", fontSize:"0.72rem",
            fontFamily:"var(--font-montserrat)", fontWeight:400, lineHeight:1.5 }}>
            <span style={{ width:"4px", height:"4px", background:"#C9A84C", transform:"rotate(45deg)", flexShrink:0, marginTop:"6px" }} />
            {f}
          </li>
        ))}
      </ul>

      <div style={{
        paddingTop:     "1.2rem",
        borderTop:      "1px solid rgba(255,255,255,0.06)",
        display:        "flex",
        alignItems:     "center",
        justifyContent: "space-between",
        gap:            "1rem",
        flexWrap:       "wrap",
      }}>
        <div>
          <div style={{ color:"#C9A84C", fontSize:"clamp(1rem,1.8vw,1.3rem)", fontWeight:800, fontFamily:"var(--font-montserrat)", lineHeight:1 }}>
            {tier.price}
          </div>
          <div style={{ color:"rgba(255,255,255,0.25)", fontSize:"0.58rem", fontFamily:"var(--font-montserrat)", marginTop:"0.2rem", letterSpacing:"0.08em" }}>
            per year
          </div>
        </div>
        <button
          onClick={() => document.querySelector("#cta")?.scrollIntoView({ behavior:"smooth" })}
          onMouseEnter={e => { e.currentTarget.style.background="#C9A84C"; e.currentTarget.style.color="#000000"; }}
          onMouseLeave={e => {
            e.currentTarget.style.background = tier.featured ? "#C9A84C" : "transparent";
            e.currentTarget.style.color      = tier.featured ? "#000000" : "#C9A84C";
          }}
          style={{
            background:    tier.featured ? "#C9A84C" : "transparent",
            border:        "1px solid #C9A84C",
            color:         tier.featured ? "#000000" : "#C9A84C",
            fontSize:      "0.6rem",
            fontWeight:    700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            padding:       "8px 16px",
            cursor:        "pointer",
            transition:    "background 0.22s, color 0.22s",
            whiteSpace:    "nowrap",
          }}
        >
          Enquire
        </button>
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function SponsorshipSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !sectionRef.current) return;
      const ctx = gsap.context(() => {
        gsap.fromTo(".spon-heading",
          { opacity:0, y:28 },
          { opacity:1, y:0, duration:0.9, ease:"power2.out",
            scrollTrigger:{ trigger:".spon-heading", start:"top 85%" } }
        );
        gsap.fromTo(".spon-hook-text",
          { opacity:0, y:36 },
          { opacity:1, y:0, duration:1, ease:"power2.out",
            scrollTrigger:{ trigger:".spon-hook-text", start:"top 80%" } }
        );
        gsap.fromTo(".spon-tier-card",
          { opacity:0, y:44 },
          { opacity:1, y:0, duration:0.75, ease:"power2.out", stagger:0.13,
            scrollTrigger:{ trigger:".spon-tiers-grid", start:"top 82%" } }
        );
        gsap.fromTo(".spon-tree-heading",
          { opacity:0, y:24 },
          { opacity:1, y:0, duration:0.8, ease:"power2.out",
            scrollTrigger:{ trigger:".spon-tree-heading", start:"top 85%" } }
        );
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="sponsorship" ref={sectionRef} style={{ background:"#050402", overflow:"hidden" }}>
      <div style={{ height:"1px", background:"linear-gradient(to right,transparent,rgba(201,168,76,0.2),transparent)" }} />

      {/* Heading */}
      <div className="spon-heading" style={{ textAlign:"center", padding:"5rem 1.5rem 4rem" }}>
        <p style={{ color:"#C9A84C", fontSize:"0.7rem", letterSpacing:"0.4em", textTransform:"uppercase",
          fontFamily:"var(--font-montserrat)", fontWeight:600, margin:"0 0 0.8rem" }}>
          Sponsorship & partnerships
        </p>
        <h2 style={{ color:"#ffffff", fontSize:"clamp(1.8rem,3.5vw,3rem)", fontWeight:800,
          fontFamily:"var(--font-montserrat)", margin:"0 0 1rem", lineHeight:1.1 }}>
          Own your audience.<br />
          <span style={{ color:"#C9A84C" }}>40 million times a year.</span>
        </h2>
        <p style={{ color:"rgba(255,255,255,0.38)", fontSize:"0.82rem", fontFamily:"var(--font-montserrat)",
          fontWeight:400, margin:"0 auto", maxWidth:"460px", lineHeight:1.7 }}>
          Most ads are ignored. Mall of America is impossible to ignore.
          Your brand lives inside the most visited retail destination in America.
        </p>
      </div>

      {/* Impression chart */}
      <div style={{ padding:"0 clamp(1.5rem,6vw,6rem) 5rem", maxWidth:"800px", margin:"0 auto" }}>
        <div className="spon-hook-text" style={{ marginBottom:"2.5rem" }}>
          <p style={{ color:"#C9A84C", fontSize:"0.68rem", letterSpacing:"0.35em", textTransform:"uppercase",
            fontFamily:"var(--font-montserrat)", fontWeight:700, margin:"0 0 0.7rem" }}>
            Impression comparison
          </p>
          <h3 style={{ color:"#ffffff", fontSize:"clamp(1.2rem,2.5vw,1.9rem)", fontWeight:800,
            fontFamily:"var(--font-montserrat)", margin:"0 0 0.5rem", lineHeight:1.15 }}>
            No platform delivers<br />
            <span style={{ color:"#C9A84C" }}>more eyeballs, period.</span>
          </h3>
          <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.72rem", fontFamily:"var(--font-montserrat)",
            margin:0, lineHeight:1.6 }}>
            Annual impression comparison (millions) vs major ad formats
          </p>
        </div>

        {/* ── Visual legend above chart ── */}
        <div style={{ display:"flex", gap:"1.5rem", marginBottom:"1.8rem", flexWrap:"wrap" }}>
          {[
            { color:"rgba(201,168,76,0.28)", label:"Other platforms" },
            { color:"#C9A84C",              label:"Mall of America" },
          ].map(l => (
            <div key={l.label} style={{ display:"flex", alignItems:"center", gap:"0.5rem" }}>
              <div style={{ width:"20px", height:"8px", background:l.color, borderRadius:"1px" }} />
              <span style={{ color:"rgba(255,255,255,0.38)", fontSize:"0.6rem", letterSpacing:"0.12em",
                textTransform:"uppercase", fontFamily:"var(--font-montserrat)", fontWeight:600 }}>
                {l.label}
              </span>
            </div>
          ))}
        </div>

        <ImpressionChart />

        {/* Annotation below chart */}
        <div style={{ marginTop:"1.4rem", paddingLeft:"172px" }}>
          <p style={{ color:"rgba(201,168,76,0.55)", fontSize:"0.62rem", fontFamily:"var(--font-montserrat)",
            fontWeight:600, letterSpacing:"0.08em", margin:0 }}>
            ↑ Mall of America delivers 50× more impressions than a Super Bowl ad — annually.
          </p>
        </div>
      </div>

      {/* Tiers */}
      <div style={{ padding:"0 clamp(1.2rem,4vw,4rem) 5rem" }}>
        <p style={{ color:"rgba(255,255,255,0.22)", fontSize:"0.58rem", letterSpacing:"0.3em",
          textTransform:"uppercase", fontFamily:"var(--font-montserrat)", fontWeight:600, margin:"0 0 1.5rem" }}>
          Partnership tiers
        </p>
        <div className="spon-tiers-grid">
          {TIERS.map((t, i) => <TierCard key={t.id} tier={t} index={i} />)}
        </div>
      </div>

      {/* Treemap */}
      <div style={{ padding:"0 clamp(1.2rem,4vw,4rem) 6rem" }}>
        <div className="spon-tree-heading" style={{ marginBottom:"2rem" }}>
          <p style={{ color:"#C9A84C", fontSize:"0.68rem", letterSpacing:"0.35em", textTransform:"uppercase",
            fontFamily:"var(--font-montserrat)", fontWeight:700, margin:"0 0 0.6rem" }}>
            Placement zones
          </p>
          <h3 style={{ color:"#ffffff", fontSize:"clamp(1.1rem,2vw,1.6rem)", fontWeight:800,
            fontFamily:"var(--font-montserrat)", margin:"0 0 0.4rem", lineHeight:1.15 }}>
            Where your brand lives<br />
            <span style={{ color:"#C9A84C" }}>inside the property</span>
          </h3>
          <p style={{ color:"rgba(255,255,255,0.28)", fontSize:"0.7rem", fontFamily:"var(--font-montserrat)",
            margin:0, lineHeight:1.6 }}>
            Zone sizes represent relative visitor exposure
          </p>
        </div>
        <div style={{ border:"1px solid rgba(201,168,76,0.1)", padding:"1px", background:"rgba(201,168,76,0.03)" }}>
          <PlacementTreemap />
        </div>
      </div>

      <div style={{ height:"1px", background:"linear-gradient(to right,transparent,rgba(201,168,76,0.15),transparent)" }} />

      <style>{`
        .spon-tiers-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(201,168,76,0.07);
          border: 1px solid rgba(201,168,76,0.07);
        }
        @media (min-width: 640px) {
          .spon-tiers-grid { grid-template-columns: repeat(3,1fr); }
        }
      `}</style>
    </section>
  );
}