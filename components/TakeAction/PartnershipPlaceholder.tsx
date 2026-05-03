"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";



// ─── Data ────────────────────────────────────────────────────────────────────
const PARTNERSHIP_TYPES = [
  {
    id: "strategic",
    icon: "◈",
    name: "Strategic Alliance",
    tag: "Long-Term",
    desc: "Deep, multi-year collaboration. Co-develop campaigns, share audience data, and build equity in the world's most visited retail destination.",
    bullets: ["Joint marketing campaigns", "Exclusive category rights", "Co-branded content & IP", "Executive steering committee"],
  },
  {
    id: "retail",
    icon: "◈",
    name: "Retail Partnership",
    tag: "Commercial",
    desc: "Integrate your product or service into the MOA retail ecosystem — from curated pop-ups to permanent concession arrangements.",
    bullets: ["Revenue-share models", "Seasonal activation windows", "Direct-to-consumer testing", "Retail media network access"],
  },
  {
    id: "community",
    icon: "◈",
    name: "Community & Cause",
    tag: "Impact",
    desc: "Align your brand with purpose. Co-host charity drives, community events, and initiatives that reach millions at the grassroots level.",
    bullets: ["Charity event co-hosting", "Community activation space", "CSR storytelling platform", "Local media amplification"],
  },
] as const;

type PartnerType = typeof PARTNERSHIP_TYPES[number]["id"];

const PROOF = [
  { val: "30+", label: "Years of partnerships", sub: "Trusted by the world's best brands" },
  { val: "520+", label: "Active brand partners", sub: "Every tier, every category" },
  { val: "40M+", label: "Shared audience annually", sub: "The largest captive retail crowd" },
  { val: "$2B+", label: "Regional GDP impact", sub: "A partner in America's economy" },
];

const PARTNER_LOGOS = [
  "Samsung", "Nike", "Apple", "H&M", "Lego",
  "Zara", "Pepsi", "American Express",
];

