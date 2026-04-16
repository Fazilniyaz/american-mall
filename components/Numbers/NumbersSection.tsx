"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as d3 from "d3";


gsap.registerPlugin(ScrollTrigger);

const STATS = [
  {
    value:   40,
    suffix:  "M+",
    label:   "Annual Visitors",
    sub:     "More than the entire population of Canada",
    arc:     0.88,
    color:   "#C9A84C",
  },
  {
    value:   520,
    suffix:  "+",
    label:   "Stores & Brands",
    sub:     "Every category. Every tier.",
    arc:     0.72,
    color:   "#C0A030",
  },
  {
    value:   5.6,
    suffix:  "M sqft",
    label:   "Total Space",
    sub:     "87 American football fields",
    arc:     0.65,
    color:   "#A8882A",
  },
  {
    value:   12,
    suffix:  "+",
    label:   "Entertainment Venues",
    sub:     "Rides, aquarium, mini golf & more",
    arc:     0.55,
    color:   "#907020",
  },
];

function ArcCounter({ stat, index }: { stat: typeof STATS[0]; index: number }) {
  const svgRef     = useRef<SVGSVGElement>(null);
  const countRef   = useRef<HTMLDivElement>(null);
  const triggered  = useRef(false);

  useEffect(() => {
    if (!svgRef.current || !countRef.current) return;

    const size   = 160;
    const radius = 66;
    const stroke = 3;
    const cx     = size / 2;
    const cy     = size / 2;

    const svg = d3.select(svgRef.current)
      .attr("width", size)
      .attr("height", size)
      .attr("viewBox", `0 0 ${size} ${size}`);

    // Background track arc
    const arcBg = d3.arc<unknown, unknown>()
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
    const arcFg = d3.arc<unknown, unknown>()
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

    // Scroll trigger animation
    ScrollTrigger.create({
      trigger: svgRef.current,
      start:   "top 82%",
      once:    true,
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;

        // Arc fill
        const endAngle = -Math.PI * 0.85 + Math.PI * 1.7 * stat.arc;
        gsap.to({ angle: -Math.PI * 0.85 }, {
          angle:    endAngle,
          duration: 1.6,
          ease:     "power2.out",
          delay:    index * 0.12,
          onUpdate: function () {
            // ts-expect-error gsap tween target
            const a = this.targets()[0].angle;
            // @ts-expect-error d3 arc
            path.attr("d", arcFg.endAngle(a)());
          },
        });

        // Number count up
        const isDecimal = stat.value % 1 !== 0;
        gsap.to({ val: 0 }, {
          val:      stat.value,
          duration: 1.8,
          ease:     "power2.out",
          delay:    index * 0.12,
          onUpdate: function () {
            // ts-expect-error gsap tween target
            const v = this.targets()[0].val;
            if (countRef.current) {
              countRef.current.textContent = isDecimal
                ? v.toFixed(1) + stat.suffix
                : Math.round(v) + stat.suffix;
            }
          },
        });
      },
    });

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, [stat, index]);

  return (
    <div style={{
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      gap:            "0",
      perspective:    "600px",
    }}>
      {/* 3D tilt card */}
      <div
        className={`num-card num-card-${index}`}
        style={{
          position:    "relative",
          width:       "160px",
          transformStyle: "preserve-3d",
          willChange:  "transform",
        }}
        onMouseMove={e => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const mx   = ((e.clientX - rect.left) / rect.width  - 0.5) * 18;
          const my   = ((e.clientY - rect.top)  / rect.height - 0.5) * -18;
          gsap.to(e.currentTarget, {
            rotateY: mx, rotateX: my,
            duration: 0.35, ease: "power2.out",
          });
        }}
        onMouseLeave={e => {
          gsap.to(e.currentTarget, {
            rotateY: 0, rotateX: 0,
            duration: 0.6, ease: "elastic.out(1,0.6)",
          });
        }}
      >
        {/* D3 arc SVG */}
        <svg ref={svgRef} style={{ display: "block" }} />

        {/* Counter in center of arc */}
        <div
          ref={countRef}
          style={{
            position:   "absolute",
            top:        "50%", left: "50%",
            transform:  "translate(-50%, -52%)",
            color:      stat.color,
            fontSize:   "clamp(1.3rem, 2.2vw, 1.7rem)",
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
        color:         "#ffffff",
        fontSize:      "0.78rem",
        fontWeight:    700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        fontFamily:    "var(--font-montserrat)",
        margin:        "0.6rem 0 0.3rem",
        textAlign:     "center",
      }}>
        {stat.label}
      </p>
      <p style={{
        color:      "rgba(255,255,255,0.38)",
        fontSize:   "0.65rem",
        fontFamily: "var(--font-montserrat)",
        textAlign:  "center",
        margin:     0,
        maxWidth:   "140px",
        lineHeight: 1.5,
      }}>
        {stat.sub}
      </p>
    </div>
  );
}

export default function NumbersSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".numbers-heading", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: ".numbers-heading", start: "top 85%" }
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="numbers"
      ref={sectionRef}
      style={{
        background: "#050402",
        padding:    "7rem 2rem",
        display:    "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Section heading */}
      <div className="numbers-heading" style={{ textAlign: "center", marginBottom: "4.5rem" }}>
        <p style={{
          color:         "#C9A84C",
          fontSize:      "0.72rem",
          letterSpacing: "0.4em",
          textTransform: "uppercase",
          fontFamily:    "var(--font-montserrat)",
          fontWeight:    600,
          marginBottom:  "0.8rem",
        }}>
          By the numbers
        </p>
        <h2 style={{
          color:      "#ffffff",
          fontSize:   "clamp(1.8rem, 3.5vw, 3rem)",
          fontWeight: 800,
          fontFamily: "var(--font-montserrat)",
          margin:     0,
          lineHeight: 1.1,
        }}>
          The scale is<br />
          <span style={{ color: "#C9A84C" }}>impossible to ignore</span>
        </h2>
      </div>

      {/* Arc counters grid */}
      <div style={{
        display:               "grid",
        gridTemplateColumns:   "repeat(auto-fit, minmax(160px, 1fr))",
        gap:                   "3rem 2rem",
        width:                 "100%",
        maxWidth:              "900px",
        justifyItems:          "center",
      }}>
        {STATS.map((stat, i) => (
          <ArcCounter key={stat.label} stat={stat} index={i} />
        ))}
      </div>

      {/* Bottom divider line */}
      <div style={{
        marginTop:   "5rem",
        width:       "60px",
        height:      "1px",
        background:  "linear-gradient(to right, transparent, #C9A84C, transparent)",
      }} />
    </section>
  );
}