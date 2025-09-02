/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  // Removed 'standalone' output to work with 'next start'
  // Use 'output: standalone' only for containerized deployments
  async rewrites() {
    return []
  }
}

module.exports = nextConfig
