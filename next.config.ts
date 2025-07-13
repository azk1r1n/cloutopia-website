import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    typedRoutes: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude conflicting directories
  webpack: (config: any) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: [
        '**/alpine-theme/**',
        '**/backend/**', 
        '**/src/nuxt-app/**',
        '**/node_modules/**'
      ]
    };
    return config;
  }
};

export default nextConfig;
