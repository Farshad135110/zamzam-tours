import Head from 'next/head'
import { useI18n } from '../../src/i18n/I18nContext'

export default function Tours() {
  const { t } = useI18n()
  return (
    <>
      <Head>
        <title>{t('tours.title')} - ZamZam Tours</title>
      </Head>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-6">{t('tours.heading')}</h1>
        <p className="text-gray-600">{t('tours.comingSoon')}</p>
      </div>
    </>
  )
}
