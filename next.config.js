/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['kteobfyferrukqeolofj.supabase.co'],
  },
  // Exclude Supabase Edge Functions from Next.js build
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.tsx?$/,
      exclude: /supabase[\\/]functions/,
    })
    return config
  },
}

module.exports = nextConfig
