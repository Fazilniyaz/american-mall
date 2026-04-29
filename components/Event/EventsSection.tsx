"use client";

import {
    useEffect,
    useRef,
    memo,
} from "react";
import { useScroller } from "@/components/ScrollerContext";

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

// ─── Event category cards data ────────────────────────────────────────────────
const EVENT_TYPES = [
    {
        id: "concerts",
        number: "180+",
        title: "Concerts & Live Music",
        body: "From intimate acoustic sets to full-scale arena productions. Mall of America's atrium transforms into a world-class stage.",
        detail: "Capacity up to 20,000",
        icon: "♩",
    },
    {
        id: "activations",
        number: "90+",
        title: "Brand Activations",
        body: "Samsung Galaxy launches. Nike drops. Apple reveals. The most visited mall in America is where brands come to make moments.",
        detail: "Avg 15K attendees per activation",
        icon: "◈",
    },
    {
        id: "corporate",
        number: "40+",
        title: "Corporate & Convention",
        body: "Conference-grade event spaces, exposition halls, and boardroom facilities. Your convention, inside a destination.",
        detail: "80,000 sqft event space",
        icon: "⬡",
    },
];

// ─── Brand events with SVG paths from public/svg/ ────────────────────────────
const BRAND_EVENTS = [
    {
        brand: "Samsung",
        event: "Galaxy Experience Store Launch",
        year: "2025",
        stat: "22K attendees",
        category: "Product Launch",
        gradient: "linear-gradient(135deg, #1428A0 0%, #0a1560 100%)",
        logo: "/svg/samsung.svg",
        logoStyle: { width: "72%", height: "auto" },
    },
    {
        brand: "Nike",
        event: "Air Max Day Activation",
        year: "2024",
        stat: "18K attendees",
        category: "Brand Activation",
        gradient: "linear-gradient(135deg, #111111 0%, #2a2a2a 100%)",
        logo: "/svg/nike.svg",
        logoStyle: { width: "52%", height: "auto" },
    },
    {
    brand: "Lego",
    event: "Flagship Store Opening",
    year: "2024",
    stat: "14K attendees",
    category: "Store Launch",
    gradient: "linear-gradient(135deg, #006DB7 0%, #003d6b 100%)",
    logo: "/svg/lego.svg",
    logoFilter: "brightness(0) invert(1) drop-shadow(0 0 18px rgba(255,255,255,0.15))",
    logoStyle: { width: "62%", height: "auto" },
},
    {
        brand: "Coca-Cola",
        event: "Summer Sponsorship Takeover",
        year: "2024",
        stat: "31K reach",
        category: "Sponsorship",
        gradient: "linear-gradient(135deg, #c8102e 0%, #6b0018 100%)",
        logo: "/svg/coca-cola.svg",
        logoStyle: { width: "76%", height: "auto" },
    },
    {
        brand: "Marvel",
        event: "Avengers Promotional Event",
        year: "2023",
        stat: "27K attendees",
        category: "Entertainment",
        gradient: "linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)",
        logo: "/svg/marvel.svg",
        logoStyle: { width: "66%", height: "auto" },
    },
    {
        brand: "Tesla",
        event: "Model Y Showcase Experience",
        year: "2023",
        stat: "12K visitors",
        category: "Product Experience",
        gradient: "linear-gradient(135deg, #1a1a1a 0%, #0a0000 100%)",
        logo: "/svg/tesla.svg",
        logoStyle: { width: "60%", height: "auto" },
    },
    {
        brand: "Apple",
        event: "iPhone 15 Launch Event",
        year: "2023",
        stat: "19K attendees",
        category: "Product Launch",
        gradient: "linear-gradient(135deg, #1c1c1e 0%, #000000 100%)",
        logo: "/svg/apple.svg",
        logoStyle: { width: "28%", height: "auto" },
    },
];

