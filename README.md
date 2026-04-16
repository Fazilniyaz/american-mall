# American Mall Experience

An immersive interactive web experience showcasing the American Mall phenomenon with cutting-edge frontend technologies and AI-enhanced features.

---

## 1. Tech Stack & Technologies Used

### **Core Framework**

- **Next.js 16.2.3** (Latest App Router)
  - Why: Server-side rendering + static generation for performance, built-in image optimization, API routes
  - SSR for SEO, SSG for static pages, edge functions for scalability

### **Animation & Graphics**

- **GSAP 3.15.0** - Advanced timeline animations
  - Why: Smooth, performant animations with ScrollTrigger for scroll-based effects
  - Used in: Hero stats counter, navbar entrance, text animations

- **Three.js 0.183.2** - 3D WebGL graphics
  - Why: Create interactive 3D particle effects and prepare for future 3D mall map
  - Dynamically imported to avoid SSR issues and reduce bundle size on mobile

- **D3.js 7.9.0** - Data visualization
  - Why: Render animated arc counters in the Numbers section with precise SVG control

### **Styling & UI**

- **Tailwind CSS 4** - Utility-first CSS framework
  - Why: Fast development, responsive design, minimal bundle size
- **Geist Font Family** - Vercel's modern font
  - Why: Professional, readable typeface optimized for web

- **Next Font (Google Fonts)**
  - Playfair Display (serif headings)
  - Montserrat (sans-serif body)
  - Inter (UI elements)
  - Why: Self-hosted fonts avoid render-blocking external requests

### **React Ecosystem**

- **React 19.2.4** - UI library
- **React DOM 19.2.4** - DOM rendering
- **@gsap/react 2.1.2** - React GSAP integration

### **Development**

- **TypeScript 5** - Type safety and better DX
- **ESLint 9** - Code quality
- **PostCSS 4** - CSS processing

---

## 2. Why This Tech Stack?

| Technology       | Use Case          | Why Chosen                                                |
| ---------------- | ----------------- | --------------------------------------------------------- |
| **Next.js**      | Full framework    | Fast iteration, built-in optimizations, Vercel deployment |
| **React 19**     | Component library | Modern hooks, better performance, large ecosystem         |
| **GSAP**         | Animations        | Industry standard, smoothest performance, no jank         |
| **Three.js**     | 3D graphics       | Mature WebGL library, perfect for interactive 3D mall map |
| **D3.js**        | Data viz          | Precise SVG manipulation for animated counters            |
| **Tailwind CSS** | Styling           | Utility-first reduces CSS bloat, responsive by default    |
| **TypeScript**   | Development       | Catch bugs early, better IDE support, maintainability     |

### **Performance-First Approach:**

