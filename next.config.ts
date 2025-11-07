import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap', // Route to our Next.js route handler which proxies with proper headers
      },
    ];
  },
};

export default nextConfig;
