"use client";

import { useEffect, useRef, useState, memo } from "react";

// ── Lazy GSAP + D3 loaders ─────────────────────────────────────────────────
type GsapType = typeof import("gsap")["default"];
type ScrollTriggerType = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];
type D3Type = typeof import("d3");

let _gsap: GsapType | null = null;
let _ST: ScrollTriggerType | null = null;
let _d3: D3Type | null = null;

const loadGsap = async () => {
  if (_gsap && _ST) return { gsap: _gsap, ScrollTrigger: _ST };
  const [gsapMod, stMod] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
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

// ─── Footfall Data ────────────────────────────────────────────────────────────
const FOOTFALL_DATA = [
  { month: "Jan", visitors: 3.2 },
  { month: "Feb", visitors: 2.8 },
  { month: "Mar", visitors: 3.5 },
  { month: "Apr", visitors: 3.1 },
  { month: "May", visitors: 3.8 },
  { month: "Jun", visitors: 4.2 },
  { month: "Jul", visitors: 4.6 },
  { month: "Aug", visitors: 4.4 },
  { month: "Sep", visitors: 3.7 },
  { month: "Oct", visitors: 3.9 },
  { month: "Nov", visitors: 4.8 },
  { month: "Dec", visitors: 5.2 },
];

const REVENUE_STREAMS = [
  { label: "Retail Sales", value: 2.1, unit: "B", color: "#C9A84C" },
  { label: "Event Revenue", value: 340, unit: "M", color: "rgba(201,168,76,0.7)" },
  { label: "Sponsorship", value: 85, unit: "M", color: "rgba(201,168,76,0.5)" },
  { label: "Dining & F&B", value: 420, unit: "M", color: "rgba(201,168,76,0.6)" },
];

// ─── Impression data (from Sponsorship) ───────────────────────────────────────
const IMPRESSION_DATA = [
  { label: "TV Ad (30s spot)", value: 0.8, max: 40 },
  { label: "Billboard (1 year)", value: 1.2, max: 40 },
  { label: "Instagram Campaign", value: 2.4, max: 40 },
  { label: "Super Bowl Ad", value: 4.5, max: 40 },
  { label: "Mall of America", value: 40, max: 40, highlight: true },
];

// ─── Footfall Line Chart ──────────────────────────────────────────────────────
const FootfallChart = memo(function FootfallChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let cancelled = false;

    Promise.all([loadD3(), loadGsap()]).then(([d3, { gsap }]) => {
      if (cancelled || !el) return;

      const container = el.parentElement;
      const W = container?.clientWidth || 500;
      const H = Math.min(280, W * 0.55);
      const ml = 45, mr = 20, mt = 20, mb = 35;
      const innerW = W - ml - mr;
      const innerH = H - mt - mb;

      const svg = d3.select(el).attr("width", W).attr("height", H).attr("viewBox", `0 0 ${W} ${H}`);
      svg.selectAll("*").remove();

      const x = d3.scalePoint<string>().domain(FOOTFALL_DATA.map(d => d.month)).range([0, innerW]).padding(0.1);
      const y = d3.scaleLinear().domain([0, 6]).range([innerH, 0]);

      const g = svg.append("g").attr("transform", `translate(${ml},${mt})`);

      // Grid lines
      [1, 2, 3, 4, 5].forEach(v => {
        g.append("line").attr("x1", 0).attr("x2", innerW).attr("y1", y(v)).attr("y2", y(v))
          .attr("stroke", "rgba(255,255,255,0.06)").attr("stroke-dasharray", "3,3");
      });

      // Y-axis labels
      [0, 2, 4, 6].forEach(v => {
        g.append("text").attr("x", -10).attr("y", y(v) + 4).attr("text-anchor", "end")
          .attr("font-size", "9px").attr("font-family", "var(--font-montserrat)")
          .attr("fill", "rgba(255,255,255,0.3)").attr("font-weight", "500").text(`${v}M`);
      });

      // X-axis labels
      FOOTFALL_DATA.forEach(d => {
        g.append("text").attr("x", x(d.month)!).attr("y", innerH + 22).attr("text-anchor", "middle")
          .attr("font-size", "8px").attr("font-family", "var(--font-montserrat)")
          .attr("fill", "rgba(255,255,255,0.3)").attr("font-weight", "600")
          .attr("letter-spacing", "0.06em").text(d.month);
      });

      // Area gradient
      const gradId = "footfall-grad-" + Math.random().toString(36).slice(2, 8);
      const defs = svg.append("defs");
      const grad = defs.append("linearGradient").attr("id", gradId).attr("x1", "0%").attr("y1", "0%").attr("x2", "0%").attr("y2", "100%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", "#C9A84C").attr("stop-opacity", 0.25);
      grad.append("stop").attr("offset", "100%").attr("stop-color", "#C9A84C").attr("stop-opacity", 0.02);

      // Area path
      const area = d3.area<typeof FOOTFALL_DATA[0]>()
        .x(d => x(d.month)!).y0(innerH).y1(d => y(d.visitors)).curve(d3.curveMonotoneX);

      const areaPath = g.append("path").datum(FOOTFALL_DATA).attr("d", area)
        .attr("fill", `url(#${gradId})`).attr("opacity", 0);

      // Line path
      const line = d3.line<typeof FOOTFALL_DATA[0]>()
        .x(d => x(d.month)!).y(d => y(d.visitors)).curve(d3.curveMonotoneX);

      const linePath = g.append("path").datum(FOOTFALL_DATA).attr("d", line)
        .attr("fill", "none").attr("stroke", "#C9A84C").attr("stroke-width", 2);

      const totalLen = (linePath.node() as SVGPathElement).getTotalLength();
      linePath.attr("stroke-dasharray", totalLen).attr("stroke-dashoffset", totalLen);

      // Dots
      const dots = g.selectAll(".fr-dot").data(FOOTFALL_DATA).enter().append("circle")
        .attr("cx", d => x(d.month)!).attr("cy", d => y(d.visitors))
        .attr("r", 3.5).attr("fill", "#C9A84C").attr("stroke", "#050402").attr("stroke-width", 2).attr("opacity", 0);

      // Animate on view
      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        obs.disconnect();

        gsap.to(linePath.node(), { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" });
        gsap.to(areaPath.node(), { opacity: 1, duration: 1.2, delay: 0.6, ease: "power2.out" });
        dots.nodes().forEach((node, i) => {
          gsap.to(node, { opacity: 1, duration: 0.4, delay: 0.8 + i * 0.08, ease: "power2.out" });
        });
      }, { rootMargin: "100px", threshold: 0 });

      obs.observe(el);
    });

    return () => { cancelled = true; };
  }, []);

  return <svg ref={svgRef} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }} aria-label="Monthly footfall chart" />;
});

