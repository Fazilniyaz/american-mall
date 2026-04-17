"use client";

import {
    useEffect,
    useRef,
    useState,
    memo,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as d3 from "d3";
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    BufferGeometry,
    BufferAttribute,
    PointsMaterial,
    Points,
    Color as ThreeColor,
} from "three";

gsap.registerPlugin(ScrollTrigger);

// ─── Panel data ───────────────────────────────────────────────────────────────
const PANELS = [
    {
        id: "theme-park",
        category: "Theme Park",
        headline: "7 roller coasters.",
        sub: "Inside a mall.",
        stat: "12M+",
        statLabel: "Rides taken yearly",
        body: "Nickelodeon Universe — the largest indoor theme park in North America. Your brand sits steps away from the most visited attraction in Minnesota.",
        bg: "linear-gradient(135deg, #0a0600 0%, #1a0e00 40%, #0d0800 100%)",
        accent: "#C9A84C",
    },
    {
        id: "aquarium",
        category: "Aquarium",
        headline: "1.2 million",
        sub: "aquarium visitors yearly.",
        stat: "10K+",
        statLabel: "Sea creatures",
        body: "Sea Life Minnesota Aquarium draws families year-round — a captive, engaged audience that lingers, shops, and converts for your brand.",
        bg: "linear-gradient(135deg, #000d0f 0%, #001a1f 40%, #000a0d 100%)",
        accent: "#C9A84C",
    },
    {
        id: "dining",
        category: "Dining & Lifestyle",
        headline: "50+ restaurants.",
        sub: "Every cuisine. One destination.",
        stat: "2.8M",
        statLabel: "Dining visits per year",
        body: "From Michelin-calibre dining to fast-casual, the food ecosystem at Mall of America keeps visitors on-property longer — and spending more.",
        bg: "linear-gradient(135deg, #0a0400 0%, #140800 40%, #080300 100%)",
        accent: "#C9A84C",
    },
    {
        id: "events",
        category: "Live Events",
        headline: "300+ events",
        sub: "every single year.",
        stat: "500K+",
        statLabel: "Event attendees annually",
        body: "Concerts, celebrity appearances, product launches, conventions. The property operates like a global platform — not a shopping centre.",
        bg: "linear-gradient(135deg, #060006 0%, #0e000e 40%, #040004 100%)",
        accent: "#C9A84C",
    },
];

// ─── Footfall D3 chart data ───────────────────────────────────────────────────
const FOOTFALL_DATA = [
    { month: "Jan", retail: 2.1, entertainment: 1.8 },
    { month: "Feb", retail: 2.4, entertainment: 2.0 },
    { month: "Mar", retail: 2.8, entertainment: 2.5 },
    { month: "Apr", retail: 3.1, entertainment: 2.9 },
    { month: "May", retail: 3.6, entertainment: 3.4 },
    { month: "Jun", retail: 4.2, entertainment: 4.0 },
    { month: "Jul", retail: 4.8, entertainment: 4.6 },
    { month: "Aug", retail: 4.5, entertainment: 4.3 },
    { month: "Sep", retail: 3.2, entertainment: 3.0 },
    { month: "Oct", retail: 3.5, entertainment: 3.3 },
    { month: "Nov", retail: 4.1, entertainment: 3.8 },
    { month: "Dec", retail: 4.9, entertainment: 4.7 },
];

