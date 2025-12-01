// pages/airport-transfer/index.js - All-Island Transfers Main Page
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { fadeInUp } from '../../src/utils/animations';
import useTranslation from '../../src/i18n/useTranslation'

export default function AirportTransfer() {
  const [passengers, setPassengers] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [additionalStops, setAdditionalStops] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [notes, setNotes] = useState('');

  // Video hero refs
  const heroRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  const { t } = useTranslation()

  const get = (key: string, fallback: string) => {
    const val = t(key)
    return val === key ? fallback : val
  }

  // Sri Lankan airports
  const airports = [
    get('airportTransfer.airports.cmb', 'Bandaranaike International Airport (CMB) - Colombo'),
    get('airportTransfer.airports.hri', 'Mattala Rajapaksa International Airport (HRI) - Hambantota'),
    get('airportTransfer.airports.rml', 'Ratmalana Airport (RML) - Colombo')
  ];

  // Sri Lankan districts
  const districts = [
    get('airportTransfer.districts.colombo', 'Colombo'),
    get('airportTransfer.districts.gampaha', 'Gampaha'),
    get('airportTransfer.districts.kalutara', 'Kalutara'),
    get('airportTransfer.districts.kandy', 'Kandy'),
    get('airportTransfer.districts.matale', 'Matale'),
    get('airportTransfer.districts.nuwaraEliya', 'Nuwara Eliya'),
    get('airportTransfer.districts.galle', 'Galle'),
    get('airportTransfer.districts.matara', 'Matara'),
    get('airportTransfer.districts.hambantota', 'Hambantota'),
    get('airportTransfer.districts.jaffna', 'Jaffna'),
    get('airportTransfer.districts.kilinochchi', 'Kilinochchi'),
    get('airportTransfer.districts.mannar', 'Mannar'),
    get('airportTransfer.districts.vavuniya', 'Vavuniya'),
    get('airportTransfer.districts.mullaitivu', 'Mullaitivu'),
    get('airportTransfer.districts.batticaloa', 'Batticaloa'),
    get('airportTransfer.districts.ampara', 'Ampara'),
    get('airportTransfer.districts.trincomalee', 'Trincomalee'),
    get('airportTransfer.districts.kurunegala', 'Kurunegala'),
    get('airportTransfer.districts.puttalam', 'Puttalam'),
    get('airportTransfer.districts.anuradhapura', 'Anuradhapura'),
    get('airportTransfer.districts.polonnaruwa', 'Polonnaruwa'),
    get('airportTransfer.districts.badulla', 'Badulla'),
    get('airportTransfer.districts.monaragala', 'Monaragala'),
    get('airportTransfer.districts.ratnapura', 'Ratnapura'),
    get('airportTransfer.districts.kegalle', 'Kegalle')
  ];

  // Popular destinations
  const popularDestinations = [
    get('airportTransfer.destinations.sigiriya', 'Sigiriya'),
    get('airportTransfer.destinations.ella', 'Ella'),
    get('airportTransfer.destinations.mirissa', 'Mirissa'),
    get('airportTransfer.destinations.bentota', 'Bentota'),
    get('airportTransfer.destinations.unawatuna', 'Unawatuna'),
    get('airportTransfer.destinations.arugamBay', 'Arugam Bay'),
    get('airportTransfer.destinations.yala', 'Yala National Park'),
    get('airportTransfer.destinations.udawalawe', 'Udawalawe'),
    get('airportTransfer.destinations.pinnawala', 'Pinnawala'),
    get('airportTransfer.destinations.dambulla', 'Dambulla'),
    get('airportTransfer.destinations.anuradhapura', 'Anuradhapura (Ancient City)'),
    get('airportTransfer.destinations.polonnaruwa', 'Polonnaruwa (Ancient City)'),
    get('airportTransfer.destinations.tangalle', 'Tangalle'),
    get('airportTransfer.destinations.negombo', 'Negombo'),
    get('airportTransfer.destinations.trincomalee', 'Trincomalee Beach'),
    get('airportTransfer.destinations.jaffna', 'Jaffna Peninsula')
  ];

  // Combine all locations for pickup/dropoff
  const allLocations = [
    ...airports.map(loc => ({ label: loc, category: 'Airport' })),
    ...districts.map(loc => ({ label: loc, category: 'District' })),
    ...popularDestinations.map(loc => ({ label: loc, category: 'Destination' }))
  ];

  // Fleet vehicles with passenger capacity
  const fleetVehicles = [
    { name: get('airportTransfer.vehicles.miniCar', 'Mini Car (2-3 passengers)'), capacity: 3 },
    { name: get('airportTransfer.vehicles.vitz', 'Toyota Vitz (Economy Car)'), capacity: 4 },
    { name: get('airportTransfer.vehicles.alto', 'Suzuki Alto (Budget Car)'), capacity: 4 },
    { name: get('airportTransfer.vehicles.aqua', 'Toyota Aqua (Compact Car)'), capacity: 4 },
    { name: get('airportTransfer.vehicles.prius', 'Toyota Prius (Hybrid Car)'), capacity: 4 },
    { name: get('airportTransfer.vehicles.axio', 'Toyota Axio (Sedan)'), capacity: 4 },
    { name: get('airportTransfer.vehicles.luxurySuv', 'Luxury SUV'), capacity: 6 },
    { name: get('airportTransfer.vehicles.hiace', 'Toyota Hiace (Luxury Van)'), capacity: 10 },
    { name: get('airportTransfer.vehicles.kdhVan', 'Toyota KDH Van (14 seats)'), capacity: 14 }
  ];

  // Get available vehicles based on passenger count
  const getAvailableVehicles = () => {
    return fleetVehicles.filter(vehicle => vehicle.capacity >= passengers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let message = '';
    message += `\u{1F697} ${get('airportTransfer.messages.heading','*ALL-ISLAND TRANSFER BOOKING REQUEST*')}\n`;
    message += `${get('airportTransfer.messages.lineSeparator','\u2501'.repeat(24))}\n\n`;

    message += `${get('airportTransfer.messages.tripDetails','*TRIP DETAILS*')}\n`;
    message += `\u{251C} ${get('airportTransfer.messages.passengersLabel','Passengers')}: \u{1F465} ${passengers} ${passengers === 1 ? get('airportTransfer.messages.personSingular','Person') : get('airportTransfer.messages.personPlural','People')}\n`;
    message += `\u{2514} ${get('airportTransfer.messages.vehicleLabel','Vehicle')}: \u{1F699} ${selectedVehicle}\n\n`;

    message += `${get('airportTransfer.messages.journey','*JOURNEY*')}\n`;
    message += `\u{251C} ${get('airportTransfer.messages.pickupLabel','Pickup')}: \u{1F4CD} ${pickupLocation}\n`;
    message += `\u{2514} ${get('airportTransfer.messages.dropoffLabel','Drop-off')}: \u{1F4CD} ${dropoffLocation}\n`;

    if (additionalStops) {
      message += `\u{251C} ${get('airportTransfer.messages.additionalStops','Additional Stops')}: \u{1F6A9} ${additionalStops}\n`;
    }

    message += `\n${get('airportTransfer.messages.schedule','*SCHEDULE*')}\n`;
    message += `\u{251C} ${get('airportTransfer.messages.dateLabel','Date')}: \u{1F4C5} ${pickupDate}\n`;
    message += `\u{2514} ${get('airportTransfer.messages.timeLabel','Time')}: \u{23F0} ${pickupTime}\n`;

    if (notes) {
      message += `\n${get('airportTransfer.messages.specialRequests','*SPECIAL REQUESTS*')}\n`;
      message += `${notes}\n`;
    }

    message += `\n${get('airportTransfer.messages.lineSeparator','\u2501'.repeat(24))}`;
    message += `\n${get('airportTransfer.messages.confirmNote','_Please confirm availability and pricing_')} \u{1F4AC}`;

    const whatsappNumber = CONTACT_INFO.whatsapp;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      <Head>
        <title>{get('airportTransfer.pageTitle', 'Airport & All-Island Transfers Sri Lanka | Zamzam Lanka Tours')}</title>
        <meta name="description" content={get('airportTransfer.metaDescription', 'Professional airport and all-island transfers in Sri Lanka. Travel anywhere with our comfortable vehicles and professional drivers.')} />
        <meta name="keywords" content={get('airportTransfer.metaKeywords', 'Sri Lanka airport transfer, all island transfers, Colombo airport pickup, Sri Lanka taxi service, island-wide transport')} />
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
            preload="metadata"
            poster="https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453704/dylan-shaw-smUAKwMT8XA-unsplash_qhenhx.jpg"
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
                {get('airportTransfer.hero.titlePrefix','Stress-Free')} <span style={{ color: '#f8b500' }}>{get('airportTransfer.hero.titleHighlight','Airport & All-Island Transfers')}</span> {get('airportTransfer.hero.titleSuffix','in Sri Lanka')}
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
                {get('airportTransfer.hero.subtitle','Airport pickups with meet & greet service and island-wide transfers with professional drivers')}
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
            <h2>{get('airportTransfer.booking.title','Book Your Airport or All-Island Transfer')}</h2>

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
                  </select>
                </div>

                <div className="form-group">
                  <label>{get('airportTransfer.form.label.selectVehicle','🚙 Select Vehicle')}</label>
                  <select 
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    required
                  >
                    <option value="">{get('airportTransfer.form.selectVehiclePlaceholder','Select Vehicle')}</option>
                    {getAvailableVehicles().map((vehicle, index) => (
                      <option key={index} value={vehicle.name}>{vehicle.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Pickup Location */}
              <div className="form-row">
                <div className="form-group full-width">
                  <label>{get('airportTransfer.form.label.pickupLocation','📍 Pickup Location')}</label>
                  <select 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  >
                    <option value="">{get('airportTransfer.form.selectLocationPlaceholder','Select Pickup Location')}</option>
                    <optgroup label="✈️ Airports">
                      {airports.map((location, index) => (
                        <option key={`airport-${index}`} value={location}>{location}</option>
                      ))}
                    </optgroup>
                    <optgroup label="📍 Districts">
                      {districts.map((location, index) => (
                        <option key={`district-${index}`} value={location}>{location}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🏖️ Popular Destinations">
                      {popularDestinations.map((location, index) => (
                        <option key={`dest-${index}`} value={location}>{location}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Row 3: Drop-off Location */}
              <div className="form-row">
                <div className="form-group full-width">
                  <label>{get('airportTransfer.form.label.dropoff','📍 Drop-off Location')}</label>
                  <select 
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    required
                  >
                    <option value="">{get('airportTransfer.form.selectLocationPlaceholder','Select Drop-off Location')}</option>
                    <optgroup label="✈️ Airports">
                      {airports.map((location, index) => (
                        <option key={`airport-drop-${index}`} value={location}>{location}</option>
                      ))}
                    </optgroup>
                    <optgroup label="📍 Districts">
                      {districts.map((location, index) => (
                        <option key={`district-drop-${index}`} value={location}>{location}</option>
                      ))}
                    </optgroup>
                    <optgroup label="🏖️ Popular Destinations">
                      {popularDestinations.map((location, index) => (
                        <option key={`dest-drop-${index}`} value={location}>{location}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Row 4: Additional Stops (Optional) */}
              <div className="form-row">
                <div className="form-group full-width">
                  <label>{get('airportTransfer.form.label.additionalStops','🚩 Additional Stops (Optional)')}</label>
                  <input
                    type="text"
                    value={additionalStops}
                    onChange={(e) => setAdditionalStops(e.target.value)}
                    placeholder={get('airportTransfer.form.placeholder.additionalStops','e.g., Stop at Temple, Visit Spice Garden')}
                  />
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
            <h2>{get('airportTransfer.why.title','Why Choose Zamzam Lanka Tours?')}</h2>
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

        .widget-form select {
          max-height: 300px;
          overflow-y: auto;
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

