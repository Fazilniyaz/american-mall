# Mall of America Interactive Sales Deck

An interactive, browser-based sales deck for Mall of America. The experience is built to feel like a presentation, not a traditional website: a floating chapter rail replaces a fixed navbar, sections advance as distinct chapters, and the closing slide focuses on clear next-step actions for leasing, sponsorship, and event booking.

## What It Covers

- Cinematic intro with desktop video and mobile poster fallback
- Scale and visitor statistics
- Brand presence and tenant mix
- Mall map and zoning exploration
- Dining, attractions, and entertainment storytelling
- Events and sponsorship positioning
- Final action slide with three direct CTAs

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- GSAP for motion
- Three.js for the interactive mall map and hero particles
- D3 for charts and data-driven visuals
- IntersectionObserver for lazy section activation
- Native CSS scroll snapping and custom styling

## Performance Notes

The codebase is structured to keep the initial load light while preserving the visual polish:

- Heavy modules are loaded lazily inside the sections that need them
- The hero uses desktop video only after hydration and an image fallback on mobile
- The floating chapter rail is lightweight and client-side only
- The browser scrollbar is hidden and the page uses snap-style section progression
- The closing actions are rendered as simple links/buttons, not a form workflow

## AI Usage

AI was used to move faster across copy, structure, and implementation details. In practice that meant:

- Drafting and refining presentation copy
- Assisting with component structure and section sequencing
- Speeding up repetitive refactors and cleanup
- Generating or supporting visual assets where source media was limited

## Local Development

### Requirements

- Node.js 18+

### Install

```bash
npm install
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

## Notes

This project is intentionally optimized to read like a deck: no persistent website header, no contact form, and a closing slide that pushes toward a business decision rather than generic lead capture.