// ─── Mini Three.js particle ring per panel ───────────────────────────────────
function PanelParticles({ color }: { color: string }) {
    const mountRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const isVis = useRef(true);

    useEffect(() => {
        const el = mountRef.current;
        if (!el) return;

        const W = el.clientWidth;
        const H = el.clientHeight;

        const scene = new Scene();
        const camera = new PerspectiveCamera(60, W / H, 0.1, 100);
        camera.position.z = 4;

        const renderer = new WebGLRenderer({ alpha: true, antialias: false });
        renderer.setSize(W, H);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);
        el.appendChild(renderer.domElement);

        // Ring of particles
        const count = 800;
        const geo = new BufferGeometry();
        const pos = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);
        const c = new ThreeColor(color);

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const radius = 2.2 + (Math.random() - 0.5) * 1.2;
            const spread = (Math.random() - 0.5) * 0.6;
            pos[i * 3] = Math.cos(angle) * radius;
            pos[i * 3 + 1] = spread;
            pos[i * 3 + 2] = Math.sin(angle) * radius;
            cols[i * 3] = c.r + (Math.random() - 0.5) * 0.2;
            cols[i * 3 + 1] = c.g + (Math.random() - 0.5) * 0.2;
            cols[i * 3 + 2] = c.b;
        }

        geo.setAttribute("position", new BufferAttribute(pos, 3));
        geo.setAttribute("color", new BufferAttribute(cols, 3));

        const mat = new PointsMaterial({
            size: 0.018,
            vertexColors: true,
            transparent: true,
            opacity: 0.55,
        });

        const ring = new Points(geo, mat);
        scene.add(ring);

        const obs = new IntersectionObserver(
            ([e]) => { isVis.current = e.isIntersecting; },
            { threshold: 0.1 }
        );
        obs.observe(el);

        const animate = () => {
            rafRef.current = requestAnimationFrame(animate);
            if (!isVis.current) return;
            ring.rotation.y += 0.0015;
            ring.rotation.x = 0.3;
            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(rafRef.current);
            obs.disconnect();
            mat.dispose();
            geo.dispose();
            renderer.dispose();
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
        };
    }, [color]);

    return (
        <div
            ref={mountRef}
            style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                opacity: 0.45,
            }}
        />
    );
}

