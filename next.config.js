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
}
module.exports = nextConfig
