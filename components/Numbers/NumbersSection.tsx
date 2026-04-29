"use client";

import { useEffect, useRef } from "react";
import { useScroller } from "@/components/ScrollerContext";

// D3 modules loaded lazily inside useEffect (no top-level import)
type D3Select = typeof import("d3-selection");
type D3Shape = typeof import("d3-shape");


const STATS = [
  {
    value: 40,
    suffix: "M+",
    label: "Annual Visitors",
    sub: "More than the entire population of Canada",
    arc: 0.88,
    color: "#C9A84C",
  },
  {
    value: 520,
    suffix: "+",
    label: "Stores & Brands",
    sub: "Every category. Every tier.",
    arc: 0.72,
    color: "#C0A030",
  },
  {
    value: 5.6,
    suffix: "M sqft",
    label: "Total Space",
    sub: "87 American football fields",
    arc: 0.65,
    color: "#A8882A",
  },
  {
    value: 12,
    suffix: "+",
    label: "Entertainment Venues",
    sub: "Rides, aquarium, mini golf & more",
    arc: 0.55,
    color: "#907020",
  },
];

function ArcCounter({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const countRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!svgRef.current || !countRef.current) return;
    let cancelled = false;

    const svgEl = svgRef.current;
    const countEl = countRef.current;

    Promise.all([
      import("d3-selection"),
      import("d3-shape"),
    ]).then(([d3Select, d3Shape]) => {
      if (cancelled || !svgEl || !countEl) return;

      const size = 160;
      const radius = 66;
      const stroke = 3;
      const cx = size / 2;
      const cy = size / 2;

      const svg = d3Select.select(svgEl)
        .attr("width", size)
        .attr("height", size)
        .attr("viewBox", `0 0 ${size} ${size}`);

      // Background track arc
      const arcBg = d3Shape.arc<unknown, unknown>()
        .innerRadius(radius - stroke / 2)
        .outerRadius(radius + stroke / 2)
        .startAngle(-Math.PI * 0.85)
        .endAngle(Math.PI * 0.85)
        .cornerRadius(4);

      svg.append("path")
        // @ts-expect-error d3 arc with no data
        .attr("d", arcBg())
        .attr("transform", `translate(${cx},${cy})`)
        .attr("fill", "rgba(255,255,255,0.06)");

      // Foreground arc — animated
      const arcFg = d3Shape.arc<unknown, unknown>()
        .innerRadius(radius - stroke / 2)
        .outerRadius(radius + stroke / 2)
        .startAngle(-Math.PI * 0.85)
        .cornerRadius(4);

      const path = svg.append("path")
        .attr("transform", `translate(${cx},${cy})`)
        .attr("fill", stat.color);

      // Tick marks
      const tickCount = 8;
      for (let t = 0; t <= tickCount; t++) {
        const angle = -Math.PI * 0.85 + (t / tickCount) * Math.PI * 1.7;
        const inner = radius - 10;
        const outer = radius - 6;
        svg.append("line")
          .attr("x1", cx + Math.sin(angle) * inner)
          .attr("y1", cy - Math.cos(angle) * inner)
          .attr("x2", cx + Math.sin(angle) * outer)
          .attr("y2", cy - Math.cos(angle) * outer)
          .attr("stroke", "rgba(255,255,255,0.15)")
          .attr("stroke-width", 1);
      }

      // Scroll trigger via IntersectionObserver (zero-cost until visible)
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting || triggered.current) return;
          triggered.current = true;
          observer.disconnect();

          import("gsap").then(({ default: gsap }) => {
            const endAngle = -Math.PI * 0.85 + Math.PI * 1.7 * stat.arc;
            gsap.to({ angle: -Math.PI * 0.85 }, {
              angle: endAngle,
              duration: 1.6,
              ease: "power2.out",
              delay: index * 0.12,
              onUpdate: function () {
                const a = this.targets()[0].angle;
                // @ts-expect-error d3 arc
                path.attr("d", arcFg.endAngle(a)());
              },
            });

            const isDecimal = stat.value % 1 !== 0;
            gsap.to({ val: 0 }, {
              val: stat.value,
              duration: 1.8,
              ease: "power2.out",
              delay: index * 0.12,
              onUpdate: function () {
                const v = this.targets()[0].val;
                if (countEl) {
                  countEl.textContent = isDecimal
                    ? v.toFixed(1) + stat.suffix
                    : Math.round(v) + stat.suffix;
                }
              },
            });
          });
        },
        { rootMargin: "100px", threshold: 0 }
      );

      observer.observe(svgEl);
    });

    return () => { cancelled = true; };
  }, [stat, index]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0",
      perspective: "600px",
    }}>
      {/* 3D tilt card */}
      <div
        className={`num-card num-card-${index}`}
        style={{
          position: "relative",
          width: "160px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        onMouseMove={e => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const mx = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
          const my = ((e.clientY - rect.top) / rect.height - 0.5) * -18;
          // Use CSS transforms instead of GSAP for hover (zero JS cost)
          (e.currentTarget as HTMLElement).style.transform =
            `rotateY(${mx}deg) rotateX(${my}deg)`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.transition = "transform 0.6s cubic-bezier(0.34,1.56,0.64,1)";
          (e.currentTarget as HTMLElement).style.transform = "rotateY(0deg) rotateX(0deg)";
          setTimeout(() => {
            if (e.currentTarget) (e.currentTarget as HTMLElement).style.transition = "";
          }, 600);
        }}
      >
        {/* D3 arc SVG */}
        <svg ref={svgRef} style={{ display: "block" }} />

        {/* Counter in center of arc */}
        <div
          ref={countRef}
          style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -52%)",
            color: stat.color,
            fontSize: "clamp(1.3rem, 2.2vw, 1.7rem)",
            fontWeight: 800,
            fontFamily: "var(--font-montserrat)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            textShadow: `0 0 28px ${stat.color}55`,
          }}
        >
          0{stat.suffix}
        </div>
      </div>

      {/* Label below arc */}
      <p style={{
        color: "#ffffff",
        fontSize: "0.78rem",
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        fontFamily: "var(--font-montserrat)",
        margin: "0.6rem 0 0.3rem",
        textAlign: "center",
      }}>
        {stat.label}
      </p>
      <p style={{
        color: "rgba(255,255,255,0.38)",
        fontSize: "0.65rem",
        fontFamily: "var(--font-montserrat)",
        textAlign: "center",
        margin: 0,
        maxWidth: "140px",
        lineHeight: 1.5,
      }}>
        {stat.sub}
      </p>
    </div>
  );
}

