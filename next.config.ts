import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "cdn.cloudflare.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "cdn.dota2.com",
      },
      {
        protocol: "https",
        hostname: "api.opendota.com",
      },
      {
        protocol: "https",
        hostname: "cdn.steamusercontent.com",
      },
      {
        protocol: "https",
        hostname: "steamusercontent-a.akamaihd.net",
      },
      {
        protocol: "https",
        hostname: "steamcdn-a.akamaihd.net",
      },
      {
        protocol: "https",
        hostname: "*.steamusercontent.com",
      },
      {
        protocol: "https",
        hostname: "*.akamaihd.net",
      },
      {
        protocol: "https",
        hostname: "*.steamstatic.com",
      },
    ],
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