// ─── Impression Bar Chart ─────────────────────────────────────────────────────
const ImpressionChart = memo(function ImpressionChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    let cancelled = false;

    Promise.all([loadD3(), loadGsap()]).then(([d3, { gsap }]) => {
      if (cancelled || !el) return;

      const container = el.parentElement;
      const W = container?.clientWidth || 500;
      const rowH = 48;
      const H = IMPRESSION_DATA.length * rowH + 20;
      const ml = 140, mr = 65;
      const barMaxW = W - ml - mr;

      const svg = d3.select(el).attr("width", W).attr("height", H).attr("viewBox", `0 0 ${W} ${H}`);
      svg.selectAll("*").remove();

      const x = d3.scaleLinear().domain([0, 40]).range([0, barMaxW]);

      type BarRef = { bar: d3.Selection<SVGRectElement, unknown, null, undefined>; valText: d3.Selection<SVGTextElement, unknown, null, undefined>; targetW: number; targetV: number; isHL: boolean; delay: number };
      const barRefs: BarRef[] = [];

      IMPRESSION_DATA.forEach((d, i) => {
        const yPos = i * rowH + rowH / 2;
        const isHL = !!d.highlight;
        const labelColor = isHL ? "#C9A84C" : "rgba(255,255,255,0.42)";
        const barColor = isHL ? "#C9A84C" : "rgba(201,168,76,0.28)";
        const barH = isHL ? 16 : 10;

        svg.append("text").attr("x", ml - 12).attr("y", yPos + 4).attr("text-anchor", "end")
          .attr("font-size", isHL ? "10.5px" : "9px").attr("font-weight", isHL ? "800" : "500")
          .attr("font-family", "var(--font-montserrat)").attr("fill", labelColor)
          .attr("letter-spacing", "0.05em").text(d.label);

        svg.append("rect").attr("x", ml).attr("y", yPos - barH / 2).attr("width", barMaxW)
          .attr("height", barH).attr("rx", isHL ? 2 : 1.5).attr("fill", "rgba(255,255,255,0.04)");

        const bar = svg.append("rect").attr("x", ml).attr("y", yPos - barH / 2).attr("width", 0)
          .attr("height", barH).attr("rx", isHL ? 2 : 1.5).attr("fill", barColor);

        const valText = svg.append("text").attr("x", ml + 8).attr("y", yPos + 4)
          .attr("font-size", isHL ? "10px" : "8.5px").attr("font-weight", "700")
          .attr("font-family", "var(--font-montserrat)").attr("fill", labelColor).attr("opacity", 0).text("0M");

        barRefs.push({ bar, valText, targetW: x(d.value), targetV: d.value, isHL, delay: i * 0.15 });
      });

      const obs = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        obs.disconnect();

        barRefs.forEach(({ bar, valText, targetW, targetV, isHL, delay }) => {
          const proxy = { w: 0, v: 0 };
          gsap.to(proxy, {
            w: targetW, v: targetV, duration: isHL ? 1.8 : 1.2, ease: isHL ? "power3.out" : "power2.out", delay,
            onUpdate() {
              bar.attr("width", Math.max(0, proxy.w));
              valText.attr("x", ml + proxy.w + 10).attr("opacity", proxy.w > 4 ? 1 : 0)
                .text(isHL ? proxy.v.toFixed(0) + "M" : proxy.v.toFixed(1) + "M");
            },
          });
        });
      }, { rootMargin: "100px", threshold: 0 });

      obs.observe(el);
    });

    return () => { cancelled = true; };
  }, []);

  return <svg ref={svgRef} style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }} aria-label="Impression comparison chart" />;
});

