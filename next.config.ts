import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'samaproductionme.com',
      },
    ],
  },
};

export default nextConfig;
