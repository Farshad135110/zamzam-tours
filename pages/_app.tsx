import '../styles/globals.css'
import '../styles/home.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { I18nProvider } from '../src/i18n/I18nContext'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Add global error handler for all images
    const handleImageError = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img && img.tagName === 'IMG') {
        // Apply green fallback background
        img.setAttribute('data-error', 'true');
        img.style.background = '#053b3c';
        img.style.minHeight = '200px';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        
        // Also mark parent span if it's a Next.js Image wrapper
        const parent = img.parentElement;
        if (parent && parent.tagName === 'SPAN') {
          parent.setAttribute('data-error', 'true');
          parent.style.background = '#053b3c';
        }
      }
    };

    // Listen for image errors globally
    document.addEventListener('error', handleImageError, true);

    return () => {
      document.removeEventListener('error', handleImageError, true);
    };
  }, []);

  return (
    <I18nProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, user-scalable=yes" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>
      <Component {...pageProps} />
    </I18nProvider>
  )
}
