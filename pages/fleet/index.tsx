import Head from 'next/head'
import { useI18n } from '../../src/i18n/I18nContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { CONTACT_INFO } from '../../src/constants/config'

const vehicles = [
  'Bus', 'KDH', 'Tour Van', 'WagonR', 'Shuttle', 'Every Buddy Van', 'Aqua', 'Prius'
]

export default function Fleet() {
  const { t } = useI18n()
  return (
    <>
      <Head>
        <title>{t('fleet.title')} - Zamzam Lanka Tours</title>
      </Head>
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-12" style={{ marginTop: '80px' }}>
        <h1 className="text-3xl font-bold mb-6">{t('fleet.heading')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {vehicles.map(v => (
            <div key={v} className="border rounded p-4 shadow-sm">
              <img src="/placeholder.jpg" alt={v} className="w-full h-40 object-cover rounded mb-3" />
              <h3 className="font-semibold">{v}</h3>
              <p className="text-sm text-gray-600 mt-2">{t('fleet.contactForPrice')}</p>
              <a className="inline-block mt-3 text-emerald-600" href={`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent('Hello, I am interested in renting a '+v)}`} target="_blank" rel="noreferrer">{t('fleet.contactWhatsApp')}</a>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  )
}
