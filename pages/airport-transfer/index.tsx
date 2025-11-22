// Clean Airport Transfer page (single coherent component)
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import useTranslation from '../../src/i18n/useTranslation'
import { CONTACT_INFO } from '../../src/constants/config';

export default function AirportTransfer() {
  const [tripType, setTripType] = useState('one-way');
  const [passengers, setPassengers] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { if (videoRef.current) videoRef.current.play().catch(() => {}); }, []);

  const { t } = useTranslation();
  const get = (k: string, f: string) => { const v = t(k); return v === k ? f : v; };

  const airports = [
    get('airportTransfer.airports.cmb', 'Bandaranaike International Airport (CMB) - Colombo'),
    get('airportTransfer.airports.hri', 'Mattala Rajapaksa International Airport (HRI) - Hambantota')
  ];

  const districts = [get('airportTransfer.districts.colombo', 'Colombo'), get('airportTransfer.districts.kandy', 'Kandy')];

  const fleetVehicles = [
    { name: get('airportTransfer.vehicles.miniCar', 'Mini Car (2-3 passengers)'), capacity: 3 },
    { name: get('airportTransfer.vehicles.vitz', 'Toyota Vitz (Economy Car)'), capacity: 4 }
  ];

  const getAvailableVehicles = () => fleetVehicles.filter(v => v.capacity >= passengers);
  const getPickupOptions = () => tripType === 'one-way' ? airports : districts;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Booking request - Type: ${tripType}, Passengers: ${passengers}, Vehicle: ${selectedVehicle}`;
    window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <Head>
        <title>{get('airportTransfer.pageTitle', 'Airport Transfers Sri Lanka')}</title>
      </Head>

      <Navbar />

      <section className="transfer-hero">
        <video ref={videoRef} autoPlay loop muted playsInline src="https://res.cloudinary.com/dhfqwxyb4/video/upload/v1761687230/12177913_3840_2160_30fps_d6dhi5.mp4" style={{ width: '100%', height: '60vh', objectFit: 'cover' }} />
      </section>

      <section className="booking-widget-section">
        <div className="container">
          <div className="booking-widget">
            <h2>{get('airportTransfer.booking.title','Book Your Airport Transfer')}</h2>
            <form onSubmit={handleSubmit} className="widget-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Passengers</label>
                  <select value={passengers} onChange={e => setPassengers(Number(e.target.value))}>
                    {[1,2,3,4].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Vehicle</label>
                  <select value={selectedVehicle} onChange={e => setSelectedVehicle(e.target.value)}>
                    <option value="">Select</option>
                    {getAvailableVehicles().map((v,i) => <option key={i} value={v.name}>{v.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Pickup</label>
                  <select value={pickupLocation} onChange={e => setPickupLocation(e.target.value)}>
                    <option value="">Choose</option>
                    {getPickupOptions().map((o,i) => <option key={i} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              <button type="submit">Send via WhatsApp</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

  return (
    <>
      <Head>
        <title>{get('airportTransfer.pageTitle', 'Airport Transfers Sri Lanka | Meet & Greet Service | Zamzam Tours')}</title>
        <meta name="description" content={get('airportTransfer.metaDescription', 'Hassle-free airport transfers in Sri Lanka with meet & greet service. Professional drivers and comfortable vehicles from Colombo Airport.')} />
        <meta name="keywords" content={get('airportTransfer.metaKeywords', 'Sri Lanka airport transfer, Colombo airport pickup, meet and greet, CMB airport, taxi service, airport taxi Sri Lanka')} />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="transfer-hero" ref={heroRef} style={{ marginTop: '0', position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Cloudinary Hero Background Video */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden'
        }}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            src="https://res.cloudinary.com/dhfqwxyb4/video/upload/v1761687230/12177913_3840_2160_30fps_d6dhi5.mp4"
          />
        </div>
        
        <div className="transfer-hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(5, 59, 60, 0.45), rgba(10, 92, 94, 0.35))',
          zIndex: 1
        }}></div>
        
        <motion.div 
          style={{ position: 'relative', zIndex: 2 }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="transfer-hero-content">
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h1 style={{ 
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
                color: '#ffffff'
              }}>
                {get('airportTransfer.hero.titlePrefix','Stress-Free')} <span style={{ color: '#f8b500' }}>{get('airportTransfer.hero.titleHighlight','Airport Transfers')}</span> {get('airportTransfer.hero.titleSuffix','in Sri Lanka')}
              </h1>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <p style={{ 
                textShadow: '1px 1px 6px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.6)',
                color: '#ffffff'
              }}>
                {get('airportTransfer.hero.subtitle','Professional meet & greet service with comfortable vehicles')}
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <div className="hero-features">
                <div className="feature-item">
                  <span className="icon">👨‍💼</span>
                  <span>{get('airportTransfer.hero.feature.meetAndGreet','Meet & Greet')}</span>
                </div>
                <div className="feature-item">
                  <span className="icon">🚗</span>
                  <span>{get('airportTransfer.hero.feature.professionalDrivers','Professional Drivers')}</span>
                </div>
                <div className="feature-item">
                  <span className="icon">🕒</span>
                  <span>{get('airportTransfer.hero.feature.twentyFourSeven','24/7 Service')}</span>
                </div>
                <div className="feature-item">
                  <span className="icon">💰</span>
                  <span>{get('airportTransfer.hero.feature.noHiddenCosts','No Hidden Costs')}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          style={{ position: 'relative', zIndex: 2 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        >
            <div className="scroll-indicator" style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            <span style={{ 
              display: 'block',
              marginBottom: '10px',
              fontSize: '14px',
              fontWeight: '500',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
            }}> {get('airportTransfer.hero.scroll','Scroll to explore')}</span>
            <div className="arrow-down" style={{
              width: '30px',
              height: '30px',
              margin: '0 auto',
              borderLeft: '2px solid #ffffff',
              borderBottom: '2px solid #ffffff',
              transform: 'rotate(-45deg)',
              filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))'
            }}></div>
          </div>
        </motion.div>
      </section>

      {/* Booking Form Section */}
      <section className="booking-widget-section">
        <div className="container">
          <div className="booking-widget">
            <h2>{get('airportTransfer.booking.title','Book Your Airport Transfer')}</h2>
            
            {/* Trip Type Selection */}
            <div className="trip-type-selector">
              <button
                className={`trip-type-btn ${tripType === 'one-way' ? 'active' : ''}`}
                onClick={() => setTripType('one-way')}
              >
                <span className="icon">🛫</span>
                <span>{get('airportTransfer.tripType.oneWay','One Way')}</span>
              </button>
              <button
                className={`trip-type-btn ${tripType === 'two-way' ? 'active' : ''}`}
                onClick={() => setTripType('two-way')}
              >
                <span className="icon">🛬</span>
                <span>{get('airportTransfer.tripType.roundTrip','Two Way (Round Trip)')}</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="widget-form">
              {/* Row 1: Passengers and Vehicle */}
              <div className="form-row">
                <div className="form-group">
                  <label>{get('airportTransfer.form.label.passengers','👨‍👩‍👧‍👦 Number of Passengers')}</label>
                  <select 
                    value={passengers}
                    onChange={(e) => {
                      setPassengers(parseInt(e.target.value));
                      setSelectedVehicle(''); // Reset vehicle when passengers change
                    }}
                    required
                  >
                    {[1,2,3,4,5,6,7,8,9,10,12,14].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? get('airportTransfer.form.passengerSingular','Passenger') : get('airportTransfer.form.passengerPlural','Passengers')}</option>
                    ))}
<<<<<<< HEAD
<<<<<<< Updated upstream
                  </div>
=======
=======
>>>>>>> origin/main
                  </select>
                </div>

                <div className="form-group">
<<<<<<< HEAD
                  <label>🚙 Select Vehicle</label>
=======
                  <label>{get('airportTransfer.form.label.selectVehicle','🚙 Select Vehicle')}</label>
>>>>>>> origin/main
                  <select 
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    required
                  >
<<<<<<< HEAD
                    <option value="">Select Vehicle</option>
                    {getAvailableVehicles().map((vehicle) => (
                      <option key={vehicle.vehicle_id} value={vehicle.vehicle_name}>{vehicle.vehicle_name}</option>
=======
                    <option value="">{get('airportTransfer.form.selectVehiclePlaceholder','Select Vehicle')}</option>
                    {getAvailableVehicles().map((vehicle, index) => (
                      <option key={index} value={vehicle.name}>{vehicle.name}</option>
>>>>>>> origin/main
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Pickup Location */}
              <div className="form-row">
                <div className="form-group full-width">
                  <label>
                    {tripType === 'one-way' ? get('airportTransfer.form.label.pickupAirport','✈️ Pickup Location (Airport)') : get('airportTransfer.form.label.pickupDistrict','📍 Pickup Location (District)')}
                  </label>
                  <select 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  >
                    <option value="">{tripType === 'one-way' ? get('airportTransfer.form.selectAirportPlaceholder','Select Airport') : get('airportTransfer.form.selectDistrictPlaceholder','Select District')}</option>
                    {getPickupOptions().map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Airport (Two-Way only) */}
              {tripType === 'two-way' && (
                <div className="form-row">
                  <div className="form-group full-width">
                    <label>{get('airportTransfer.form.label.airport','✈️ Airport')}</label>
                    <select 
                      value={airport}
                      onChange={(e) => setAirport(e.target.value)}
                      required
                    >
                      <option value="">{get('airportTransfer.form.selectAirportPlaceholder','Select Airport')}</option>
                      {airports.map((airportOption, index) => (
                        <option key={index} value={airportOption}>{airportOption}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Row 4: Drop-off Location */}
              <div className="form-row">
                <div className="form-group full-width">
                  <label>{get('airportTransfer.form.label.dropoff','📍Drop-off Location (District)')}</label>
                  <select 
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    required
                  >
                    <option value="">{get('airportTransfer.form.selectDistrictPlaceholder','Select District')}</option>
                    {getDropoffOptions().map((location, index) => (
                      <option key={index} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5: Date and Time */}
              <div className="form-row">
                <div className="form-group">
                  <label>{get('airportTransfer.form.label.date','📅 Date')}</label>
                  <input 
                    type="date" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{get('airportTransfer.form.label.time','🕒 Time')}</label>
                  <input 
                    type="time" 
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div className="form-group">
                <label>{get('airportTransfer.form.label.notes','📝 Additional Notes (Optional)')}</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={get('airportTransfer.form.placeholder.notes','Flight number, special requests, luggage details, etc.')}
                  rows={2}
                />
              </div>

              {/* Pricing Notice */}
              <div className="pricing-notice">
                <p>💰 <strong>{get('airportTransfer.pricing.notice','Pricing will be discussed via WhatsApp')}</strong></p>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn-primary large">
                <span>{get('airportTransfer.buttons.sendWhatsApp','📲 Send Booking Request via WhatsApp')}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2>{get('airportTransfer.why.title','Why Choose Zamzam Tours?')}</h2>
            <p>{get('airportTransfer.why.subtitle','Reliable, professional, and hassle-free airport transfer services')}</p>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">👨‍💼</div>
              <h3>{get('airportTransfer.why.professionalDrivers.title','Professional Drivers')}</h3>
              <p>{get('airportTransfer.why.professionalDrivers.desc','Experienced, licensed, and English-speaking drivers')}</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">📍</div>
              <h3>{get('airportTransfer.why.modernFleet.title','Modern Fleet')}</h3>
              <p>{get('airportTransfer.why.modernFleet.desc','Well-maintained, comfortable, and air-conditioned vehicles')}</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🕒</div>
              <h3>{get('airportTransfer.why.twentyFourSeven.title','24/7 Service')}</h3>
              <p>{get('airportTransfer.why.twentyFourSeven.desc','Available round the clock for your convenience')}</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">💰</div>
              <h3>{get('airportTransfer.why.competitiveRates.title','Competitive Rates')}</h3>
              <p>{get('airportTransfer.why.competitiveRates.desc','Transparent pricing with no hidden costs')}</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">🔒</div>
              <h3>{get('airportTransfer.why.safeSecure.title','Safe & Secure')}</h3>
              <p>{get('airportTransfer.why.safeSecure.desc','Fully insured vehicles and trained drivers')}</p>
            </div>

            <div className="feature-box">
              <div className="feature-icon">📲</div>
              <h3>{get('airportTransfer.why.easyBooking.title','Easy Booking')}</h3>
              <p>{get('airportTransfer.why.easyBooking.desc','Simple WhatsApp booking process')}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        /* Airport Transfer Specific Styles */
        .transfer-hero {
          position: relative;
          height: 60vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
          margin-top: 80px;
        }

        .transfer-hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .transfer-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(5, 59, 60, 0.45), rgba(10, 92, 94, 0.35));
        }

        .transfer-hero-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          padding: 0 20px;
          text-align: center;
        }

        .transfer-hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
          color: #ffffff;
        }

        .transfer-hero-content p {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.95;
          text-shadow: 1px 1px 6px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.6);
          color: #ffffff;
        }

        .hero-features {
          display: flex;
          justify-content: center;
          gap: 2.5rem;
          flex-wrap: wrap;
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem 2rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          max-width: 700px;
          margin: 0 auto;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: white;
        }

        .feature-item .icon {
          font-size: 2rem;
        }

        .feature-item span:last-child {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: #ffffff;
        }

        /* Booking Widget */
        .booking-widget-section {
          padding: 3rem 0;
          background: #f9f9f9;
        }

        .booking-widget {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 700px;
          margin: 0 auto;
        }

        .booking-widget h2 {
          text-align: center;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          font-size: 1.8rem;
        }

        .trip-type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }

        .trip-type-btn {
          padding: 1rem;
          border: 2px solid var(--border-color);
          background: white;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .trip-type-btn .icon {
          font-size: 1.3rem;
        }

        .trip-type-btn.active {
          border-color: #053b3c;
          background: #053b3c;
          color: white;
        }

        .trip-type-btn:hover:not(.active) {
          border-color: #053b3c;
          background: #f0f8f8;
        }

        .widget-form .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.8rem;
          margin-bottom: 0.8rem;
        }

        .widget-form .form-group {
          display: flex;
          flex-direction: column;
        }

        .widget-form .form-group.full-width {
          grid-column: 1 / -1;
        }

        .widget-form .form-group:last-child {
          grid-column: 1 / -1;
          margin-bottom: 0;
        }

        .widget-form label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 600;
          color: #053b3c;
          font-size: 0.9rem;
        }

        .widget-form select,
        .widget-form input,
        .widget-form textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .widget-form select:focus,
        .widget-form input:focus,
        .widget-form textarea:focus {
          outline: none;
          border-color: #053b3c;
          box-shadow: 0 0 0 3px rgba(5, 59, 60, 0.1);
        }

        .widget-form textarea {
          resize: vertical;
          font-family: inherit;
        }

        .pricing-notice {
          background: linear-gradient(135deg, #053b3c 0%, #077f82 100%);
          color: white;
          padding: 1rem;
          border-radius: 10px;
          margin: 1rem 0;
          text-align: center;
        }

        .pricing-notice p {
          margin: 0;
          font-size: 0.95rem;
        }

        .pricing-notice strong {
          color: #f8b500;
          font-size: 1rem;
        }

        .btn-primary.large {
          padding: 12px 24px;
          font-size: 1rem;
          width: 100%;
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .btn-primary.large:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }

        /* Why Choose Us Section */
        .why-choose-section {
          padding: 4rem 0;
          background: white;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature-box {
          text-align: center;
          padding: 2rem;
          background: #f9f9f9;
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .feature-box:hover {
          background: white;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          transform: translateY(-5px);
        }

        .feature-box .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-box h3 {
          color: #053b3c;
          margin-bottom: 0.5rem;
        }

        .feature-box p {
          color: #666;
          font-size: 0.95rem;
        }
        .widget-form input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid var(--border-color);
          border-radius: 5px;
          font-size: 1rem;
        }

        .price-summary {
          background: var(--primary-light);
          color: white;
          padding: 1.5rem;
          border-radius: 10px;
          margin-top: 1.5rem;
        }

        .price-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .price-total {
          display: flex;
          justify-content: space-between;
          font-weight: 700;
          font-size: 1.2rem;
          padding-top: 0.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-primary.large {
          padding: 15px 30px;
          font-size: 1.1rem;
          width: 100%;
          margin-top: 1rem;
        }

        /* Services Details */
        .services-details-section {
          padding: 4rem 0;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .service-card.detailed {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .service-card.detailed:hover {
          border-color: var(--primary-color);
          transform: translateY(-5px);
        }

        .service-header {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .service-icon-large {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .service-header h3 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .service-description {
          color: var(--text-light);
        }

        .service-features {
          margin-bottom: 1.5rem;
        }

        .service-features h4 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .service-features ul {
          list-style: none;
          padding: 0;
        }

        .service-features li {
          margin-bottom: 0.5rem;
          padding-left: 0;
        }

        .service-vehicles h4 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .vehicles-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .vehicle-tag {
          background: var(--section-bg);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .service-action {
          margin-top: 1.5rem;
        }

        /* Destinations Section */
        .destinations-section {
          padding: 4rem 0;
          background: var(--section-bg);
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .destination-card.transfer {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .destination-card.transfer:hover {
          transform: translateY(-5px);
        }

        .destination-content {
          padding: 1.5rem;
        }

        .destination-content h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .destination-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .pricing {
          margin-bottom: 1.5rem;
        }

        .price-option {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .price-option .price {
          font-weight: 600;
        }

        .price-option .price.premium {
          color: var(--secondary-color);
        }

        /* Meet & Greet Section */
        .meet-greet-section {
          padding: 4rem 0;
        }

        .meet-greet-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .content-text h2 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-size: 2.5rem;
        }

        .content-text > p {
          color: var(--text-light);
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .feature {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .feature-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .feature-text h4 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .feature-text p {
          color: var(--text-light);
          font-size: 0.9rem;
        }

        /* CTA Section */
        .transfer-cta-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: var(--text-light);
        }

        .modal-content h2 {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
        }

        .booking-summary {
          background: var(--section-bg);
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid var(--border-color);
        }

        .summary-item:last-child {
          border-bottom: none;
        }

        .summary-item.total {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary-color);
        }

        .booking-form .form-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .booking-form .form-section:last-child {
          border-bottom: none;
        }

        .booking-form .form-section h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .booking-form .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .booking-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--primary-color);
        }

        .booking-form input,
        .booking-form select,
        .booking-form textarea {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid var(--border-color);
          border-radius: 5px;
          font-size: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .widget-form .form-row {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .transfer-hero-content h1 {
            font-size: 2.2rem;
          }

          .transfer-hero-content p {
            font-size: 1.1rem;
          }

          .hero-features {
            gap: 1.5rem;
            padding: 1.25rem 1.5rem;
          }

          .feature-item .icon {
            font-size: 1.5rem;
          }

          .feature-item span:last-child {
            font-size: 0.85rem;
          }

          .trip-type-selector {
            grid-template-columns: 1fr;
          }

          .trip-type-btn {
            font-size: 1rem;
            padding: 1.2rem;
          }
        }

        @media (max-width: 576px) {
          .transfer-hero {
            height: 50vh;
            min-height: 400px;
          }

          .transfer-hero-content h1 {
            font-size: 1.8rem;
          }

          .hero-features {
            gap: 1rem;
            padding: 1rem;
            grid-template-columns: repeat(2, 1fr);
          }

          .booking-widget {
            padding: 1.2rem;
          }

          .booking-widget h2 {
            font-size: 1.5rem;
          }

          .trip-type-btn {
            font-size: 0.9rem;
            padding: 0.8rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

   
    </>
  );
}

