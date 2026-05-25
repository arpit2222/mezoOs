/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mezo-org/orangekit-contracts'],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
