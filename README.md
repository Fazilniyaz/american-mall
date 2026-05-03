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

## Complete Route Documentation

### 01. Introduction & Scale

**Route:** `/intro`
- **Storytelling Concept:** **The Cinematic Hook.** We don't start with facts; we start with a feeling. The goal here is immediate emotional buy-in. Using a high-end, immersive background, we establish that this isn't just a mall—it's a destination. The user should feel the prestige, scale, and energy of "America's Most Iconic Mall" within the first 3 seconds. It sets the tone of a luxury brand pitch.
- **Technologies:** Next.js, Three.js (Particles), GSAP, Google Flow, Meta AI, Hugging face for AI Video and Image Generation.
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-intro/a7peefexr7?form_factor=mobile)
- **AI Assets:** The video in the background was AI generated video in the entrance section with voice over. For mobiles, I replaced this video with AI generated Image. 

**Route:** `/introTwo`
- **Storytelling Concept:** **The Proof of Dominance.** Transitioning from pure emotion to hard data. By animating massive numbers (40M visitors, 520+ stores, 5.6M sqft), we ground the initial awe in undeniable business reality. The viewer instantly realizes the sheer gravity and market dominance of the property.
- **Technologies:** Next.js, D3.js (Arc Counters)
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-introTwo/rntdvo7965?form_factor=desktop)
- **AI Assets:** null. just shown the stats with Animation. 

---

### 02. Who's Here (Social Proof)

**Route:** `/WhosHereSection`
- **Storytelling Concept:** **The Halo Effect.** Brands want to be next to other great brands. This route provides immediate social proof by showcasing a massive, infinitely scrolling ticker of global leaders who have already invested here. It implicitly asks the prospect: "Your competitors are here. Why aren't you?"
- **Technologies:** Next.js, GSAP, D3.js
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-WhosHereSection/nzlkwzgym3?form_factor=desktop)
- **AI Assets:** AI Generated Background Video Showcasing the Brand Stores Already in the Mall of America.

**Route:** `/WhosHereOne`
- **Storytelling Concept:** **The Flagship Standard.** We zoom in on the biggest players (Apple, Nike, Zara). This tells the story that this property is reserved for flagship-level experiences, not standard inline stores. It elevates the prospect's ambition, pushing them to think bigger about their potential footprint.
- **Technologies:** Next.js, CSS Transitions, Google Flow for Video Generation.
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-WhosHereOne/uaj0gwb5bh?form_factor=mobile)
- **AI Assets:** AI Generated images to showcases the stores of each brands.

**Route:** `/WhosHereTwo`
- **Storytelling Concept:** **The Ecosystem of Scale.** Expanding the view to show the sheer volume of retail partners. It tells the story of a thriving, massive commercial ecosystem where every retail category is represented, supported, and highly profitable.
- **Technologies:** Next.js, GSAP, HuggingFace for Image Generation.
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-WhosHereTwo/38dy5bozqq?form_factor=desktop)
- **AI Assets:** null

---

### 03. Explore

**Route:** `/explore`
- **Storytelling Concept:** **The Invitation to Discover.** A cinematic breath between sections. This title card gracefully shifts the narrative from "who we are" to "where you could be," preparing the viewer to understand the physical space.
- **Technologies:** Next.js, CSS Transitions
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-explore/2lm0s74wx1?form_factor=desktop)
- **AI Assets:** AI generated background image using HuggingFace.

**Route:** `/explore/MallMap`
- **Storytelling Concept:** **The Blueprint of Opportunity.** By visualizing the 5.6M sqft space in an interactive 3D floor stack, we demystify the massive scale and make it navigable. It shows that despite its size, the space is meticulously planned for optimal traffic flow and brand visibility.
- **Technologies:** Next.js, Three.js, D3.js
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-explore-MallMap/wdilpfc1dt?form_factor=desktop)
- **AI Assets:** null

**Route:** `/explore/whereYourBrandLives`
- **Storytelling Concept:** **The Strategic Placement.** This isn't just about finding an empty unit; it's about strategic positioning. We tell the story of premium zones and high-traffic pathways, showing the prospect exactly how their specific brand can capture the 40M visitors.
- **Technologies:** Next.js, D3.js
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-explore-whereYourBrandLives/s0gzb0c7tf?form_factor=mobile)
- **AI Assets:** null

---

### 04. Entertainment

**Route:** `/Entertainment`
- **Storytelling Concept:** **Beyond Retail.** We pivot the story. People don't just come to shop; they come for the experience. This introduces the concept that world-class entertainment is the true anchor driving our unparalleled, year-round foot traffic.
- **Technologies:** Next.js, CSS Animations
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment/0bebypawj0?form_factor=desktop)
- **AI Assets:** null. Real Video is used.

