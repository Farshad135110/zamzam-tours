import Head from 'next/head'
import BookingForm from '../components/BookingForm'
import { useI18n } from '../src/i18n/I18nContext'

export default function Home() {
  const { t } = useI18n()
  return (
    <>
      <Head>
        <title>ZamZam Tours - Explore Sri Lanka</title>
        <meta name="description" content="ZamZam Tours - Self-drive, chauffeur services, tours and airport transfers across Sri Lanka." />
      </Head>

      <section className="relative bg-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold mb-4">{t('hero.title')}</h1>
            <p className="text-lg mb-6">{t('hero.subtitle')}</p>
            <div className="flex gap-4">
              <a href="#booking" className="bg-emerald-600 text-white px-6 py-3 rounded">{t('hero.bookNow')}</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img src="/placeholder.jpg" alt="Sri Lanka" className="rounded shadow-md" />
          </div>
        </div>
      </section>

      <section id="booking" className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-2xl font-semibold mb-4">{t('booking.title')}</h2>
        <BookingForm />
      </section>
    </>
  )
}
