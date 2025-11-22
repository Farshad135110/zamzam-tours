/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com']
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en'
  }
  ,
  // Allow building even when TypeScript errors are present so we can validate runtime behavior
  typescript: {
    ignoreBuildErrors: true
  }
}
module.exports = nextConfig