**Route:** `/Entertainment/themePark`
- **Storytelling Concept:** **The Ultimate Anchor.** Highlighting Nickelodeon Universe (the largest indoor theme park) proves that this property offers experiences impossible to replicate in standard retail environments, ensuring all-day family dwell time and immense weekend traffic.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment-themePark/ico6yy6d34?form_factor=desktop)
- **AI Assets:** null. Real Image is used.

**Route:** `/Entertainment/Aquarium`
- **Storytelling Concept:** **The Immersive Draw.** Showcasing SEA LIFE Aquarium reinforces the destination aspect. It tells the story of diverse, ticketed attractions that turn a simple shopping trip into a multi-day vacation.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment-Aquarium/jecfzh6v1x?form_factor=desktop)
- **AI Assets:** null. Real Image is used.

**Route:** `/Entertainment/Dining`
- **Storytelling Concept:** **The Culinary Destination.** Food is no longer an afterthought; it's a primary driver. We highlight the $380M F&B revenue to prove that premium dining experiences keep visitors engaged, happy, and spending longer on the property.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment-Dining/93k6hdamcg?form_factor=desktop)
- **AI Assets:** AI Generated Background video using Google Flow was used

**Route:** `/Entertainment/Shopping`
- **Storytelling Concept:** **The Core Engine.** Tying the entertainment back to commerce. The story here is that the massive footfall generated by the attractions inevitably flows into the retail corridors, driving unparalleled sales density for our tenants.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-Entertainment-Shopping/wozj5zorwf?form_factor=desktop)
- **AI Assets:** AI Generated Image using HuggingFace was used.

---

### 05. Events & Activations

**Route:** `/events`
- **Storytelling Concept:** **The Global Stage.** We re-contextualize the mall from a shopping center to a global event platform. It tells promoters and brands that this is the place to launch something big, surrounded by a captive audience.
- **Technologies:** Next.js, next/image
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events/0e8sw7j0t8?form_factor=desktop)
- **AI Assets:** null. Real Image is used.

**Route:** `/events/stats`
- **Storytelling Concept:** **The ROI of Attention.** Backing up the "Global Stage" claim with hard data. We show the attendance records and revenue generated by events, proving that activating here yields massive, measurable return on investment.
- **Technologies:** Next.js, CSS Transitions
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-stats/vr2lkbf97y?form_factor=desktop)
- **AI Assets:** null. No Images or videos are used in this route.

**Route:** `/events/tech`
- **Storytelling Concept:** **The Innovation Hub.** Focusing on tech events positions the property as forward-thinking. It tells tech brands that their cutting-edge products belong here, surrounded by a tech-savvy, high-intent audience.
- **Technologies:** Next.js, CSS Animations
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech/wijae1c70h?form_factor=mobile)
- **AI Assets:** AI generated images using Google Flow were used.

**Route:** `/events/tech/appleVisionPro`
- **Storytelling Concept:** **The Ultimate Proof of Concept.** Apple is notoriously selective. By showcasing a successful Vision Pro demo event, we tell every other brand: "If it's good enough for Apple's most crucial product launch, it's the right place for yours."
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech-appleVisionPro/026881epjb?form_factor=desktop)
- **AI Assets:** null. Real Images are used.

**Route:** `/events/tech/samsungGrandStoreOpening`
- **Storytelling Concept:** **The Blockbuster Launch.** Showcasing the scale of the Samsung opening proves our capability to handle massive crowds, celebrity appearances, and global media attention for flagship brand launches.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech-samsungGrandStoreOpening/nacexjk2b9?form_factor=desktop)
- **AI Assets:** null. Real Video was used.

**Route:** `/events/tech/vrAndGamingZones`
- **Storytelling Concept:** **The Next Generation.** Highlighting esports and permanent VR installations shows that the property actively captures the elusive Gen Z and Alpha demographics, future-proofing the audience for our partners.
- **Technologies:** Next.js, GSAP 
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech-vrAndGamingZones/fntvx0v2k4?form_factor=desktop)
- **AI Assets:** AI generated images using Google Flow were used.

**Route:** `/events/entertainmentAndGaming`
- **Storytelling Concept:** **The Pop-Culture Epicenter.** This overview tells the story of how the property intersects with music, sports, and gaming, becoming a cultural touchstone rather than just a commercial space.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-entertainmentAndGaming/3b4bjgrnf8?form_factor=mobile)
- **AI Assets:** AI generated images using Google Flow were used.

