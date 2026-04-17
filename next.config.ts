import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Tree-shake heavy sub-packages — safe for all of these because they use
  // clean named exports (no side-effect barrel files).
  experimental: {
    optimizePackageImports: [
      "d3-selection",
      "d3-shape",
      "three",
      "gsap",
    ],
  },

  // Remove console.* in production
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Optimize images - avif/webp transcoding for hero poster
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },

  // Custom headers: long-lived cache for immutable static assets + security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        // Next.js content-hashed chunks are safe forever
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;