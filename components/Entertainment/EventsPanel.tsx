"use client";

import { useEffect, useRef, useState, useCallback, memo } from "react";
import Image from "next/image";

// ── Lazy GSAP loader ──────────────────────────────────────────────────────
type GsapType = typeof import("gsap")["default"];
type ScrollTriggerType = typeof import("gsap/ScrollTrigger")["ScrollTrigger"];

let _gsap: GsapType | null = null;
let _ST: ScrollTriggerType | null = null;

const loadGsap = async () => {
  if (_gsap && _ST) return { gsap: _gsap, ScrollTrigger: _ST };
  const [gsapMod, stMod] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  _gsap = gsapMod.default;
  _ST = stMod.ScrollTrigger;
  _gsap.registerPlugin(_ST);
  return { gsap: _gsap, ScrollTrigger: _ST };
};

// ─── Hero slideshow data ──────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    src: "/photos/event-hero-1.jpg",
    alt: "Live event production crew at Mall of America",
    headline: "300+",
    sub: "Live events every year",
    accent: "#C9A84C",
    overlay: "linear-gradient(135deg, rgba(10,6,0,0.88) 0%, rgba(5,4,2,0.55) 60%, rgba(5,4,2,0.2) 100%)",
  },
  {
    src: "/photos/event-hero-2.jpg",
    alt: "Samsung Galaxy Unpacked event arena",
    headline: "500K+",
    sub: "Annual event attendees",
    accent: "#00c8f0",
    overlay: "linear-gradient(135deg, rgba(0,10,20,0.92) 0%, rgba(0,15,30,0.6) 60%, rgba(0,10,20,0.2) 100%)",
  },
  {
    src: "/photos/event-hero-3.jpg",
    alt: "Concert crowd energy at night event",
    headline: "40M",
    sub: "Witnesses per year",
    accent: "#C9A84C",
    overlay: "linear-gradient(135deg, rgba(15,4,0,0.9) 0%, rgba(10,2,0,0.6) 60%, rgba(5,4,2,0.2) 100%)",
  },
];

// ─── Hero stat pills ──────────────────────────────────────────────────────────
const HERO_STATS = [
  { value: "300+", label: "Annual Events" },
  { value: "500K+", label: "Event Attendees" },
  { value: "40M", label: "Yearly Witnesses" },
  { value: "20K", label: "Max Capacity" },
];

// ─── ONLY THE 3 CHANGED DATA ARRAYS ──────────────────────────────────────────
// Replace these arrays in your EventsPanel.tsx — everything else stays identical

// 1. TECH_EVENTS — samsung-vr card: video prepended
const TECH_EVENTS = [
  {
    id: "apple-vr",
    brand: "Apple",
    event: "Vision Pro Demo Experience",
    year: "2024–Present",
    stat: "8,000+",
    statLabel: "Demo sessions",
    desc: "First hands-on Vision Pro demo experiences in the Midwest. Visitors queued for hours for a chance to step into spatial computing.",
    images: [
      { src: "/photos/apple-vr-1.jpg", alt: "Apple Vision Pro launch crowd" },
      { src: "/photos/apple-vr-2.jpg", alt: "Woman wearing Apple Vision Pro" },
      { src: "/photos/apple-vr-3.jpg", alt: "Apple Vision Pro selfie event" },
    ],
    accent: "#f5f5f7",
    tag: "Tech · AR/VR",
  },
  {
    id: "samsung-store",
    brand: "Samsung",
    event: "Galaxy Experience Store Grand Opening",
    year: "2025",
    stat: "22K+",
    statLabel: "Opening day visitors",
    desc: "Samsung's first Midwest Experience Store launched at Mall of America. Crowds lined up before dawn for Galaxy S25 hands-on demos.",
    images: [
      { src: "/videos/samsung_event.mp4", alt: "Samsung Galaxy store opening event", type: "video" as const },
      { src: "/photos/samsung-store-1.webp", alt: "Samsung Galaxy store opening" },
    ],
    accent: "#1428A0",
    tag: "Tech · Retail",
  },
  {
    id: "samsung-vr",
    brand: "Samsung",
    event: "VR & Gaming Experience Zones",
    year: "2024",
    stat: "15K+",
    statLabel: "VR sessions",
    desc: "Immersive Galaxy VR gaming zones activated across the property. Full-scale demo pods, headsets, and live competitions.",
    images: [
      // ✅ VIDEO FIRST — then the 2 existing images
      { src: "/videos/samsung_vr.mp4", alt: "Samsung VR experience zone live footage", type: "video" as const },
      { src: "/photos/samsung-vr-1.avif", alt: "Samsung VR experience" },
      { src: "/photos/samsung-vr-2.jpg", alt: "Samsung VR gaming zone" },
    ],
    accent: "#1428A0",
    tag: "Tech · Gaming",
  },
];

