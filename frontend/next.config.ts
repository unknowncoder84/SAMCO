import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Disable experimental features that might cause issues
  experimental: {
    turbo: undefined, // Disable Turbopack, use webpack
  },
};

export default nextConfig;
