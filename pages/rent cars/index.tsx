// pages/rent/index.js - Vehicle Rental Main Page
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

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

export default function Rent() {
  const [rentalType, setRentalType] = useState<'self-drive' | 'with-driver'>('with-driver');
  const [customerType, setCustomerType] = useState<'tourist' | 'local'>('tourist');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [pickupLocation, setPickupLocation] = useState('colombo');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch vehicles from database
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vehicles');
        if (!response.ok) throw new Error('Failed to fetch vehicles');
        const vehiclesData = await response.json();
        
        console.log('Fetched vehicles from database:', vehiclesData);
        
        // Transform database vehicles to match UI format
        const transformedVehicles = vehiclesData.map((vehicle: any) => {
          // Parse price (handle both string and number from DB)
          const basePrice = parseFloat(vehicle.price_per_day) || 0;

          // Normalize available_for tokens to hyphenated form for filtering
          const typesArr = (vehicle.available_for || '')
            .toString()
            .toLowerCase()
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
            .map((t: string) => t.replace(/\s+/g, '-'));
          const availableFor = typesArr.length ? typesArr.join(', ') : 'self-drive, with-driver';

          return {
            id: parseInt(vehicle.vehicle_id.replace('V', '')) || 0,
            name: vehicle.vehicle_name,
            category: vehicle.vehicle_type.toLowerCase(),
            type: availableFor,
            image: vehicle.image || '/vehicles/default.jpg',
            capacity: `${vehicle.capacity || 4} passengers`,
            transmission: 'Automatic', // Default value
            fuel: 'Hybrid', // Default value
            features: vehicle.description ? vehicle.description.split(',').map((f: string) => f.trim()).slice(0, 4) : ['AC', 'GPS', 'Bluetooth', 'Comfortable'],
            touristPrices: {
              'self-drive': { 
                daily: basePrice,
                weekly: basePrice * 6,
                monthly: basePrice * 20
              },
              'with-driver': { 
                daily: basePrice * 1.5,
                weekly: basePrice * 9,
                monthly: basePrice * 30
              }
            },
            localPrices: {
              'self-drive': { 
                daily: basePrice * 0.8,
                weekly: basePrice * 4.8,
                monthly: basePrice * 16
              },
              'with-driver': { 
                daily: basePrice * 1.2,
                weekly: basePrice * 7.2,
                monthly: basePrice * 24
              }
            }
          };
        });
        
        setVehicles(transformedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        alert('Failed to load vehicles from database');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, []);

  // Pickup locations
  const locations = [
    { id: 'colombo', name: 'Colombo City' },
    { id: 'airport', name: 'Bandaranaike International Airport (CMB)' },
    { id: 'kandy', name: 'Kandy City' },
    { id: 'galle', name: 'Galle City' },
    { id: 'negombo', name: 'Negombo Beach' },
    { id: 'other', name: 'Other Location' }
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

  // Helper: availability match (treat 'tour' as with-driver)
  const isAvailableFor = (v: Vehicle, type: 'self-drive' | 'with-driver') =>
    v.type.includes(type) || (type === 'with-driver' && v.type.includes('tour'));

  // Filter vehicles based on rental type (same logic for both types)
  const filteredVehicles = vehicles.filter(vehicle => isAvailableFor(vehicle, rentalType));

  // Handle WhatsApp booking
  const handleWhatsAppBooking = (vehicle: Vehicle, customMessage = '') => {
    let message = customMessage;
    if (!customMessage) {
      message = `Hello Zamzam Tours! I'm interested in renting a ${vehicle.name} (${rentalType}) for ${customerType}. `;
      if (pickupDate && returnDate) {
        message += `From ${pickupDate} to ${returnDate}. `;
      }
      message += `Please provide more details and availability.`;
    }
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/94771234567?text=${encodedMessage}`, '_blank');
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
        <title>Vehicle Rentals in Sri Lanka | Self-Drive & With Driver | Zamzam Tours</title>
        <meta name="description" content="Rent vehicles in Sri Lanka with Zamzam Tours. Self-drive and with-driver options for tourists and locals. Best prices for Prius, Aqua, Vans, Buses and more." />
        <meta name="keywords" content="Sri Lanka car rental, self-drive, with driver, vehicle hire, tourist rental, local rental, Prius, Aqua, van rental, bus rental" />
      </Head>

      {/* Hero Section */}
      <section className="rent-hero">
        <div className="rent-hero-background">
          <Image 
            src="/rent/hero-rent.jpg" 
            alt="Vehicle Rentals Sri Lanka" 
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="rent-hero-overlay"></div>
        </div>
        
        <div className="rent-hero-content">
          <h1>Premium Vehicle Rentals in Sri Lanka</h1>
          <p>Choose from our extensive fleet - self-drive or with professional driver</p>
          
          <div className="rental-options">
            <div className="option-group">
              <h3>I am a:</h3>
              <div className="option-buttons">
                <button 
                  className={`option-btn ${customerType === 'tourist' ? 'active' : ''}`}
                  onClick={() => setCustomerType('tourist')}
                >
                  🌍 Tourist
                </button>
                <button 
                  className={`option-btn ${customerType === 'local' ? 'active' : ''}`}
                  onClick={() => setCustomerType('local')}
                >
                  🇱🇰 Sri Lankan
                </button>
              </div>
            </div>

            {/* Rental type is fixed to with-driver on this page */}
          </div>
        </div>
      </section>

      {/* Quick Quote Section */}
      <section className="quote-section">
        <div className="container">
          <div className="quote-card">
            <h2>Get Instant Quote</h2>
            <div className="quote-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Pickup Location</label>
                  <select 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  >
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Pickup Date</label>
                  <input 
                    type="date" 
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group">
                  <label>Return Date</label>
                  <input 
                    type="date" 
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                    min={pickupDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              
              {calculatedPrice > 0 && (
                <div className="quote-result">
                  <div className="estimated-price">
                    <span>Estimated Price:</span>
                    <span className="price">${calculatedPrice}</span>
                    <span className="period">for {getRentalPeriod()}</span>
                  </div>
                  <p className="price-note">* Final price may vary based on vehicle availability and additional services</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Vehicles Grid */}
      <section className="vehicles-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Vehicle Fleet</h2>
            <p>Well-maintained vehicles for every need and budget</p>
            <div className="customer-badge">
              Currently showing prices for: <strong>{customerType === 'tourist' ? 'Tourists' : 'Sri Lankans'}</strong>
            </div>
          </div>

          {loading ? (
            <div className="loading-message" style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#666' }}>
              Loading vehicles...
            </div>
          ) : (
            <div className="vehicles-grid">
              {filteredVehicles.map(vehicle => (
              <div key={vehicle.id} className="vehicle-card">
                <div className="vehicle-image">
                  <Image 
                    src={vehicle.image} 
                    alt={vehicle.name}
                    width={400}
                    height={250}
                    objectFit="cover"
                    unoptimized
                  />
                  <div className="vehicle-badge">{vehicle.category}</div>
                  {!isAvailableFor(vehicle, rentalType) && (
                    <div className="not-available-badge">Not available for {rentalType}</div>
                  )}
                </div>

                <div className="vehicle-content">
                  <h3>{vehicle.name}</h3>
                  
                  <div className="vehicle-specs">
                    <div className="spec-item">
                      <span>👥</span>
                      <span>{vehicle.capacity}</span>
                    </div>
                    <div className="spec-item">
                      <span>⚙️</span>
                      <span>{vehicle.transmission}</span>
                    </div>
                    <div className="spec-item">
                      <span>⛽</span>
                      <span>{vehicle.fuel}</span>
                    </div>
                  </div>

                  <div className="vehicle-features">
                    <h4>Features:</h4>
                    <div className="features-list">
                      {vehicle.features.map((feature, index) => (
                        <span key={index} className="feature-tag">{feature}</span>
                      ))}
                    </div>
                  </div>

                  <div className="pricing-section">
                    <h4>Rental Rates:</h4>
                    <div className="price-grid">
                      <div className="price-column">
                        <span className="price-label">Daily</span>
                        <span className="price-amount">
                          ${customerType === 'tourist' ? 
                            vehicle.touristPrices[rentalType].daily : 
                            vehicle.localPrices[rentalType].daily}
                        </span>
                      </div>
                      <div className="price-column">
                        <span className="price-label">Weekly</span>
                        <span className="price-amount">
                          ${customerType === 'tourist' ? 
                            vehicle.touristPrices[rentalType].weekly : 
                            vehicle.localPrices[rentalType].weekly}
                        </span>
                      </div>
                      <div className="price-column">
                        <span className="price-label">Monthly</span>
                        <span className="price-amount">
                          ${customerType === 'tourist' ? 
                            vehicle.touristPrices[rentalType].monthly : 
                            vehicle.localPrices[rentalType].monthly}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="vehicle-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => openBookingForm(vehicle)}
                    >
                      View Details
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => handleWhatsAppBooking(vehicle)}
                      disabled={!isAvailableFor(vehicle, rentalType)}
                    >
                      {!isAvailableFor(vehicle, rentalType) ? 'Not Available' : 'Book Now'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Rental Services</h2>
            <p>Comprehensive solutions for all your travel needs</p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🚗</div>
              <h3>Self-Drive Rental</h3>
              <p>Freedom to explore at your own pace with our well-maintained self-drive vehicles</p>
              <ul>
                <li>Full insurance coverage</li>
                <li>24/7 roadside assistance</li>
                <li>Free delivery in Colombo</li>
                <li>No hidden charges</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">👨‍💼</div>
              <h3>With Driver Service</h3>
              <p>Relax and enjoy your journey with our professional, English-speaking drivers</p>
              <ul>
                <li>Experienced local drivers</li>
                <li>Flexible itineraries</li>
                <li>Local knowledge & tips</li>
                <li>Door-to-door service</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">✈️</div>
              <h3>Airport Transfers</h3>
              <p>Hassle-free airport pickups and drop-offs with meet & greet service</p>
              <ul>
                <li>Flight monitoring</li>
                <li>Meet & greet service</li>
                <li>Luggage assistance</li>
                <li>24/7 availability</li>
              </ul>
            </div>

            <div className="service-card">
              <div className="service-icon">🏨</div>
              <h3>Hotel Transfers</h3>
              <p>Seamless transfers between airports, hotels, and attractions</p>
              <ul>
                <li>Multiple pickup points</li>
                <li>Comfortable vehicles</li>
                <li>Professional service</li>
                <li>Fixed prices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="requirements-section">
        <div className="container">
          <div className="requirements-grid">
            <div className="requirements-card">
              <h3>Requirements for Self-Drive</h3>
              <div className="requirements-list">
                <div className="requirement-item">
                  <h4>📄 Valid Driving License</h4>
                  <p>International Driving Permit or home country license valid in Sri Lanka</p>
                </div>
                <div className="requirement-item">
                  <h4>🆔 Passport & ID</h4>
                  <p>Original passport for tourists or National ID for Sri Lankans</p>
                </div>
                <div className="requirement-item">
                  <h4>💳 Security Deposit</h4>
                  <p>Refundable deposit required (credit card or cash)</p>
                </div>
                <div className="requirement-item">
                  <h4>🎂 Age Requirement</h4>
                  <p>Minimum 21 years old with 2 years driving experience</p>
                </div>
              </div>
            </div>

            <div className="requirements-card">
              <h3>What's Included</h3>
              <div className="included-list">
                <div className="included-item">
                  <span className="check">✅</span>
                  <span>Comprehensive Insurance</span>
                </div>
                <div className="included-item">
                  <span className="check">✅</span>
                  <span>24/7 Roadside Assistance</span>
                </div>
                <div className="included-item">
                  <span className="check">✅</span>
                  <span>Free Delivery & Pickup</span>
                </div>
                <div className="included-item">
                  <span className="check">✅</span>
                  <span>Vehicle Maintenance</span>
                </div>
                <div className="included-item">
                  <span className="check">✅</span>
                  <span>GPS Navigation System</span>
                </div>
                <div className="included-item">
                  <span className="check">✅</span>
                  <span>Child Seats (on request)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rent-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore Sri Lanka?</h2>
            <p>Contact us now to book your perfect vehicle</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary"
                onClick={() => handleWhatsAppBooking(vehicles[0], 'Hello Zamzam Tours! I need help choosing a vehicle for my trip.')}
              >
                📞 Call Us: +94 77 123 4567
              </button>
              <button 
                className="btn-secondary"
                onClick={() => handleWhatsAppBooking(vehicles[0], 'Hello Zamzam Tours! I have questions about vehicle rental.')}
              >
                💬 Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && selectedVehicle && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close"
              onClick={() => setShowBookingForm(false)}
            >
              ×
            </button>
            
            <h2>Book {selectedVehicle.name}</h2>
            
            <div className="vehicle-summary">
              <div className="vehicle-image">
                <Image 
                  src={selectedVehicle.image} 
                  alt={selectedVehicle.name}
                  width={200}
                  height={150}
                  objectFit="cover"
                />
              </div>
              <div className="vehicle-details">
                <h3>{selectedVehicle.name}</h3>
                <div className="detail-item">
                  <span>Category:</span>
                  <span>{selectedVehicle.category}</span>
                </div>
                <div className="detail-item">
                  <span>Capacity:</span>
                  <span>{selectedVehicle.capacity}</span>
                </div>
                <div className="detail-item">
                  <span>Transmission:</span>
                  <span>{selectedVehicle.transmission}</span>
                </div>
                <div className="detail-item">
                  <span>Fuel Type:</span>
                  <span>{selectedVehicle.fuel}</span>
                </div>
              </div>
            </div>

            <form className="booking-form">
              <div className="form-section">
                <h3>Rental Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Rental Type *</label>
                    <select value={rentalType} disabled>
                      <option value="self-drive">Self Drive</option>
                      <option value="with-driver">With Driver</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Customer Type *</label>
                    <select value={customerType} disabled>
                      <option value="tourist">Tourist</option>
                      <option value="local">Sri Lankan</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Pickup Location *</label>
                    <select 
                      value={pickupLocation}
                      onChange={(e) => setPickupLocation(e.target.value)}
                      required
                    >
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>
                          {location.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Pickup Date *</label>
                    <input 
                      type="date" 
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Return Date *</label>
                    <input 
                      type="date" 
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={pickupDate || new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Rental Period</label>
                    <input 
                      type="text" 
                      value={getRentalPeriod()}
                      readOnly
                      className="readonly"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input type="text" required />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input type="tel" required />
                  </div>
                  <div className="form-group">
                    <label>Country *</label>
                    <input type="text" required />
                  </div>
                </div>

                {rentalType === 'self-drive' && (
                  <div className="form-row">
                    <div className="form-group">
                      <label>Driving License Number *</label>
                      <input type="text" required />
                    </div>
                    <div className="form-group">
                      <label>License Country *</label>
                      <input type="text" required />
                    </div>
                  </div>
                )}
              </div>

              <div className="form-section">
                <h3>Price Summary</h3>
                <div className="price-summary">
                  <div className="summary-row">
                    <span>Base Rate ({getRentalPeriod()})</span>
                    <span>${calculatedPrice}</span>
                  </div>
                  <div className="summary-row">
                    <span>Insurance</span>
                    <span>Included</span>
                  </div>
                  <div className="summary-row">
                    <span>Roadside Assistance</span>
                    <span>Included</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total Amount</span>
                    <span>${calculatedPrice}</span>
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  className="btn-primary"
                  onClick={() => handleWhatsAppBooking(selectedVehicle)}
                >
                  Confirm & Book via WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Rent Page Specific Styles */
        .rent-hero {
          position: relative;
          height: 70vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }

        .rent-hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .rent-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(5, 59, 60, 0.8) 0%, rgba(5, 59, 60, 0.4) 100%);
        }

        .rent-hero-content {
          max-width: 800px;
          padding: 0 20px;
          z-index: 1;
        }

        .rent-hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .rent-hero-content p {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }

        .rental-options {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .option-group h3 {
          margin-bottom: 1rem;
          font-size: 1.1rem;
        }

        .option-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .option-btn {
          flex: 1;
          padding: 12px 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .option-btn.active {
          background: var(--secondary-color);
          border-color: var(--secondary-color);
          color: var(--text-color);
          font-weight: 600;
        }

        .option-btn:hover:not(.active) {
          border-color: rgba(255, 255, 255, 0.6);
          background: rgba(255, 255, 255, 0.2);
        }

        /* Quote Section */
        .quote-section {
          padding: 3rem 0;
          background: var(--section-bg);
        }

        .quote-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: 0 auto;
        }

        .quote-card h2 {
          text-align: center;
          color: var(--primary-color);
          margin-bottom: 2rem;
        }

        .quote-form .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--primary-color);
        }

        .form-group select,
        .form-group input {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid var(--border-color);
          border-radius: 5px;
          font-size: 1rem;
        }

        .quote-result {
          background: var(--primary-light);
          color: white;
          padding: 1.5rem;
          border-radius: 10px;
          text-align: center;
        }

        .estimated-price {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .estimated-price .price {
          font-size: 2rem;
          font-weight: 700;
        }

        .estimated-price .period {
          background: var(--secondary-color);
          color: var(--text-color);
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: 600;
        }

        .price-note {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* Vehicles Section */
        .vehicles-section {
          padding: 4rem 0;
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .section-header p {
          font-size: 1.1rem;
          color: var(--text-light);
          margin-bottom: 1rem;
        }

        .customer-badge {
          background: var(--secondary-color);
          color: var(--text-color);
          padding: 8px 16px;
          border-radius: 20px;
          display: inline-block;
          font-weight: 600;
        }

        .vehicles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .vehicle-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .vehicle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .vehicle-image {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .vehicle-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: var(--primary-color);
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .not-available-badge {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #e74c3c;
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .vehicle-content {
          padding: 1.5rem;
        }

        .vehicle-content h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }

        .vehicle-specs {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1rem;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .spec-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 0.3rem;
        }

        .spec-item span:first-child {
          font-size: 1.2rem;
        }

        .spec-item span:last-child {
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .vehicle-features {
          margin-bottom: 1.5rem;
        }

        .vehicle-features h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: var(--primary-color);
        }

        .features-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .feature-tag {
          background: var(--section-bg);
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .pricing-section {
          margin-bottom: 1.5rem;
        }

        .pricing-section h4 {
          font-size: 1rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }

        .price-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0.5rem;
          text-align: center;
        }

        .price-column {
          background: var(--section-bg);
          padding: 0.8rem;
          border-radius: 8px;
        }

        .price-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-light);
          margin-bottom: 0.3rem;
        }

        .price-amount {
          display: block;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .vehicle-actions {
          display: flex;
          gap: 0.5rem;
        }

        .vehicle-actions button {
          flex: 1;
        }

        /* Services Section */
        .services-section {
          padding: 4rem 0;
          background: var(--section-bg);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .service-card:hover {
          transform: translateY(-5px);
        }

        .service-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .service-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }

        .service-card p {
          color: var(--text-light);
          margin-bottom: 1.5rem;
        }

        .service-card ul {
          list-style: none;
          text-align: left;
        }

        .service-card li {
          margin-bottom: 0.5rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .service-card li:before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--secondary-color);
          font-weight: bold;
        }

        /* Requirements Section */
        .requirements-section {
          padding: 4rem 0;
        }

        .requirements-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .requirements-card {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .requirements-card h3 {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .requirements-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .requirement-item h4 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .requirement-item p {
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .included-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .included-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .included-item .check {
          color: var(--secondary-color);
          font-size: 1.1rem;
        }

        /* CTA Section */
        .rent-cta-section {
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

        .rent-cta-section .btn-primary {
          background: var(--secondary-color);
          color: var(--text-color);
        }

        .rent-cta-section .btn-primary:hover {
          background: #e6a500;
        }

        .rent-cta-section .btn-secondary {
          border-color: white;
          color: white;
        }

        .rent-cta-section .btn-secondary:hover {
          background: white;
          color: var(--primary-color);
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

        .vehicle-summary {
          display: flex;
          gap: 1.5rem;
          background: var(--section-bg);
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .vehicle-image {
          flex: 0 0 200px;
        }

        .vehicle-details {
          flex: 1;
        }

        .vehicle-details h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .detail-item:last-child {
          border-bottom: none;
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
        .booking-form select {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid var(--border-color);
          border-radius: 5px;
          font-size: 1rem;
        }

        .booking-form input.readonly {
          background: var(--section-bg);
          color: var(--text-light);
        }

        .price-summary {
          background: var(--section-bg);
          padding: 1.5rem;
          border-radius: 10px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.8rem;
          padding-bottom: 0.8rem;
          border-bottom: 1px solid var(--border-color);
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-row.total {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--primary-color);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .rental-options {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .quote-form .form-row {
            grid-template-columns: 1fr;
          }

          .vehicles-grid {
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          }

          .requirements-grid {
            grid-template-columns: 1fr;
          }

          .vehicle-summary {
            flex-direction: column;
          }

          .booking-form .form-row {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .rent-hero-content h1 {
            font-size: 2.2rem;
          }

          .rent-hero-content p {
            font-size: 1.1rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .option-buttons {
            flex-direction: column;
          }

          .vehicle-specs {
            grid-template-columns: 1fr;
          }

          .price-grid {
            grid-template-columns: 1fr;
          }

          .vehicle-actions {
            flex-direction: column;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 576px) {
          .rent-hero {
            height: 60vh;
            min-height: 400px;
          }

          .rent-hero-content h1 {
            font-size: 1.8rem;
          }

          .vehicles-grid {
            grid-template-columns: 1fr;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}