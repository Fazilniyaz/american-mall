"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

let _gsap: typeof import("gsap")["default"] | null = null;
const loadGsap = () =>
  _gsap
    ? Promise.resolve(_gsap)
    : import("gsap").then((m) => { _gsap = m.default; return _gsap!; });

// ─── Data ────────────────────────────────────────────────────────────────────
const TIERS = [
  {
    id: "presenting",
    name: "Presenting Partner",
    badge: "Most Impactful",
    price: "Custom",
    color: "#C9A84C",
    perks: [
      "Naming rights on signature events",
      "Prime Rotunda digital signage",
      "Exclusive category ownership",
      "Co-branded campaigns + PR",
      "Dedicated activation space",
      "Executive hospitality suite access",
    ],
  },
  {
    id: "premium",
    name: "Premium Sponsor",
    badge: "Popular",
    price: "From $250K",
    color: "#B8922A",
    perks: [
      "Multi-court brand placement",
      "Digital & physical co-branding",
      "Seasonal campaign inclusion",
      "VIP event access passes",
      "Dedicated account manager",
    ],
  },
  {
    id: "associate",
    name: "Associate Sponsor",
    badge: "Entry Point",
    price: "From $50K",
    color: "#907020",
    perks: [
      "Logo placement on select signage",
      "Social media co-mentions",
      "Access to MOA audience data",
      "Event day brand presence",
    ],
  },
] as const;

const REACH = [
  { val: "40M+", label: "Annual visitors", sub: "Largest captive audience in retail" },
  { val: "110K", label: "Peak daily footfall", sub: "Prime weekend traffic" },
  { val: "75%", label: "Return visitor rate", sub: "Loyal, high-intent shoppers" },
  { val: "$3.2B", label: "Annual visitor spend", sub: "Unmatched purchasing power" },
];

const CATEGORIES = [
  "Automotive", "Financial Services", "Technology", "Beverage & Food",
  "Travel & Tourism", "Health & Wellness", "Apparel & Fashion", "Entertainment",
];

type TierId = typeof TIERS[number]["id"];

