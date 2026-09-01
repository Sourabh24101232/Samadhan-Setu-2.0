// ==========================================
// FRONTEND - NEXT.JS CONFIGURATION BLUEPRINT
// File: Frontend/next.config.js
// ==========================================

/*
  PURPOSE:
  - Next.js application configuration (image remote patterns, environment settings).

  CONFIGURATIONS TO DEFINE LATER:
  - images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'res.cloudinary.com' },
        { protocol: 'https', hostname: 'images.unsplash.com' }
      ]
    }
  - reactStrictMode: true
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' }
    ],
  },
};

module.exports = nextConfig;
