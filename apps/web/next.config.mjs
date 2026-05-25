/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@mezo-org/orangekit-contracts'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.externals.push('@react-native-async-storage/async-storage');
    return config;
  },
};

export default nextConfig;
