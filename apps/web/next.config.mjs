/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mezo-org/orangekit-contracts'],
  serverExternalPackages: ['@react-native-async-storage/async-storage'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
};

export default nextConfig;