// ─── D3 footfall chart ────────────────────────────────────────────────────────
const FootfallChart = memo(function FootfallChart() {
    const svgRef = useRef<SVGSVGElement>(null);
    const triggered = useRef(false);

    useEffect(() => {
        if (!svgRef.current) return;

        const el = svgRef.current;
        const W = el.parentElement?.clientWidth || 600;
        const H = 220;
        const mb = 32;
        const ml = 36;
        const mr = 16;
        const mt = 16;
        const iW = W - ml - mr;
        const iH = H - mt - mb;

        const svg = d3.select(el)
            .attr("width", W)
            .attr("height", H)
            .attr("viewBox", `0 0 ${W} ${H}`);

        const x = d3.scalePoint()
            .domain(FOOTFALL_DATA.map(d => d.month))
            .range([0, iW])
            .padding(0.3);

        const y = d3.scaleLinear()
            .domain([0, 6])
            .range([iH, 0]);

        const g = svg.append("g").attr("transform", `translate(${ml},${mt})`);

        // Gridlines
        y.ticks(4).forEach(tick => {
            g.append("line")
                .attr("x1", 0).attr("x2", iW)
                .attr("y1", y(tick)).attr("y2", y(tick))
                .attr("stroke", "rgba(255,255,255,0.06)")
                .attr("stroke-width", 1);
        });

        // X axis labels
        FOOTFALL_DATA.forEach(d => {
            g.append("text")
                .attr("x", x(d.month) ?? 0)
                .attr("y", iH + 18)
                .attr("text-anchor", "middle")
                .attr("font-size", "9px")
                .attr("font-family", "var(--font-montserrat)")
                .attr("font-weight", "600")
                .attr("fill", "rgba(255,255,255,0.28)")
                .attr("letter-spacing", "0.06em")
                .text(d.month.toUpperCase());
        });

        // Y axis labels
        y.ticks(4).forEach(tick => {
            g.append("text")
                .attr("x", -8)
                .attr("y", y(tick) + 4)
                .attr("text-anchor", "end")
                .attr("font-size", "9px")
                .attr("font-family", "var(--font-montserrat)")
                .attr("fill", "rgba(255,255,255,0.22)")
                .text(tick + "M");
        });

        // Area + line generators
        const areaGen = d3.area<(typeof FOOTFALL_DATA)[0]>()
            .x(d => x(d.month) ?? 0)
            .y0(iH)
            .y1(d => y(d.retail))
            .curve(d3.curveCatmullRom);

        const lineGen = d3.line<(typeof FOOTFALL_DATA)[0]>()
            .x(d => x(d.month) ?? 0)
            .y(d => y(d.retail))
            .curve(d3.curveCatmullRom);

        const lineGen2 = d3.line<(typeof FOOTFALL_DATA)[0]>()
            .x(d => x(d.month) ?? 0)
            .y(d => y(d.entertainment))
            .curve(d3.curveCatmullRom);

        // Gradient fill
        const defs = svg.append("defs");
        const grad = defs.append("linearGradient")
            .attr("id", "ent-area-grad")
            .attr("x1", "0%").attr("y1", "0%")
            .attr("x2", "0%").attr("y2", "100%");
        grad.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", "#C9A84C")
            .attr("stop-opacity", "0.18");
        grad.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", "#C9A84C")
            .attr("stop-opacity", "0.0");

        // Area fill
        g.append("path")
            .datum(FOOTFALL_DATA)
            .attr("d", areaGen)
            .attr("fill", "url(#ent-area-grad)");

        // Retail line (gold)
        const retailPath = g.append("path")
            .datum(FOOTFALL_DATA)
            .attr("d", lineGen)
            .attr("fill", "none")
            .attr("stroke", "#C9A84C")
            .attr("stroke-width", "2")
            .attr("stroke-linecap", "round");

        // Entertainment line (dim gold)
        const entPath = g.append("path")
            .datum(FOOTFALL_DATA)
            .attr("d", lineGen2)
            .attr("fill", "none")
            .attr("stroke", "rgba(201,168,76,0.4)")
            .attr("stroke-width", "1.5")
            .attr("stroke-dasharray", "4 3")
            .attr("stroke-linecap", "round");

        // Animate lines on scroll
        const animateLine = (path: d3.Selection<SVGPathElement, unknown, null, undefined>) => {
            const len = (path.node() as SVGPathElement).getTotalLength();
            path
                .attr("stroke-dasharray", `${len} ${len}`)
                .attr("stroke-dashoffset", len);
            return len;
        };

        const rLen = animateLine(retailPath as d3.Selection<SVGPathElement, unknown, null, undefined>);
        const eLen = animateLine(entPath as d3.Selection<SVGPathElement, unknown, null, undefined>);

        // Dots on retail line
        const dots = g.selectAll(".ent-dot")
            .data(FOOTFALL_DATA)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.month) ?? 0)
            .attr("cy", d => y(d.retail))
            .attr("r", 3)
            .attr("fill", "#C9A84C")
            .attr("opacity", 0);

        // Scroll trigger
        ScrollTrigger.create({
            trigger: el,
            start: "top 85%",
            once: true,
            onEnter: () => {
                if (triggered.current) return;
                triggered.current = true;

                gsap.to(retailPath.node(), {
                    strokeDashoffset: 0,
                    duration: 1.6,
                    ease: "power2.out",
                });
                gsap.to(entPath.node(), {
                    strokeDashoffset: 0,
                    duration: 1.8,
                    ease: "power2.out",
                    delay: 0.2,
                });
                dots.each(function (_, i) {
                    gsap.to(this, {
                        opacity: 1,
                        duration: 0.3,
                        delay: 0.8 + i * 0.06,
                    });
                });
            },
        });

        return () => {
            ScrollTrigger.getAll()
                .filter(st => st.vars.trigger === el)
                .forEach(st => st.kill());
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            style={{ width: "100%", height: "auto", display: "block", overflow: "visible" }}
            aria-label="Monthly footfall — retail vs entertainment"
        />
    );
});