export default function PartnerWithUsPage() {
  const router = useRouter();
  const [activeType, setActiveType] = useState<PartnerType>("strategic");
  const [formOpen, setFormOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const markerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const active = PARTNERSHIP_TYPES.find(p => p.id === activeType)!;
  const activeIdx = PARTNERSHIP_TYPES.findIndex(p => p.id === activeType);

  const [mounted, setMounted] = useState(false);

  // ── Entrance ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // ── Slide marker on type change ──────────────────────────────────────────
  useEffect(() => {
    if (!markerRef.current || !listRef.current) return;
    const items = listRef.current.querySelectorAll(".pw-type-item");
    if (items[activeIdx]) {
      const el = items[activeIdx] as HTMLElement;
      markerRef.current.style.top = `${el.offsetTop}px`;
      markerRef.current.style.height = `${el.offsetHeight}px`;
    }
  }, [activeType, activeIdx]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  }, []);

  return (
    <>
      <style>{`
        .pw-root {
          position:fixed; inset:0;
          background:#050402;
          display:grid;
          grid-template-columns:1fr 1fr;
          overflow:hidden;
          font-family:var(--font-montserrat);
        }

        /* ════════ LEFT ════════ */
        .pw-left {
          position:relative;
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:clamp(1.8rem,5vh,3.5rem) clamp(1.6rem,4vw,3.5rem) clamp(4rem,8vh,5rem);
          gap:clamp(0.75rem,1.6vh,1.3rem);
          border-right:1px solid rgba(201,168,76,0.1);
          overflow:hidden;
          z-index:10;
        }
        .pw-left::before {
          content:'';
          position:absolute; left:0; top:12%; bottom:12%; width:3px;
          background:linear-gradient(to bottom,transparent,#C9A84C,transparent);
        }

        .pw-eyebrow {
          color:#C9A84C;
          font-size:clamp(0.52rem,0.8vw,0.66rem);
          letter-spacing:0.44em; text-transform:uppercase;
          font-weight:700; margin:0; opacity:0; transform:translateY(14px);
          transition:opacity 0.55s ease, transform 0.55s ease;
        }
        .pw-headline {
          color:#fff;
          font-size:clamp(1.65rem,3vw,2.9rem);
          font-weight:800; line-height:1.04;
          margin:0; opacity:0; transform:translateY(24px);
          transition:opacity 0.7s ease 0.12s, transform 0.7s ease 0.12s;
        }
        .pw-headline em { color:#C9A84C; font-style:normal; }
        .pw-sub {
          color:rgba(255,255,255,0.44);
          font-size:clamp(0.7rem,1.05vw,0.84rem);
          font-weight:400; line-height:1.75;
          margin:0; max-width:390px; opacity:0; transform:translateY(14px);
          transition:opacity 0.55s ease 0.22s, transform 0.55s ease 0.22s;
        }
        .pw-divider {
          width:52px; height:2px;
          background:linear-gradient(to right,#C9A84C,rgba(201,168,76,0.15));
          transform:scaleX(0); transform-origin:left;
          transition:transform 0.5s ease 0.32s;
        }

        /* ── Proof stats ── */
        .pw-proof {
          display:grid;
          grid-template-columns:repeat(4,1fr);
          border:1px solid rgba(201,168,76,0.12);
          opacity:0; transform:translateY(12px);
          transition:opacity 0.55s ease 0.4s, transform 0.55s ease 0.4s;
        }
        .pw-proof-item {
          padding:clamp(0.5rem,1vh,0.8rem) clamp(0.4rem,0.8vw,0.7rem);
          border-right:1px solid rgba(201,168,76,0.12);
          transition:background 0.22s;
        }
        .pw-proof-item:last-child { border-right:none; }
        .pw-proof-item:hover { background:rgba(201,168,76,0.05); }
        .pw-proof-val {
          color:#C9A84C;
          font-size:clamp(0.9rem,1.6vw,1.4rem);
          font-weight:800; line-height:1;
          font-variant-numeric:tabular-nums;
        }
        .pw-proof-label {
          color:#fff;
          font-size:clamp(0.38rem,0.58vw,0.52rem);
          font-weight:700; letter-spacing:0.1em;
          text-transform:uppercase; margin-top:0.2rem; line-height:1.2;
        }
        .pw-proof-sub {
          color:rgba(255,255,255,0.24);
          font-size:clamp(0.34rem,0.5vw,0.46rem);
          margin-top:0.1rem; line-height:1.3;
        }

        /* ── Partnership type selector ── */
        .pw-type-head {
          color:rgba(255,255,255,0.26);
          font-size:clamp(0.44rem,0.66vw,0.56rem);
          letter-spacing:0.36em; text-transform:uppercase;
          font-weight:700; margin:0;
        }

        .pw-types {
          position:relative;
          opacity:0; transform:translateY(12px);
          transition:opacity 0.55s ease 0.5s, transform 0.55s ease 0.5s;
        }
        /* Sliding gold highlight */
        .pw-type-marker {
          position:absolute;
          left:0; right:0;
          background:rgba(201,168,76,0.055);
          border-left:2px solid #C9A84C;
          transition:top 0.35s cubic-bezier(0.4,0,0.2,1),
                     height 0.35s cubic-bezier(0.4,0,0.2,1);
          pointer-events:none;
          z-index:0;
        }

        .pw-type-list {
          border:1px solid rgba(201,168,76,0.12);
          position:relative;
          z-index:1;
        }

        .pw-type-item {
          display:flex;
          gap:clamp(0.6rem,1.2vw,1rem);
          align-items:flex-start;
          padding:clamp(0.6rem,1.2vh,1rem) clamp(0.7rem,1.2vw,1.1rem);
          border-bottom:1px solid rgba(201,168,76,0.07);
          cursor:pointer;
          transition:opacity 0.2s;
          position:relative; z-index:1;
        }
        .pw-type-item:last-child { border-bottom:none; }
        .pw-type-item:not(.active) { opacity:0.46; }
        .pw-type-item:not(.active):hover { opacity:0.72; }
        .pw-type-item.active { opacity:1; }

        .pw-type-icon {
          color:#C9A84C;
          font-size:clamp(0.55rem,0.82vw,0.7rem);
          flex-shrink:0;
          margin-top:0.12rem;
          opacity:0.6;
          transition:opacity 0.2s;
        }
        .pw-type-item.active .pw-type-icon { opacity:1; }

        .pw-type-body { flex:1; min-width:0; }
        .pw-type-top {
          display:flex; align-items:center; gap:0.5rem;
          margin-bottom:0.15rem;
        }
        .pw-type-name {
          color:#fff;
          font-size:clamp(0.58rem,0.88vw,0.72rem);
          font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
        }
        .pw-type-item.active .pw-type-name { color:#C9A84C; }
        .pw-type-tag {
          background:rgba(201,168,76,0.1);
          border:1px solid rgba(201,168,76,0.2);
          color:rgba(201,168,76,0.65);
          font-size:clamp(0.3rem,0.44vw,0.4rem);
          font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
          padding:1px 5px;
        }
        .pw-type-desc {
          color:rgba(255,255,255,0.36);
          font-size:clamp(0.42rem,0.62vw,0.54rem);
          line-height:1.5;
        }
        /* Bullets — visible only when active */
        .pw-type-bullets {
          display:none;
          flex-direction:column; gap:0.18rem;
          margin-top:0.35rem;
        }
        .pw-type-item.active .pw-type-bullets { display:flex; }
        .pw-bullet {
          display:flex; align-items:flex-start; gap:0.38rem;
        }
        .pw-bullet-dot {
          color:#C9A84C; font-size:0.4rem;
          flex-shrink:0; margin-top:0.2rem; line-height:1;
        }
        .pw-bullet-text {
          color:rgba(255,255,255,0.4);
          font-size:clamp(0.38rem,0.58vw,0.5rem);
          line-height:1.4;
        }

        /* ── CTAs ── */
        .pw-cta {
          display:flex; gap:0.75rem; align-items:center; flex-wrap:wrap;
          opacity:0; transform:translateY(10px);
          transition:opacity 0.5s ease 0.6s, transform 0.5s ease 0.6s;
        }
        .pw-btn-primary {
          background:#C9A84C; color:#050402; border:none;
          padding:clamp(0.6rem,1.2vh,0.85rem) clamp(1.2rem,2.5vw,2rem);
          font-size:clamp(0.58rem,0.88vw,0.7rem);
          font-weight:800; letter-spacing:0.18em; text-transform:uppercase;
          font-family:var(--font-montserrat); cursor:pointer;
          transition:all 0.22s ease;
        }
        .pw-btn-primary:hover {
          background:#e0bc5c; transform:translateY(-1px);
          box-shadow:0 6px 24px rgba(201,168,76,0.35);
        }
        .pw-btn-secondary {
          background:transparent; color:rgba(255,255,255,0.5);
          border:1px solid rgba(255,255,255,0.14);
          padding:clamp(0.6rem,1.2vh,0.85rem) clamp(1rem,2vw,1.5rem);
          font-size:clamp(0.56rem,0.84vw,0.68rem);
          font-weight:600; letter-spacing:0.14em; text-transform:uppercase;
          font-family:var(--font-montserrat); cursor:pointer;
          transition:all 0.22s ease;
        }
        .pw-btn-secondary:hover { border-color:rgba(201,168,76,0.4); color:#C9A84C; }

        /* ════════ RIGHT ════════ */
        .pw-right {
          position:relative; overflow:hidden; opacity:0; transform:translateX(24px);
          transition:opacity 0.75s ease 0.18s, transform 0.75s ease 0.18s;
        }
        .pw-img {
          position:absolute; inset:0;
          width:100%; height:100%;
          object-fit:cover; object-position:center 22%;
          opacity:0; transform:scale(1.05);
          filter:brightness(0.32) saturate(0.65);
          transition:opacity 1.2s ease, transform 1.2s ease;
        }

        /* Mounted states */
        .pw-root.mounted .pw-eyebrow,
        .pw-root.mounted .pw-headline,
        .pw-root.mounted .pw-sub,
        .pw-root.mounted .pw-proof,
        .pw-root.mounted .pw-types,
        .pw-root.mounted .pw-cta,
        .pw-root.mounted .pw-right {
          opacity: 1; transform: translate(0,0);
        }
        .pw-root.mounted .pw-divider {
          transform: scaleX(1);
        }
        .pw-root.mounted .pw-img {
          opacity: 1; transform: scale(1);
        }
        .pw-fade-l {
          position:absolute; top:0; left:0; bottom:0; width:30%;
          background:linear-gradient(to right,#050402,transparent);
          z-index:2; pointer-events:none;
        }
        .pw-fade-b {
          position:absolute; left:0; right:0; bottom:0; height:30%;
          background:linear-gradient(to top,#050402,transparent);
          z-index:2; pointer-events:none;
        }
        .pw-fade-t {
          position:absolute; left:0; right:0; top:0; height:16%;
          background:linear-gradient(to bottom,rgba(5,4,2,0.55),transparent);
          z-index:2; pointer-events:none;
        }

        /* ── Handshake callout card ── */
        .pw-callout {
          position:absolute;
          top:clamp(1.4rem,3.5vh,2.8rem);
          right:clamp(1.2rem,3vw,2.4rem);
          z-index:10; max-width:265px;
        }
        .pw-callout-card {
          background:rgba(5,4,2,0.84);
          border:1px solid rgba(201,168,76,0.22);
          border-left:3px solid #C9A84C;
          padding:clamp(0.85rem,1.7vh,1.3rem) clamp(0.9rem,1.6vw,1.3rem);
          backdrop-filter:blur(10px);
        }
        .pw-callout-label {
          color:rgba(201,168,76,0.65);
          font-size:clamp(0.42rem,0.62vw,0.52rem);
          letter-spacing:0.32em; text-transform:uppercase;
          font-weight:700; margin-bottom:0.5rem;
        }
        .pw-callout-text {
          color:rgba(255,255,255,0.7);
          font-size:clamp(0.6rem,0.88vw,0.72rem);
          line-height:1.6; font-style:italic; margin:0 0 0.65rem;
        }
        .pw-callout-name {
          color:#C9A84C;
          font-size:clamp(0.44rem,0.66vw,0.56rem);
          font-weight:700; letter-spacing:0.14em; text-transform:uppercase;
        }
        .pw-callout-role {
          color:rgba(255,255,255,0.24);
          font-size:clamp(0.38rem,0.56vw,0.48rem);
          margin-top:2px; letter-spacing:0.06em;
        }

        /* ── Active partnership detail panel — bottom of photo ── */
        .pw-detail {
          position:absolute;
          bottom:clamp(1rem,2.8vh,2.2rem);
          left:clamp(1.2rem,3vw,2rem);
          right:clamp(1.2rem,3vw,2rem);
          z-index:10;
        }
        .pw-detail-label {
          color:rgba(255,255,255,0.2);
          font-size:clamp(0.42rem,0.62vw,0.54rem);
          letter-spacing:0.34em; text-transform:uppercase;
          font-weight:700; margin-bottom:0.45rem; display:block;
        }
        /* Logo / partner pills */
        .pw-logos {
          display:flex; flex-wrap:wrap; gap:0.38rem;
        }
        .pw-logo-pill {
          background:rgba(5,4,2,0.76);
          border:1px solid rgba(201,168,76,0.15);
          color:rgba(255,255,255,0.38);
          font-size:clamp(0.38rem,0.58vw,0.52rem);
          font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
          padding:3px 10px; backdrop-filter:blur(6px);
          transition:border-color 0.2s, color 0.2s, background 0.2s;
          white-space:nowrap;
        }
        .pw-logo-pill:hover {
          border-color:rgba(201,168,76,0.42); color:#C9A84C;
          background:rgba(201,168,76,0.07);
        }

        /* ── Handshake strip ── */
        .pw-strip {
          position:absolute;
          bottom:clamp(4.5rem,9vh,6rem);
          left:clamp(1.2rem,3vw,2rem);
          right:clamp(1.2rem,3vw,2rem);
          z-index:10;
          display:flex; align-items:center; gap:0.7rem;
        }
        .pw-strip-line {
          flex:1; height:1px;
          background:linear-gradient(to right,rgba(201,168,76,0.28),transparent);
        }
        .pw-strip-text {
          color:rgba(201,168,76,0.42);
          font-size:clamp(0.38rem,0.56vw,0.5rem);
          letter-spacing:0.3em; text-transform:uppercase; font-weight:700;
          white-space:nowrap;
        }

        /* ════════ NAV ════════ */
        .pw-nav {
          position:fixed;
          bottom:0; left:0; right:0; z-index:30;
          display:flex; align-items:center; justify-content:space-between;
          padding:clamp(0.7rem,1.8vh,1.1rem) clamp(1rem,3vw,2rem);
          background:linear-gradient(to top,rgba(5,4,2,0.9) 0%,transparent 100%);
        }
        .pw-nav-btn {
          background:transparent;
          border:1px solid rgba(201,168,76,0.25); color:#C9A84C;
          width:clamp(34px,4vw,42px); height:clamp(34px,4vw,42px);
          display:flex; align-items:center; justify-content:center;
          font-size:1rem; cursor:pointer; backdrop-filter:blur(8px);
          transition:all 0.2s; font-family:var(--font-montserrat);
        }
        .pw-nav-btn:hover { background:rgba(201,168,76,0.1); border-color:#C9A84C; }
        .pw-nav-label {
          color:rgba(255,255,255,0.18);
          font-size:clamp(0.48rem,0.72vw,0.58rem);
          letter-spacing:0.22em; text-transform:uppercase; font-weight:600;
        }

        /* ════════ MODAL ════════ */
        .pw-modal-bg {
          position:fixed; inset:0; z-index:50;
          background:rgba(5,4,2,0.9);
          backdrop-filter:blur(14px);
          display:flex; align-items:center; justify-content:center;
          padding:1.5rem;
          animation:pwFadeIn 0.25s ease;
        }
        @keyframes pwFadeIn { from{opacity:0} to{opacity:1} }
        .pw-modal {
          background:#0b0905;
          border:1px solid rgba(201,168,76,0.22);
          width:100%; max-width:540px;
          padding:clamp(1.8rem,4vw,3rem);
          position:relative;
          animation:pwSlideUp 0.32s cubic-bezier(0.34,1.56,0.64,1);
          max-height:92vh; overflow-y:auto;
        }
        @keyframes pwSlideUp {
          from{opacity:0;transform:translateY(22px)}
          to{opacity:1;transform:translateY(0)}
        }
        .pw-modal-close {
          position:absolute; top:1rem; right:1rem;
          background:transparent; border:none;
          color:rgba(255,255,255,0.28); font-size:1.2rem;
          cursor:pointer; transition:color 0.2s;
          font-family:var(--font-montserrat);
        }
        .pw-modal-close:hover { color:#C9A84C; }

        .pw-modal h3 {
          color:#fff; font-size:clamp(1rem,1.8vw,1.4rem);
          font-weight:800; margin:0 0 0.2rem;
          font-family:var(--font-montserrat);
        }
        .pw-modal-sub {
          color:rgba(255,255,255,0.34);
          font-size:clamp(0.6rem,0.88vw,0.72rem);
          margin:0 0 1.4rem; font-family:var(--font-montserrat);
        }

        /* Active type badge in modal */
        .pw-modal-badge {
          display:inline-flex; align-items:center; gap:0.5rem;
          background:rgba(201,168,76,0.08);
          border:1px solid rgba(201,168,76,0.22);
          padding:0.35rem 0.8rem;
          margin-bottom:1.4rem;
        }
        .pw-modal-badge-dot {
          width:6px; height:6px; background:#C9A84C; flex-shrink:0;
        }
        .pw-modal-badge-name {
          color:#C9A84C;
          font-size:clamp(0.46rem,0.68vw,0.58rem);
          font-weight:700; letter-spacing:0.14em; text-transform:uppercase;
          font-family:var(--font-montserrat);
        }

        .pw-field {
          display:flex; flex-direction:column; gap:0.3rem;
          margin-bottom:0.9rem;
        }
        .pw-field label {
          color:rgba(255,255,255,0.36);
          font-size:clamp(0.46rem,0.68vw,0.56rem);
          letter-spacing:0.22em; text-transform:uppercase;
          font-weight:700; font-family:var(--font-montserrat);
        }
        .pw-field input,
        .pw-field select,
        .pw-field textarea {
          background:rgba(255,255,255,0.03);
          border:1px solid rgba(201,168,76,0.18); color:#fff;
          padding:0.62rem 0.82rem;
          font-size:clamp(0.62rem,0.92vw,0.76rem);
          font-family:var(--font-montserrat);
          outline:none; resize:none; width:100%; box-sizing:border-box;
          transition:border-color 0.2s;
        }
        .pw-field input::placeholder,
        .pw-field textarea::placeholder { color:rgba(255,255,255,0.15); }
        .pw-field select option { background:#0b0905; }
        .pw-field input:focus,
        .pw-field select:focus,
        .pw-field textarea:focus { border-color:rgba(201,168,76,0.5); }
        .pw-field-row { display:grid; grid-template-columns:1fr 1fr; gap:0.8rem; }

        .pw-submit {
          width:100%; background:#C9A84C; border:none;
          color:#050402; font-weight:800;
          font-size:clamp(0.6rem,0.88vw,0.7rem);
          letter-spacing:0.18em; text-transform:uppercase;
          padding:0.85rem; cursor:pointer;
          font-family:var(--font-montserrat); margin-top:0.4rem;
          transition:background 0.2s,transform 0.2s;
        }
        .pw-submit:hover { background:#e0bc5c; transform:translateY(-1px); }

        .pw-sent {
          text-align:center; padding:2.5rem 0;
        }
        .pw-sent-icon { color:#C9A84C; font-size:2rem; margin-bottom:1rem; }
        .pw-sent h4 {
          color:#fff; font-size:1.1rem; font-weight:800;
          margin:0 0 0.5rem; font-family:var(--font-montserrat);
        }
        .pw-sent p {
          color:rgba(255,255,255,0.32); font-size:0.7rem;
          font-family:var(--font-montserrat); line-height:1.7; margin:0;
        }

        /* ════════ RESPONSIVE ════════ */
        @media (max-width:700px) {
          .pw-root {
            grid-template-columns:1fr;
            grid-template-rows:46vh 1fr;
          }
          .pw-right { grid-row:1; }
          .pw-left {
            grid-row:2;
            border-right:none;
            border-top:1px solid rgba(201,168,76,0.1);
            padding:1.1rem 1.2rem 4.5rem;
            gap:0.6rem;
            overflow-y:auto;
            justify-content:flex-start;
          }
          .pw-left::before { display:none; }
          .pw-proof { grid-template-columns:repeat(2,1fr); }
          .pw-proof-item:nth-child(2) { border-right:none; }
          .pw-proof-item:nth-child(3) { border-top:1px solid rgba(201,168,76,0.12); }
          .pw-proof-item:nth-child(4) { border-top:1px solid rgba(201,168,76,0.12); border-right:none; }
          .pw-callout { display:none; }
          .pw-detail  { display:none; }
          .pw-strip   { display:none; }
        }
        @media (min-width:701px) and (max-width:1024px) {
          .pw-root { grid-template-columns:46% 54%; }
          .pw-callout { max-width:210px; }
        }
      `}</style>

      <div className={`pw-root ${mounted ? "mounted" : ""}`}>

        {/* ══ LEFT ══ */}
        <div className="pw-left">

          <p className="pw-eyebrow">Mall of America · Partnerships</p>

          <h1 className="pw-headline">
            Build something<br />
            bigger <em>together.</em>
          </h1>

          <p className="pw-sub">
            A Mall of America partnership is more than a deal —
            it's access to 40 million people, 30 years of brand trust,
            and the most coveted real estate in American retail.
          </p>

          <div className="pw-divider" />

          {/* Proof stats */}
          <div className="pw-proof">
            {PROOF.map((p) => (
              <div key={p.label} className="pw-proof-item">
                <div className="pw-proof-val">{p.val}</div>
                <div className="pw-proof-label">{p.label}</div>
                <div className="pw-proof-sub">{p.sub}</div>
              </div>
            ))}
          </div>

          {/* Partnership type selector */}
          <p className="pw-type-head">Partnership models</p>

          <div className="pw-types">
            {/* Sliding highlight marker */}
            <div className="pw-type-marker" ref={markerRef} />

            <div className="pw-type-list" ref={listRef}>
              {PARTNERSHIP_TYPES.map((pt) => (
                <div
                  key={pt.id}
                  className={`pw-type-item ${activeType === pt.id ? "active" : ""}`}
                  onClick={() => setActiveType(pt.id)}
                >
                  <span className="pw-type-icon">{pt.icon}</span>
                  <div className="pw-type-body">
                    <div className="pw-type-top">
                      <span className="pw-type-name">{pt.name}</span>
                      <span className="pw-type-tag">{pt.tag}</span>
                    </div>
                    <div className="pw-type-desc">{pt.desc}</div>
                    <div className="pw-type-bullets">
                      {pt.bullets.map((b) => (
                        <div key={b} className="pw-bullet">
                          <span className="pw-bullet-dot">◆</span>
                          <span className="pw-bullet-text">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="pw-cta">
            <button className="pw-btn-primary" onClick={() => setFormOpen(true)}>
              Start a Conversation
            </button>
            <button className="pw-btn-secondary" >
              Become a Partner →
            </button>
          </div>

        </div>

        {/* ══ RIGHT ══ */}
        <div className="pw-right">

          <img
            className="pw-img"
            src="/photos/partnership.webp"
            alt="Strategic partnership handshake at Mall of America"
          />
          <div className="pw-fade-l" />
          <div className="pw-fade-b" />
          <div className="pw-fade-t" />

          {/* Quote callout */}
          <div className="pw-callout">
            <div className="pw-callout-card">
              <div className="pw-callout-label">Partner Voice</div>
              <p className="pw-callout-text">
                "Partnering with MOA gave us instant credibility
                with an audience that no media buy could have reached."
              </p>
              <div className="pw-callout-name">James Harlow</div>
              <div className="pw-callout-role">CEO · Strategic Brands Group</div>
            </div>
          </div>

          {/* Strip */}
          <div className="pw-strip">
            <div className="pw-strip-line" />
            <span className="pw-strip-text">Trusted by 520+ brands</span>
            <div className="pw-strip-line" style={{ background: "linear-gradient(to left,rgba(201,168,76,0.28),transparent)" }} />
          </div>

          {/* Partner logos */}
          <div className="pw-detail">
            <span className="pw-detail-label">In partnership with</span>
            <div className="pw-logos">
              {PARTNER_LOGOS.map((l) => (
                <span key={l} className="pw-logo-pill">{l}</span>
              ))}
              <span className="pw-logo-pill" style={{ color: "rgba(201,168,76,0.4)", borderColor: "rgba(201,168,76,0.1)" }}>
                +512 more
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ══ NAV ══ */}
      <div className="pw-nav">
        <button className="pw-nav-btn" onClick={() => router.back()} aria-label="Back">‹</button>
        <span className="pw-nav-label">Partner With Us</span>
        <div style={{ width: "clamp(34px,4vw,42px)" }} />
      </div>

      {/* ══ FORM MODAL ══ */}
      {formOpen && (
        <div
          className="pw-modal-bg"
          onClick={(e) => { if (e.target === e.currentTarget) { setFormOpen(false); setSent(false); } }}
        >
          <div className="pw-modal">
            <button className="pw-modal-close" onClick={() => { setFormOpen(false); setSent(false); }}>✕</button>

            {sent ? (
              <div className="pw-sent">
                <div className="pw-sent-icon">◈</div>
                <h4>Let's Talk</h4>
                <p>
                  Our partnerships team will reach out within 1 business day.<br />
                  We're looking forward to building something great together.
                </p>
              </div>
            ) : (
              <>
                <h3>Start a Conversation</h3>
                <p className="pw-modal-sub">Tell us about your brand and what you're looking to build.</p>

                <div className="pw-modal-badge">
                  <div className="pw-modal-badge-dot" />
                  <span className="pw-modal-badge-name">{active.name} · {active.tag}</span>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="pw-field-row">
                    <div className="pw-field">
                      <label>First Name</label>
                      <input type="text" placeholder="James" required />
                    </div>
                    <div className="pw-field">
                      <label>Last Name</label>
                      <input type="text" placeholder="Harlow" required />
                    </div>
                  </div>

                  <div className="pw-field-row">
                    <div className="pw-field">
                      <label>Title</label>
                      <input type="text" placeholder="CEO / VP Partnerships" />
                    </div>
                    <div className="pw-field">
                      <label>Email</label>
                      <input type="email" placeholder="you@company.com" required />
                    </div>
                  </div>

                  <div className="pw-field-row">
                    <div className="pw-field">
                      <label>Company</label>
                      <input type="text" placeholder="Your company" required />
                    </div>
                    <div className="pw-field">
                      <label>Company Size</label>
                      <select>
                        <option value="">Select…</option>
                        <option>1–50 employees</option>
                        <option>50–500 employees</option>
                        <option>500–5,000 employees</option>
                        <option>5,000+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div className="pw-field-row">
                    <div className="pw-field">
                      <label>Partnership Model</label>
                      <select
                        value={activeType}
                        onChange={(e) => setActiveType(e.target.value as PartnerType)}
                      >
                        {PARTNERSHIP_TYPES.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="pw-field">
                      <label>Estimated Budget</label>
                      <select>
                        <option value="">Select…</option>
                        <option>Under $25K</option>
                        <option>$25K – $100K</option>
                        <option>$100K – $500K</option>
                        <option>$500K+</option>
                        <option>Open to discussion</option>
                      </select>
                    </div>
                  </div>

                  <div className="pw-field">
                    <label>What do you want to achieve together?</label>
                    <textarea
                      rows={3}
                      placeholder="Your goals, vision for the partnership, timeline expectations…"
                    />
                  </div>

                  <button className="pw-submit" type="submit">
                    Send Message →
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