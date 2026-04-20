import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Tree-shake heavy sub-packages + inline CSS
  experimental: {
    inlineCss: true,
    optimizePackageImports: [
      "d3-selection",
      "d3-shape",
      "d3-scale",
      "d3-axis",
      "three",
      "gsap",
      "lodash",
    ],
  },

  // Remove console.* in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Optimize images
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  // ── Eliminate legacy JS polyfills ──────────────────────────────────────
  // Next.js/SWC still generates polyfills for Array.prototype.at,
  // Object.fromEntries, Object.hasOwn, String.prototype.trimEnd etc.
  // Turbopack resolve aliases replace these core-js polyfill modules with
  // empty modules so they're tree-shaken from the bundle.
  // These features are natively supported in Chrome 93+, Firefox 92+,
  // Safari 15.4+ — our browserslist already targets newer.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;