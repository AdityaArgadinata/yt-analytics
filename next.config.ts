import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'yt3.ggpht.com' },   // avatar channel
      { protocol: 'https', hostname: 'i.ytimg.com' },     // thumbnails
      { protocol: 'https', hostname: 'img.youtube.com' }, // thumbnails lama
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // kadang dipakai Google
    ],
    // atau kalau mau paling simpel tanpa optimasi:
    // unoptimized: true,
  },
  experimental: { serverActions: { bodySizeLimit: '2mb' } },
};

export default nextConfig;