export default function BecomeASponsorPage() {
  const router = useRouter();
  const [activeTier, setActiveTier] = useState<TierId>("presenting");
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const tier = TIERS.find(t => t.id === activeTier)!;

  // ── Entrance ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      loadGsap().then((gsap) => {
        gsap.fromTo(".bas-eyebrow", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" });
        gsap.fromTo(".bas-headline", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.12 });
        gsap.fromTo(".bas-sub", { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.22 });
        gsap.fromTo(".bas-divider", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power2.out", delay: 0.32, transformOrigin: "left" });
        gsap.fromTo(".bas-reach", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.40 });
        gsap.fromTo(".bas-tiers", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", delay: 0.50 });
        gsap.fromTo(".bas-cta", { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", delay: 0.60 });
        gsap.fromTo(".bas-right", { opacity: 0, x: 24 }, { opacity: 1, x: 0, duration: 0.75, ease: "power2.out", delay: 0.18 });
        gsap.fromTo(".bas-img", { opacity: 0, scale: 1.05 }, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" });
      });
    }, 200);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  }, []);

  return (
    <>
      <style>{`
        .bas-root {
          position: fixed; inset: 0;
          background: #050402;
          display: grid;
          grid-template-columns: 1fr 1fr;
          overflow: hidden;
          font-family: var(--font-montserrat);
        }

        /* ════════ LEFT ════════ */
        .bas-left {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: clamp(1.8rem,5vh,3.5rem) clamp(1.6rem,4vw,3.5rem) clamp(4rem,8vh,5rem);
          gap: clamp(0.75rem,1.6vh,1.3rem);
          border-right: 1px solid rgba(201,168,76,0.1);
          overflow: hidden;
          z-index: 10;
        }
        .bas-left::before {
          content:'';
          position:absolute; left:0; top:12%; bottom:12%; width:3px;
          background: linear-gradient(to bottom, transparent, #C9A84C, transparent);
        }

        .bas-eyebrow {
          color:#C9A84C;
          font-size:clamp(0.52rem,0.8vw,0.66rem);
          letter-spacing:0.44em; text-transform:uppercase;
          font-weight:700; margin:0; opacity:0;
        }
        .bas-headline {
          color:#fff;
          font-size:clamp(1.65rem,3vw,2.9rem);
          font-weight:800; line-height:1.04;
          margin:0; opacity:0;
        }
        .bas-headline em { color:#C9A84C; font-style:normal; }
        .bas-sub {
          color:rgba(255,255,255,0.44);
          font-size:clamp(0.7rem,1.05vw,0.84rem);
          font-weight:400; line-height:1.75;
          margin:0; max-width:390px; opacity:0;
        }
        .bas-divider {
          width:52px; height:2px;
          background:linear-gradient(to right,#C9A84C,rgba(201,168,76,0.15));
        }

        /* ── Reach stats ── */
        .bas-reach {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          border:1px solid rgba(201,168,76,0.12);
          opacity:0;
        }
        .bas-reach-item {
          padding:clamp(0.5rem,1vh,0.8rem) clamp(0.4rem,0.8vw,0.7rem);
          border-right:1px solid rgba(201,168,76,0.12);
          transition:background 0.22s;
        }
        .bas-reach-item:last-child { border-right:none; }
        .bas-reach-item:hover { background:rgba(201,168,76,0.05); }
        .bas-reach-val {
          color:#C9A84C;
          font-size:clamp(0.9rem,1.6vw,1.4rem);
          font-weight:800; line-height:1;
          font-variant-numeric:tabular-nums;
        }
        .bas-reach-label {
          color:#fff;
          font-size:clamp(0.4rem,0.6vw,0.54rem);
          font-weight:700; letter-spacing:0.1em;
          text-transform:uppercase; margin-top:0.2rem; line-height:1.2;
        }
        .bas-reach-sub {
          color:rgba(255,255,255,0.26);
          font-size:clamp(0.36rem,0.52vw,0.48rem);
          margin-top:0.1rem; line-height:1.3;
        }

        /* ── Tier selector ── */
        .bas-tier-head {
          color:rgba(255,255,255,0.26);
          font-size:clamp(0.44rem,0.66vw,0.56rem);
          letter-spacing:0.36em; text-transform:uppercase;
          font-weight:700; margin:0;
        }
        .bas-tiers {
          display:flex;
          flex-direction:column;
          gap:0;
          border:1px solid rgba(201,168,76,0.12);
          opacity:0;
        }
        .bas-tier {
          display:flex;
          align-items:stretch;
          gap:0;
          border-bottom:1px solid rgba(201,168,76,0.08);
          cursor:pointer;
          transition:background 0.2s;
          position:relative;
          overflow:hidden;
        }
        .bas-tier:last-child { border-bottom:none; }
        .bas-tier::before {
          content:'';
          position:absolute; left:0; top:0; bottom:0; width:2px;
          background:#C9A84C;
          transform:scaleY(0);
          transition:transform 0.25s ease;
          transform-origin:center;
        }
        .bas-tier.active::before { transform:scaleY(1); }
        .bas-tier.active { background:rgba(201,168,76,0.055); }
        .bas-tier:not(.active):hover { background:rgba(255,255,255,0.018); }

        .bas-tier-left {
          flex:1;
          padding:clamp(0.55rem,1.1vh,0.85rem) clamp(0.7rem,1.2vw,1rem);
        }
        .bas-tier-top {
          display:flex; align-items:center; gap:0.5rem;
          margin-bottom:0.2rem;
        }
        .bas-tier-name {
          color:#fff;
          font-size:clamp(0.58rem,0.88vw,0.72rem);
          font-weight:700; letter-spacing:0.08em;
          text-transform:uppercase;
        }
        .bas-tier.active .bas-tier-name { color:#C9A84C; }
        .bas-tier-badge {
          background:rgba(201,168,76,0.1);
          border:1px solid rgba(201,168,76,0.22);
          color:rgba(201,168,76,0.7);
          font-size:clamp(0.32rem,0.48vw,0.42rem);
          font-weight:700; letter-spacing:0.12em;
          text-transform:uppercase; padding:1px 5px;
        }

        /* Perks list — visible only when active */
        .bas-tier-perks {
          display:none;
          flex-direction:column;
          gap:0.2rem;
          margin-top:0.35rem;
        }
        .bas-tier.active .bas-tier-perks { display:flex; }
        .bas-perk-row {
          display:flex; align-items:flex-start; gap:0.4rem;
        }
        .bas-perk-dot {
          color:#C9A84C; font-size:0.45rem;
          margin-top:0.18rem; flex-shrink:0;
          line-height:1;
        }
        .bas-perk-text {
          color:rgba(255,255,255,0.42);
          font-size:clamp(0.4rem,0.6vw,0.52rem);
          line-height:1.4;
        }

        .bas-tier-right {
          flex-shrink:0;
          display:flex; flex-direction:column;
          align-items:flex-end; justify-content:center;
          padding:clamp(0.55rem,1.1vh,0.85rem) clamp(0.7rem,1.2vw,1rem);
          border-left:1px solid rgba(201,168,76,0.08);
          gap:3px;
        }
        .bas-tier-price {
          color:#C9A84C;
          font-size:clamp(0.62rem,0.95vw,0.8rem);
          font-weight:800; white-space:nowrap;
        }
        .bas-tier-custom {
          color:rgba(255,255,255,0.22);
          font-size:clamp(0.36rem,0.52vw,0.46rem);
          white-space:nowrap;
        }

        /* ── CTAs ── */
        .bas-cta {
          display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;
          opacity:0;
        }
        .bas-btn-primary {
          background:#C9A84C; color:#050402; border:none;
          padding:clamp(0.6rem,1.2vh,0.85rem) clamp(1.2rem,2.5vw,2rem);
          font-size:clamp(0.58rem,0.88vw,0.7rem);
          font-weight:800; letter-spacing:0.18em; text-transform:uppercase;
          font-family:var(--font-montserrat); cursor:pointer;
          transition:all 0.22s ease;
        }
        .bas-btn-primary:hover {
          background:#e0bc5c; transform:translateY(-1px);
          box-shadow:0 6px 24px rgba(201,168,76,0.35);
        }
        .bas-btn-secondary {
          background:transparent; color:rgba(255,255,255,0.5);
          border:1px solid rgba(255,255,255,0.14);
          padding:clamp(0.6rem,1.2vh,0.85rem) clamp(1rem,2vw,1.5rem);
          font-size:clamp(0.56rem,0.84vw,0.68rem);
          font-weight:600; letter-spacing:0.14em; text-transform:uppercase;
          font-family:var(--font-montserrat); cursor:pointer;
          transition:all 0.22s ease;
        }
        .bas-btn-secondary:hover { border-color:rgba(201,168,76,0.4); color:#C9A84C; }

        /* ════════ RIGHT ════════ */
        .bas-right {
          position:relative; overflow:hidden; opacity:0;
        }
        .bas-img {
          position:absolute; inset:0;
          width:100%; height:100%;
          object-fit:cover; object-position:center 18%;
          opacity:0;
          filter:brightness(0.33) saturate(0.6);
          transition:opacity 0.8s ease;
        }
        .bas-fade-l {
          position:absolute; top:0; left:0; bottom:0; width:30%;
          background:linear-gradient(to right,#050402,transparent);
          z-index:2; pointer-events:none;
        }
        .bas-fade-b {
          position:absolute; left:0; right:0; bottom:0; height:30%;
          background:linear-gradient(to top,#050402,transparent);
          z-index:2; pointer-events:none;
        }
        .bas-fade-t {
          position:absolute; left:0; right:0; top:0; height:16%;
          background:linear-gradient(to bottom,rgba(5,4,2,0.55),transparent);
          z-index:2; pointer-events:none;
        }

        /* ── Signing moment callout — top right ── */
        .bas-callout {
          position:absolute;
          top:clamp(1.4rem,3.5vh,2.8rem);
          right:clamp(1.2rem,3vw,2.4rem);
          z-index:10;
          max-width:260px;
        }
        .bas-callout-card {
          background:rgba(5,4,2,0.84);
          border:1px solid rgba(201,168,76,0.22);
          border-left:3px solid #C9A84C;
          padding:clamp(0.85rem,1.7vh,1.3rem) clamp(0.9rem,1.6vw,1.3rem);
          backdrop-filter:blur(10px);
        }
        .bas-callout-label {
          color:rgba(201,168,76,0.7);
          font-size:clamp(0.44rem,0.64vw,0.54rem);
          letter-spacing:0.32em; text-transform:uppercase;
          font-weight:700; margin-bottom:0.5rem;
        }
        .bas-callout-text {
          color:rgba(255,255,255,0.7);
          font-size:clamp(0.6rem,0.9vw,0.74rem);
          line-height:1.6; font-style:italic; margin:0 0 0.65rem;
        }
        .bas-callout-name {
          color:#C9A84C;
          font-size:clamp(0.46rem,0.68vw,0.58rem);
          font-weight:700; letter-spacing:0.14em; text-transform:uppercase;
        }
        .bas-callout-role {
          color:rgba(255,255,255,0.26);
          font-size:clamp(0.4rem,0.58vw,0.5rem);
          margin-top:2px; letter-spacing:0.06em;
        }

        /* ── Category pills ── */
        .bas-cats {
          position:absolute;
          bottom:clamp(1rem,2.8vh,2.2rem);
          left:clamp(1.2rem,3vw,2rem);
          right:clamp(1.2rem,3vw,2rem);
          z-index:10;
        }
        .bas-cats-label {
          color:rgba(255,255,255,0.2);
          font-size:clamp(0.42rem,0.62vw,0.54rem);
          letter-spacing:0.34em; text-transform:uppercase;
          font-weight:700; margin-bottom:0.45rem; display:block;
        }
        .bas-pills {
          display:flex; flex-wrap:wrap; gap:0.38rem;
        }
        .bas-pill {
          background:rgba(5,4,2,0.76);
          border:1px solid rgba(201,168,76,0.16);
          color:rgba(255,255,255,0.42);
          font-size:clamp(0.4rem,0.6vw,0.52rem);
          font-weight:600; letter-spacing:0.1em; text-transform:uppercase;
          padding:3px 9px; backdrop-filter:blur(6px);
          transition:border-color 0.2s, color 0.2s, background 0.2s;
          white-space:nowrap;
        }
        .bas-pill:hover {
          border-color:rgba(201,168,76,0.42); color:#C9A84C;
          background:rgba(201,168,76,0.07);
        }

        /* ── Signature strip ── */
        .bas-sig-strip {
          position:absolute;
          bottom:clamp(4.5rem,9vh,6rem);
          left:clamp(1.2rem,3vw,2rem);
          right:clamp(1.2rem,3vw,2rem);
          z-index:10;
          display:flex; align-items:center; gap:0.7rem;
        }
        .bas-sig-line {
          flex:1; height:1px;
          background:linear-gradient(to right,rgba(201,168,76,0.3),transparent);
        }
        .bas-sig-text {
          color:rgba(201,168,76,0.45);
          font-size:clamp(0.4rem,0.58vw,0.52rem);
          letter-spacing:0.3em; text-transform:uppercase; font-weight:700;
          white-space:nowrap;
        }

        /* ════════ NAV ════════ */
        .bas-nav {
          position:fixed;
          bottom:0; left:0; right:0; z-index:30;
          display:flex; align-items:center; justify-content:space-between;
          padding:clamp(0.7rem,1.8vh,1.1rem) clamp(1rem,3vw,2rem);
          background:linear-gradient(to top,rgba(5,4,2,0.9) 0%,transparent 100%);
        }
        .bas-nav-btn {
          background:transparent;
          border:1px solid rgba(201,168,76,0.25); color:#C9A84C;
          width:clamp(34px,4vw,42px); height:clamp(34px,4vw,42px);
          display:flex; align-items:center; justify-content:center;
          font-size:1rem; cursor:pointer; backdrop-filter:blur(8px);
          transition:all 0.2s; font-family:var(--font-montserrat);
        }
        .bas-nav-btn:hover { background:rgba(201,168,76,0.1); border-color:#C9A84C; }
        .bas-nav-label {
          color:rgba(255,255,255,0.18);
          font-size:clamp(0.48rem,0.72vw,0.58rem);
          letter-spacing:0.22em; text-transform:uppercase; font-weight:600;
        }

        /* ════════ MODAL ════════ */
        .bas-modal-bg {
          position:fixed; inset:0; z-index:50;
          background:rgba(5,4,2,0.9);
          backdrop-filter:blur(14px);
          display:flex; align-items:center; justify-content:center;
          padding:1.5rem;
          animation:basFadeIn 0.25s ease;
        }
        @keyframes basFadeIn { from{opacity:0} to{opacity:1} }
        .bas-modal {
          background:#0b0905;
          border:1px solid rgba(201,168,76,0.22);
          width:100%; max-width:540px;
          padding:clamp(1.8rem,4vw,3rem);
          position:relative;
          animation:basSlideUp 0.32s cubic-bezier(0.34,1.56,0.64,1);
          max-height:92vh; overflow-y:auto;
        }
        @keyframes basSlideUp {
          from{ opacity:0; transform:translateY(22px) }
          to  { opacity:1; transform:translateY(0)    }
        }
        .bas-modal-close {
          position:absolute; top:1rem; right:1rem;
          background:transparent; border:none;
          color:rgba(255,255,255,0.3); font-size:1.2rem;
          cursor:pointer; transition:color 0.2s;
          font-family:var(--font-montserrat);
        }
        .bas-modal-close:hover { color:#C9A84C; }

        .bas-modal h3 {
          color:#fff; font-size:clamp(1rem,1.8vw,1.4rem);
          font-weight:800; margin:0 0 0.2rem;
          font-family:var(--font-montserrat);
        }
        .bas-modal-sub {
          color:rgba(255,255,255,0.35);
          font-size:clamp(0.6rem,0.88vw,0.72rem);
          margin:0 0 1.5rem; font-family:var(--font-montserrat);
        }

        /* Selected tier badge in modal */
        .bas-modal-tier {
          display:inline-flex; align-items:center; gap:0.5rem;
          background:rgba(201,168,76,0.08);
          border:1px solid rgba(201,168,76,0.22);
          padding:0.35rem 0.8rem;
          margin-bottom:1.4rem;
        }
        .bas-modal-tier-dot {
          width:6px; height:6px; background:#C9A84C; flex-shrink:0;
        }
        .bas-modal-tier-name {
          color:#C9A84C;
          font-size:clamp(0.48rem,0.7vw,0.6rem);
          font-weight:700; letter-spacing:0.14em; text-transform:uppercase;
          font-family:var(--font-montserrat);
        }

        .bas-field {
          display:flex; flex-direction:column; gap:0.32rem;
          margin-bottom:0.9rem;
        }
        .bas-field label {
          color:rgba(255,255,255,0.38);
          font-size:clamp(0.46rem,0.68vw,0.56rem);
          letter-spacing:0.22em; text-transform:uppercase;
          font-weight:700; font-family:var(--font-montserrat);
        }
        .bas-field input,
        .bas-field select,
        .bas-field textarea {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(201,168,76,0.18); color:#fff;
          padding:0.62rem 0.82rem;
          font-size:clamp(0.62rem,0.92vw,0.76rem);
          font-family:var(--font-montserrat);
          outline:none; resize:none; width:100%; box-sizing:border-box;
          transition:border-color 0.2s;
        }
        .bas-field input::placeholder,
        .bas-field textarea::placeholder { color:rgba(255,255,255,0.16); }
        .bas-field select option { background:#0b0905; }
        .bas-field input:focus,
        .bas-field select:focus,
        .bas-field textarea:focus { border-color:rgba(201,168,76,0.5); }
        .bas-field-row { display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; }

        .bas-submit {
          width:100%; background:#C9A84C; border:none;
          color:#050402; font-weight:800;
          font-size:clamp(0.6rem,0.88vw,0.7rem);
          letter-spacing:0.18em; text-transform:uppercase;
          padding:0.85rem; cursor:pointer;
          font-family:var(--font-montserrat); margin-top:0.4rem;
          transition:background 0.2s, transform 0.2s;
        }
        .bas-submit:hover { background:#e0bc5c; transform:translateY(-1px); }

        .bas-sent {
          text-align:center; padding:2.5rem 0;
        }
        .bas-sent-icon { color:#C9A84C; font-size:2rem; margin-bottom:1rem; }
        .bas-sent h4 {
          color:#fff; font-size:1.1rem; font-weight:800;
          margin:0 0 0.5rem; font-family:var(--font-montserrat);
        }
        .bas-sent p {
          color:rgba(255,255,255,0.34); font-size:0.7rem;
          font-family:var(--font-montserrat); line-height:1.7; margin:0;
        }

        /* ════════ RESPONSIVE ════════ */
        @media (max-width:700px) {
          .bas-root {
            grid-template-columns:1fr;
            grid-template-rows:46vh 1fr;
          }
          .bas-right { grid-row:1; }
          .bas-left {
            grid-row:2;
            border-right:none;
            border-top:1px solid rgba(201,168,76,0.1);
            padding:1.1rem 1.2rem 4.5rem;
            gap:0.6rem;
            overflow-y:auto;
            justify-content:flex-start;
          }
          .bas-left::before { display:none; }
          .bas-reach { grid-template-columns:repeat(2,1fr); }
          .bas-reach-item:nth-child(2) { border-right:none; }
          .bas-reach-item:nth-child(3) { border-top:1px solid rgba(201,168,76,0.12); }
          .bas-reach-item:nth-child(4) { border-top:1px solid rgba(201,168,76,0.12); border-right:none; }
          .bas-callout { display:none; }
          .bas-cats { display:none; }
          .bas-sig-strip { display:none; }
        }
        @media (min-width:701px) and (max-width:1024px) {
          .bas-root { grid-template-columns:46% 54%; }
          .bas-callout { max-width:210px; }
        }
      `}</style>

      <div className="bas-root">

        {/* ══ LEFT ══ */}
        <div className="bas-left">

          <p className="bas-eyebrow">Mall of America · Sponsorship</p>

          <h1 className="bas-headline">
            Own the room.<br />
            Own the<br />
            <em>conversation.</em>
          </h1>

          <p className="bas-sub">
            Sponsoring Mall of America means your brand lives where
            40 million people choose to spend their time — and their money.
            No impression is more real than one earned in person.
          </p>

          <div className="bas-divider" />

          {/* Reach stats */}
          <div className="bas-reach">
            {REACH.map((r) => (
              <div key={r.label} className="bas-reach-item">
                <div className="bas-reach-val">{r.val}</div>
                <div className="bas-reach-label">{r.label}</div>
                <div className="bas-reach-sub">{r.sub}</div>
              </div>
            ))}
          </div>

          {/* Tier selector */}
          <p className="bas-tier-head">Sponsorship tiers</p>
          <div className="bas-tiers">
            {TIERS.map((t) => (
              <div
                key={t.id}
                className={`bas-tier ${activeTier === t.id ? "active" : ""}`}
                onClick={() => setActiveTier(t.id)}
              >
                <div className="bas-tier-left">
                  <div className="bas-tier-top">
                    <span className="bas-tier-name">{t.name}</span>
                    <span className="bas-tier-badge">{t.badge}</span>
                  </div>
                  <div className="bas-tier-perks">
                    {t.perks.map((p) => (
                      <div key={p} className="bas-perk-row">
                        <span className="bas-perk-dot">◆</span>
                        <span className="bas-perk-text">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bas-tier-right">
                  <span className="bas-tier-price">{t.price}</span>
                  <span className="bas-tier-custom">per year</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="bas-cta">
            <button className="bas-btn-primary" onClick={() => setFormOpen(true)}>
              Request Sponsorship Deck
            </button>
            <button className="bas-btn-secondary" onClick={() => router.push("/takeAction/hostAnEvent")}>
              Host an Event →
            </button>
          </div>

        </div>

        {/* ══ RIGHT ══ */}
        <div className="bas-right">

          <img
            className="bas-img"
            src="/photos/sponsor.webp"
            alt="Sponsorship agreement signing at Mall of America"
            onLoad={(e) => { (e.target as HTMLImageElement).style.opacity = "1"; }}
          />
          <div className="bas-fade-l" />
          <div className="bas-fade-b" />
          <div className="bas-fade-t" />

          {/* Quote callout */}
          <div className="bas-callout">
            <div className="bas-callout-card">
              <div className="bas-callout-label">Partner Story</div>
              <p className="bas-callout-text">
                "Our MOA sponsorship delivered 3× the brand recall
                of any digital campaign we ran that quarter."
              </p>
              <div className="bas-callout-name">Sarah Jenkins</div>
              <div className="bas-callout-role">Chief Marketing Officer · GlobalBrand Co.</div>
            </div>
          </div>

          {/* Signature strip */}
          <div className="bas-sig-strip">
            <div className="bas-sig-line" />
            <span className="bas-sig-text">Agreements signed · 2024</span>
            <div className="bas-sig-line" style={{ background: "linear-gradient(to left,rgba(201,168,76,0.3),transparent)" }} />
          </div>

          {/* Category pills */}
          <div className="bas-cats">
            <span className="bas-cats-label">Industries we partner with</span>
            <div className="bas-pills">
              {CATEGORIES.map((c) => (
                <span key={c} className="bas-pill">{c}</span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ══ NAV ══ */}
      <div className="bas-nav">
        <button className="bas-nav-btn" onClick={() => router.back()} aria-label="Back">‹</button>
        <span className="bas-nav-label">Become a Sponsor</span>
        <div style={{ width: "clamp(34px,4vw,42px)" }} />
      </div>

      {/* ══ FORM MODAL ══ */}
      {formOpen && (
        <div
          className="bas-modal-bg"
          onClick={(e) => { if (e.target === e.currentTarget) { setFormOpen(false); setSent(false); } }}
        >
          <div className="bas-modal">
            <button className="bas-modal-close" onClick={() => { setFormOpen(false); setSent(false); }}>✕</button>

            {sent ? (
              <div className="bas-sent">
                <div className="bas-sent-icon">◈</div>
                <h4>Proposal Received</h4>
                <p>
                  Our partnerships team will send your tailored sponsorship deck<br />
                  within 1 business day. Welcome to Mall of America.
                </p>
              </div>
            ) : (
              <>
                <h3>Request Sponsorship Deck</h3>
                <p className="bas-modal-sub">We'll send a tailored proposal within 24 hours.</p>

                {/* Selected tier indicator */}
                <div className="bas-modal-tier">
                  <div className="bas-modal-tier-dot" />
                  <span className="bas-modal-tier-name">
                    {tier.name} — {tier.price}
                  </span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="bas-field-row">
                    <div className="bas-field">
                      <label>First Name</label>
                      <input type="text" placeholder="Sarah" required />
                    </div>
                    <div className="bas-field">
                      <label>Last Name</label>
                      <input type="text" placeholder="Jenkins" required />
                    </div>
                  </div>

                  <div className="bas-field-row">
                    <div className="bas-field">
                      <label>Title / Role</label>
                      <input type="text" placeholder="Chief Marketing Officer" />
                    </div>
                    <div className="bas-field">
                      <label>Email</label>
                      <input type="email" placeholder="you@company.com" required />
                    </div>
                  </div>

                  <div className="bas-field-row">
                    <div className="bas-field">
                      <label>Company</label>
                      <input type="text" placeholder="Your company" required />
                    </div>
                    <div className="bas-field">
                      <label>Industry</label>
                      <select>
                        <option value="">Select…</option>
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="bas-field-row">
                    <div className="bas-field">
                      <label>Sponsorship Tier</label>
                      <select
                        value={activeTier}
                        onChange={(e) => setActiveTier(e.target.value as TierId)}
                      >
                        {TIERS.map(t => (
                          <option key={t.id} value={t.id}>{t.name} · {t.price}</option>
                        ))}
                      </select>
                    </div>
                    <div className="bas-field">
                      <label>Budget Range</label>
                      <select>
                        <option value="">Select…</option>
                        <option>Under $50K</option>
                        <option>$50K – $150K</option>
                        <option>$150K – $500K</option>
                        <option>$500K+</option>
                      </select>
                    </div>
                  </div>

                  <div className="bas-field">
                    <label>What are your sponsorship goals?</label>
                    <textarea
                      rows={3}
                      placeholder="Brand awareness, lead generation, product launch, community association…"
                    />
                  </div>

                  <button className="bas-submit" type="submit">
                    Request Proposal →
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}