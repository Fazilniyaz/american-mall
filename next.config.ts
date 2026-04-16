import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Tree-shake D3 sub-packages (clean module structure, safe to optimize).
  // Intentionally NOT including 'three' or 'gsap' — their barrel-export
  // structures don't work well with this transform and can increase bundle size.
  experimental: {
    optimizePackageImports: ["d3-selection", "d3-shape"],
  },

  // Remove console.log in production builds
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;