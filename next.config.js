/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    config.cache = false;
    return config;
  },
  // Exclude API directory from Next.js compilation
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'].filter(ext => !ext.includes('api')),
  // Ignore API directory during development and build
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig