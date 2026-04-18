"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Three action paths ───────────────────────────────────────────────────────
const PATHS = [
  {
    number:  "01",
    title:   "Lease a Space",
    sub:     "Find your flagship location",
    body:    "520+ stores. Room for one more iconic brand. From luxury flagships to pop-up concepts — find the space that fits your ambition.",
    interest:"Retail Leasing",
    arrow:   "→",
  },
  {
    number:  "02",
    title:   "Host an Event",
    sub:     "Book your brand moment",
    body:    "300+ events a year. 40 million witnesses. Whether it's a product launch or a global convention — this is the stage.",
    interest:"Event Booking",
    arrow:   "→",
  },
  {
    number:  "03",
    title:   "Become a Sponsor",
    sub:     "Own your audience",
    body:    "No platform delivers more impressions. Platinum, Gold, or Partner — own a zone, own a moment, own a conversation.",
    interest:"Sponsorship",
    arrow:   "→",
  },
];

// ─── Form field component ─────────────────────────────────────────────────────
function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}: {
  label:       string;
  type?:       string;
  placeholder: string;
  value:       string;
  onChange:    (v: string) => void;
  required?:   boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label style={{
        color:         focused ? "#C9A84C" : "rgba(255,255,255,0.35)",
        fontSize:      "0.6rem",
        fontWeight:    700,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        fontFamily:    "var(--font-montserrat)",
        transition:    "color 0.2s ease",
      }}>
        {label}{required && <span style={{ color: "#C9A84C", marginLeft: "3px" }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        required={required}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background:   "rgba(255,255,255,0.03)",
          border:       `1px solid ${focused ? "#C9A84C" : "rgba(201,168,76,0.15)"}`,
          color:        "#ffffff",
          fontSize:     "0.82rem",
          fontFamily:   "var(--font-montserrat)",
          fontWeight:   400,
          padding:      "12px 14px",
          outline:      "none",
          transition:   "border-color 0.22s ease",
          width:        "100%",
          boxSizing:    "border-box",
        }}
        onMouseEnter={e => {
          if (!focused)
            (e.target as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.35)";
        }}
        onMouseLeave={e => {
          if (!focused)
            (e.target as HTMLInputElement).style.borderColor = "rgba(201,168,76,0.15)";
        }}
      />
    </div>
  );
}

// ─── Select field ─────────────────────────────────────────────────────────────
function FormSelect({
  label,
  value,
  onChange,
}: {
  label:    string;
  value:    string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label style={{
        color:         focused ? "#C9A84C" : "rgba(255,255,255,0.35)",
        fontSize:      "0.6rem",
        fontWeight:    700,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        fontFamily:    "var(--font-montserrat)",
        transition:    "color 0.2s ease",
      }}>
        {label} <span style={{ color: "#C9A84C" }}>*</span>
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background:   "rgba(5,4,2,0.98)",
          border:       `1px solid ${focused ? "#C9A84C" : "rgba(201,168,76,0.15)"}`,
          color:        value ? "#ffffff" : "rgba(255,255,255,0.3)",
          fontSize:     "0.82rem",
          fontFamily:   "var(--font-montserrat)",
          fontWeight:   400,
          padding:      "12px 14px",
          outline:      "none",
          transition:   "border-color 0.22s ease",
          width:        "100%",
          cursor:       "pointer",
          appearance:   "none",
          WebkitAppearance: "none",
        }}
      >
        <option value="" disabled>Select your interest</option>
        <option value="Retail Leasing">Retail Leasing</option>
        <option value="Event Booking">Event Booking</option>
        <option value="Sponsorship">Sponsorship — Platinum</option>
        <option value="Sponsorship Gold">Sponsorship — Gold</option>
        <option value="Sponsorship Partner">Sponsorship — Partner</option>
        <option value="General">General Enquiry</option>
      </select>
    </div>
  );
}

// ─── Textarea field ───────────────────────────────────────────────────────────
function FormTextarea({
  label,
  placeholder,
  value,
  onChange,
}: {
  label:       string;
  placeholder: string;
  value:       string;
  onChange:    (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <label style={{
        color:         focused ? "#C9A84C" : "rgba(255,255,255,0.35)",
        fontSize:      "0.6rem",
        fontWeight:    700,
        letterSpacing: "0.28em",
        textTransform: "uppercase",
        fontFamily:    "var(--font-montserrat)",
        transition:    "color 0.2s ease",
      }}>
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        rows={4}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          background:  "rgba(255,255,255,0.03)",
          border:      `1px solid ${focused ? "#C9A84C" : "rgba(201,168,76,0.15)"}`,
          color:       "#ffffff",
          fontSize:    "0.82rem",
          fontFamily:  "var(--font-montserrat)",
          fontWeight:  400,
          padding:     "12px 14px",
          outline:     "none",
          transition:  "border-color 0.22s ease",
          width:       "100%",
          boxSizing:   "border-box",
          resize:      "vertical",
          minHeight:   "100px",
        }}
        onMouseEnter={e => {
          if (!focused)
            (e.target as HTMLTextAreaElement).style.borderColor = "rgba(201,168,76,0.35)";
        }}
        onMouseLeave={e => {
          if (!focused)
            (e.target as HTMLTextAreaElement).style.borderColor = "rgba(201,168,76,0.15)";
        }}
      />
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const [form, setForm] = useState({
    name:     "",
    company:  "",
    email:    "",
    interest: "",
    message:  "",
  });

  const update = useCallback(
    (key: keyof typeof form) => (val: string) =>
      setForm(p => ({ ...p, [key]: val })),
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.interest) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1400);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".cta-heading",
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: ".cta-heading", start: "top 85%" },
        }
      );
      gsap.fromTo(".cta-path-card",
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.75, ease: "power2.out", stagger: 0.14,
          scrollTrigger: { trigger: ".cta-paths-grid", start: "top 82%" },
        }
      );
      gsap.fromTo(".cta-form-wrap",
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power2.out",
          scrollTrigger: { trigger: ".cta-form-wrap", start: "top 82%" },
        }
      );
      gsap.fromTo(".cta-watermark",
        { opacity: 0 },
        {
          opacity: 1, duration: 1.4, ease: "power2.out",
          scrollTrigger: { trigger: ".cta-watermark", start: "top 90%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="cta"
      ref={sectionRef}
      style={{
        background: "#050402",
        overflow:   "hidden",
        position:   "relative",
      }}
    >
      {/* Top separator */}
      <div style={{
        height:     "1px",
        background: "linear-gradient(to right, transparent, rgba(201,168,76,0.2), transparent)",
      }} />

      {/* Radial glow background */}
      <div style={{
        position:      "absolute",
        top:           "20%",
        left:          "50%",
        transform:     "translateX(-50%)",
        width:         "800px",
        height:        "800px",
        borderRadius:  "50%",
        background:    "radial-gradient(circle, rgba(201,168,76,0.055) 0%, transparent 68%)",
        pointerEvents: "none",
        zIndex:        0,
      }} />

      {/* ── Section heading ── */}
      <div
        className="cta-heading"
        style={{ textAlign: "center", padding: "5rem 1.5rem 4rem", position: "relative", zIndex: 1 }}
      >
        <p style={{
          color: "#C9A84C", fontSize: "0.7rem", letterSpacing: "0.4em",
          textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
          fontWeight: 600, margin: "0 0 0.8rem",
        }}>
          You&apos;ve seen it all
        </p>
        <h2 style={{
          color: "#ffffff", fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
          fontWeight: 800, fontFamily: "var(--font-montserrat)",
          margin: "0 0 1rem", lineHeight: 1.1,
        }}>
          Now make<br />
          <span style={{ color: "#C9A84C" }}>your move.</span>
        </h2>
        <p style={{
          color: "rgba(255,255,255,0.38)", fontSize: "0.82rem",
          fontFamily: "var(--font-montserrat)", fontWeight: 400,
          margin: "0 auto", maxWidth: "400px", lineHeight: 1.7,
        }}>
          40 million visitors a year. 520+ brands. The most visited mall
          in America. Your place is waiting.
        </p>
      </div>

      {/* ── Three action paths ── */}
      <div
        style={{
          padding:  "0 clamp(1.2rem, 4vw, 4rem) 5rem",
          position: "relative",
          zIndex:   1,
        }}
      >
        <div className="cta-paths-grid">
          {PATHS.map((path, i) => (
            <div
              key={path.number}
              className="cta-path-card"
              style={{
                background:    "rgba(255,255,255,0.02)",
                border:        "1px solid rgba(201,168,76,0.12)",
                padding:       "2.2rem 1.8rem",
                display:       "flex",
                flexDirection: "column",
                gap:           "1rem",
                cursor:        "default",
                transition:    "border-color 0.25s ease, background 0.25s ease",
                position:      "relative",
                overflow:      "hidden",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.42)";
                e.currentTarget.style.background  = "rgba(201,168,76,0.04)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "rgba(201,168,76,0.12)";
                e.currentTarget.style.background  = "rgba(255,255,255,0.02)";
              }}
              onClick={() =>
                document.querySelector(".cta-form-wrap")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              {/* Large number watermark */}
              <div style={{
                position:      "absolute",
                right:         "1rem",
                top:           "1rem",
                color:         "rgba(201,168,76,0.06)",
                fontSize:      "5.5rem",
                fontWeight:    800,
                fontFamily:    "var(--font-montserrat)",
                lineHeight:    1,
                userSelect:    "none",
                pointerEvents: "none",
              }}>
                {path.number}
              </div>

              {/* Number */}
              <div style={{
                color:         "#C9A84C",
                fontSize:      "0.62rem",
                fontWeight:    700,
                letterSpacing: "0.3em",
                fontFamily:    "var(--font-montserrat)",
                opacity:       0.65,
              }}>
                {path.number}
              </div>

              {/* Title */}
              <h3 style={{
                color:      "#ffffff",
                fontSize:   "clamp(1.1rem, 1.8vw, 1.35rem)",
                fontWeight: 800,
                fontFamily: "var(--font-montserrat)",
                margin:     0,
                lineHeight: 1.2,
              }}>
                {path.title}
              </h3>

              {/* Sub */}
              <p style={{
                color:         "#C9A84C",
                fontSize:      "0.68rem",
                fontFamily:    "var(--font-montserrat)",
                fontWeight:    600,
                letterSpacing: "0.08em",
                margin:        0,
                opacity:       0.75,
              }}>
                {path.sub}
              </p>

              {/* Body */}
              <p style={{
                color:      "rgba(255,255,255,0.45)",
                fontSize:   "0.76rem",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 400,
                lineHeight: 1.7,
                margin:     0,
                flexGrow:   1,
              }}>
                {path.body}
              </p>

              {/* Arrow CTA */}
              <div style={{
                display:     "flex",
                alignItems:  "center",
                gap:         "0.6rem",
                paddingTop:  "1rem",
                borderTop:   "1px solid rgba(255,255,255,0.06)",
                color:       "#C9A84C",
                fontSize:    "0.65rem",
                fontWeight:  700,
                letterSpacing:"0.2em",
                textTransform:"uppercase",
                fontFamily:  "var(--font-montserrat)",
                cursor:      "pointer",
              }}>
                Get Started
                <span style={{ fontSize: "0.9rem", marginTop: "1px" }}>{path.arrow}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Contact form ── */}
      <div
        className="cta-form-wrap"
        style={{
          padding:   "0 clamp(1.2rem, 4vw, 4rem) 5rem",
          position:  "relative",
          zIndex:    1,
          maxWidth:  "760px",
          margin:    "0 auto",
        }}
      >
        {/* Form heading */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            color: "#C9A84C", fontSize: "0.68rem", letterSpacing: "0.35em",
            textTransform: "uppercase", fontFamily: "var(--font-montserrat)",
            fontWeight: 700, margin: "0 0 0.6rem",
          }}>
            Start the conversation
          </p>
          <h3 style={{
            color: "#ffffff", fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)",
            fontWeight: 800, fontFamily: "var(--font-montserrat)",
            margin: "0 0 0.4rem", lineHeight: 1.15,
          }}>
            Tell us about your brand.<br />
            <span style={{ color: "#C9A84C" }}>We&apos;ll find your place.</span>
          </h3>
        </div>

        {/* Form or success */}
        {submitted ? (
          <div style={{
            border:        "1px solid rgba(201,168,76,0.3)",
            background:    "rgba(201,168,76,0.05)",
            padding:       "3rem 2rem",
            textAlign:     "center",
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            gap:           "1rem",
          }}>
            <div style={{
              width:      "1px",
              height:     "40px",
              background: "linear-gradient(to bottom, transparent, #C9A84C)",
            }} />
            <h3 style={{
              color:      "#C9A84C",
              fontSize:   "clamp(1.2rem, 2vw, 1.6rem)",
              fontWeight: 800,
              fontFamily: "var(--font-montserrat)",
              margin:     0,
            }}>
              Message received.
            </h3>
            <p style={{
              color:      "rgba(255,255,255,0.45)",
              fontSize:   "0.82rem",
              fontFamily: "var(--font-montserrat)",
              fontWeight: 400,
              margin:     0,
              lineHeight: 1.6,
              maxWidth:   "340px",
            }}>
              Our commercial team will be in touch within 24 hours.
              Welcome to the conversation.
            </p>
            <div style={{
              width:      "1px",
              height:     "40px",
              background: "linear-gradient(to bottom, #C9A84C, transparent)",
            }} />
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}
          >
            {/* Row 1 */}
            <div className="form-row">
              <FormField
                label="Full name" placeholder="Your name"
                value={form.name} onChange={update("name")} required
              />
              <FormField
                label="Company" placeholder="Your brand or company"
                value={form.company} onChange={update("company")}
              />
            </div>

            {/* Row 2 */}
            <div className="form-row">
              <FormField
                label="Email address" type="email" placeholder="you@company.com"
                value={form.email} onChange={update("email")} required
              />
              <FormSelect
                label="I'm interested in"
                value={form.interest} onChange={update("interest")}
              />
            </div>

            {/* Message */}
            <FormTextarea
              label="Tell us more (optional)"
              placeholder="Share any details about your brand, goals, or timeline..."
              value={form.message} onChange={update("message")}
            />

            {/* Submit */}
            <div style={{
              display:        "flex",
              alignItems:     "center",
              justifyContent: "space-between",
              flexWrap:       "wrap",
              gap:            "1rem",
              paddingTop:     "0.5rem",
            }}>
              <p style={{
                color:      "rgba(255,255,255,0.2)",
                fontSize:   "0.62rem",
                fontFamily: "var(--font-montserrat)",
                fontWeight: 400,
                margin:     0,
                lineHeight: 1.5,
                maxWidth:   "260px",
              }}>
                Our commercial team responds within 24 hours.
                All enquiries are treated with full confidentiality.
              </p>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background:    loading ? "rgba(201,168,76,0.4)" : "#C9A84C",
                  border:        "1px solid #C9A84C",
                  color:         "#000000",
                  fontSize:      "0.68rem",
                  fontWeight:    800,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontFamily:    "var(--font-montserrat)",
                  padding:       "14px 36px",
                  cursor:        loading ? "not-allowed" : "pointer",
                  transition:    "background 0.22s, opacity 0.22s",
                  opacity:       loading ? 0.7 : 1,
                  whiteSpace:    "nowrap",
                }}
                onMouseEnter={e => {
                  if (!loading) (e.currentTarget).style.background = "#E8C97A";
                }}
                onMouseLeave={e => {
                  if (!loading) (e.currentTarget).style.background = "#C9A84C";
                }}
              >
                {loading ? "Sending…" : "Send Enquiry →"}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* ── Watermark logo finale ── */}
      <div
        className="cta-watermark"
        style={{
          position:       "relative",
          zIndex:         1,
          textAlign:      "center",
          padding:        "3rem 1.5rem 5rem",
          display:        "flex",
          flexDirection:  "column",
          alignItems:     "center",
          gap:            "1.5rem",
          borderTop:      "1px solid rgba(201,168,76,0.08)",
        }}
      >
        {/* Huge faint watermark text */}
        <div style={{
          position:      "absolute",
          top:           "50%",
          left:          "50%",
          transform:     "translate(-50%, -50%)",
          color:         "rgba(201,168,76,0.03)",
          fontSize:      "clamp(4rem, 14vw, 10rem)",
          fontWeight:    800,
          fontFamily:    "var(--font-montserrat)",
          letterSpacing: "0.05em",
          userSelect:    "none",
          pointerEvents: "none",
          whiteSpace:    "nowrap",
          lineHeight:    1,
        }}>
          MALL OF AMERICA
        </div>

        {/* Small gold mark */}
        <svg viewBox="0 0 44 44" width="36" height="36" aria-hidden="true" style={{ opacity: 0.55 }}>
          <defs>
            <linearGradient id="cta-g1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#F0D988" />
              <stop offset="50%"  stopColor="#C9A84C" />
              <stop offset="100%" stopColor="#8A6820" />
            </linearGradient>
          </defs>
          <circle cx="22" cy="22" r="14" fill="none" stroke="url(#cta-g1)" strokeWidth="1" opacity="0.6" />
          <polygon points="22,14 30,22 22,30 14,22" fill="none" stroke="url(#cta-g1)" strokeWidth="1.3" opacity="0.9" />
          <polygon points="22,17 27,22 22,27 17,22" fill="url(#cta-g1)" />
          <circle cx="22" cy="22" r="1.8" fill="#050402" opacity="0.6" />
        </svg>

        {/* Wordmark */}
        <div style={{ textAlign: "center" }}>
          <p style={{
            color:         "#C9A84C",
            fontSize:      "0.75rem",
            fontWeight:    800,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            margin:        "0 0 0.15rem",
            lineHeight:    1,
          }}>
            Mall of America
          </p>
          <p style={{
            color:         "rgba(255,255,255,0.18)",
            fontSize:      "0.5rem",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontFamily:    "var(--font-montserrat)",
            fontWeight:    500,
            margin:        0,
          }}>
            Bloomington · Minnesota
          </p>
        </div>

        {/* Legal line */}
        <p style={{
          color:         "rgba(255,255,255,0.12)",
          fontSize:      "0.55rem",
          fontFamily:    "var(--font-montserrat)",
          fontWeight:    400,
          margin:        0,
          letterSpacing: "0.06em",
          textAlign:     "center",
        }}>
          © {new Date().getFullYear()} Mall of America · All commercial enquiries treated in strict confidence
        </p>
      </div>

      {/* Responsive */}
      <style>{`
        .cta-paths-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1px;
          background: rgba(201,168,76,0.07);
          border: 1px solid rgba(201,168,76,0.07);
        }
        @media (min-width: 640px) {
          .cta-paths-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.4rem;
        }
        @media (min-width: 560px) {
          .form-row {
            grid-template-columns: 1fr 1fr;
          }
        }
        input::placeholder,
        textarea::placeholder {
          color: rgba(255,255,255,0.2);
          font-family: var(--font-montserrat);
          font-size: 0.78rem;
        }
        select option {
          background: #050402;
          color: #ffffff;
          font-family: var(--font-montserrat);
        }
      `}</style>
    </section>
  );
}