// 2. ENT_EVENTS — nike and adidas: video prepended to each
const ENT_EVENTS = [
  {
    id: "nike",
    brand: "Nike",
    event: "Sneaker Launch Events",
    year: "2023–Present",
    stat: "18K+",
    statLabel: "Attendees per event",
    desc: "Exclusive sneaker drops and athlete meet-and-greets. Nike transforms Mall of America's atrium into a full-scale brand experience.",
    images: [
      // ✅ VIDEO FIRST — then the 2 existing images
      { src: "/videos/nike.mp4", alt: "Nike sneaker launch event footage", type: "video" as const },
      { src: "/photos/nike-1.jpg", alt: "Nike sneaker launch event" },
      { src: "/photos/nike-2.jpg", alt: "Nike fan engagement" },
    ],
    accent: "#111111",
    tag: "Entertainment · Sport",
  },
  {
    id: "adidas",
    brand: "Adidas",
    event: "Fan Engagement Events",
    year: "2023–Present",
    stat: "12K+",
    statLabel: "Fan engagements",
    desc: "Premium Adidas brand activations with exclusive merchandise drops, athlete appearances, and immersive product showcases.",
    images: [
      // ✅ VIDEO FIRST — then the 2 existing images
      { src: "/videos/adidas.mp4", alt: "Adidas fan engagement event footage", type: "video" as const },
      { src: "/photos/adidas-1.jpg", alt: "Adidas fan event" },
      { src: "/photos/adidas-2.webp", alt: "Adidas Palace event space" },
    ],
    accent: "#000000",
    tag: "Entertainment · Sport",
  },
  {
    id: "xbox",
    brand: "Xbox",
    event: "Gaming Events & Showcase",
    year: "2024",
    stat: "10K+",
    statLabel: "Gaming sessions",
    desc: "Microsoft Xbox brought the Games Showcase experience to Mall of America. 4K gaming zones, early access titles, and live tournaments.",
    images: [
      { src: "/photos/xbox1.jpg", alt: "Xbox Games Showcase" },
      { src: "/photos/xbox2.jpg", alt: "Xbox gaming devices" },
    ],
    accent: "#107C10",
    tag: "Gaming · Microsoft",
  },
];

// ─── Lazy video slide — only loads/plays when active + visible ─────────────────
// preload="none" ensures ZERO bytes downloaded until the slide is visible.
// IntersectionObserver pauses the video when off-screen to save CPU/GPU.
function LazyVideoSlide({
  src,
  alt,
  isActive,
}: {
  src: string;
  alt: string;
  isActive: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);
  const srcLoaded = useRef(false);

  // Track visibility via IntersectionObserver
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Load src on first activation + play/pause based on active + visible state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive && isVisibleRef.current) {
      // Lazy-set src only on first activation — zero upfront cost
      if (!srcLoaded.current) {
        video.src = src;
        video.load();
        srcLoaded.current = true;
      }
      video.play().catch(() => { });
    } else {
      video.pause();
    }
  }, [isActive, src]);

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          display: "block",
        }}
      />
    </div>
  );
}