// ─── Revenue Stat Pill ────────────────────────────────────────────────────────
function RevenuePill({ stream, index }: { stream: typeof REVENUE_STREAMS[0]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setTimeout(() => setVisible(true), index * 120); obs.disconnect(); } }, { rootMargin: "50px", threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [index]);

  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,0.025)", border: "1px solid rgba(201,168,76,0.12)",
      padding: "1rem 1.2rem", display: "flex", alignItems: "center", gap: "1rem",
      opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: "opacity 0.6s ease, transform 0.6s ease",
    }}>
      <div style={{ width: "4px", height: "28px", background: stream.color, borderRadius: "2px", flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "var(--font-montserrat)", fontWeight: 600, marginBottom: "0.2rem" }}>
          {stream.label}
        </div>
        <div style={{ color: "#C9A84C", fontSize: "clamp(1.1rem,2vw,1.4rem)", fontWeight: 800, fontFamily: "var(--font-montserrat)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
          ${stream.value}{stream.unit}
        </div>
      </div>
    </div>
  );
}

// ─── Main Slide ───────────────────────────────────────────────────────────────
export default function FootfallRevenueSlide() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const tr = (d: number) => `opacity 0.7s ease ${d}s, transform 0.7s ease ${d}s`;

  return (
    <div style={{
      width: "100%", height: "100vh", overflow: "auto",
      background: "#050402", position: "relative",
      display: "flex", flexDirection: "column",
      fontFamily: "var(--font-montserrat)",
    }}>
      {/* ── TOP BAR ── */}
      <div style={{
        height: "48px", flexShrink: 0, display: "flex", alignItems: "center",
        justifyContent: "center", padding: "0 clamp(1.2rem,3.5vw,2.5rem)",
        borderBottom: "1px solid rgba(201,168,76,0.1)",
        opacity: visible ? 1 : 0, transition: tr(0),
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#C9A84C", fontSize: "0.47rem", letterSpacing: "0.42em", textTransform: "uppercase", fontWeight: 700, margin: 0 }}>
            Footfall · Revenue
          </p>
          <h1 style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 800, margin: 0, lineHeight: 1, letterSpacing: "0.09em", textTransform: "uppercase" }}>
            How Footfall Turns Into Revenue
          </h1>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "clamp(1.5rem,3vh,2.5rem) clamp(1.2rem,3.5vw,2.5rem)" }}>

        {/* Section Heading */}
        <div style={{
          textAlign: "center", marginBottom: "clamp(1.5rem,3vh,2.5rem)",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: tr(0.1),
        }}>
          <p style={{ color: "#C9A84C", fontSize: "0.65rem", letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 0.6rem" }}>
            The full picture
          </p>
          <h2 style={{ color: "#fff", fontSize: "clamp(1.4rem,3vw,2.4rem)", fontWeight: 800, margin: "0 0 0.5rem", lineHeight: 1.1 }}>
            40M Visitors.<br /><span style={{ color: "#C9A84C" }}>Billions in Revenue.</span>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.78rem", fontWeight: 400, margin: "0 auto", maxWidth: "480px", lineHeight: 1.6 }}>
            Every footstep converts. Every visitor spends. Here&apos;s how the most visited mall in America turns foot traffic into a revenue engine.
          </p>
        </div>

        {/* ── TWO CHARTS SIDE BY SIDE ── */}
        <div className="fr-charts-grid">
          {/* LEFT: Footfall Chart */}
          <div className="fr-chart-panel" style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)",
            padding: "clamp(1rem,2vw,1.8rem)",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: tr(0.2),
          }}>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ color: "rgba(201,168,76,0.7)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 0.3rem" }}>
                Monthly Footfall
              </p>
              <h3 style={{ color: "#fff", fontSize: "clamp(0.95rem,1.8vw,1.2rem)", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                Visitor Traffic <span style={{ color: "#C9A84C" }}>by Month</span>
              </h3>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", margin: "0.3rem 0 0", lineHeight: 1.5 }}>
                Millions of visitors per month — peaking in holiday season
              </p>
            </div>
            <FootfallChart />
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.8rem" }}>
              <div style={{ width: "16px", height: "3px", background: "#C9A84C", borderRadius: "1px" }} />
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.55rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600 }}>
                Monthly visitors (millions)
              </span>
            </div>
          </div>

          {/* RIGHT: Impression Chart */}
          <div className="fr-chart-panel" style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(201,168,76,0.12)",
            padding: "clamp(1rem,2vw,1.8rem)",
            opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: tr(0.35),
          }}>
            <div style={{ marginBottom: "1rem" }}>
              <p style={{ color: "rgba(201,168,76,0.7)", fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 700, margin: "0 0 0.3rem" }}>
                Impression Comparison
              </p>
              <h3 style={{ color: "#fff", fontSize: "clamp(0.95rem,1.8vw,1.2rem)", fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                More Eyeballs <span style={{ color: "#C9A84C" }}>Than Any Platform</span>
              </h3>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.68rem", margin: "0.3rem 0 0", lineHeight: 1.5 }}>
                Annual impressions (millions) vs major ad formats
              </p>
            </div>

            <div style={{ display: "flex", gap: "1.2rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              {[{ color: "rgba(201,168,76,0.28)", label: "Other platforms" }, { color: "#C9A84C", label: "Mall of America" }].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <div style={{ width: "16px", height: "6px", background: l.color, borderRadius: "1px" }} />
                  <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.52rem", letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 600, fontFamily: "var(--font-montserrat)" }}>{l.label}</span>
                </div>
              ))}
            </div>

            <ImpressionChart />

            <p style={{ color: "rgba(201,168,76,0.5)", fontSize: "0.58rem", fontWeight: 600, letterSpacing: "0.06em", margin: "0.8rem 0 0", fontFamily: "var(--font-montserrat)" }}>
              ↑ 50× more impressions than a Super Bowl ad — annually.
            </p>
          </div>
        </div>

        {/* ── REVENUE STREAMS (hidden on mobile) ── */}
        <div className="fr-revenue-section" style={{
          marginTop: "clamp(1.5rem,3vh,2.5rem)",
          opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(16px)", transition: tr(0.45),
        }}>
          <p style={{ color: "rgba(255,255,255,0.22)", fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 1rem", fontFamily: "var(--font-montserrat)" }}>
            Revenue Breakdown
          </p>
          <div className="fr-revenue-grid">
            {REVENUE_STREAMS.map((s, i) => <RevenuePill key={s.label} stream={s} index={i} />)}
          </div>
        </div>

        {/* Bottom spacer */}
        <div style={{ height: "2rem" }} />
      </div>

      {/* ── RESPONSIVE STYLES ── */}
      <style>{`
        .fr-charts-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(1rem, 2vw, 1.5rem);
        }
        .fr-revenue-section {
          display: block;
        }
        @media (max-width: 767px) {
          .fr-revenue-section {
            display: none;
          }
        }
        .fr-revenue-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(201,168,76,0.06);
          border: 1px solid rgba(201,168,76,0.06);
        }
        .fr-revenue-grid > div {
          background: #050402;
        }
        @media (min-width: 768px) {
          .fr-charts-grid {
            grid-template-columns: 1fr 1fr;
          }
          .fr-revenue-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .fr-revenue-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