// ─── Event type card ──────────────────────────────────────────────────────────
const EventTypeCard = memo(function EventTypeCard({
    evt,
    index,
}: {
    evt: typeof EVENT_TYPES[0];
    index: number;
}) {
    const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const r = e.currentTarget.getBoundingClientRect();
        const mx = ((e.clientX - r.left) / r.width - 0.5) * 12;
        const my = ((e.clientY - r.top) / r.height - 0.5) * -12;
        loadGsap().then(({ gsap }) => {
            gsap.to(e.currentTarget, {
                rotateY: mx, rotateX: my,
                duration: 0.3, ease: "power2.out",
                transformPerspective: 700,
            });
        });
    };

    const onLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        loadGsap().then(({ gsap }) => {
            gsap.to(e.currentTarget, {
                rotateY: 0, rotateX: 0,
                duration: 0.55, ease: "elastic.out(1,0.6)",
                transformPerspective: 700,
            });
        });
    };

    return (
        <div
            className={`evt-type-card evt-type-card-${index}`}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(201,168,76,0.14)",
                padding: "2rem 1.8rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                willChange: "transform",
                transformStyle: "preserve-3d",
                cursor: "default",
                transition: "border-color 0.25s ease, background 0.25s ease",
                position: "relative",
                overflow: "hidden",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.38)";
                e.currentTarget.style.background = "rgba(201,168,76,0.04)";
            }}
        >
            {/* Background number watermark */}
            <div style={{
                position: "absolute",
                right: "1rem",
                bottom: "0.5rem",
                color: "rgba(201,168,76,0.05)",
                fontSize: "5rem",
                fontWeight: 800,
                fontFamily: "var(--font-montserrat)",
                lineHeight: 1,
                userSelect: "none",
                pointerEvents: "none",
            }}>
                {evt.number}
            </div>

            {/* Icon */}
            <div style={{
                color: "#C9A84C",
                fontSize: "1.4rem",
                lineHeight: 1,
                opacity: 0.7,
            }}>
                {evt.icon}
            </div>

            {/* Number */}
            <div style={{
                color: "#C9A84C",
                fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
                fontWeight: 800,
                fontFamily: "var(--font-montserrat)",
                lineHeight: 1,
                fontVariantNumeric: "tabular-nums",
            }}>
                {evt.number}
            </div>

            {/* Title */}
            <h3 style={{
                color: "#ffffff",
                fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)",
                fontWeight: 700,
                fontFamily: "var(--font-montserrat)",
                margin: 0,
                letterSpacing: "0.04em",
                lineHeight: 1.25,
            }}>
                {evt.title}
            </h3>

            {/* Body */}
            <p style={{
                color: "rgba(255,255,255,0.48)",
                fontSize: "0.78rem",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 400,
                lineHeight: 1.7,
                margin: 0,
                flexGrow: 1,
            }}>
                {evt.body}
            </p>

            {/* Detail pill */}
            <div style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                paddingTop: "0.8rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
                <div style={{
                    width: "4px",
                    height: "4px",
                    background: "#C9A84C",
                    transform: "rotate(45deg)",
                    flexShrink: 0,
                }} />
                <span style={{
                    color: "rgba(201,168,76,0.65)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                }}>
                    {evt.detail}
                </span>
            </div>
        </div>
    );
});

// ─── Brand event carousel card ────────────────────────────────────────────────
const BrandEventCard = memo(function BrandEventCard({
    evt,
}: {
    evt: typeof BRAND_EVENTS[0];
}) {
    return (
        <div
            className="brand-evt-card"
            style={{
                minWidth: "clamp(200px, 28vw, 290px)",
                height: "clamp(185px, 22vw, 245px)",
                background: evt.gradient,
                border: "1px solid rgba(201,168,76,0.1)",
                padding: "1.4rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                flexShrink: 0,
                position: "relative",
                overflow: "hidden",
                cursor: "default",
                transition: "border-color 0.25s ease",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.45)";
                loadGsap().then(({ gsap }) =>
                    gsap.to(e.currentTarget, { scale: 1.025, duration: 0.28, ease: "power2.out" })
                );
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.1)";
                loadGsap().then(({ gsap }) =>
                    gsap.to(e.currentTarget, { scale: 1, duration: 0.4, ease: "power2.out" })
                );
            }}
        >
            {/* Category pill */}
            <div style={{
                display: "inline-flex",
                alignSelf: "flex-start",
                background: "rgba(0,0,0,0.4)",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "rgba(201,168,76,0.85)",
                fontSize: "0.52rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 700,
                padding: "3px 8px",
                position: "relative",
                zIndex: 2,
            }}>
                {evt.category}
            </div>

            {/* Real brand logo — centered, luminous white */}
            <div style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                pointerEvents: "none",
            }}>
                <img
                    src={evt.logo}
                    alt={evt.brand}
                    style={{
                    ...evt.logoStyle,
                    opacity: 0.9,
                    filter: evt.logoFilter ?? "brightness(0) invert(1) drop-shadow(0 0 18px rgba(255,255,255,0.15))",
                    objectFit: "contain",
                    }}
                />
            </div>

            {/* Bottom vignette so text stays readable */}
            <div style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "52%",
                background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)",
                zIndex: 1,
                pointerEvents: "none",
            }} />

            {/* Bottom info */}
            <div style={{ position: "relative", zIndex: 2 }}>
                <div style={{
                    color: "rgba(255,255,255,0.55)",
                    fontSize: "0.64rem",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 400,
                    lineHeight: 1.4,
                    marginBottom: "0.4rem",
                }}>
                    {evt.event}
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.7rem",
                }}>
                    <span style={{
                        color: "#C9A84C",
                        fontSize: "0.64rem",
                        fontWeight: 700,
                        fontFamily: "var(--font-montserrat)",
                        letterSpacing: "0.1em",
                    }}>
                        {evt.stat}
                    </span>
                    <span style={{
                        color: "rgba(255,255,255,0.25)",
                        fontSize: "0.58rem",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 500,
                        letterSpacing: "0.1em",
                    }}>
                        · {evt.year}
                    </span>
                </div>
            </div>
        </div>
    );
});

