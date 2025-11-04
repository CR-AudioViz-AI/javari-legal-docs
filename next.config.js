/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: {
      enabled: true,
    },
  },
  images: {
    domains: ['kteobfyferrukqeolofj.supabase.co'],
  },
}

module.exports = nextConfig
