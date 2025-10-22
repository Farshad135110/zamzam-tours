import '../styles/globals.css'
import '../styles/home.css'
import type { AppProps } from 'next/app'
import { I18nProvider } from '../src/i18n/I18nContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nProvider>
      <Component {...pageProps} />
    </I18nProvider>
  )
}
