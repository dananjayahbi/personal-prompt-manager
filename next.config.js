/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  output: 'standalone',
  // Set custom port configuration
  async rewrites() {
    return []
  }
}

module.exports = nextConfig