export default function NumbersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerEl = useScroller();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !scrollerEl) return;

    // ── Heading animation — lazy GSAP ─────────────────────────────────────
    // GSAP + ScrollTrigger were previously imported at the MODULE TOP LEVEL.
    // This caused them to run during initial JS parse, blocking the main thread.
    // Now they're imported lazily via IntersectionObserver when the section
    // comes into view. Zero cost until needed.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        Promise.all([
          import("gsap"),
          import("gsap/ScrollTrigger"),
        ]).then(([gsapMod, stMod]) => {
          const gsap = gsapMod.default;
          const { ScrollTrigger } = stMod;
          gsap.registerPlugin(ScrollTrigger);

          const ctx = gsap.context(() => {
            gsap.fromTo(".numbers-heading",
              { opacity: 0, y: 30 },
              {
                opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
                scrollTrigger: { trigger: ".numbers-heading", start: "top 85%", ...(scrollerEl ? { scroller: scrollerEl } : {}) }
              }
            );
          }, sectionRef);

          return () => ctx.revert();
        });
      },
      { rootMargin: "200px", threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollerEl]);

  return (
    <section
      id="numbers"
      ref={sectionRef}
      style={{
        background: "#050402",
        padding: "7rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Section heading */}
      <div className="numbers-heading" style={{ textAlign: "center", marginBottom: "4.5rem" }}>
        <p style={{
          color: "#C9A84C",
          fontSize: "0.72rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 600,
          marginBottom: "0.8rem",
        }}>
          By the numbers
        </p>
        <h2 style={{
          color: "#ffffff",
          fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
          fontWeight: 800,
          fontFamily: "var(--font-montserrat)",
          margin: 0,
          lineHeight: 1.1,
        }}>
          The scale is<br />
          <span style={{ color: "#C9A84C" }}>impossible to ignore</span>
        </h2>
      </div>

      {/* Arc counters grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "3rem 2rem",
        width: "100%",
        maxWidth: "900px",
        justifyItems: "center",
      }}>
        {STATS.map((stat, i) => (
          <ArcCounter key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Bottom divider line */}
      <div style={{
        marginTop: "5rem",
        width: "60px",
        height: "1px",
        background: "linear-gradient(to right, transparent, #C9A84C, transparent)",
      }} />
    </section>
  );
}