// ─── Carousel — GSAP infinite scroll + hover slow + touch drag ───────────────
function BrandCarousel() {
    const trackRef = useRef<HTMLDivElement>(null);
    const tlRef = useRef<gsap.core.Tween | null>(null);
    const isDrag = useRef(false);
    const startX = useRef(0);
    const scrollX = useRef(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;
        let cancelled = false;

        loadGsap().then(({ gsap }) => {
            if (cancelled || !track) return;

            const totalW = track.scrollWidth / 2;
            gsap.set(track, { x: 0 });

            tlRef.current = gsap.to(track, {
                x: -totalW,
                duration: 40,
                ease: "none",
                repeat: -1,
                paused: document.hidden,
                modifiers: {
                    x: gsap.utils.unitize(x => parseFloat(x) % totalW),
                },
            });

            const onVis = () => {
                if (document.hidden) tlRef.current?.pause();
                else tlRef.current?.resume();
            };
            document.addEventListener("visibilitychange", onVis);

            const onEnter = () => gsap.to(tlRef.current, { timeScale: 0.2, duration: 0.6 });
            const onLeave = () => gsap.to(tlRef.current, { timeScale: 1, duration: 0.6 });
            track.parentElement?.addEventListener("mouseenter", onEnter);
            track.parentElement?.addEventListener("mouseleave", onLeave);

            const onTouchStart = (e: TouchEvent) => {
                isDrag.current = true;
                startX.current = e.touches[0].clientX;
                scrollX.current = gsap.getProperty(track, "x") as number;
                tlRef.current?.pause();
            };
            const onTouchMove = (e: TouchEvent) => {
                if (!isDrag.current) return;
                const dx = e.touches[0].clientX - startX.current;
                gsap.set(track, { x: scrollX.current + dx });
            };
            const onTouchEnd = () => {
                isDrag.current = false;
                setTimeout(() => tlRef.current?.resume(), 1800);
            };

            track.addEventListener("touchstart", onTouchStart, { passive: true });
            track.addEventListener("touchmove", onTouchMove, { passive: true });
            track.addEventListener("touchend", onTouchEnd);

            (track as any).__evtCleanup = () => {
                tlRef.current?.kill();
                document.removeEventListener("visibilitychange", onVis);
                track.parentElement?.removeEventListener("mouseenter", onEnter);
                track.parentElement?.removeEventListener("mouseleave", onLeave);
                track.removeEventListener("touchstart", onTouchStart);
                track.removeEventListener("touchmove", onTouchMove);
                track.removeEventListener("touchend", onTouchEnd);
            };
        });

        return () => {
            cancelled = true;
            if ((trackRef.current as any)?.__evtCleanup)
                (trackRef.current as any).__evtCleanup();
        };
    }, []);

    // Duplicate for seamless infinite loop
    const doubled = [...BRAND_EVENTS, ...BRAND_EVENTS];

    return (
        <div style={{ overflow: "hidden", position: "relative", width: "100%" }}>
            {/* Left fade */}
            <div style={{
                position: "absolute", left: 0, top: 0, bottom: 0, width: "100px",
                background: "linear-gradient(to right, #050402, transparent)",
                zIndex: 2, pointerEvents: "none",
            }} />
            {/* Right fade */}
            <div style={{
                position: "absolute", right: 0, top: 0, bottom: 0, width: "100px",
                background: "linear-gradient(to left, #050402, transparent)",
                zIndex: 2, pointerEvents: "none",
            }} />

            <div
                ref={trackRef}
                style={{
                    display: "flex",
                    gap: "1px",
                    willChange: "transform",
                    background: "rgba(201,168,76,0.05)",
                }}
            >
                {doubled.map((evt, i) => (
                    <BrandEventCard key={`${evt.brand}-${i}`} evt={evt} />
                ))}
            </div>
        </div>
    );
}