- ✅ Dynamic imports for heavy libraries (Three.js)
- ✅ Image optimization via Next.js Image component
- ✅ Lazy loading for non-critical content
- ✅ RequestIdleCallback for animations (don't block main thread)
- ✅ Mobile-first design with conditional rendering

---

## 3. Setup Instructions

### **Prerequisites**

- Node.js 18+ or Bun
- npm, yarn, pnpm, or bun package manager

### **Installation**

```bash
# Clone repository
git clone <repo-url>
cd american-mall

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### **Development**

```bash
# Start dev server (hot reload enabled)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Production Build**

```bash
# Build for production
npm run build

# Start production server
npm start
```

### **Linting**

```bash
# Check code quality
npm run lint
```

---

## 4. Folder Structure

```
american-mall/
├── app/
│   ├── layout.tsx              # Root layout with fonts
│   ├── page.tsx                # Home page
│   ├── globals.css             # Global styles
│   └── ...
│
├── components/
│   ├── Hero/
│   │   ├── HeroSection.tsx     # Main hero with video/particles
│   │   ├── HeroStats.tsx       # GSAP animated statistics
│   │   ├── HeroStats.tsx       # Logo component
│   │   ├── MallLogo.tsx        # Logo component
│   │   └── ParticleCanvas.tsx  # Three.js particle effects
│   │
│   ├── Navbar/
│   │   └── Navbar.tsx          # Fixed navigation with mobile menu
│   │
│   ├── Numbers/
│   │   └── NumbersSection.tsx  # D3 arc counters with GSAP
│   │
│   ├── WhoIsHere/
   │   └── WhosHereSection.tsx  # Brand showcase with D3 radial reach arcs
│   │
│   └── ...
│
├── public/
│   ├── photos/
│   │   ├── hero-poster.jpg     # Hero image (mobile/fallback)
│   │   └── ...
│   ├── videos/
│   │   ├── videoplayback.mp4   # Hero background video
│   │   └── ...
│   └── [SVGs, icons]
│
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
├── next.config.ts              # Next.js config
├── tailwind.config.js          # Tailwind config
├── eslint.config.mjs           # ESLint config
├── postcss.config.mjs          # PostCSS config
└── README.md                   # This file
```

### **Key Components Explained**

| Component           | Purpose                               | Tech                           |
| ------------------- | ------------------------------------- | ------------------------------ |
| **HeroSection**     | Full-screen hero with video/particles | Next.js Image, Three.js (lazy) |
| **HeroStats**       | Animated statistics display           | GSAP, no external libs         |
| **ParticleCanvas**  | 3D particle effects                   | Three.js, dynamically imported |
| **NumbersSection**  | Arc counters with scroll trigger      | D3 + GSAP + ScrollTrigger      |
| **Navbar**          | Fixed navigation, mobile-responsive   | GSAP for animations            |
| **WhosHereSection** | Featured brands with reach indicators | D3 radial arcs, GSAP 3D tilt   |

---

## 5. AI Integrations & Tools Used

### **Current AI Implementations**

#### **1. AI-Generated Assets** 📸

- ✅ Hero poster images (generated via DALL-E 3)
- ✅ Background images and cinematic visuals
- Purpose: Faster visual development, consistent brand aesthetic

#### **2. AI in Development** 💻

- ✅ GitHub Copilot - Code generation and suggestions
- ✅ Code optimization recommendations via AI analysis
- Purpose: Accelerate component development, catch performance issues

#### **3. AI-Powered Performance Optimization**

- ✅ Lighthouse AI suggestions (mobile performance: 61% → targeting 90%+)
- ✅ Image compression via AI tools (TinyPNG, Squoosh.app)
- Purpose: Optimize Core Web Vitals (LCP, CLS, TBT)

### **Upcoming AI Features** (Roadmap)

| Feature                          | AI Tool                   | Status         | Impact                                |
| -------------------------------- | ------------------------- | -------------- | ------------------------------------- |
| **AI Store Finder**              | OpenAI/Claude API         | 🔜 In Progress | Semantic search for stores            |
| **Dynamic Store Descriptions**   | ChatGPT API               | 🔜 Planned     | Auto-generate 520+ store bios         |
| **Personalized Recommendations** | ML model                  | 🔜 Planned     | Suggest stores based on user behavior |
| **AI Chatbot**                   | Intercom/Tidio AI         | 🔜 Planned     | Answer visitor questions              |
| **3D Mall Map**                  | Three.js + AI pathfinding | 🔜 Planned     | Interactive 3D navigation             |

### **AI Tools in Pipeline**

- **OpenAI GPT-4** - Content generation, store descriptions
- **Claude** - Complex reasoning for recommendations
- **Midjourney/DALL-E** - Additional visual asset generation
- **TinyPNG/Squoosh** - AI image compression
- **Intercom AI** - Automated customer support

---

## 6. Performance Metrics

### **Current Status (Mobile)**

- Performance Score: **61%** → **Target: 97%+** 🎯
- LCP: 23.5s → Target: <2.5s
- TBT: 250ms → Target: <100ms

### **Optimizations Applied**

✅ Next.js Image component for hero poster  
✅ Defer ParticleCanvas to 3s (doesn't block LCP)  
✅ Defer GSAP animations (requestIdleCallback)  
✅ Preload critical resources  
✅ Mobile-optimized navbar (CSS-first)

### **Next Steps**

1. Compress hero images to <400KB
2. Delete unused image files (~18MB saved)
3. Re-test Lighthouse (expecting 92-95% mobile score)

---

## 7. Deployment

Deployed on **Vercel** with automatic deployments from Git.

- **Production:** https://american-mall.vercel.app
- **Preview:** Automatic for pull requests

---

## License

MIT

---

## Questions?

For issues or contributions, please open an issue or PR.
