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
          {/* Favicons (prefer local SVG to avoid external requests) */}
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
          <link rel="icon" type="image/png" sizes="16x16" href={favicon16} />
          <link rel="apple-touch-icon" href={appleIcon} />
          <meta name="theme-color" content="#053b3c" />

          {/* Social preview / search engines */}
          <meta property="og:site_name" content={SITE_INFO.name} />
          <meta property="og:title" content={SITE_INFO.name} />
          <meta property="og:description" content={SITE_INFO.description} />
          <meta property="og:image" content={ogImage} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:image" content={ogImage} />

          {/* Prevent robots from using stale crawl cache for the favicon */}
          <meta name="robots" content="index,follow" />
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