// ─── Video reel hero ──────────────────────────────────────────────────────────
function EventReel({ scrollerEl }: { scrollerEl: HTMLElement | null }) {
    const reelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        loadGsap().then(({ gsap, ScrollTrigger }) => {
            if (cancelled || !reelRef.current) return;
            gsap.context(() => {
                gsap.fromTo(".reel-tagline",
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                        scrollTrigger: { trigger: ".reel-tagline", start: "top 80%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
                    }
                );
                gsap.fromTo(".reel-headline",
                    { opacity: 0, y: 32 },
                    {
                        opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.15,
                        scrollTrigger: { trigger: ".reel-headline", start: "top 80%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
                    }
                );
                gsap.fromTo(".reel-sub",
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.3,
                        scrollTrigger: { trigger: ".reel-sub", start: "top 80%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
                    }
                );
            }, reelRef);
        });
        return () => { cancelled = true; };
    }, [scrollerEl]);

    return (
        <div
            ref={reelRef}
            style={{
                position: "relative",
                width: "100%",
                minHeight: "70vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #0a0600 0%, #050402 50%, #080004 100%)",
                overflow: "hidden",
                borderTop: "1px solid rgba(201,168,76,0.08)",
                borderBottom: "1px solid rgba(201,168,76,0.08)",
            }}
        >
            {/* Grid lines */}
            <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                    linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
                pointerEvents: "none",
            }} />

            {/* Radial glow */}
            <div style={{
                position: "absolute",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                width: "600px", height: "600px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)",
                pointerEvents: "none",
                zIndex: 1,
            }} />

            {/* Centre content */}
            <div style={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                padding: "4rem clamp(1.5rem, 6vw, 6rem)",
                maxWidth: "800px",
            }}>
                <p
                    className="reel-tagline"
                    style={{
                        color: "#C9A84C",
                        fontSize: "0.7rem",
                        letterSpacing: "0.4em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        margin: "0 0 1.5rem",
                        opacity: 0,
                    }}
                >
                    Your brand · Our stage
                </p>

                <h2
                    className="reel-headline"
                    style={{
                        color: "#ffffff",
                        fontSize: "clamp(2.2rem, 6vw, 5rem)",
                        fontWeight: 800,
                        fontFamily: "var(--font-montserrat)",
                        margin: "0 0 0.5rem",
                        lineHeight: 1.0,
                        opacity: 0,
                    }}
                >
                    40 million
                </h2>
                <h2 style={{
                    color: "#C9A84C",
                    fontSize: "clamp(2.2rem, 6vw, 5rem)",
                    fontWeight: 800,
                    fontFamily: "var(--font-montserrat)",
                    margin: "0 0 2rem",
                    lineHeight: 1.0,
                }}>
                    witnesses.
                </h2>

                <p
                    className="reel-sub"
                    style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: "clamp(0.85rem, 1.5vw, 1.05rem)",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 400,
                        lineHeight: 1.75,
                        margin: "0 auto 2.5rem",
                        maxWidth: "520px",
                        opacity: 0,
                    }}
                >
                    When your brand activates at Mall of America, it doesn&apos;t just reach
                    visitors — it reaches the world. Every launch, every event, every moment
                    becomes part of a global conversation.
                </p>

                <p style={{
                    color: "rgba(201,168,76,0.55)",
                    fontSize: "0.68rem",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    margin: 0,
                    opacity: 0.8,
                }}>
                    Booking options are collected in the closing slide
                </p>
            </div>
        </div>
    );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function EventsSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const scrollerEl = useScroller();

    useEffect(() => {
        let cancelled = false;
        loadGsap().then(({ gsap, ScrollTrigger }) => {
            if (cancelled || !sectionRef.current) return;
            gsap.context(() => {
                gsap.fromTo(".events-heading",
                    { opacity: 0, y: 28 },
                    {
                        opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
                        scrollTrigger: { trigger: ".events-heading", start: "top 85%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
                    }
                );
                gsap.fromTo(".evt-type-card",
                    { opacity: 0, y: 44 },
                    {
                        opacity: 1, y: 0,
                        duration: 0.75, ease: "power2.out", stagger: 0.13,
                        scrollTrigger: { trigger: ".evt-types-grid", start: "top 82%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
                    }
                );
                gsap.fromTo(".carousel-heading",
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                        scrollTrigger: { trigger: ".carousel-heading", start: "top 85%", ...(scrollerEl ? { scroller: scrollerEl } : {}) },
                    }
                );
            }, sectionRef);
        });
        return () => { cancelled = true; };
    }, [scrollerEl]);

    return (
        <section
            id="events"
            ref={sectionRef}
            style={{ background: "#050402", overflow: "hidden" }}
        >
            {/* Top separator */}
            <div style={{
                height: "1px",
                background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)",
            }} />

            {/* ── Section heading ── */}
            <div
                className="events-heading"
                style={{
                    textAlign: "center",
                    padding: "5rem 1.5rem 4rem",
                }}
            >
                <p style={{
                    color: "#C9A84C",
                    fontSize: "0.7rem",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                    margin: "0 0 0.8rem",
                }}>
                    Events & activations
                </p>
                <h2 style={{
                    color: "#ffffff",
                    fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                    fontWeight: 800,
                    fontFamily: "var(--font-montserrat)",
                    margin: "0 0 1rem",
                    lineHeight: 1.1,
                }}>
                    The world&apos;s brands<br />
                    <span style={{ color: "#C9A84C" }}>launch here</span>
                </h2>
                <p style={{
                    color: "rgba(255,255,255,0.38)",
                    fontSize: "0.82rem",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 400,
                    margin: "0 auto",
                    maxWidth: "460px",
                    lineHeight: 1.7,
                }}>
                    300+ events every year. From intimate pop-ups to full-scale
                    productions — this is the most powerful event platform in American retail.
                </p>
            </div>

            {/* ── Event type cards ── */}
            <div style={{ padding: "0 clamp(1.2rem, 4vw, 4rem)", marginBottom: "5rem" }}>
                <div className="evt-types-grid">
                    {EVENT_TYPES.map((evt, i) => (
                        <EventTypeCard key={evt.id} evt={evt} index={i} />
                    ))}
                </div>
            </div>

            {/* ── Video reel hero ── */}
            <EventReel scrollerEl={scrollerEl} />

            {/* ── Past brand carousel ── */}
            <div style={{ paddingTop: "5rem", paddingBottom: "2rem" }}>
                <div
                    className="carousel-heading"
                    style={{
                        padding: "0 clamp(1.2rem, 4vw, 4rem)",
                        marginBottom: "2rem",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        flexWrap: "wrap",
                        gap: "1rem",
                    }}
                >
                    <div>
                        <p style={{
                            color: "#C9A84C",
                            fontSize: "0.68rem",
                            letterSpacing: "0.35em",
                            textTransform: "uppercase",
                            fontFamily: "var(--font-montserrat)",
                            fontWeight: 700,
                            margin: "0 0 0.5rem",
                        }}>
                            Past activations
                        </p>
                        <h3 style={{
                            color: "#ffffff",
                            fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
                            fontWeight: 800,
                            fontFamily: "var(--font-montserrat)",
                            margin: 0,
                            lineHeight: 1.15,
                        }}>
                            Brands that trusted<br />
                            <span style={{ color: "#C9A84C" }}>this stage</span>
                        </h3>
                    </div>
                    <p style={{
                        color: "rgba(255,255,255,0.28)",
                        fontSize: "0.7rem",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 400,
                        margin: 0,
                        maxWidth: "240px",
                        lineHeight: 1.6,
                        textAlign: "right",
                    }}>
                        Hover to pause · Drag to explore past brand events and activations.
                    </p>
                </div>

                <BrandCarousel />
            </div>

            {/* ── Bottom CTA ── */}
            <div style={{
                textAlign: "center",
                padding: "4rem 1.5rem 6rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1.5rem",
            }}>
                <div style={{
                    width: "1px",
                    height: "48px",
                    background: "linear-gradient(to bottom, transparent, rgba(201,168,76,0.5))",
                }} />
                <p style={{
                    color: "rgba(255,255,255,0.3)",
                    fontSize: "0.78rem",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 400,
                    margin: 0,
                    letterSpacing: "0.04em",
                    maxWidth: "360px",
                    lineHeight: 1.6,
                }}>
                    Ready to make your brand moment at the most visited mall in America?
                </p>
                <p style={{
                    color: "rgba(201,168,76,0.55)",
                    fontSize: "0.65rem",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    margin: 0,
                }}>
                    Activation booking appears in the closing slide
                </p>
            </div>

            {/* Bottom divider */}
            <div style={{
                height: "1px",
                background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)",
            }} />

            {/* Responsive grid */}
            <style>{`
                .evt-types-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 1px;
                    background: rgba(201,168,76,0.07);
                    border: 1px solid rgba(201,168,76,0.07);
                }
                @media (min-width: 640px) {
                    .evt-types-grid {
                        grid-template-columns: repeat(3, 1fr);
                    }
                }
            `}</style>
        </section>
    );
}