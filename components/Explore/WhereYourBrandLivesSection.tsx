"use client";

import {
  useEffect,
  useRef,
  useState,
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
const PLACEMENTS = [
  { name: "Main Atrium",    value: 35, desc: "40M pass-throughs/yr" },
  { name: "North Entrance", value: 18, desc: "Primary access point" },
  { name: "South Entrance", value: 16, desc: "Theme park access" },
  { name: "Food Court",     value: 14, desc: "Highest dwell time" },
  { name: "Digital Screens",value: 10, desc: "12 premium locations" },
  { name: "Event Plaza",    value: 7,  desc: "300+ events/year" },
];

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

      // Auto-trigger animations immediately (no scroll trigger needed since it's a full page)
      if (!triggered.current) {
        triggered.current = true;
        cell.selectAll("rect").each(function (_, i) {
          gsap.to(this, { opacity: 1, duration: 0.5, delay: 0.3 + i * 0.08, ease: "power2.out" });
        });
        cell.selectAll("text").each(function (_, i) {
          gsap.to(this, { opacity: 1, duration: 0.4, delay: 0.6 + i * 0.05, ease: "power2.out" });
        });
      }

      // Suppress unused variable warning
      void ScrollTrigger;
    });

    return () => {
      cancelled = true;
      Promise.all([loadD3(), loadGsap()]).then(([d3]) => {
        d3.select(el).select("svg").remove();
      });
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width:"100%", height:"100%" }}
      aria-label="Sponsor placement zones at Mall of America" />
  );
});

// ─── Main section ─────────────────────────────────────────────────────────────
export default function WhereYourBrandLivesSection() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section
      style={{
        width: "100%",
        height: "100vh",
        background: "#050402",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Top divider */}
      <div style={{ height: "1px", background: "linear-gradient(to right,transparent,rgba(201,168,76,0.2),transparent)", flexShrink: 0 }} />

      {/* Content wrapper — centers everything in viewport */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(1.5rem, 4vh, 3rem) clamp(1.2rem,4vw,4rem)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Heading */}
        <div style={{ marginBottom: "clamp(1rem, 2.5vh, 2rem)" }}>
          <p style={{
            color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.35em", textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)", fontWeight: 700, margin: "0 0 0.6rem"
          }}>
            Placement zones
          </p>
          <h2 style={{
            color: "#ffffff", fontSize: "clamp(1.1rem,2vw,1.6rem)", fontWeight: 800,
            fontFamily: "var(--font-montserrat)", margin: "0 0 0.4rem", lineHeight: 1.15
          }}>
            Where your brand lives<br />
            <span style={{ color: "#C9A84C" }}>inside the property</span>
          </h2>
          <p style={{
            color: "rgba(255,255,255,0.28)", fontSize: "0.7rem", fontFamily: "var(--font-montserrat)",
            margin: 0, lineHeight: 1.6
          }}>
            Zone sizes represent relative visitor exposure
          </p>
        </div>

        {/* Treemap container — takes remaining space */}
        <div
          style={{
            border: "1px solid rgba(201,168,76,0.1)",
            padding: "1px",
            background: "rgba(201,168,76,0.03)",
            flex: 1,
            minHeight: "200px",
            maxHeight: "clamp(250px, 50vh, 450px)",
          }}
        >
          <PlacementTreemap />
        </div>
      </div>

      {/* Bottom divider */}
      <div style={{ height: "1px", background: "linear-gradient(to right,transparent,rgba(201,168,76,0.15),transparent)", flexShrink: 0 }} />
    </section>
  );
}
