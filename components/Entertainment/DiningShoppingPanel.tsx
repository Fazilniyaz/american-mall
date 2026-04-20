"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

// ── Lazy GSAP loader ─────────────────────────────────────────────────────────────
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

// ─── Restaurant stats ─────────────────────────────────────────────────────────
const REST_STATS = [
    { value: "50+", label: "Restaurants" },
    { value: "2.8M", label: "Dining visits/yr" },
    { value: "15+", label: "Cuisines" },
    { value: "Top 3", label: "US Mall Dining" },
];

// ─── Restaurant thumbnails ────────────────────────────────────────────────────
const REST_THUMBS = [
    {
        src: "/photos/restaurant-thumb-1.jpg",
        alt: "Fine dining service at Mall of America",
        label: "Fine Dining",
        desc: "Premium table service",
    },
    {
        src: "/photos/restaurant-thumb-2.jpg",
        alt: "Restaurant bar at Mall of America",
        label: "Bars & Lounge",
        desc: "Craft cocktails, live energy",
    },
    {
        src: "/photos/restaurant-thumb-3.jpg",
        alt: "Gourmet cuisine at Mall of America",
        label: "Gourmet",
        desc: "Every cuisine imaginable",
    },
];

// ─── Shopping stats ───────────────────────────────────────────────────────────
const SHOP_STATS = [
    { value: "520+", label: "Stores" },
    { value: "$2B+", label: "Annual Revenue" },
    { value: "40M", label: "Shoppers/yr" },
    { value: "#1", label: "US Retail Destination" },
];

// ─── Shopping thumbnails ──────────────────────────────────────────────────────
const SHOP_THUMBS = [
    {
        src: "/photos/shopping-thumb-1.jpg",
        alt: "Shoppers at Mall of America",
        label: "Every Brand",
        desc: "Luxury to fast fashion",
    },
    {
        src: "/photos/shopping-thumb-2.jpg",
        alt: "Luxury shopping at Mall of America",
        label: "Luxury Retail",
        desc: "Premium flagship stores",
    },
];

// ─── Shared: 3-thumbnail stack ────────────────────────────────────────────────
function ThumbStack({
    thumbs,
    accentColor,
    stripLabel,
    animClass,
}: {
    thumbs: { src: string; alt: string; label: string; desc: string }[];
    accentColor: string;
    stripLabel: string;
    animClass: string;
}) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", alignSelf: "center" }}>
            {thumbs.map((t, i) => (
                <div
                    key={t.src}
                    className={animClass}
                    style={{
                        position: "relative",
                        width: "100%",
                        height: `clamp(120px, ${thumbs.length === 2 ? "16vw" : "13vw"}, ${thumbs.length === 2 ? "200px" : "170px"})`,
                        overflow: "hidden",
                        opacity: 0,
                        transform: "translateX(40px)",
                    }}
                >
                    <Image
                        src={t.src}
                        alt={t.alt}
                        fill
                        loading="lazy"
                        sizes="(max-width:768px) 100vw, 35vw"
                        style={{ objectFit: "cover", transition: "transform 0.55s ease" }}
                        onMouseEnter={e => { (e.target as HTMLImageElement).style.transform = "scale(1.06)"; }}
                        onMouseLeave={e => { (e.target as HTMLImageElement).style.transform = "scale(1)"; }}
                    />
                    {/* Overlay */}
                    <div style={{
                        position: "absolute", inset: 0,
                        background: "linear-gradient(to top, rgba(5,4,2,0.8) 0%, transparent 55%)",
                    }} />
                    {/* Caption */}
                    <div style={{ position: "absolute", bottom: "0.75rem", left: "0.9rem", zIndex: 2 }}>
                        <div style={{
                            color: accentColor,
                            fontSize: "0.6rem",
                            fontWeight: 700,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            fontFamily: "var(--font-montserrat)",
                            lineHeight: 1,
                        }}>
                            {t.label}
                        </div>
                        <div style={{
                            color: "rgba(255,255,255,0.42)",
                            fontSize: "0.56rem",
                            fontFamily: "var(--font-montserrat)",
                            marginTop: "0.18rem",
                        }}>
                            {t.desc}
                        </div>
                    </div>
                    {/* Corner bracket */}
                    <div style={{
                        position: "absolute", top: "8px", right: "8px",
                        width: "12px", height: "12px",
                        borderTop: `1px solid ${accentColor}80`,
                        borderRight: `1px solid ${accentColor}80`,
                    }} />
                </div>
            ))}
            {/* Strip below */}
            <div style={{
                borderTop: `1px solid ${accentColor}20`,
                paddingTop: "0.6rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <span style={{
                    color: `${accentColor}55`,
                    fontSize: "0.58rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 600,
                }}>
                    {stripLabel}
                </span>
                <span style={{ color: accentColor, fontSize: "0.72rem", opacity: 0.6 }}>→</span>
            </div>
        </div>
    );
}

