"use client";

import { useEffect, useRef, useState } from "react";
import { useScroller } from "@/components/ScrollerContext";

// ─── Data ────────────────────────────────────────────────────────────────────
const STATS = [
  { value: 40, suffix: "M+", label: "Annual Visitors", sub: "More than Canada's population", arc: 0.88 },
  { value: 520, suffix: "+", label: "Stores & Brands", sub: "Every category, every tier", arc: 0.72 },
  { value: 5.6, suffix: "M sqft", label: "Total Space", sub: "87 American football fields", arc: 0.65 },
  { value: 12, suffix: "+", label: "Entertainment Venues", sub: "Rides, aquarium & mini golf", arc: 0.55 },
  { value: 56, suffix: "+", label: "Restaurants & Dining", sub: "Fast casual to fine dining", arc: 0.60 },
  { value: 1992, suffix: "", label: "Year Opened", sub: "30+ years as America's #1 mall", arc: 0.78 },
  { value: 2, suffix: "nd", label: "Largest Mall in USA", sub: "By total leasable retail area", arc: 0.45 },
  { value: 100, suffix: "M+", label: "Annual Revenue", sub: "Driving $2B+ in regional GDP", arc: 0.82 },
] as const;


type Stat = (typeof STATS)[number];

// ─── Compute arc dimensions from current viewport ─────────────────────────────
function computeArc() {
  if (typeof window === "undefined") return { size: 110, r: 44, sw: 3 };

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const isMobile = vw < 560;

  const cols = isMobile ? 2 : 4;
  const rows = isMobile ? 4 : 2;
  const headH = isMobile ? 72 : 96;   // heading block height
  const labelH = isMobile ? 44 : 48;   // label+sub below each arc
  const gapV = isMobile ? 8 : 14;
  const gapH = isMobile ? 14 : 20;
  const padV = isMobile ? 28 : 40;   // top+bottom section padding
  const dividerH = 24;

  const availH = vh - headH - padV - dividerH;
  const availW = Math.min(vw - (isMobile ? 24 : 32), 880);

  const cellH = (availH - gapV * (rows - 1)) / rows - labelH;
  const cellW = (availW - gapH * (cols - 1)) / cols;

  const size = Math.max(Math.floor(Math.min(cellH, cellW, 150)), 76);
  return { size, r: size * 0.41, sw: Math.max(size * 0.027, 2.5) };
}

