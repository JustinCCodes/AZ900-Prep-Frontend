import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    cacheComponents: true,
    cacheHandlers: {},
  },
};

export default nextConfig;
