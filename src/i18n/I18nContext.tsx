import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const locales = ['en', 'de'] as const

type Locale = typeof locales[number]

const translations: Record<Locale, Record<string, string>> = {
  en: require('../../locales/en.json'),
  de: require('../../locales/de.json')
}

const I18nContext = createContext<any>(null)

export function I18nProvider({ children }:{children: React.ReactNode}){
  const router = useRouter()
  const routerLocale = (router && router.locale) as Locale | undefined

  const [locale, setLocaleState] = useState<Locale>((routerLocale as Locale) || 'en')

  // keep locale in sync with router.locale
  useEffect(() => {
    if (routerLocale && routerLocale !== locale) {
      setLocaleState(routerLocale)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routerLocale])

  useEffect(()=>{
    // NOTE: intentionally DO NOT auto-switch locale based on browser language here.
    // Auto-detecting and changing locale on first client render can cause
    // React hydration mismatches when the server-rendered locale differs.
    // Locale should be controlled by Next.js router (i.e. URL /de) or by an
    // explicit user action (language selector). If you want client auto-detect,
    // implement it server-side or persist the choice to avoid hydration errors.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const t = (key: string) => {
    return translations[locale] && translations[locale][key]
      ? translations[locale][key]
      : translations['en'][key] || key
  }

  // wrapper to change locale and update Next.js router locale
  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return
    setLocaleState(newLocale)
    try {
      // preserve current path and query while switching locale
      router.push(router.pathname, router.asPath, { locale: newLocale })
    } catch (e) {
      // ignore router errors on initial render
      // console.warn('locale switch failed', e)
    }
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, __translations: translations }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(){
  const ctx = useContext(I18nContext)
  if(!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}

export default I18nContext
