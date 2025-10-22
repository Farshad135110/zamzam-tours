import Link from 'next/link'
import { useI18n } from '../src/i18n/I18nContext'

export default function Navbar(){
  const { locale, setLocale, t } = useI18n()
  return (
    <nav className="bg-white shadow">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl">
            ZamZam Tours
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/tours" className="text-sm">{t('nav.tours')}</Link>
          <Link href="/fleet" className="text-sm">{t('nav.fleet')}</Link>
          <select className="border rounded p-1" value={locale} onChange={(e:any)=>setLocale(e.target.value)}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>
    </nav>
  )
}
