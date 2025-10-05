/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
    // Add your production API domain here when you have it
    // domains: ['localhost', 'your-api-domain.com'],
  },
  // Optimize for production
  compress: true,
  // Handle trailing slashes
  trailingSlash: false,
  // Environment variables validation
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
}

module.exports = nextConfig
