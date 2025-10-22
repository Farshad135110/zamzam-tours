import React, { createContext, useContext, useEffect, useState } from 'react'

const locales = ['en', 'de'] as const

type Locale = typeof locales[number]

const translations: Record<Locale, Record<string, string>> = {
  en: require('../../locales/en.json'),
  de: require('../../locales/de.json')
}

const I18nContext = createContext<any>(null)

export function I18nProvider({ children }:{children: React.ReactNode}){
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(()=>{
    const nav = navigator.language
    if(nav && nav.startsWith('de')) setLocale('de')
  },[])

  const t = (key: string) => {
    return translations[locale][key] || translations['en'][key] || key
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