// ─── Restaurant Panel ─────────────────────────────────────────────────────────
function RestaurantPanel() {
    const panelRef = useRef<HTMLDivElement>(null);
    const triggered = useRef(false);

    useEffect(() => {
        if (!panelRef.current) return;
        let cancelled = false;
        const el = panelRef.current;
        loadGsap().then(({ gsap, ScrollTrigger }) => {
            if (cancelled || !el) return;
            ScrollTrigger.create({
                trigger: el, start: "top 72%", once: true,
                onEnter: () => {
                    if (triggered.current) return;
                    triggered.current = true;
                    gsap.timeline()
                        .to(".rest-cat", { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
                        .to(".rest-headline", { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.25")
                        .to(".rest-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
                        .to(".rest-divider", { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
                        .to(".rest-body", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
                        .to(".rest-stat", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.09 }, "-=0.2")
                        .to(".rest-thumb", { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 }, "-=0.35");
                },
            });
        });
        return () => {
            cancelled = true;
            loadGsap().then(({ ScrollTrigger }) => {
                ScrollTrigger.getAll()
                    .filter(st => st.vars.trigger === el)
                    .forEach(st => st.kill());
            });
        };
    }, []);

    return (
        <div
            ref={panelRef}
            style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                background: "#080501",
            }}
        >
            {/* ── Hero bg — aerial food court — shows mall scale ── */}
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                <Image
                    src="/photos/restaurant-bg.jpg"
                    alt="Mall of America dining — aerial view of food court"
                    fill
                    loading="lazy"
                    sizes="100vw"
                    style={{ objectFit: "cover", objectPosition: "center 25%" }}
                />
                {/* Warm amber overlay matching restaurant warmth */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(110deg, rgba(8,5,1,0.96) 0%, rgba(12,7,2,0.88) 38%, rgba(16,9,3,0.5) 64%, rgba(8,5,1,0.15) 100%)",
                    zIndex: 2,
                }} />
                {/* Subtle warm colour wash */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(to bottom, rgba(30,15,0,0.35), rgba(15,8,0,0.55))",
                    zIndex: 2,
                }} />
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "160px",
                    background: "linear-gradient(to bottom, transparent, #050402)",
                    zIndex: 3,
                }} />
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "80px",
                    background: "linear-gradient(to bottom, #050402, transparent)",
                    zIndex: 3,
                }} />
            </div>

            {/* Content grid */}
            <div
                className="rest-grid"
                style={{
                    position: "relative", zIndex: 4, width: "100%",
                    padding: "6rem clamp(1.5rem, 6vw, 6rem)",
                    display: "grid", gap: "2.5rem",
                }}
            >
                {/* Left — text */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", maxWidth: "520px" }}>
                    <p className="rest-cat" style={{
                        color: "#E8A84C",
                        fontSize: "0.68rem",
                        letterSpacing: "0.42em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        margin: 0,
                        opacity: 0, transform: "translateY(16px)",
                    }}>
                        Dining & Lifestyle · 50+ Restaurants
                    </p>

                    <h2 className="rest-headline" style={{
                        color: "#ffffff",
                        fontSize: "clamp(2.4rem, 5.5vw, 5.2rem)",
                        fontWeight: 800,
                        fontFamily: "var(--font-montserrat)",
                        margin: 0, lineHeight: 0.95,
                        opacity: 0, transform: "translateY(24px)",
                    }}>
                        50 restaurants.<br />Every cuisine.
                    </h2>

                    <h3 className="rest-sub" style={{
                        color: "rgba(255,255,255,0.38)",
                        fontSize: "clamp(1.1rem, 2.5vw, 1.9rem)",
                        fontWeight: 800,
                        fontFamily: "var(--font-montserrat)",
                        margin: 0, lineHeight: 1.1,
                        opacity: 0, transform: "translateY(20px)",
                    }}>
                        One destination.
                    </h3>

                    <div className="rest-divider" style={{
                        width: "48px", height: "2px",
                        background: "linear-gradient(to right, #E8A84C, rgba(232,168,76,0.1))",
                        transform: "scaleX(0)", transformOrigin: "left",
                    }} />

                    <p className="rest-body" style={{
                        color: "rgba(255,255,255,0.52)",
                        fontSize: "clamp(0.82rem, 1.3vw, 0.95rem)",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 400,
                        lineHeight: 1.8, margin: 0, maxWidth: "420px",
                        opacity: 0, transform: "translateY(16px)",
                    }}>
                        From Michelin-calibre tasting menus to fast-casual street food,
                        the dining ecosystem at Mall of America keeps visitors on-property
                        longer — and spending more. Every hour spent dining is an hour
                        spent steps from your store.
                    </p>

                    {/* Stat pills — warm amber accent */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.6rem",
                        marginTop: "0.4rem",
                    }}>
                        {REST_STATS.map(s => (
                            <div key={s.value} className="rest-stat" style={{
                                background: "rgba(232,168,76,0.06)",
                                border: "1px solid rgba(232,168,76,0.18)",
                                padding: "0.75rem 1rem",
                                opacity: 0, transform: "translateY(12px)",
                            }}>
                                <div style={{
                                    color: "#E8A84C",
                                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                                    fontWeight: 800,
                                    fontFamily: "var(--font-montserrat)",
                                    lineHeight: 1,
                                    fontVariantNumeric: "tabular-nums",
                                }}>
                                    {s.value}
                                </div>
                                <div style={{
                                    color: "rgba(255,255,255,0.35)",
                                    fontSize: "0.58rem",
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontFamily: "var(--font-montserrat)",
                                    fontWeight: 600, marginTop: "0.25rem",
                                }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right — thumbnail stack */}
                <div className="rest-thumbs-col">
                    <ThumbStack
                        thumbs={REST_THUMBS}
                        accentColor="#E8A84C"
                        stripLabel="Mall of America dining"
                        animClass="rest-thumb"
                    />
                </div>
            </div>

            {/* Panel number */}
            <div style={{
                position: "absolute", right: "clamp(1.5rem,5vw,4rem)", bottom: "3rem",
                color: "rgba(232,168,76,0.06)",
                fontSize: "clamp(5rem,12vw,10rem)",
                fontWeight: 800, fontFamily: "var(--font-montserrat)",
                lineHeight: 1, userSelect: "none", pointerEvents: "none", zIndex: 4,
            }}>
                03
            </div>

            <style>{`
        @media (max-width:767px) {
          .rest-thumbs-col { display:none !important; }
          .rest-grid        { grid-template-columns:1fr !important; }
        }
        @media (min-width:768px) {
          .rest-grid {
            grid-template-columns: 1fr 1fr !important;
            align-items: center;
          }
          .rest-thumbs-col { display:block !important; }
        }
        @media (min-width:1100px) {
          .rest-grid { grid-template-columns: 55fr 45fr !important; }
        }
      `}</style>
        </div>
    );
}

// ─── Shopping Panel ───────────────────────────────────────────────────────────
function ShoppingPanel() {
    const panelRef = useRef<HTMLDivElement>(null);
    const triggered = useRef(false);

    useEffect(() => {
        if (!panelRef.current) return;
        let cancelled = false;
        const el = panelRef.current;
        loadGsap().then(({ gsap, ScrollTrigger }) => {
            if (cancelled || !el) return;
            ScrollTrigger.create({
                trigger: el, start: "top 72%", once: true,
                onEnter: () => {
                    if (triggered.current) return;
                    triggered.current = true;
                    gsap.timeline()
                        .to(".shop-cat", { opacity: 1, y: 0, duration: 0.55, ease: "power2.out" })
                        .to(".shop-headline", { opacity: 1, y: 0, duration: 0.65, ease: "power2.out" }, "-=0.25")
                        .to(".shop-sub", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.35")
                        .to(".shop-divider", { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
                        .to(".shop-body", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, "-=0.2")
                        .to(".shop-stat", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.09 }, "-=0.2")
                        .to(".shop-thumb", { opacity: 1, x: 0, duration: 0.6, ease: "power2.out", stagger: 0.14 }, "-=0.35");
                },
            });
        });
        return () => {
            cancelled = true;
            loadGsap().then(({ ScrollTrigger }) => {
                ScrollTrigger.getAll()
                    .filter(st => st.vars.trigger === el)
                    .forEach(st => st.kill());
            });
        };
    }, []);

    return (
        <div
            ref={panelRef}
            style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
                background: "#050402",
            }}
        >
            {/* ── Hero bg — H&M store front, bright clean retail ── */}
            <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
                <Image
                    src="/photos/shopping-bg.jpg"
                    alt="Mall of America retail — H&M flagship store"
                    fill
                    loading="lazy"
                    sizes="100vw"
                    style={{ objectFit: "cover", objectPosition: "center 40%" }}
                />
                {/* Reversed gradient — dark RIGHT so text on right side is readable */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(255deg, rgba(5,4,2,0.96) 0%, rgba(5,4,2,0.85) 35%, rgba(5,4,2,0.42) 62%, rgba(5,4,2,0.1) 100%)",
                    zIndex: 2,
                }} />
                <div style={{
                    position: "absolute", bottom: 0, left: 0, right: 0, height: "160px",
                    background: "linear-gradient(to bottom, transparent, #050402)",
                    zIndex: 3,
                }} />
                <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, height: "80px",
                    background: "linear-gradient(to bottom, #050402, transparent)",
                    zIndex: 3,
                }} />
            </div>

            {/* Content grid — REVERSED: thumbnails left, text right (alternating layout) */}
            <div
                className="shop-grid"
                style={{
                    position: "relative", zIndex: 4, width: "100%",
                    padding: "6rem clamp(1.5rem, 6vw, 6rem)",
                    display: "grid", gap: "2.5rem",
                }}
            >
                {/* Left — thumbnails (hidden mobile) */}
                <div className="shop-thumbs-col">
                    <ThumbStack
                        thumbs={SHOP_THUMBS}
                        accentColor="#C9A84C"
                        stripLabel="520+ stores · every category"
                        animClass="shop-thumb"
                    />
                </div>

                {/* Right — text */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem", maxWidth: "520px" }}>
                    <p className="shop-cat" style={{
                        color: "#C9A84C",
                        fontSize: "0.68rem",
                        letterSpacing: "0.42em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        margin: 0,
                        opacity: 0, transform: "translateY(16px)",
                    }}>
                        Retail & Fashion · 520+ Stores
                    </p>

                    <h2 className="shop-headline" style={{
                        color: "#ffffff",
                        fontSize: "clamp(2.4rem, 5.5vw, 5.2rem)",
                        fontWeight: 800,
                        fontFamily: "var(--font-montserrat)",
                        margin: 0, lineHeight: 0.95,
                        opacity: 0, transform: "translateY(24px)",
                    }}>
                        520 stores.<br />Every category.
                    </h2>

                    <h3 className="shop-sub" style={{
                        color: "rgba(255,255,255,0.38)",
                        fontSize: "clamp(1.1rem, 2.5vw, 1.9rem)",
                        fontWeight: 800,
                        fontFamily: "var(--font-montserrat)",
                        margin: 0, lineHeight: 1.1,
                        opacity: 0, transform: "translateY(20px)",
                    }}>
                        From luxury to everyday.
                    </h3>

                    <div className="shop-divider" style={{
                        width: "48px", height: "2px",
                        background: "linear-gradient(to right, #C9A84C, rgba(201,168,76,0.1))",
                        transform: "scaleX(0)", transformOrigin: "left",
                    }} />

                    <p className="shop-body" style={{
                        color: "rgba(255,255,255,0.52)",
                        fontSize: "clamp(0.82rem, 1.3vw, 0.95rem)",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 400,
                        lineHeight: 1.8, margin: 0, maxWidth: "420px",
                        opacity: 0, transform: "translateY(16px)",
                    }}>
                        Nike. H&M. Zara. Coach. Sephora. Louis Vuitton.
                        Mall of America hosts flagship stores across every retail tier —
                        luxury flagships to fast fashion, beauty to electronics.
                        Your brand opens alongside the names that define global retail.
                    </p>

                    {/* Stat pills */}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "0.6rem",
                        marginTop: "0.4rem",
                    }}>
                        {SHOP_STATS.map(s => (
                            <div key={s.value} className="shop-stat" style={{
                                background: "rgba(201,168,76,0.06)",
                                border: "1px solid rgba(201,168,76,0.18)",
                                padding: "0.75rem 1rem",
                                opacity: 0, transform: "translateY(12px)",
                            }}>
                                <div style={{
                                    color: "#C9A84C",
                                    fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                                    fontWeight: 800,
                                    fontFamily: "var(--font-montserrat)",
                                    lineHeight: 1,
                                    fontVariantNumeric: "tabular-nums",
                                }}>
                                    {s.value}
                                </div>
                                <div style={{
                                    color: "rgba(255,255,255,0.35)",
                                    fontSize: "0.58rem",
                                    letterSpacing: "0.14em",
                                    textTransform: "uppercase",
                                    fontFamily: "var(--font-montserrat)",
                                    fontWeight: 600, marginTop: "0.25rem",
                                }}>
                                    {s.label}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: "0.5rem" }}>
                        <p style={{
                            color: "rgba(201,168,76,0.55)",
                            fontSize: "0.63rem",
                            fontFamily: "var(--font-montserrat)",
                            fontWeight: 600,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            margin: 0,
                        }}>
                            Leasing options continue in the closing slide
                        </p>
                    </div>
                </div>
            </div>

            {/* Panel number */}
            <div style={{
                position: "absolute", left: "clamp(1.5rem,5vw,4rem)", bottom: "3rem",
                color: "rgba(201,168,76,0.06)",
                fontSize: "clamp(5rem,12vw,10rem)",
                fontWeight: 800, fontFamily: "var(--font-montserrat)",
                lineHeight: 1, userSelect: "none", pointerEvents: "none", zIndex: 4,
            }}>
                04
            </div>

            <style>{`
        @media (max-width:767px) {
          .shop-thumbs-col { display:none !important; }
          .shop-grid        { grid-template-columns:1fr !important; }
        }
        @media (min-width:768px) {
          .shop-grid {
            grid-template-columns: 1fr 1fr !important;
            align-items: center;
          }
          .shop-thumbs-col { display:block !important; }
        }
        @media (min-width:1100px) {
          .shop-grid { grid-template-columns: 42fr 58fr !important; }
        }
      `}</style>
        </div>
    );
}

// ─── Main export — both panels combined ──────────────────────────────────────
export default function DiningShoppingPanel() {
    return (
        <>
            {/* Thin separator */}
            <div style={{
                height: "1px",
                background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)",
            }} />

            <RestaurantPanel />

            {/* Separator between panels */}
            <div style={{
                height: "1px",
                background: "linear-gradient(to right, transparent, rgba(201,168,76,0.1), transparent)",
            }} />

            <ShoppingPanel />

            <div style={{
                height: "1px",
                background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)",
            }} />
        </>
    );
}