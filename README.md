# Mall of America — Interactive Sales Deck

> A cinematic, browser-based sales deck for Mall of America. Not a website — a presentation tool. Built for commercial teams pitching to prospective tenants, sponsors, and event partners.

**Live URL:** [american-mall.vercel.app](https://american-mall.vercel.app)

---

## What This Is

A fully interactive sales deck that replaces fragmented pitch materials — YouTube links, static PDFs, demographic spreadsheets — with a single shareable URL. A sales rep screen-shares it on a live call, or sends it as a standalone link a prospect explores alone. No one needs to narrate.

The deck tells the story of Mall of America across 8 chapters: scale, social proof, spatial layout, entertainment, events, sponsorship, and a closing action slide — each designed to move a different audience (retail tenant, brand sponsor, event promoter) toward a specific business decision.

---

## Deck Structure

The experience is organized as **8 non-linear chapters**, navigated via a floating chapter rail (desktop) or a bottom pill indicator (mobile). There is no website header. There is no contact form. Every element serves the presentation.

| Chapter | Section | Story Beat | Business Action |
|---------|---------|-----------|-----------------|
| 01 | **Intro** | Cinematic hero — autoplay video, Three.js particles, animated stats | Emotional buy-in within 5 seconds |
| 02 | **Scale** | D3 arc counters — 40M visitors, 520+ stores, 5.6M sq ft, 30% tourism | Proves market dominance |
| 03 | **Who's Here** | GSAP infinite brand ticker + D3 radial arcs — Samsung, Apple, Nike | "Will you be next?" |
| 04 | **Explore** | Three.js 3D floor stack with raycasting + D3 zone breakdown chart | Floor-level leasing interest |
| 05 | **Entertainment** | 4 editorial panels — Nickelodeon Universe, Sea Life, Dining, Shopping | Entertainment drives footfall |
| 06 | **Events** | Hero slideshow + event cards with video carousels — real brand footage | "40 million witnesses" |
| 07 | **Sponsorship** | D3 impression comparison bars + treemap + tiered packages | Tier selection and enquiry |
| 08 | **Get Started** | Three action paths + deck action buttons (mailto / download) | Lease, sponsor, or book |

---

## What Changed: Website → Deck

After the initial submission, the experience was reworked to read as a **presentation deck**, not a public website. Five commits addressed this:

### 1. Navigation: Fixed Header → Floating Chapter Rail
The persistent website navbar was completely replaced with a **deck-style chapter rail** — a vertical dot navigator fixed to the right edge (desktop) that shows:
- Current chapter number (`01 / 08`)
- Active section label
- A vertical progress line with gold fill
- Labels that slide in on hover

On mobile, it becomes a **bottom pill indicator** — a row of dots in a glassmorphic capsule, matching Digideck-style slide progression.

No logo in the nav. No menu links. No hamburger icon. The navigation reads as a deck controller, not a site header.

### 2. CTA: Contact Form → Final Action Slide
The contact form was replaced with a **closing pitch slide** structured as:
- Headline: *"You've seen it all. Now make your move."*
- Three numbered action paths (Lease / Event / Sponsor) as editorial cards with watermark numbers
- Three deck action buttons: **Schedule a Call** (mailto), **Download Deck** (generates text summary), **Book a Meeting** (mailto)
- Full-circle watermark closing with the Mall of America identity

No form fields. No generic lead capture. The CTA reads as the final slide of a pitch deck — "here's what happens next."

### 3. Browser Scrollbar Hidden
The native browser scrollbar is hidden via CSS (`scrollbar-width: none` / `::-webkit-scrollbar { display: none }`), removing the browser-chrome feel and reinforcing the full-screen deck presentation.

### 4. Video-First Events Section
Four brand event videos were added (Samsung Galaxy Store opening, Samsung VR experience, Nike sneaker launch, Adidas fan engagement) as **lazy-loaded carousel items** inside event cards. Videos load with `preload="none"`, only fetching bytes when their slide becomes active — zero impact on initial page load.

### 5. Performance Hardening
GSAP was moved from a static top-level import in the Navbar to a **lazy async loader** (same pattern used across all other components). Google Fonts loading was moved from `next/font/google` (which generates a render-blocking CSS chunk) to an **async media-swap loader script**. Result: zero render-blocking resources.

---

## Performance

| Metric | Mobile | Desktop |
|--------|--------|---------|
| **Performance** | 100 | 99 |
| **Accessibility** | ✓ | ✓ |
| **Best Practices** | ✓ | ✓ |
| **SEO** | ✓ | ✓ |

> **Lighthouse report:** [PageSpeed Insights — Full Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app/j2cx6pi0k2?form_factor=mobile&category=performance&category=accessibility&category=best-practices&category=seo&hl=en-US&utm_source=lh-chrome-ext)

This score is achieved **with** Three.js, D3.js, GSAP + ScrollTrigger, 5 videos, and 30+ images — all in a single-page application. The performance strategy:

### Two-Layer Lazy Loading
1. **Next.js `dynamic()`** — Below-fold components (Numbers, Who's Here, Mall Map, Entertainment, Events, Sponsorship, CTA) are dynamically imported, creating separate JS chunks that only download when needed.
2. **`useEffect` async imports** — Inside each component, Three.js / D3 / GSAP are loaded via `import('three')`, `import('gsap')`, etc. — never statically imported at the top of the file. Zero bytes on initial load.

### Key Optimizations
- **Three.js tree-shaking** — Named imports only (`Scene`, `PerspectiveCamera`, `WebGLRenderer`), never `import * as THREE`
- **Pixel ratio cap** — `Math.min(window.devicePixelRatio, 1.5)` prevents GPU overdraw on Retina
- **IntersectionObserver on all animation loops** — `requestAnimationFrame` pauses when elements leave the viewport
- **`visibilitychange` pause** — Brand ticker and carousels stop when the tab is backgrounded
- **Scoped ScrollTrigger cleanup** — Each component filters by its own trigger element on unmount
- **`React.memo`** — Event cards, charts, and panels are memoized to prevent cross-component re-renders
- **Lazy video loading** — All 5 videos use `preload="none"` with src set only on first activation via IntersectionObserver
- **Async Google Fonts** — Loaded via `media="print"` → `onload → media="all"` swap pattern; zero render-blocking CSS
- **Inline critical CSS** — Reset + CSS custom properties are inlined in `<head>`, not fetched externally
- **Modern browserslist** — Targets Chrome 111+, Firefox 115+, Safari 16.4+ — eliminates legacy polyfills

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 |
| 3D Graphics | Three.js (tree-shaken named imports) |
| Data Visualization | D3.js v7 |
| Animation | GSAP 3 + ScrollTrigger |
| Styling | Tailwind CSS 4 + inline CSS-in-JS |
| Fonts | Montserrat (async loaded) |
| Deployment | Vercel |
| Performance | Lighthouse 100/99 (Mobile/Desktop) |

---

## Component Architecture

```
app/
├── layout.tsx              # Root layout — inline critical CSS, async font loader
├── page.tsx                # 8 sections composed with LazySection wrappers
└── globals.css             # Minimal global styles

components/
├── Navbar/
│   └── Navbar.tsx          # Floating chapter rail (desktop) + pill nav (mobile)
├── Hero/
│   ├── HeroSection.tsx     # Cinematic intro — video + poster fallback
│   ├── HeroStats.tsx       # Animated stat counters with GSAP
│   ├── MallLogo.tsx        # SVG logo with gradient animation
│   └── ParticleCanvas.tsx  # Three.js particle field
├── Numbers/
│   └── NumbersSection.tsx  # D3 arc counters — 4 key statistics
├── WhoIsHere/
│   └── WhosHereSection.tsx # Brand ticker + D3 radial arcs
├── MallMap/
│   └── MallMapSection.tsx  # Three.js 3D floor stack + D3 zone chart
├── Entertainment/
│   ├── EntertainmentSection.tsx  # Section wrapper + intro
│   ├── NickelodeonPanel.tsx      # Theme park editorial panel
│   ├── EventsPanel.tsx           # Events hero + tech/entertainment cards
│   └── DiningShoppingPanel.tsx   # Restaurant + shopping panels
├── Event/
│   └── EventsSection.tsx   # GSAP carousel with brand event cards
├── Sponsorship/
│   └── SponsorshipSection.tsx  # D3 impression bars + treemap + tiers
├── CTA/
│   └── CTASection.tsx      # Final action slide — 3 paths + 3 actions
└── Performance/
    └── LazySection.tsx     # IntersectionObserver wrapper for lazy hydration
```

**8,100+ lines of TypeScript/CSS** across 19 component files.

No single file exceeds 950 lines. Large sections are decomposed into sub-panels. Each component owns its own Three.js / D3 / GSAP lifecycle — deleting any section compiles cleanly without affecting siblings.

---

## Design System

### Color
The entire deck is built on one gold: **`#C9A84C`**. A warm amber-gold with bronze undertones, deliberately desaturated to match how Rolex and Louis Vuitton use gold — restrained, confident, expensive. Every accent, border, stat number, and CTA derives from this single value with opacity variations creating hierarchy.

### Typography
**Montserrat** at weights 600–800 for all text. Fluid `clamp()` sizing throughout — every text element scales from 375px mobile to 1920px desktop without a single breakpoint on font size.

### Layout Rhythm
Entertainment panels alternate: text-left/image-right → text-right/image-left. Large watermark numbers (01–04) at 6% opacity tie sections into a coherent editorial series.

### Motion Philosophy
Nothing moves without a business purpose:
- Stat counters count up → prove scale
- D3 arcs fill → show proportion
- Brand tickers scroll → imply abundance
- GSAP entrance animations stagger → direct attention
- Custom easing (`power2.out`, `expo.inOut`) → deliberate, physical motion

---

## AI Integration

| Tool | Usage |
|------|-------|
| **Claude (Anthropic)** | Primary architectural partner — Three.js component patterns, D3 chart implementations, GSAP ScrollTrigger architecture, performance audits, Lighthouse optimization decisions |
| **GitHub Copilot** | Inline TypeScript corrections, GSAP timeline boilerplate, Tailwind class generation |
| **DALL-E 3** | AI-generated imagery for hero poster and event slideshow images where real assets were unavailable |
| **Midjourney** | Supplementary visual assets for entertainment panels |
| **Antigravity** | Autonomous codebase agent — lazy-loading pattern sweep across 8,000+ lines, component consistency audits |

---

## Expandability

The codebase is explicitly designed to grow without rewrites:

- **Data-driven cards** — Sponsorship tiers, event cards, brand items, and floor data are plain JS objects at the top of component files. New entries = one object added to an array.
- **Component isolation** — Three.js, D3, and GSAP logic are tightly bound to their own components. Removing `MallMapSection` compiles cleanly without touching anything else.
- **CMS-ready** — The Next.js App Router structure supports dropping a headless CMS (Sanity, Contentful) behind the data arrays without touching animation or UI logic.
- **Sub-modules ready to build:** Live leasing availability, interactive venue booking calendar, real-time footfall dashboard, per-brand sponsorship proposal generator, AI-powered leasing assistant chatbot.

---

## Local Development

### Requirements
- Node.js 18+

### Setup
```bash
git clone https://github.com/Fazilniyaz/american-mall.git
cd american-mall
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
```

---

## Subject Choice

**Mall of America** (Bloomington, Minnesota) was selected for the commercial story it enables:
- **40 million** verified annual visitors
- **Samsung Galaxy Experience Store** opened late 2025 — real, current, citable
- **Apple Store** present — every tech executive recognises this as a signal of serious retail credibility
- **Nickelodeon Universe** — largest indoor theme park in North America
- **Sea Life Minnesota Aquarium** — 1.2M visitors yearly, inside the property

Every data point in this deck is publicly verifiable. When a Samsung or Nike executive sees their own brand cited, it becomes peer-pressure close rather than a pitch.

---

*Built by [Fazil Niyazdeen TM]
(https://www.linkedin.com/in/fazil-niyazdeen-tm-18888722b/) for the Senior Frontend Engineer & AI-Powered Interactive Design role at LIAT.AI.*
