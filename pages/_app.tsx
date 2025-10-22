import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { I18nProvider } from '../src/i18n/I18nContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </I18nProvider>
  )
}