// ─── Media carousel (images + videos) shared by all event cards ───────────────
function ImageCarousel({
  images,
  accent,
}: {
  images: { src: string; alt: string; type?: "video" }[];
  accent: string;
}) {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = useCallback((idx: number) => {
    setActive(idx);
  }, []);

  // Auto-advance only when more than 1 item
  // Video slides get longer display time (6s) vs images (3.8s)
  useEffect(() => {
    if (images.length <= 1) return;
    const currentItem = images[active];
    const delay = currentItem?.type === "video" ? 6000 : 3800;
    timerRef.current = setTimeout(() => {
      setActive(p => (p + 1) % images.length);
    }, delay);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [images, active]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      {images.map((img, i) => (
        <div
          key={img.src}
          style={{
            position: "absolute",
            inset: 0,
            opacity: i === active ? 1 : 0,
            transition: "opacity 0.75s ease",
            // Prevent hidden slides from consuming GPU resources
            visibility: i === active ? "visible" : "hidden",
          }}
        >
          {img.type === "video" ? (
            <LazyVideoSlide
              src={img.src}
              alt={img.alt}
              isActive={i === active}
            />
          ) : (
            <Image
              src={img.src}
              alt={img.alt}
              fill
              loading="lazy"
              sizes="(max-width:768px) 100vw, 33vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          )}
        </div>
      ))}

      {/* Overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to top, rgba(5,4,2,0.85) 0%, rgba(5,4,2,0.1) 55%)",
        zIndex: 2,
      }} />

      {/* Dot indicators */}
      {images.length > 1 && (
        <div style={{
          position: "absolute",
          bottom: "0.7rem",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "5px",
          zIndex: 3,
        }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              style={{
                width: i === active ? "16px" : "5px",
                height: "5px",
                background: i === active ? accent : "rgba(255,255,255,0.35)",
                border: "none",
                cursor: "pointer",
                padding: 0,
                transition: "all 0.3s ease",
              }}
              aria-label={`View slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Event card ───────────────────────────────────────────────────────────────
const EventCard = memo(function EventCard({
  evt,
  index,
  className,
}: {
  evt: typeof TECH_EVENTS[0];
  index: number;
  className: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const mx = ((e.clientX - r.left) / r.width - 0.5) * 10;
    const my = ((e.clientY - r.top) / r.height - 0.5) * -10;
    loadGsap().then(({ gsap }) => {
      gsap.to(e.currentTarget, {
        rotateY: mx, rotateX: my, duration: 0.3, ease: "power2.out",
        transformPerspective: 700,
      });
    });
  };
  const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    loadGsap().then(({ gsap }) => {
      gsap.to(e.currentTarget, {
        rotateY: 0, rotateX: 0, duration: 0.55, ease: "elastic.out(1,0.6)",
        transformPerspective: 700,
      });
    });
  };

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(201,168,76,0.12)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        willChange: "transform",
        transformStyle: "preserve-3d",
        opacity: 0,
        transform: "translateY(32px)",
        transition: "border-color 0.25s ease",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(201,168,76,0.38)";
      }}
    >
      {/* Image carousel — fixed height */}
      <div style={{ position: "relative", height: "clamp(160px,20vw,240px)", flexShrink: 0 }}>
        <ImageCarousel images={evt.images} accent={evt.accent} />

        {/* Brand tag */}
        <div style={{
          position: "absolute",
          top: "0.7rem",
          left: "0.7rem",
          zIndex: 4,
          background: "rgba(5,4,2,0.75)",
          border: "1px solid rgba(201,168,76,0.2)",
          backdropFilter: "blur(8px)",
          padding: "3px 9px",
        }}>
          <span style={{
            color: "#C9A84C",
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
          }}>
            {evt.tag}
          </span>
        </div>

        {/* Year badge */}
        <div style={{
          position: "absolute",
          top: "0.7rem",
          right: "0.7rem",
          zIndex: 4,
          background: "rgba(5,4,2,0.6)",
          padding: "3px 8px",
        }}>
          <span style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: "0.55rem",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 600,
            letterSpacing: "0.1em",
          }}>
            {evt.year}
          </span>
        </div>
      </div>

      {/* Text content */}
      <div style={{ padding: "1.2rem 1.2rem 1.4rem", display: "flex", flexDirection: "column", gap: "0.7rem", flexGrow: 1 }}>
        {/* Brand + event name */}
        <div>
          <p style={{
            color: "#C9A84C",
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            margin: "0 0 0.25rem",
            opacity: 0.8,
          }}>
            {evt.brand}
          </p>
          <h3 style={{
            color: "#ffffff",
            fontSize: "clamp(0.88rem, 1.4vw, 1rem)",
            fontWeight: 700,
            fontFamily: "var(--font-montserrat)",
            margin: 0,
            lineHeight: 1.25,
          }}>
            {evt.event}
          </h3>
        </div>

        {/* Description */}
        <p style={{
          color: "rgba(255,255,255,0.48)",
          fontSize: "0.72rem",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 400,
          lineHeight: 1.65,
          margin: 0,
          flexGrow: 1,
        }}>
          {evt.desc}
        </p>

        {/* Stat */}
        <div style={{
          display: "flex",
          alignItems: "baseline",
          gap: "0.5rem",
          paddingTop: "0.8rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <span style={{
            color: "#C9A84C",
            fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
            fontWeight: 800,
            fontFamily: "var(--font-montserrat)",
            lineHeight: 1,
            fontVariantNumeric: "tabular-nums",
          }}>
            {evt.stat}
          </span>
          <span style={{
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.58rem",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}>
            {evt.statLabel}
          </span>
        </div>
      </div>
    </div>
  );
});

// ─── Hero Slideshow ───────────────────────────────────────────────────────────
function EventsHero() {
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive(p => (p + 1) % HERO_SLIDES.length);
    }, 4500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!heroRef.current) return;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !heroRef.current) return;
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          setEntered(true);
          gsap.fromTo(".evh-cat", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
          gsap.fromTo(".evh-head", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 0.15 });
          gsap.fromTo(".evh-sub", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.25 });
          gsap.fromTo(".evh-stat", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.1, delay: 0.4 });
          gsap.fromTo(".evh-dots", { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.6 });
        },
      });
    });
    return () => {
      cancelled = true;
      loadGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().filter(st => st.vars.trigger === heroRef.current).forEach(st => st.kill());
      });
    };
  }, []);

  const slide = HERO_SLIDES[active];

  return (
    <div
      ref={heroRef}
      style={{
        position: "relative",
        width: "100%",
        minHeight: "80vh",
        overflow: "hidden",
        background: "#050402",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Background slides */}
      {HERO_SLIDES.map((s, i) => (
        <div key={s.src} style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: i === active ? 1 : 0,
          transition: "opacity 1s ease",
        }}>
          <Image
            src={s.src}
            alt={s.alt}
            fill
            loading={i === 0 ? "eager" : "lazy"}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 40%" }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: s.overlay,
            zIndex: 2,
          }} />
        </div>
      ))}

      {/* Top + bottom fade */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "80px", background: "linear-gradient(to bottom, #050402, transparent)", zIndex: 3 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", background: "linear-gradient(to bottom, transparent, #050402)", zIndex: 3 }} />

      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 4,
        padding: "5rem clamp(1.5rem, 6vw, 6rem)",
        width: "100%",
        maxWidth: "900px",
      }}>
        <p className="evh-cat" style={{
          color: "#C9A84C",
          fontSize: "0.68rem",
          letterSpacing: "0.42em",
          textTransform: "uppercase",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 700,
          margin: "0 0 1rem",
          opacity: entered ? 1 : 0,
        }}>
          Events & Activations · Mall of America
        </p>

        <h2 className="evh-head" style={{
          color: "#ffffff",
          fontSize: "clamp(3rem, 7vw, 6.5rem)",
          fontWeight: 800,
          fontFamily: "var(--font-montserrat)",
          margin: 0,
          lineHeight: 0.92,
          opacity: entered ? 1 : 0,
          fontVariantNumeric: "tabular-nums",
          transition: "color 0.6s ease",
          //   color:      slide.accent,
        }}>
          {slide.headline}
        </h2>
        <h3 style={{
          color: "rgba(255,255,255,0.55)",
          fontSize: "clamp(1rem, 2.5vw, 1.8rem)",
          fontWeight: 700,
          fontFamily: "var(--font-montserrat)",
          margin: "0.3rem 0 2.5rem",
          lineHeight: 1.2,
          transition: "opacity 0.6s ease",
        }}
          className="evh-sub"
        >
          {slide.sub}
        </h3>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "clamp(1rem, 3vw, 3rem)", flexWrap: "wrap" }}>
          {HERO_STATS.map(s => (
            <div key={s.value} className="evh-stat" style={{
              borderLeft: "2px solid #C9A84C",
              paddingLeft: "0.9rem",
              opacity: entered ? 1 : 0,
            }}>
              <div style={{
                color: "#C9A84C",
                fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                fontWeight: 800,
                fontFamily: "var(--font-montserrat)",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
              }}>{s.value}</div>
              <div style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.58rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 600,
                marginTop: "0.2rem",
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide dots */}
      <div className="evh-dots" style={{
        position: "absolute",
        bottom: "2rem",
        left: "clamp(1.5rem, 6vw, 6rem)",
        display: "flex",
        gap: "6px",
        zIndex: 5,
        opacity: 0,
      }}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              width: i === active ? "24px" : "6px",
              height: "6px",
              background: i === active ? "#C9A84C" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.35s ease",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Tech events section ──────────────────────────────────────────────────────
function TechEventsSection() {
  const secRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!secRef.current) return;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !secRef.current) return;
      ScrollTrigger.create({
        trigger: secRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          gsap.fromTo(".tech-heading", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
          gsap.to(".tech-card", {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
            stagger: 0.14, delay: 0.2,
          });
        },
      });
    });
    return () => {
      cancelled = true;
      loadGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().filter(st => st.vars.trigger === secRef.current).forEach(st => st.kill());
      });
    };
  }, []);

  return (
    <div
      ref={secRef}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "5rem 0 4rem",
      }}
    >
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <Image
          src="/photos/event-hero-2.jpg"
          alt="Tech events background"
          fill
          loading="lazy"
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,10,20,0.97) 0%, rgba(0,15,30,0.92) 50%, rgba(0,10,20,0.97) 100%)",
          zIndex: 2,
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 3, padding: "0 clamp(1.2rem, 4vw, 4rem)" }}>
        {/* Section heading */}
        <div className="tech-heading" style={{ marginBottom: "2.5rem", opacity: 0 }}>
          <p style={{
            color: "rgba(0,200,240,0.85)",
            fontSize: "0.68rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            margin: "0 0 0.6rem",
          }}>
            Tech Events
          </p>
          <h3 style={{
            color: "#ffffff",
            fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
            fontWeight: 800,
            fontFamily: "var(--font-montserrat)",
            margin: 0,
            lineHeight: 1.1,
          }}>
            Where tech brands<br />
            <span style={{ color: "rgba(0,200,240,0.9)" }}>launch their future</span>
          </h3>
        </div>

        {/* Cards grid */}
        <div className="events-3col-grid">
          {TECH_EVENTS.map((evt, i) => (
            <EventCard key={evt.id} evt={evt} index={i} className="tech-card" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Entertainment + Gaming section ──────────────────────────────────────────
function EntGamingSection() {
  const secRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    if (!secRef.current) return;
    let cancelled = false;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !secRef.current) return;
      ScrollTrigger.create({
        trigger: secRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (triggered.current) return;
          triggered.current = true;
          gsap.fromTo(".eg-heading", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });
          gsap.to(".eg-card", {
            opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
            stagger: 0.14, delay: 0.2,
          });
        },
      });
    });
    return () => {
      cancelled = true;
      loadGsap().then(({ ScrollTrigger }) => {
        ScrollTrigger.getAll().filter(st => st.vars.trigger === secRef.current).forEach(st => st.kill());
      });
    };
  }, []);

  return (
    <div
      ref={secRef}
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "5rem 0 6rem",
      }}
    >
      {/* Background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
        <Image
          src="/photos/event-hero-3.jpg"
          alt="Entertainment events background"
          fill
          loading="lazy"
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(15,4,0,0.97) 0%, rgba(10,2,0,0.9) 50%, rgba(5,4,2,0.97) 100%)",
          zIndex: 2,
        }} />
      </div>

      <div style={{ position: "relative", zIndex: 3, padding: "0 clamp(1.2rem, 4vw, 4rem)" }}>
        {/* Section heading */}
        <div className="eg-heading" style={{ marginBottom: "2.5rem", opacity: 0 }}>
          <p style={{
            color: "#C9A84C",
            fontSize: "0.68rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            margin: "0 0 0.6rem",
          }}>
            Entertainment & Gaming
          </p>
          <h3 style={{
            color: "#ffffff",
            fontSize: "clamp(1.4rem, 3vw, 2.4rem)",
            fontWeight: 800,
            fontFamily: "var(--font-montserrat)",
            margin: 0,
            lineHeight: 1.1,
          }}>
            Sport, culture & gaming<br />
            <span style={{ color: "#C9A84C" }}>collide on our stage</span>
          </h3>
        </div>

        {/* Cards grid */}
        <div className="events-3col-grid">
          {ENT_EVENTS.map((evt, i) => (
            <EventCard key={evt.id} evt={evt} index={i} className="eg-card" />
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{
        position: "relative",
        zIndex: 3,
        textAlign: "center",
        padding: "4rem 1.5rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.2rem",
      }}>
        <p style={{
          color: "rgba(255,255,255,0.28)",
          fontSize: "0.78rem",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 400,
          margin: 0,
          maxWidth: "380px",
          lineHeight: 1.6,
        }}>
          Your brand. Our stage. 40 million witnesses.
        </p>
        <p style={{
          color: "rgba(201,168,76,0.55)",
          fontSize: "0.65rem",
          fontFamily: "var(--font-montserrat)",
          fontWeight: 600,
          margin: 0,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
        }}>
          Booking details continue in the closing slide
        </p>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function EventsPanel() {
  return (
    <div id="events-panel" style={{ background: "#050402", overflow: "hidden" }}>
      {/* Separator */}
      <div style={{
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)",
      }} />

      {/* 1 — Hero slideshow */}
      <EventsHero />

      {/* 2 — Tech events */}
      <TechEventsSection />

      {/* Divider */}
      <div style={{
        height: "1px",
        margin: "0 clamp(1.2rem, 4vw, 4rem)",
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.12), transparent)",
      }} />

      {/* 3 — Entertainment & Gaming */}
      <EntGamingSection />

      {/* Bottom divider */}
      <div style={{
        height: "1px",
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)",
      }} />

      {/* Responsive grid styles */}
      <style>{`
        .events-3col-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(201,168,76,0.07);
          border: 1px solid rgba(201,168,76,0.07);
        }
        @media (min-width: 640px) {
          .events-3col-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .events-3col-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}