// ─── Single cinematic panel ───────────────────────────────────────────────────
function EntPanel({ panel, index }: { panel: typeof PANELS[0]; index: number }) {
    return (
        <div
            className={`ent-panel ent-panel-${index}`}
            style={{
                position: "relative",
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: panel.bg,
                overflow: "hidden",
            }}
        >
            {/* Three.js particle ring — desktop only */}
            <div className="ent-particles-wrap">
                <PanelParticles color={panel.accent} />
            </div>

            {/* Noise texture overlay */}
            <div style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
                backgroundSize: "200px 200px",
                pointerEvents: "none",
                opacity: 0.6,
            }} />

            {/* Content */}
            <div
                style={{
                    position: "relative",
                    zIndex: 3,
                    padding: "4rem clamp(1.5rem, 6vw, 6rem)",
                    maxWidth: "900px",
                    width: "100%",
                }}
            >
                {/* Category */}
                <p className={`ent-cat-${index}`} style={{
                    color: "#C9A84C",
                    fontSize: "0.68rem",
                    letterSpacing: "0.4em",
                    textTransform: "uppercase",
                    fontFamily: "var(--font-montserrat)",
                    fontWeight: 700,
                    margin: "0 0 1.2rem",
                    opacity: 0,
                }}>
                    {panel.category}
                </p>

                {/* Headline */}
                <h2 className={`ent-headline-${index}`} style={{
                    color: "#ffffff",
                    fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
                    fontWeight: 800,
                    fontFamily: "var(--font-montserrat)",
                    margin: "0 0 0.1rem",
                    lineHeight: 1.0,
                    opacity: 0,
                }}>
                    {panel.headline}
                </h2>
                <h2 className={`ent-sub-${index}`} style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "clamp(1.4rem, 3.5vw, 3rem)",
                    fontWeight: 800,
                    fontFamily: "var(--font-montserrat)",
                    margin: "0 0 2.5rem",
                    lineHeight: 1.1,
                    opacity: 0,
                }}>
                    {panel.sub}
                </h2>

                {/* Stat + body row */}
                <div className={`ent-body-${index}`} style={{
                    display: "flex",
                    gap: "3rem",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    opacity: 0,
                }}>
                    {/* Big stat */}
                    <div style={{
                        borderLeft: "2px solid #C9A84C",
                        paddingLeft: "1.2rem",
                        flexShrink: 0,
                    }}>
                        <div style={{
                            color: "#C9A84C",
                            fontSize: "clamp(2rem, 4vw, 3.2rem)",
                            fontWeight: 800,
                            fontFamily: "var(--font-montserrat)",
                            lineHeight: 1,
                            fontVariantNumeric: "tabular-nums",
                        }}>
                            {panel.stat}
                        </div>
                        <div style={{
                            color: "rgba(255,255,255,0.38)",
                            fontSize: "0.62rem",
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            fontFamily: "var(--font-montserrat)",
                            fontWeight: 600,
                            marginTop: "0.4rem",
                        }}>
                            {panel.statLabel}
                        </div>
                    </div>

                    {/* Body text */}
                    <p style={{
                        color: "rgba(255,255,255,0.52)",
                        fontSize: "clamp(0.82rem, 1.4vw, 1rem)",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 400,
                        lineHeight: 1.75,
                        margin: 0,
                        maxWidth: "440px",
                        paddingTop: "0.3rem",
                    }}>
                        {panel.body}
                    </p>
                </div>

                {/* Panel index */}
                <div style={{
                    position: "absolute",
                    right: "clamp(1.5rem, 6vw, 6rem)",
                    bottom: "2rem",
                    color: "rgba(201,168,76,0.18)",
                    fontSize: "clamp(4rem, 10vw, 8rem)",
                    fontWeight: 800,
                    fontFamily: "var(--font-montserrat)",
                    lineHeight: 1,
                    userSelect: "none",
                    pointerEvents: "none",
                }}>
                    0{index + 1}
                </div>
            </div>

            {/* Bottom gradient fade */}
            <div style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                height: "120px",
                background: "linear-gradient(to bottom, transparent, rgba(5,4,2,0.5))",
                zIndex: 4,
                pointerEvents: "none",
            }} />
        </div>
    );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function EntertainmentSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(window.innerWidth < 768);

        const ctx = gsap.context(() => {
            // Heading entrance
            gsap.fromTo(".ent-heading",
                { opacity: 0, y: 28 },
                {
                    opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
                    scrollTrigger: { trigger: ".ent-heading", start: "top 85%" },
                }
            );

            // Each panel animates in on scroll
            PANELS.forEach((_, i) => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: `.ent-panel-${i}`,
                        start: "top 72%",
                        once: true,
                    },
                });
                tl.to(`.ent-cat-${i}`, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
                    .to(`.ent-headline-${i}`, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3")
                    .to(`.ent-sub-${i}`, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.4")
                    .to(`.ent-body-${i}`, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.3");
            });

            // Chart heading
            gsap.fromTo(".ent-chart-head",
                { opacity: 0, y: 24 },
                {
                    opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                    scrollTrigger: { trigger: ".ent-chart-head", start: "top 85%" },
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            id="entertainment"
            ref={sectionRef}
            style={{ background: "#050402", overflow: "hidden" }}
        >
            {/* Top separator */}
            <div style={{
                height: "1px",
                background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)",
            }} />

            {/* ── Section intro heading ── */}
            <div
                className="ent-heading"
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
                    Beyond retail
                </p>
                <h2 style={{
                    color: "#ffffff",
                    fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
                    fontWeight: 800,
                    fontFamily: "var(--font-montserrat)",
                    margin: "0 0 1rem",
                    lineHeight: 1.1,
                }}>
                    Entertainment that<br />
                    <span style={{ color: "#C9A84C" }}>drives your revenue</span>
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
                    Every attraction brings millions more visitors to your doorstep.
                    This isn&apos;t a mall — it&apos;s a destination.
                </p>
            </div>

            {/* ── Cinematic panels ── */}
            <div style={{ display: "flex", flexDirection: "column" }}>
                {PANELS.map((panel, i) => (
                    <EntPanel key={panel.id} panel={panel} index={i} />
                ))}
            </div>

            {/* ── Footfall chart section ── */}
            <div style={{
                padding: "6rem clamp(1.5rem, 6vw, 6rem)",
                maxWidth: "900px",
                margin: "0 auto",
            }}>
                <div className="ent-chart-head" style={{ marginBottom: "2.5rem" }}>
                    <p style={{
                        color: "#C9A84C",
                        fontSize: "0.68rem",
                        letterSpacing: "0.35em",
                        textTransform: "uppercase",
                        fontFamily: "var(--font-montserrat)",
                        fontWeight: 700,
                        margin: "0 0 0.7rem",
                    }}>
                        Footfall data
                    </p>
                    <h3 style={{
                        color: "#ffffff",
                        fontSize: "clamp(1.2rem, 2.5vw, 1.9rem)",
                        fontWeight: 800,
                        fontFamily: "var(--font-montserrat)",
                        margin: "0 0 0.5rem",
                        lineHeight: 1.15,
                    }}>
                        Entertainment visits<br />
                        <span style={{ color: "#C9A84C" }}>directly lift retail footfall</span>
                    </h3>
                    <p style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-montserrat)",
                        margin: 0,
                        lineHeight: 1.6,
                    }}>
                        Monthly visitor data (millions) — retail vs entertainment correlation
                    </p>
                </div>

                {/* Chart */}
                <FootfallChart />

                {/* Legend */}
                <div style={{
                    display: "flex",
                    gap: "2rem",
                    marginTop: "1.2rem",
                    flexWrap: "wrap",
                }}>
                    {[
                        { color: "#C9A84C", dash: false, label: "Retail footfall" },
                        { color: "rgba(201,168,76,0.5)", dash: true, label: "Entertainment footfall" },
                    ].map(l => (
                        <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <svg width="24" height="10">
                                <line
                                    x1="0" y1="5" x2="24" y2="5"
                                    stroke={l.color}
                                    strokeWidth="2"
                                    strokeDasharray={l.dash ? "4 3" : undefined}
                                />
                            </svg>
                            <span style={{
                                color: "rgba(255,255,255,0.38)",
                                fontSize: "0.62rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                fontFamily: "var(--font-montserrat)",
                                fontWeight: 600,
                            }}>
                                {l.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom divider */}
            <div style={{
                height: "1px",
                background: "linear-gradient(to right, transparent, rgba(201,168,76,0.15), transparent)",
            }} />

            {/* Responsive */}
            <style>{`
        .ent-particles-wrap {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
        }
        @media (max-width: 767px) {
          .ent-particles-wrap { display: none; }
        }
      `}</style>
        </section>
    );
}