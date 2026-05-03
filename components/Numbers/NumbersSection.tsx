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
  const [visible, setVisible] = useState(false);
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        io.disconnect();
        setTimeout(() => {
          setVisible(true);
          let start = performance.now();
          const animate = (time: number) => {
            const progress = Math.min((time - start) / 1700, 1);
            const ease = 1 - Math.pow(1 - progress, 4);
            setVal(stat.value * ease);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }, index * 80);
      }
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, [stat.value, index]);

  const cx = size / 2;
  const cy = size / 2;
  const C = 2 * Math.PI * r;
  const totalArc = C * 0.85; // 306 / 360 = 0.85
  const fillLength = totalArc * stat.arc;

  const isFloat = stat.value % 1 !== 0;
  const displayVal = isFloat ? val.toFixed(1) : Math.round(val);

  return (
    <div className="ac-wrap" ref={ref}>
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
        <svg style={{ display: "block", position: "absolute", inset: 0, width: size, height: size, transform: "rotate(117deg)" }}>
          {/* Background track */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth={sw}
            strokeDasharray={`${totalArc} ${C}`}
            strokeLinecap="round"
          />
          {/* Ticks */}
          {Array.from({ length: 8 }).map((_, t) => {
            const angle = (t / 7) * (Math.PI * 1.7);
            const i1 = r - sw - 5;
            const i2 = r - sw - 2;
            return <line key={t} 
              x1={cx + Math.cos(angle) * i1} y1={cy + Math.sin(angle) * i1} 
              x2={cx + Math.cos(angle) * i2} y2={cy + Math.sin(angle) * i2} 
              stroke="rgba(255,255,255,0.1)" strokeWidth="1" />;
          })}
          {/* Foreground Arc */}
          <circle
            cx={cx} cy={cy} r={r}
            fill="none" stroke="#C9A84C" strokeWidth={sw}
            strokeDasharray={`${C} ${C}`}
            strokeDashoffset={visible ? C - fillLength : C}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)" }}
          />
          {/* Glow Dot */}
          <g style={{
            transformOrigin: `${cx}px ${cy}px`,
            transform: `rotate(${visible ? stat.arc * 306 : 0}deg)`,
            transition: "transform 1.5s cubic-bezier(0.22, 1, 0.36, 1)"
          }}>
            <circle
              cx={cx + r} cy={cy} r={sw + 1.5}
              fill="#C9A84C"
              style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
            />
          </g>
        </svg>

        <span
          className="ac-num"
          style={{
            fontSize: `${Math.max(size * 0.148, 9)}px`,
            textShadow: `0 0 20px #C9A84C55`,
          }}
        >
          {displayVal}{stat.suffix}
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

  const [headingVisible, setHeadingVisible] = useState(false);

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
      if (entry.isIntersecting) {
        setHeadingVisible(true);
        io.disconnect();
      }
    }, { rootMargin: "0px", threshold: 0.1 });
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
          transform: translateY(20px);
          transition: all 0.8s cubic-bezier(0.22, 1, 0.36, 1);
          text-align: center;
          flex-shrink: 0;
          margin-bottom: clamp(10px, 1.8vh, 24px);
        }
        .ns-heading.visible {
          opacity: 1;
          transform: translateY(0);
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

        <div className={`ns-heading ${headingVisible ? 'visible' : ''}`}>
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