// ─── ArcCounter ──────────────────────────────────────────────────────────────
function ArcCounter({
  stat, index, size, r, sw,
}: { stat: Stat; index: number; size: number; r: number; sw: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const svgEl = svgRef.current;
    const numEl = numRef.current;
    if (!svgEl || !numEl) return;
    let dead = false;

    // Wipe previous paint (handles resize re-render)
    while (svgEl.firstChild) svgEl.removeChild(svgEl.firstChild);
    triggered.current = false;

    const GOLD = "#C9A84C";
    const cx = size / 2, cy = size / 2;
    const START = -Math.PI * 0.85;
    const SPAN = Math.PI * 1.70;

    Promise.all([import("d3-selection"), import("d3-shape")]).then(([sel, sh]) => {
      if (dead) return;

      const svg = sel
        .select(svgEl)
        .attr("width", size)
        .attr("height", size)
        .attr("viewBox", `0 0 ${size} ${size}`);

      const mkArc = (end: number) =>
        sh
          .arc<unknown, unknown>()
          .innerRadius(r - sw / 2)
          .outerRadius(r + sw / 2)
          .startAngle(START)
          .endAngle(end)
          .cornerRadius(2);

      // Track ring
      svg
        .append("path")
        // @ts-expect-error d3 no-datum arc
        .attr("d", mkArc(START + SPAN)())
        .attr("transform", `translate(${cx},${cy})`)
        .attr("fill", "rgba(255,255,255,0.055)");

      // Tick marks
      for (let t = 0; t <= 7; t++) {
        const a = START + (t / 7) * SPAN;
        const i1 = r - sw - 5, i2 = r - sw - 2;
        svg
          .append("line")
          .attr("x1", cx + Math.sin(a) * i1).attr("y1", cy - Math.cos(a) * i1)
          .attr("x2", cx + Math.sin(a) * i2).attr("y2", cy - Math.cos(a) * i2)
          .attr("stroke", "rgba(255,255,255,0.1)")
          .attr("stroke-width", 1);
      }

      // Foreground arc (animated)
      const fgPath = svg
        .append("path")
        // @ts-expect-error d3 no-datum arc
        .attr("d", mkArc(START)())
        .attr("transform", `translate(${cx},${cy})`)
        .attr("fill", GOLD);

      // Glow dot at arc tip
      const dot = svg
        .append("circle")
        .attr("r", sw + 1.5)
        .attr("fill", GOLD)
        .attr("opacity", 0);

      // Trigger only when visible
      const io = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || triggered.current) return;
        triggered.current = true;
        io.disconnect();

        import("gsap").then(({ default: gsap }) => {
          const targetAngle = START + SPAN * stat.arc;
          const p1 = { a: START };
          const isFloat = stat.value % 1 !== 0;
          const p2 = { v: 0 };

          gsap.to(p1, {
            a: targetAngle,
            duration: 1.5,
            ease: "power2.out",
            delay: index * 0.08,
            onUpdate() {
              const a = p1.a;
              // @ts-expect-error d3 no-datum arc
              fgPath.attr("d", mkArc(a)());
              dot
                .attr("opacity", 1)
                .attr("cx", cx + Math.sin(a) * r)
                .attr("cy", cy - Math.cos(a) * r);
            },
          });

          gsap.to(p2, {
            v: stat.value,
            duration: 1.7,
            ease: "power2.out",
            delay: index * 0.08,
            onUpdate() {
              if (numEl)
                numEl.textContent = isFloat
                  ? p2.v.toFixed(1) + stat.suffix
                  : Math.round(p2.v) + stat.suffix;
            },
          });
        });
      }, { rootMargin: "80px", threshold: 0 });

      io.observe(svgEl);
    });

    return () => { dead = true; };
  }, [stat, index, size, r, sw]);

  return (
    <div className="ac-wrap">
      {/* 3-D tilt shell */}
      <div
        className="ac-tilt"
        style={{ width: size, height: size }}
        onMouseMove={e => {
          const b = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const rx = ((e.clientY - b.top) / b.height - 0.5) * -16;
          const ry = ((e.clientX - b.left) / b.width - 0.5) * 16;
          (e.currentTarget as HTMLElement).style.transform =
            `rotateX(${rx}deg) rotateY(${ry}deg)`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLElement;
          el.style.transition = "transform 0.65s cubic-bezier(0.34,1.56,0.64,1)";
          el.style.transform = "rotateX(0deg) rotateY(0deg)";
          setTimeout(() => { el.style.transition = ""; }, 680);
        }}
      >
        <svg ref={svgRef} style={{ display: "block", position: "absolute", inset: 0 }} />
        <span
          ref={numRef}
          className="ac-num"
          style={{
            fontSize: `${Math.max(size * 0.148, 9)}px`,
            textShadow: `0 0 20px #C9A84C55`,
          }}
        >
          0{stat.suffix}
        </span>
      </div>

      <p className="ac-label">{stat.label}</p>
      <p className="ac-sub">{stat.sub}</p>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────
export default function NumbersSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerEl = useScroller();
  const [arc, setArc] = useState(computeArc);

  // Debounced resize via rAF
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setArc(computeArc()));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);

  // Heading entrance
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
        ([gm, stm]) => {
          const gsap = gm.default;
          gsap.registerPlugin(stm.ScrollTrigger);
          const ctx = gsap.context(() => {
            gsap.fromTo(".ns-heading",
              { opacity: 0, y: 20 },
              {
                opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                scrollTrigger: {
                  trigger: ".ns-heading",
                  start: "top 92%",
                  scroller: scrollerEl ?? undefined,
                },
              }
            );
          }, sectionRef);
          return () => ctx.revert();
        }
      );
    }, { rootMargin: "150px" });
    io.observe(el);
    return () => io.disconnect();
  }, [scrollerEl]);

  return (
    <>
      <style>{`
        /* ── Shell ── */
        .ns-root {
          background: #050402;
          width: 100%;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-sizing: border-box;
          padding: clamp(14px,2.5vh,28px) clamp(12px,2vw,24px) clamp(10px,1.8vh,20px);
          position: relative;
        }

        /* ── Heading ── */
        .ns-heading {
          opacity: 0;
          text-align: center;
          flex-shrink: 0;
          margin-bottom: clamp(10px, 1.8vh, 24px);
        }
        .ns-eyebrow {
          color: #C9A84C;
          font-size: clamp(0.48rem, 0.72vw, 0.66rem);
          letter-spacing: 0.42em;
          text-transform: uppercase;
          font-family: var(--font-montserrat);
          font-weight: 600;
          margin: 0 0 6px;
        }
        .ns-h2 {
          color: #fff;
          font-size: clamp(1.25rem, 2.7vw, 2.5rem);
          font-weight: 800;
          font-family: var(--font-montserrat);
          margin: 0;
          line-height: 1.1;
        }
        .ns-h2 em { color: #C9A84C; font-style: normal; }

        /* ── Grid ── */
        .ns-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, auto);
          gap: clamp(8px,1.4vh,20px) clamp(8px,1.6vw,24px);
          width: 100%;
          max-width: 880px;
          justify-items: center;
          flex-shrink: 0;
        }

        /* ── Card ── */
        .ac-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          position: relative;
        }
        /* Column separator */
        .ac-wrap:not(:nth-child(4n))::after {
          content: '';
          position: absolute;
          right: 0; top: 8%; height: 84%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.1), transparent);
        }

        /* ── Tilt shell ── */
        .ac-tilt {
          position: relative;
          flex-shrink: 0;
          transform-style: preserve-3d;
          will-change: transform;
          cursor: default;
        }

        /* ── Number ── */
        .ac-num {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -52%);
          color: #C9A84C;
          font-weight: 800;
          font-family: var(--font-montserrat);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
          line-height: 1;
          pointer-events: none;
        }

        /* ── Text below arc ── */
        .ac-label {
          color: #fff;
          font-size: clamp(0.42rem, 0.62vw, 0.60rem);
          font-weight: 700;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          font-family: var(--font-montserrat);
          margin: clamp(3px,0.55vh,7px) 0 2px;
          text-align: center;
          line-height: 1.2;
          white-space: nowrap;
        }
        .ac-sub {
          color: rgba(255,255,255,0.33);
          font-size: clamp(0.36rem, 0.54vw, 0.53rem);
          font-family: var(--font-montserrat);
          text-align: center;
          margin: 0;
          line-height: 1.35;
          white-space: nowrap;
        }

        /* ── Divider ── */
        .ns-divider {
          width: 48px; height: 1px;
          background: linear-gradient(to right, transparent, #C9A84C, transparent);
          flex-shrink: 0;
          margin-top: clamp(6px, 1.2vh, 18px);
        }

        /* ── MOBILE ≤ 559px: 2 cols × 4 rows ── */
        @media (max-width: 559px) {
          .ns-root { padding: 12px 10px 10px; }
          .ns-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(4, auto);
            max-width: 360px;
            gap: clamp(4px,1vh,10px) clamp(6px,3vw,18px);
          }
          /* reset 4n separator, use 2n */
          .ac-wrap:not(:nth-child(4n))::after { display: none; }
          .ac-wrap:nth-child(odd)::after {
            content: '';
            position: absolute;
            right: 0; top: 8%; height: 84%;
            width: 1px;
            background: linear-gradient(to bottom, transparent, rgba(201,168,76,0.1), transparent);
          }
          .ac-label, .ac-sub { white-space: normal; }
        }

        /* ── Tablet 560–900px ── */
        @media (min-width: 560px) and (max-width: 900px) {
          .ns-grid { max-width: 700px; }
        }
      `}</style>

      <section id="numbers" ref={sectionRef} className="ns-root">

        <div className="ns-heading">
          <p className="ns-eyebrow">By the numbers</p>
          <h2 className="ns-h2">
            The scale is <em>impossible to ignore</em>
          </h2>
        </div>

        <div className="ns-grid">
          {STATS.map((s, i) => (
            <ArcCounter
              key={s.label}
              stat={s}
              index={i}
              size={arc.size}
              r={arc.r}
              sw={arc.sw}
            />
          ))}
        </div>

        <div className="ns-divider" />

      </section>
    </>
  );
}