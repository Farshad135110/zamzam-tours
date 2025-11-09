// pages/self-drive/index.tsx - Vehicle Rental Main Page
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';
import { fadeInUp } from '../../src/utils/animations';
import useTranslation from '../../src/i18n/useTranslation';

interface PriceStructure {
  daily: number;
  weekly: number;
  monthly: number;
}

interface Vehicle {
  id: number;
  name: string;
  category: string;
  type: string;
  image: string;
  capacity: string;
  transmission: string;
  fuel: string;
  features: string[];
  touristPrices: {
    'self-drive': PriceStructure;
    'with-driver': PriceStructure;
  };
  localPrices: {
    'self-drive': PriceStructure;
    'with-driver': PriceStructure;
  };
}

type RentalType = 'self-drive' | 'with-driver';

export default function SelfDrive() {
  const { t } = useTranslation();
  const get = (key: string, fallback: string) => {
    const val = t(key);
    return val === key ? fallback : val;
  };

  const [rentalType, setRentalType] = useState<RentalType>('self-drive');
  const [customerType, setCustomerType] = useState('tourist');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('colombo');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Video hero refs
  const heroRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle video autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  // Vehicles will be fetched from the backend API (pages/api/vehicles)
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/vehicles');
        if (!res.ok) throw new Error('Failed to fetch vehicles');
        const vehiclesData = await res.json();

        const transformed = vehiclesData.map((vehicle: any) => {
          const basePrice = parseFloat(vehicle.price_per_day) || 0;
          const typesArr = (vehicle.available_for || '')
            .toString()
            .toLowerCase()
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
            .map((t: string) => t.replace(/\s+/g, '-'));
          const availableFor = typesArr.length ? typesArr.join(', ') : 'self-drive, with-driver';

          return {
            id: parseInt((vehicle.vehicle_id || '0').toString().replace(/\D/g, '')) || 0,
            name: vehicle.vehicle_name || 'Vehicle',
            category: (vehicle.vehicle_type || '').toLowerCase(),
            type: availableFor,
            image: vehicle.image || '/vehicles/default.jpg',
            capacity: `${vehicle.capacity || 4} passengers`,
            transmission: vehicle.transmission || 'Automatic',
            fuel: vehicle.fuel || 'Hybrid',
            features: vehicle.description ? vehicle.description.split(',').map((f: string) => f.trim()).slice(0, 4) : ['AC', 'GPS', 'Comfortable'],
            touristPrices: {
              'self-drive': { daily: basePrice, weekly: Math.round(basePrice * 6), monthly: Math.round(basePrice * 20) },
              'with-driver': { daily: Math.round(basePrice * 1.5), weekly: Math.round(basePrice * 9), monthly: Math.round(basePrice * 30) }
            },
            localPrices: {
              'self-drive': { daily: Math.round(basePrice * 0.8), weekly: Math.round(basePrice * 4.8), monthly: Math.round(basePrice * 16) },
              'with-driver': { daily: Math.round(basePrice * 1.2), weekly: Math.round(basePrice * 7.2), monthly: Math.round(basePrice * 24) }
            }
          } as Vehicle;
        });

        setVehicles(transformed);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Pickup locations
  const locations = [
    { id: 'colombo', name: get('carRental.locations.colombo', 'Colombo City') },
    { id: 'airport', name: get('carRental.locations.airport', 'Bandaranaike International Airport (CMB)') },
    { id: 'kandy', name: get('carRental.locations.kandy', 'Kandy City') },
    { id: 'galle', name: get('carRental.locations.galle', 'Galle City') },
    { id: 'negombo', name: get('carRental.locations.negombo', 'Negombo Beach') },
    { id: 'other', name: get('carRental.locations.other', 'Other Location') }
  ];

  // Calculate price based on selection
  useEffect(() => {
    if (selectedVehicle && pickupDate && returnDate) {
      const start = new Date(pickupDate);
      const end = new Date(returnDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      
      if (days > 0) {
        const prices = customerType === 'tourist' ? selectedVehicle.touristPrices : selectedVehicle.localPrices;
        let total = 0;
        
        if (days >= 30) {
          total = prices[rentalType].monthly * (days / 30);
        } else if (days >= 7) {
          total = prices[rentalType].weekly * (days / 7);
        } else {
          total = prices[rentalType].daily * days;
        }
        
        setCalculatedPrice(Math.round(total));
      }
    }
  }, [selectedVehicle, pickupDate, returnDate, rentalType, customerType]);

  // Filter vehicles based on rental type
  const filteredVehicles = vehicles.filter(vehicle => {
    if (rentalType === 'self-drive') {
      return vehicle.type.includes('self-drive');
    }
    return true; // Show all vehicles for with-driver
  });

  // Handle WhatsApp booking
  const handleWhatsAppBooking = (vehicle: Vehicle, customMessage: string = '') => {
    let message = customMessage;
    if (!customMessage) {
      message = `Hello Zamzam Tours! I'm interested in renting a ${vehicle.name} (${rentalType}) for ${customerType}. `;
      if (pickupDate && returnDate) {
        message += `From ${pickupDate} to ${returnDate}. `;
      }
      message += `Please provide more details and availability.`;
    }
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/94766135110?text=${encodedMessage}`, '_blank');
  };

  // Open booking form
  const openBookingForm = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setShowBookingForm(true);
  };

  // Calculate rental period
  const getRentalPeriod = () => {
    if (!pickupDate || !returnDate) return '';
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '';
  };

  return (
    <>
      <Head>
        <title>{get('carRental.pageTitle', 'Vehicle Rentals in Sri Lanka | Self-Drive & With Driver | Zamzam Tours')}</title>
        <meta name="description" content={get('carRental.metaDescription', 'Rent vehicles in Sri Lanka with ZamZam Tours. Self-drive and with-driver options for tourists and locals. Best prices for Prius, Aqua, Vans, Buses and more.')} />
        <meta name="keywords" content={get('carRental.metaKeywords', 'Sri Lanka car rental, self-drive, with driver, vehicle hire, tourist rental, local rental, Prius, Aqua, van rental, bus rental')} />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="rent-hero" ref={heroRef} style={{ marginTop: '0', position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
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
            src="https://res.cloudinary.com/dhfqwxyb4/video/upload/v1761578014/133696-757782416_small_umzqax.mp4"
          />
        </div>
        
        <div className="rent-hero-overlay" style={{
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
          <div className="rent-hero-content">
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h1 style={{ 
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
                color: '#ffffff'
              }}>
                {get('carRental.hero.titlePrefix', 'Premium')} <span style={{ color: '#f8b500' }}>{get('carRental.hero.titleHighlight', 'Vehicle Rentals')}</span> {get('carRental.hero.titleSuffix', 'in Sri Lanka')}
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
                {get('carRental.hero.subtitle', 'Self-drive or with driver - Choose from our extensive fleet of well-maintained vehicles')}
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
          
          <div className="hero-filters">
              <div className="filter-group">
              <label>{get('carRental.filters.rentalTypeLabel', 'Rental Type')}</label>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${rentalType === 'self-drive' ? 'active' : ''}`}
                  onClick={() => setRentalType('self-drive')}
                >
                  {get('carRental.filters.selfDrive', 'Self-Drive')}
                </button>
                <button 
                  className={`filter-btn ${rentalType === 'with-driver' ? 'active' : ''}`}
                  onClick={() => setRentalType('with-driver')}
                >
                  {get('carRental.filters.withDriver', 'With Driver')}
                </button>
              </div>
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
            }}>{get('carRental.hero.scroll', 'Scroll to explore')}</span>
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

      {/* Main Content */}
      <main className="rent-main">
        <div className="container">
          <section className="vehicles-section">
            <div className="section-header">
              <h2>{get('carRental.fleet.title', 'Our Fleet')}</h2>
              <p>{get('carRental.fleet.description', 'All vehicles are well-maintained, fully insured, and ready for your journey')}</p>
            </div>

            <div className="vehicles-grid">
              {filteredVehicles.map((vehicle) => (
                <div key={vehicle.id} className="vehicle-card">
                  <div className="vehicle-image">
                    <Image 
                      src={vehicle.image} 
                      alt={vehicle.name} 
                      width={400} 
                      height={300} 
                    />
                    <span className="vehicle-badge">{vehicle.category}</span>
                  </div>

                  <div className="vehicle-content">
                    <h3>{vehicle.name}</h3>
                    
                    <div className="vehicle-specs">
                      <div className="spec">
                        <span className="label">{get('carRental.labels.capacity', 'Capacity:')}</span>
                        <span>{vehicle.capacity}</span>
                      </div>
                    </div>

                    <div className="vehicle-features">
                      {vehicle.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>

                    <div className="vehicle-pricing">
                      <div className="price-item">
                        <span className="period">{get('carRental.labels.dailyRate', 'Daily Rate')}</span>
                        <span className="price">
                          ${customerType === 'tourist' ? 
                            vehicle.touristPrices[rentalType].daily : 
                            vehicle.localPrices[rentalType].daily}
                        </span>
                      </div>
                    </div>
                    <p className="pricing-note">
                      {get('carRental.pricing.weeklyMonthly', 'Weekly & monthly rates available via WhatsApp')}<br/>
                      <span className="km-charge">{get('carRental.pricing.perKm', '+ Additional charge per km applies')}</span>
                    </p>

                    <div className="vehicle-actions">
                      <button 
                        className="btn btn-primary"
                        onClick={() => openBookingForm(vehicle)}
                      >
                        {get('carRental.actions.bookNow', 'Book Now')}
                      </button>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => handleWhatsAppBooking(vehicle)}
                      >
                        {get('carRental.actions.whatsapp', 'WhatsApp')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Terms & Conditions */}
          <section className="terms-section">
            <div className="terms-card">
              <h2>{get('carRental.terms.title', 'Rental Terms & Conditions')}</h2>
              <div className="terms-grid">
                <div className="term-item">
                  <h3>🚗 {get('carRental.terms.selfDrive.title', 'Self-Drive Requirements')}</h3>
                  <ul>
                    <li>{get('carRental.terms.selfDrive.validLicense', 'Valid international driving license')}</li>
                    <li>{get('carRental.terms.selfDrive.minAge', 'Minimum age: 21 years')}</li>
                    <li>{get('carRental.terms.selfDrive.deposit', 'Security deposit required')}</li>
                    <li>{get('carRental.terms.selfDrive.insurance', 'Comprehensive insurance included')}</li>
                  </ul>
                </div>
                <div className="term-item">
                  <h3>👨‍✈️ {get('carRental.terms.withDriver.title', 'With Driver Service')}</h3>
                  <ul>
                    <li>{get('carRental.terms.withDriver.professional', 'Professional, experienced drivers')}</li>
                    <li>{get('carRental.terms.withDriver.guides', 'English-speaking guides available')}</li>
                    <li>{get('carRental.terms.withDriver.itinerary', 'Flexible itinerary planning')}</li>
                    <li>{get('carRental.terms.withDriver.localKnowledge', 'Local knowledge & expertise')}</li>
                  </ul>
                </div>
                <div className="term-item">
                  <h3>📅 {get('carRental.terms.booking.title', 'Booking & Payment')}</h3>
                  <ul>
                    <li>{get('carRental.terms.booking.advance', 'Advance booking recommended')}</li>
                    <li>{get('carRental.terms.booking.deposit', '50% deposit to confirm booking')}</li>
                    <li>{get('carRental.terms.booking.balance', 'Balance on vehicle pickup')}</li>
                    <li>{get('carRental.terms.booking.cancellation', 'Cancellation: 7 days notice')}</li>
                  </ul>
                </div>
                <div className="term-item">
                  <h3>🛡️ {get('carRental.terms.insurance.title', 'Insurance & Safety')}</h3>
                  <ul>
                    <li>{get('carRental.terms.insurance.coverage', 'Full insurance coverage')}</li>
                    <li>{get('carRental.terms.insurance.roadside', '24/7 roadside assistance')}</li>
                    <li>{get('carRental.terms.insurance.gps', 'GPS tracking for safety')}</li>
                    <li>{get('carRental.terms.insurance.emergency', 'Emergency contact support')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && selectedVehicle && (
        <div className="modal-overlay" onClick={() => setShowBookingForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close"
              onClick={() => setShowBookingForm(false)}
            >
              ×
            </button>
            
            <h2>{get('carRental.modal.bookPrefix', 'Book')} {selectedVehicle.name}</h2>
            
            <div className="vehicle-summary">
              <div className="summary-image">
                <Image 
                  src={selectedVehicle.image}
                  alt={selectedVehicle.name}
                  width={200}
                  height={150}
                />
              </div>
              <div className="summary-details">
                <h3>{selectedVehicle.name}</h3>
                <div className="summary-item">
                  <span>{get('carRental.modal.label.category', 'Category:')}</span>
                  <span>{selectedVehicle.category}</span>
                </div>
                <div className="summary-item">
                  <span>{get('carRental.modal.label.capacity', 'Capacity:')}</span>
                  <span>{selectedVehicle.capacity}</span>
                </div>
                <div className="summary-item">
                  <span>{get('carRental.modal.label.transmission', 'Transmission:')}</span>
                  <span>{selectedVehicle.transmission}</span>
                </div>
                <div className="summary-item">
                  <span>{get('carRental.modal.label.fuel', 'Fuel Type:')}</span>
                  <span>{selectedVehicle.fuel}</span>
                </div>
              </div>
            </div>

            <form className="booking-form" onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const message = [
                `${get('carRental.messages.bookingRequestHeading', 'Booking Request')} - ${selectedVehicle.name}`,
                `${get('carRental.messages.label.name', 'Name')}: ${formData.get('name')}`,
                `${get('carRental.messages.label.email', 'Email')}: ${formData.get('email')}`,
                `${get('carRental.messages.label.phone', 'Phone')}: ${formData.get('phone')}`,
                `${get('carRental.messages.label.rentalType', 'Rental Type')}: ${rentalType}`,
                `${get('carRental.messages.label.customerType', 'Customer Type')}: ${customerType}`,
                `${get('carRental.messages.label.pickupDate', 'Pickup Date')}: ${pickupDate}`,
                `${get('carRental.messages.label.returnDate', 'Return Date')}: ${returnDate}`,
                `${get('carRental.messages.label.pickupLocation', 'Pickup Location')}: ${pickupLocation}`,
                getRentalPeriod() ? `${get('carRental.messages.label.duration', 'Duration')}: ${getRentalPeriod()}` : null,
                calculatedPrice > 0 ? `${get('carRental.messages.label.estimatedCost', 'Estimated Cost')}: $${calculatedPrice}` : null,
                `${get('carRental.messages.label.specialRequests', 'Special Requests')}: ${formData.get('requests')}`
              ].filter(Boolean).join('\n');
              handleWhatsAppBooking(selectedVehicle, message);
            }}>
              <div className="form-row">
                <div className="form-group">
                  <label>{get('carRental.form.label.name', 'Full Name *')}</label>
                  <input type="text" name="name" required />
                </div>
                <div className="form-group">
                  <label>{get('carRental.form.label.email', 'Email *')}</label>
                  <input type="email" name="email" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{get('carRental.form.label.phone', 'Phone Number *')}</label>
                  <input type="tel" name="phone" required />
                </div>
                <div className="form-group">
                  <label>{get('carRental.form.label.pickupLocation', 'Pickup Location *')}</label>
                  <select 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    required
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{get('carRental.form.label.pickupDate', 'Pickup Date *')}</label>
                  <input 
                    type="date" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>{get('carRental.form.label.returnDate', 'Return Date *')}</label>
                  <input 
                    type="date" 
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
              </div>

              {calculatedPrice > 0 && (
                <div className="price-summary">
                  <div className="summary-row">
                      <span>{get('carRental.form.summary.rentalPeriod', 'Rental Period:')}</span>
                      <strong>{getRentalPeriod()}</strong>
                    </div>
                    <div className="summary-row">
                      <span>{get('carRental.form.summary.estimatedTotal', 'Estimated Total:')}</span>
                      <strong className="price-highlight">${calculatedPrice}</strong>
                    </div>
                </div>
              )}

              <div className="form-group">
                <label>{get('carRental.form.label.requests', 'Special Requests')}</label>
                <textarea 
                  name="requests" 
                  rows={3} 
                  placeholder={get('carRental.form.placeholder.requests', 'Additional requirements, pickup/dropoff instructions, etc.')}
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowBookingForm(false)}>
                  {get('carRental.form.actions.cancel', 'Cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {get('carRental.form.actions.sendWhatsApp', 'Send via WhatsApp')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Container */
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        /* Hero Section */
        .rent-hero {
          position: relative;
          height: 60vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
          color: white;
          margin-top: 80px;
        }

        .rent-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%);
        }

        .rent-hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
          max-width: 900px;
          padding: 0 20px;
        }

        .rent-hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .rent-hero-content p {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.95;
        }

        .hero-filters {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .filter-group {
          background: rgba(255, 255, 255, 0.15);
          padding: 1.5rem 2rem;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          min-width: 280px;
        }

        .filter-group label {
          display: block;
          margin-bottom: 1rem;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .filter-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .filter-btn {
          flex: 1;
          padding: 12px 24px;
          border: 2px solid white;
          background: transparent;
          color: white;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .filter-btn.active {
          background: #f8b500;
          border-color: #f8b500;
          color: #053b3c;
        }

        .filter-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.2);
          border-color: white;
        }

        /* Main Content */
        .rent-main {
          padding: 4rem 0;
          background: #f9f9f9;
        }

        /* Section Header */
        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          color: #053b3c;
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .section-header p {
          font-size: 1.1rem;
          color: #666;
        }

        /* Vehicles Grid */
        .vehicles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        /* Vehicle Card */
        .vehicle-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .vehicle-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
        }

        .vehicle-image {
          position: relative;
          height: 220px;
          background: #f0f0f0;
          overflow: hidden;
        }

        .vehicle-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #f8b500;
          color: #053b3c;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: capitalize;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        /* Vehicle Content */
        .vehicle-content {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .vehicle-content h3 {
          font-size: 1.4rem;
          color: #053b3c;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        /* Vehicle Specs */
        .vehicle-specs {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e0e0e0;
        }

        .spec {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .spec .label {
          color: #666;
          font-weight: 500;
        }

        .spec span:last-child {
          color: #053b3c;
          font-weight: 600;
        }

        /* Vehicle Features */
        .vehicle-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .feature-tag {
          background: #f0f7f7;
          color: #053b3c;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        /* Vehicle Pricing */
        .vehicle-pricing {
          background: linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .price-item {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .price-item .period {
          display: block;
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.3rem;
          font-weight: 500;
        }

        .price-item .price {
          display: block;
          font-size: 1.6rem;
          font-weight: 700;
          color: #f8b500;
        }

        .pricing-note {
          text-align: center;
          font-size: 0.7rem;
          color: #999;
          margin-bottom: 1rem;
          line-height: 1.4;
        }

        .km-charge {
          font-size: 0.65rem;
          color: #666;
          font-style: italic;
        }

        /* Vehicle Actions */
        .vehicle-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          margin-top: auto;
        }

        /* Buttons */
        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          text-align: center;
        }

        .btn-primary {
          background: #f8b500;
          color: #053b3c;
        }

        .btn-primary:hover {
          background: #e6a500;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(248, 181, 0, 0.3);
        }

        .btn-secondary {
          background: white;
          color: #053b3c;
          border: 2px solid #053b3c;
        }

        .btn-secondary:hover {
          background: #053b3c;
          color: white;
          transform: translateY(-2px);
        }

        /* Terms Section */
        .terms-section {
          margin-top: 3rem;
        }

        .terms-card {
          background: white;
          padding: 3rem;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .terms-card h2 {
          text-align: center;
          color: #053b3c;
          margin-bottom: 2.5rem;
          font-size: 2rem;
          font-weight: 700;
        }

        .terms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
        }

        .term-item h3 {
          color: #053b3c;
          margin-bottom: 1rem;
          font-size: 1.1rem;
          font-weight: 700;
        }

        .term-item ul {
          list-style: none;
          padding: 0;
        }

        .term-item li {
          padding: 0.6rem 0;
          padding-left: 1.75rem;
          position: relative;
          font-size: 0.95rem;
          color: #555;
          line-height: 1.5;
        }

        .term-item li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #f8b500;
          font-weight: bold;
          font-size: 1.1rem;
        }

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
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: var(--section-bg);
          color: var(--primary-color);
        }

        .modal-content h2 {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
        }

        .vehicle-summary {
          display: flex;
          gap: 1.5rem;
          background: var(--section-bg);
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .summary-image {
          flex-shrink: 0;
        }

        .summary-details h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .summary-item span:first-child {
          color: var(--text-light);
        }

        .booking-form .form-group {
          margin-bottom: 1.5rem;
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
          font-family: inherit;
        }

        .booking-form input:focus,
        .booking-form select:focus,
        .booking-form textarea:focus {
          outline: none;
          border-color: var(--primary-color);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .price-summary {
          background: var(--section-bg);
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .summary-row:last-child {
          margin-bottom: 0;
          padding-top: 0.5rem;
          border-top: 2px solid var(--border-color);
        }

        .price-highlight {
          color: var(--primary-color);
          font-size: 1.3rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        @media (max-width: 768px) {
          .rent-hero-content h1 {
          .hero-filters {
            flex-direction: column;
            gap: 1rem;
          }

          .vehicles-grid {
            grid-template-columns: 1fr;
          }
          .vehicles-grid {
            grid-template-columns: 1fr;
          }

          .vehicle-pricing {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .terms-grid {
            grid-template-columns: 1fr;
          }

          .vehicle-summary {
            flex-direction: column;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 576px) {
          .rent-hero {
            height: 50vh;
          }

          .vehicle-actions {
            flex-direction: column;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}

