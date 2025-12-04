import Document, { Html, Head, Main, NextScript } from 'next/document'
import { SITE_INFO } from '../src/constants/config'

class MyDocument extends Document {
  render() {
    // Use Cloudinary-transformed variants for favicons and social previews
    // Use local Zamzam logo for favicons and social preview
    const favicon32 = '/favicon.svg';
    const favicon16 = '/favicon.svg';
    const appleIcon = '/logo.svg';
    const ogImage = '/logo.svg';

    return (
      <Html lang="en">
        <Head>
          {/* Performance - DNS Prefetch */}
          <link rel="dns-prefetch" href="https://res.cloudinary.com" />
          <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
          
          {/* PWA Manifest */}
          <link rel="manifest" href="/manifest.json" />
          
          {/* Favicons and social preview - Zamzam logo only */}
          <link rel="icon" href={favicon32} type="image/svg+xml" />
          <link rel="icon" type="image/png" sizes="32x32" href={favicon32} />
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
