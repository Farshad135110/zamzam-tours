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
    const message = `Hi ZamZam Tours,%0A%0AI would like to book:%0A- Service: ${service}%0A- Name: ${name}%0A- Contact: ${phone}%0A- Details: ${details}%0A%0AThanks!`
    const url = `${CONTACT_INFO.whatsappUrl}?text=${message}`
    window.open(url, '_blank')
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <label className="block text-sm">{t('booking.form.name')}</label>
        <input className="mt-1 w-full border rounded p-2" value={name} onChange={(e)=>setName(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">{t('booking.form.phone')}</label>
        <input className="mt-1 w-full border rounded p-2" value={phone} onChange={(e)=>setPhone(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">{t('booking.form.service')}</label>
        <select className="mt-1 w-full border rounded p-2" value={service} onChange={(e)=>setService(e.target.value)}>
          <option>Tour</option>
          <option>Vehicle Rental (Self-drive)</option>
          <option>Vehicle Rental (With driver)</option>
          <option>Airport Transfer</option>
        </select>
      </div>
      <div>
        <label className="block text-sm">{t('booking.form.details')}</label>
        <input className="mt-1 w-full border rounded p-2" value={details} onChange={(e)=>setDetails(e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <button type="submit" className="bg-emerald-600 text-white px-6 py-3 rounded">{t('booking.form.submit')}</button>
      </div>
    </form>
  )
}
