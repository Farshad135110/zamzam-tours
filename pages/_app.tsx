import '../styles/globals.css'
import '../styles/home.css'
import type { AppProps } from 'next/app'
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
      <Component {...pageProps} />
    </I18nProvider>
  )
}
