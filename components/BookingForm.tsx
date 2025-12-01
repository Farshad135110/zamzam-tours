import { useState } from 'react'
import { useI18n } from '../src/i18n/I18nContext'
import { CONTACT_INFO } from '../src/constants/config'

export default function BookingForm(){
  const { t } = useI18n()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [service, setService] = useState('Tour')
  const [details, setDetails] = useState('')

  function handleSubmit(e: React.FormEvent){
    e.preventDefault()
    const message = `Hi Zamzam Lanka Tours,%0A%0AI would like to book:%0A- Service: ${service}%0A- Name: ${name}%0A- Contact: ${phone}%0A- Details: ${details}%0A%0AThanks!`
    const url = `${CONTACT_INFO.whatsappUrl}?text=${message}`
    window.open(url, '_blank')
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium mb-2">{t('booking.form.name')}</label>
        <input 
          className="mt-1 w-full border rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          value={name} 
          onChange={(e)=>setName(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">{t('booking.form.phone')}</label>
        <input 
          type="tel"
          className="mt-1 w-full border rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          value={phone} 
          onChange={(e)=>setPhone(e.target.value)} 
          required 
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">{t('booking.form.service')}</label>
        <select 
          className="mt-1 w-full border rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          value={service} 
          onChange={(e)=>setService(e.target.value)}
        >
          <option>Tour</option>
          <option>Vehicle Rental (Self-drive)</option>
          <option>Vehicle Rental (With driver)</option>
          <option>Airport & All-Island Transfer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">{t('booking.form.details')}</label>
        <input 
          className="mt-1 w-full border rounded p-3 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500" 
          value={details} 
          onChange={(e)=>setDetails(e.target.value)} 
        />
      </div>
      <div className="md:col-span-2">
        <button 
          type="submit" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded text-base font-medium transition-colors w-full md:w-auto"
        >
          {t('booking.form.submit')}
        </button>
      </div>
    </form>
  )
}