**Route:** `/events/entertainmentAndGaming/nikeSneakerLaunchEvent`
- **Storytelling Concept:** **The Hype Machine.** Demonstrating the capacity for exclusive sneaker drops proves that the property can handle high-demand, queue-heavy events safely while generating massive organic social buzz.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-entertainmentAndGaming-nikeSneakerLaunchEvent/o6qajx718s?form_factor=desktop)
- **AI Assets:** AI generated video using google flow was used.

**Route:** `/events/entertainmentAndGaming/adidasFanEngagementEvent`
- **Storytelling Concept:** **The Interactive Connection.** Showcasing experiential fan engagement tells brands they can do more than sell products here; they can build deep, interactive, physical relationships with their consumers.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-entertainmentAndGaming-adidasFanEngagementEvent/kisx0mmcri?form_factor=desktop)
- **AI Assets:** AI generated video using google flow was used.

**Route:** `/events/entertainmentAndGaming/xboxGamingEvents`
- **Storytelling Concept:** **The Convention Scale.** By highlighting a massive Xbox preview event, we prove the property's capability to act as a full-scale convention center, accommodating thousands of highly engaged attendees.
- **Technologies:** Next.js, GSAP, Three.js
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-entertainmentAndGaming-xboxGamingEvents/wwxwagwxom?form_factor=desktop)
- **AI Assets:** null. Real images are used.

---

### 06. The Revenue Bridge

**Route:** `/footfall-revenue`
- **Storytelling Concept:** **The Conversion Narrative (The Core Pitch).** This is the crucial bridge of the deck. It connects the 40M visitors directly to the bottom line. The story is simple and undeniable: massive traffic + high dwell time = unmatched brand revenue and ROI.
- **Technologies:** Next.js, D3.js
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-footfall-revenue/i3obmya3ek?form_factor=mobile)
- **AI Assets:** null. No Images or videos are used.

---

### 07. Take Action (The Close)

**Route:** `/takeAction/Partnership`
- **Storytelling Concept:** **The Strategic Alliance.** Moving from the pitch to the close. We tell brands that we don't just want sponsors; we want true partners. We offer holistic media, experiential, and digital integrations tailored to their goals.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Mobile):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-takeAction-Partnership/3uy8f8uh5l?form_factor=mobile)
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-takeAction-Partnership/w16228me4f?form_factor=desktop)
- **AI Assets:** AI generated Image using google flow was used.

**Route:** `/takeAction/LeaseASpace`
- **Storytelling Concept:** **The Foundation of Presence.** A direct, concrete call to action for retail tenants. The story shifts from aspirational to practical—showing available footprints, sizes, and making it easy to start the leasing conversation.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-takeAction-LeaseASpace/3jux3bncyh?form_factor=desktop)
- **AI Assets:** AI generated Image using google flow was used.

**Route:** `/takeAction/BecomeASponsor`
- **Storytelling Concept:** **The Value Hierarchy.** Presenting clear, premium sponsorship tiers. The story here is exclusivity and targeted reach. We make it easy for brands to understand exactly what level of investment buys what level of access to our 40M audience.
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse:** *(Recently Optimized)*
- **AI Assets:** AI generated Image using google flow was used.

**Route:** `/takeAction/HostAnEvent`
- **Storytelling Concept:** **The Canvas Awaits.** We provide the venues, specs, and capacities. The story is an invitation to promoters and agencies: "Bring your biggest ideas; we have the premium space, infrastructure, and built-in audience to make them legendary."
- **Technologies:** Next.js, next/image, CSS
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-takeAction-HostAnEvent/hgufqg1vmt?form_factor=desktop)
- **AI Assets:** AI generated Image using google flow was used.

**Route:** `/takeAction/FinalActions`
- **Storytelling Concept:** **The Inevitable Conclusion.** The ultimate closing slide of the pitch. No more selling—just clear, frictionless pathways to conversion. The story ends by empowering the user to take the exact next step they need, immediately.
- **Technologies:** Next.js, GSAP
- **Responsive:** ✅
- **Lighthouse (Desktop):** [View Report](https://pagespeed.web.dev/analysis/https-american-mall-vercel-app-events-tech-vrAndGamingZones/fntvx0v2k4?form_factor=desktop)
- **AI Assets:** null. No Images or videos used.

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
| **Google Flow** | AI generated Video for the mall Entrance, and various sections of the mall. |
| **Cursor AI** | Primary coding agent used for building the application. |
| **Hugging Face** | AI generated Images for various sections of the mall. |


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
(https://github.com/Fazilniyaz/american-mall)
(https://www.linkedin.com/in/fazil-niyazdeen-tm-18888722b/) for the Senior Frontend Engineer & AI-Powered Interactive Design role at LIAT.AI.*
