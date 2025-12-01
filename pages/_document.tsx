import Document, { Html, Head, Main, NextScript } from 'next/document'
import { SITE_INFO } from '../src/constants/config'

class MyDocument extends Document {
  render() {
    // Use Cloudinary-transformed variants for favicons and social previews
    const base = SITE_INFO.logo
    const favicon32 = base.replace('/image/upload/', '/image/upload/w_32,h_32,c_fill/')
    const favicon16 = base.replace('/image/upload/', '/image/upload/w_16,h_16,c_fill/')
    const appleIcon = base.replace('/image/upload/', '/image/upload/w_180,h_180,c_fill/')
    const ogImage = base.replace('/image/upload/', '/image/upload/w_1200,h_630,c_fill/')

    return (
      <Html lang="en">
        <Head>
          {/* Performance - DNS Prefetch */}
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
          
          {/* PWA Manifest */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* Favicons (prefer local SVG to avoid external requests) */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
          <link rel="apple-touch-icon" href={appleIcon} />
          <meta name="theme-color" content="#053b3c" />
          <meta name="msapplication-TileColor" content="#053b3c" />

          {/* SEO Meta Tags */}
          <meta name="description" content={SITE_INFO.description} />
          <meta name="keywords" content="Sri Lanka tours, Zamzam Lanka Tours, car rental Sri Lanka, airport transfer, Sri Lanka travel, tourism Sri Lanka, tour packages, vehicle rental" />
          <meta name="author" content={SITE_INFO.name} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={SITE_INFO.name} />
          <meta property="og:title" content={SITE_INFO.name} />
          <meta property="og:description" content={SITE_INFO.description} />
          <meta property="og:image" content={ogImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:locale" content="en_US" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={SITE_INFO.name} />
          <meta name="twitter:description" content={SITE_INFO.description} />
          <meta name="twitter:image" content={ogImage} />

          {/* Search Engine Crawling */}
          <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
          <meta name="googlebot" content="index,follow" />
          
          {/* Mobile Web App */}
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content={SITE_INFO.name} />
          
          {/* Canonical URL */}
          <link rel="canonical" href="https://zamzamlankatours.com" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
