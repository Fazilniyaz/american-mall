import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Tree-shake D3 + Three.js sub-packages (clean module structure, safe to optimize).
  // Intentionally NOT including 'gsap' — its barrel-export structure doesn't
  // work well with this transform and can increase bundle size.
  experimental: {
    optimizePackageImports: ["d3-selection", "d3-shape", "three"],
  },

  // Remove console.log in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;