/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['sooty-ten.vercel.app'],
  },
  // Disable service workers if present
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
  // Ensure proper cache headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'no-store, must-revalidate',
        },
      ],
    },
  ],
};

module.exports = nextConfig;
