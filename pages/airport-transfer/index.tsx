// pages/airport-transfer/index.js - Airport Transfers Main Page
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function AirportTransfer() {
  const [transferType, setTransferType] = useState('standard');
  const [passengers, setPassengers] = useState(1);
  const [luggage, setLuggage] = useState(1);
  const [flightNumber, setFlightNumber] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [pickupLocation, setPickupLocation] = useState('cmb-airport');
  const [dropoffLocation, setDropoffLocation] = useState('colombo-city');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Additional form state for database submission
  const [pickupType, setPickupType] = useState<'one_way' | 'two_way'>('one_way');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Transfer services
  const transferServices = [
    {
      type: 'standard',
      name: 'Standard Transfer',
      description: 'Direct and reliable transfer from airport to your destination',
      features: [
        'Airport pickup with name board',
        'Direct transfer to destination', 
        'English speaking driver',
        'Luggage assistance',
        'Air-conditioned vehicle',
        'Free waiting time (1 hour)'
      ],
      price: 25,
      vehicles: ['Toyota Prius', 'Toyota Aqua', 'Suzuki WagonR'],
      image: '/transfer/standard.jpg',
      icon: '🚗'
    },
    {
      type: 'premium',
      name: 'Premium Transfer',
      description: 'Luxury service with meet & greet and VIP treatment',
      features: [
        'Personal meet & greet at arrivals',
        'Professional chauffeur service',
        'VIP lounge access (if available)',
        'Complimentary refreshments',
        'Premium luxury vehicle',
        'Multi-lingual chauffeur',
        'Free waiting time (2 hours)'
      ],
      price: 45,
      vehicles: ['Toyota Camry', 'Mercedes Benz', 'BMW Series'],
      image: '/transfer/premium.jpg',
      icon: '⭐'
    },
    {
      type: 'group',
      name: 'Group Transfer',
      description: 'Perfect for families, friends and small groups',
      features: [
        'Spacious vehicle for groups',
        'Multiple stops allowed',
        'Child seats available',
        'Special group discounts',
        'Extra luggage space',
        'Experienced group driver'
      ],
      price: 60,
      vehicles: ['Toyota KDH', 'Every Buddy Van', 'Shuttle Van'],
      image: '/transfer/group.jpg',
      icon: '👨‍👩‍👧‍👦'
    }
  ];

  // Airport locations
  const airports = [
    { id: 'cmb-airport', name: 'Bandaranaike International Airport (CMB)', code: 'CMB' },
    { id: 'hri-airport', name: 'Mattala Rajapaksa International Airport (HRI)', code: 'HRI' },
    { id: 'colombo-city', name: 'Colombo City Center', code: 'City' },
    { id: 'colombo-hotels', name: 'Colombo Hotel Area', code: 'Hotels' }
  ];

<<<<<<< Updated upstream
  // Popular destinations from airport
  const popularDestinations = [
    { 
      id: 'colombo-city',
      name: 'Colombo City', 
      distance: '35km', 
      time: '45-60 min', 
      standardPrice: 25,
      premiumPrice: 45,
      image: '/destinations/colombo.jpg'
    },
    { 
      id: 'negombo-beach',
      name: 'Negombo Beach', 
      distance: '8km', 
      time: '15-20 min', 
      standardPrice: 15,
      premiumPrice: 30,
      image: '/destinations/negombo.jpg'
    },
    { 
      id: 'kandy-city',
      name: 'Kandy City', 
      distance: '115km', 
      time: '3-4 hours', 
      standardPrice: 80,
      premiumPrice: 120,
      image: '/destinations/kandy.jpg'
    },
    { 
      id: 'galle-fort',
      name: 'Galle Fort', 
      distance: '150km', 
      time: '3.5 hours', 
      standardPrice: 100,
      premiumPrice: 150,
      image: '/destinations/galle.jpg'
    },
    { 
      id: 'bentota-beach',
      name: 'Bentota Beach', 
      distance: '95km', 
      time: '2 hours', 
      standardPrice: 70,
      premiumPrice: 100,
      image: '/destinations/bentota.jpg'
    },
    { 
      id: 'sigiriya',
      name: 'Sigiriya', 
      distance: '175km', 
      time: '4-5 hours', 
      standardPrice: 120,
      premiumPrice: 180,
      image: '/destinations/sigiriya.jpg'
=======
  // Sri Lankan districts
  const districts = [
    'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
    'Galle', 'Matara', 'Hambantota', 'Jaffna', 'Kilinochchi', 'Mannar',
    'Vavuniya', 'Mullaitivu', 'Batticaloa', 'Ampara', 'Trincomalee',
    'Kurunegala', 'Puttalam', 'Anuradhapura', 'Polonnaruwa', 'Badulla',
    'Monaragala', 'Ratnapura', 'Kegalle'
  ];

  // Vehicles from DB
  type Vehicle = { vehicle_id: string; vehicle_name: string; capacity: number };
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/vehicles');
        if (!res.ok) return;
        const data = await res.json();
        // Expecting array with vehicle_name and capacity
        if (mounted) setVehicles(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load vehicles', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Get available vehicles based on passenger count
  const getAvailableVehicles = () => {
    return vehicles.filter(v => (v.capacity ?? 0) >= passengers);
  };

  // Get pickup options based on trip type
  const getPickupOptions = () => {
    if (tripType === 'one-way') {
      return airports;
    } else {
      return districts;
>>>>>>> Stashed changes
    }
  ];

  // Vehicle options based on passengers
  const vehicleOptions = [
    { type: 'sedan', name: 'Toyota Prius/Aqua', capacity: '3 passengers + 2 luggage', price: 0 },
    { type: 'suv', name: 'Toyota KDH/Van', capacity: '6-8 passengers + 4 luggage', price: 15 },
    { type: 'large-van', name: 'Every Buddy Van', capacity: '8-10 passengers + 6 luggage', price: 25 },
    { type: 'shuttle', name: 'Shuttle Van', capacity: '10-12 passengers + 8 luggage', price: 35 },
    { type: 'bus', name: 'Tourist Bus', capacity: '30-50 passengers + 20 luggage', price: 100 }
  ];

  // Calculate price based on selections
  useEffect(() => {
    let basePrice = 0;
    const selectedService = transferServices.find(service => service.type === transferType);
    const selectedDestination = popularDestinations.find(dest => dest.id === dropoffLocation);
    
    if (selectedService && selectedDestination) {
      basePrice = transferType === 'standard' ? selectedDestination.standardPrice : selectedDestination.premiumPrice;
      
      // Add vehicle upgrade cost based on passengers
      if (passengers > 3) basePrice += 15;
      if (passengers > 6) basePrice += 25;
      if (passengers > 10) basePrice += 35;
      
      setCalculatedPrice(basePrice);
    }
  }, [transferType, passengers, dropoffLocation]);

  // Handle WhatsApp booking
  const handleWhatsAppBooking = (customMessage = '') => {
    const selectedService = transferServices.find(service => service.type === transferType);
    const selectedDestination = popularDestinations.find(dest => dest.id === dropoffLocation);
    
    let message = customMessage;
    if (!customMessage) {
      message = `Hello Zamzam Tours! I would like to book a ${selectedService?.name} transfer. \n\n`;
      message += `• Service: ${selectedService?.name}\n`;
      message += `• From: ${airports.find(a => a.id === pickupLocation)?.name}\n`;
      message += `• To: ${selectedDestination?.name}\n`;
      message += `• Passengers: ${passengers}\n`;
      message += `• Luggage: ${luggage} pieces\n`;
      if (flightNumber) message += `• Flight: ${flightNumber}\n`;
      if (arrivalDate) message += `• Arrival Date: ${arrivalDate}\n`;
      if (arrivalTime) message += `• Arrival Time: ${arrivalTime}\n`;
      message += `• Estimated Price: $${calculatedPrice}\n\n`;
      message += `Please confirm availability and provide booking details.`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/94766135110?text=${encodedMessage}`, '_blank');
  };

  // Get recommended vehicle based on passengers
  const getRecommendedVehicle = () => {
    if (passengers <= 3) return vehicleOptions[0];
    if (passengers <= 6) return vehicleOptions[1];
    if (passengers <= 10) return vehicleOptions[2];
    if (passengers <= 12) return vehicleOptions[3];
    return vehicleOptions[4];
  };

<<<<<<< Updated upstream
  // Handle form submission to database
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullName || !email || !phone || !arrivalDate || !arrivalTime) {
      alert('Please fill in all required fields');
      return;
=======
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1) Persist request in DB via API
    try {
      // Build a local datetime string without timezone to avoid shifting the selected time
      const localPickupTime = (() => {
        if (pickupDate && pickupTime) {
          return `${pickupDate}T${pickupTime}:00`;
        }
        // fallback to current local datetime formatted as YYYY-MM-DDTHH:mm:ss
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        const y = now.getFullYear();
        const m = pad(now.getMonth() + 1);
        const d = pad(now.getDate());
        const hh = pad(now.getHours());
        const mm = pad(now.getMinutes());
        const ss = pad(now.getSeconds());
        return `${y}-${m}-${d}T${hh}:${mm}:${ss}`;
      })();

      const payload = {
        pickup_type: tripType === 'one-way' ? 'one_way' as const : 'two_way' as const,
        pickup_from: pickupLocation, // airport (one-way) or district (two-way)
        dropoff: dropoffLocation,
        airport: tripType === 'one-way' ? pickupLocation : airport, // ensure NOT NULL in DB
        passengers: passengers,
  pickup_time: localPickupTime,
        vehicle: selectedVehicle,
        note: notes,
        price: 0, // pricing handled later by admin
        status: 'pending' as const
      };

      const res = await fetch('/api/airport-pickups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Airport pickup create failed:', err);
        alert('Sorry, something went wrong saving your request. Please try again.');
        return;
      }
    } catch (err) {
      console.error(err);
      alert('Sorry, something went wrong saving your request. Please try again.');
      return;
    }

    // 2) Open WhatsApp with nicely formatted summary
    let message = '';
    message += '\u{1F697} *AIRPORT TRANSFER BOOKING REQUEST*\n';
    message += '\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\u{2501}\n\n';
    
    message += '*TRIP DETAILS*\n';
    message += `\u{251C} Type: ${tripType === 'one-way' ? '\u{2708}\u{FE0F} One Way' : '\u{1F504} Round Trip'}\n`;
    message += `\u{251C} Passengers: \u{1F465} ${passengers} ${passengers === 1 ? 'Person' : 'People'}\n`;
    message += `\u{2514} Vehicle: \u{1F699} ${selectedVehicle}\n\n`;
    
    if (tripType === 'one-way') {
      message += '*JOURNEY*\n';
      message += `\u{251C} From: \u{2708}\u{FE0F} ${pickupLocation}\n`;
      message += `\u{2514} To: \u{1F4CD} ${dropoffLocation}\n\n`;
      
      message += '*SCHEDULE*\n';
      message += `\u{251C} Date: \u{1F4C5} ${pickupDate}\n`;
      message += `\u{2514} Time: \u{23F0} ${pickupTime}\n`;
    } else {
      message += '*JOURNEY*\n';
      message += `\u{251C} Pickup: \u{1F4CD} ${pickupLocation}\n`;
      message += `\u{251C} Airport: \u{2708}\u{FE0F} ${airport}\n`;
      message += `\u{2514} Drop-off: \u{1F4CD} ${dropoffLocation}\n\n`;
      
      message += '*SCHEDULE*\n';
      message += `\u{251C} Date: \u{1F4C5} ${pickupDate}\n`;
      message += `\u{2514} Time: \u{23F0} ${pickupTime}\n`;
>>>>>>> Stashed changes
    }

    setSubmitting(true);

    try {
      const pickupFrom = airports.find(a => a.id === pickupLocation)?.name || pickupLocation;
      const dropoff = popularDestinations.find(d => d.id === dropoffLocation)?.name || dropoffLocation;
      const airportName = pickupLocation.includes('airport') ? 
        airports.find(a => a.id === pickupLocation)?.name : '';
      const recommendedVehicle = getRecommendedVehicle();
      
      // Combine date and time for pickup_time
      const pickupDateTime = new Date(`${arrivalDate}T${arrivalTime}`).toISOString();

      const payload = {
        pickup_type: pickupType,
        pickup_from: pickupFrom,
        dropoff: dropoff,
        airport: airportName,
        passengers: passengers,
        pickup_time: pickupDateTime,
        vehicle: recommendedVehicle.name,
        note: `Customer: ${fullName}\nEmail: ${email}\nPhone: ${phone}\nNationality: ${nationality}\nFlight: ${flightNumber || 'N/A'}\nService Type: ${transferServices.find(s => s.type === transferType)?.name}\n${additionalNotes}`,
        price: calculatedPrice
      };

      const response = await fetch('/api/airport-pickups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit booking');
      }

      const result = await response.json();
      console.log('Booking created:', result);
      
      alert('Booking submitted successfully! We will contact you shortly via WhatsApp.');
      
      // Reset form
      setShowBookingForm(false);
      setFullName('');
      setEmail('');
      setPhone('');
      setNationality('');
      setAdditionalNotes('');
      
      // Send WhatsApp notification
      handleWhatsAppBooking();
    } catch (error: any) {
      console.error('Booking submission error:', error);
      alert('Failed to submit booking: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Head>
        <title>Airport Transfers Sri Lanka | Meet & Greet Service | Zamzam Tours</title>
        <meta name="description" content="Hassle-free airport transfers in Sri Lanka with meet & greet service. Professional drivers and comfortable vehicles from Colombo Airport." />
        <meta name="keywords" content="Sri Lanka airport transfer, Colombo airport pickup, meet and greet, CMB airport, taxi service, airport taxi Sri Lanka" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="transfer-hero" style={{ marginTop: '80px' }}>
        <div className="transfer-hero-background">
          <Image 
            src="/transfer/airport-hero.jpg" 
            alt="Airport Transfer Service" 
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="transfer-hero-overlay"></div>
        </div>
        
        <div className="transfer-hero-content">
          <h1>Stress-Free Airport Transfers in Sri Lanka</h1>
          <p>Professional meet & greet service with comfortable vehicles</p>
          
          <div className="hero-features">
            <div className="feature-item">
              <span className="icon">👨‍💼</span>
              <span>Meet & Greet</span>
            </div>
            <div className="feature-item">
              <span className="icon">🚗</span>
              <span>Professional Drivers</span>
            </div>
            <div className="feature-item">
              <span className="icon">⏱️</span>
              <span>24/7 Service</span>
            </div>
            <div className="feature-item">
              <span className="icon">💰</span>
              <span>No Hidden Costs</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Booking Widget */}
      <section className="booking-widget-section">
        <div className="container">
          <div className="booking-widget">
            <h2>Book Your Airport Transfer</h2>
            <div className="widget-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Service Type</label>
                  <div className="service-buttons">
                    {transferServices.map(service => (
                      <button
                        key={service.type}
                        className={`service-btn ${transferType === service.type ? 'active' : ''}`}
                        onClick={() => setTransferType(service.type)}
                      >
                        <span className="service-icon">{service.icon}</span>
                        <span className="service-name">{service.name}</span>
                        <span className="service-price">From ${service.price}</span>
                      </button>
                    ))}
<<<<<<< Updated upstream
                  </div>
=======
                  </select>
                </div>

                <div className="form-group">
                  <label>🚙 Select Vehicle</label>
                  <select 
                    value={selectedVehicle}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {getAvailableVehicles().map((vehicle) => (
                      <option key={vehicle.vehicle_id} value={vehicle.vehicle_name}>{vehicle.vehicle_name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Pickup From</label>
                  <select 
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                  >
                    {airports.map(airport => (
                      <option key={airport.id} value={airport.id}>
                        {airport.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Dropoff To</label>
                  <select 
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                  >
                    {popularDestinations.map(destination => (
                      <option key={destination.id} value={destination.id}>
                        {destination.name} - {destination.distance} - {destination.time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of Passengers</label>
                  <select 
                    value={passengers}
                    onChange={(e) => setPassengers(parseInt(e.target.value))}
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'passenger' : 'passengers'}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Number of Luggage</label>
                  <select 
                    value={luggage}
                    onChange={(e) => setLuggage(parseInt(e.target.value))}
                  >
                    {[1,2,3,4,5,6,7,8].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'piece' : 'pieces'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Flight Number (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="e.g., UL 123"
                    value={flightNumber}
                    onChange={(e) => setFlightNumber(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Arrival Date</label>
                  <input 
                    type="date" 
                    value={arrivalDate}
                    onChange={(e) => setArrivalDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Arrival Time</label>
                  <input 
                    type="time" 
                    value={arrivalTime}
                    onChange={(e) => setArrivalTime(e.target.value)}
                  />
                </div>
              </div>

              {calculatedPrice > 0 && (
                <div className="price-summary">
                  <div className="price-details">
                    <div className="price-line">
                      <span>Transfer Cost:</span>
                      <span>${calculatedPrice}</span>
                    </div>
                    <div className="price-line">
                      <span>Recommended Vehicle:</span>
                      <span>{getRecommendedVehicle().name}</span>
                    </div>
                    <div className="price-total">
                      <span>Total Amount:</span>
                      <span>${calculatedPrice}</span>
                    </div>
                  </div>
                  
                  <button 
                    className="btn-primary large"
                    onClick={() => setShowBookingForm(true)}
                  >
                    Book Now - ${calculatedPrice}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Services Details */}
      <section className="services-details-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Transfer Services</h2>
            <p>Choose the perfect service for your arrival in Sri Lanka</p>
          </div>

          <div className="services-grid">
            {transferServices.map(service => (
              <div key={service.type} className="service-card detailed">
                <div className="service-header">
                  <div className="service-icon-large">{service.icon}</div>
                  <h3>{service.name}</h3>
                  <p className="service-description">{service.description}</p>
                </div>

                <div className="service-features">
                  <h4>What's Included:</h4>
                  <ul>
                    {service.features.map((feature, index) => (
                      <li key={index}>✓ {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="service-vehicles">
                  <h4>Available Vehicles:</h4>
                  <div className="vehicles-list">
                    {service.vehicles.map((vehicle, index) => (
                      <span key={index} className="vehicle-tag">{vehicle}</span>
                    ))}
                  </div>
                </div>

                <div className="service-action">
                  <button 
                    className={`btn-primary ${transferType === service.type ? 'active' : ''}`}
                    onClick={() => setTransferType(service.type)}
                  >
                    Select This Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Transfer Routes</h2>
            <p>Quick transfers to major destinations across Sri Lanka</p>
          </div>

          <div className="destinations-grid">
            {popularDestinations.map(destination => (
              <div key={destination.id} className="destination-card transfer">
                <div className="destination-image">
                  <Image 
                    src={destination.image} 
                    alt={destination.name}
                    width={300}
                    height={200}
                    objectFit="cover"
                  />
                </div>
                
                <div className="destination-content">
                  <h3>{destination.name}</h3>
                  <div className="destination-meta">
                    <span>📏 {destination.distance}</span>
                    <span>⏱️ {destination.time}</span>
                  </div>
                  
                  <div className="pricing">
                    <div className="price-option">
                      <span>Standard:</span>
                      <span className="price">${destination.standardPrice}</span>
                    </div>
                    <div className="price-option">
                      <span>Premium:</span>
                      <span className="price premium">${destination.premiumPrice}</span>
                    </div>
                  </div>

                  <button 
                    className="btn-small"
                    onClick={() => {
                      setDropoffLocation(destination.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    Select This Route
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet & Greet Features */}
      <section className="meet-greet-section">
        <div className="container">
          <div className="meet-greet-content">
            <div className="content-text">
              <h2>Premium Meet & Greet Service</h2>
              <p>Experience the ultimate airport arrival service designed for your comfort and convenience</p>
              
              <div className="features-list">
                <div className="feature">
                  <div className="feature-icon">🛬</div>
                  <div className="feature-text">
                    <h4>Airport Arrival Assistance</h4>
                    <p>Our representative will meet you at the arrival gate with a name board</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon">🎯</div>
                  <div className="feature-text">
                    <h4>On-Time Service</h4>
                    <p>Punctual and reliable pickup service at the scheduled time</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon">🧳</div>
                  <div className="feature-text">
                    <h4>Luggage Handling</h4>
                    <p>We assist with your luggage from baggage claim to the vehicle</p>
                  </div>
                </div>
                
                <div className="feature">
                  <div className="feature-icon">💬</div>
                  <div className="feature-text">
                    <h4>Local SIM & Information</h4>
                    <p>Get local SIM card assistance and travel information upon arrival</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="content-image">
              <Image 
                src="/transfer/meet-greet.jpg" 
                alt="Meet and Greet Service"
                width={400}
                height={500}
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="transfer-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready for a Stress-Free Arrival?</h2>
            <p>Book your airport transfer now and start your Sri Lankan adventure the right way</p>
            <div className="cta-buttons">
              <button 
                className="btn-primary large"
                onClick={() => setShowBookingForm(true)}
              >
                Book Transfer Now
              </button>
              <button 
                className="btn-secondary"
                onClick={() => handleWhatsAppBooking('Hello Zamzam Tours! I have questions about airport transfer services.')}
              >
                💬 Chat on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close"
              onClick={() => setShowBookingForm(false)}
            >
              ×
            </button>
            
            <h2>Confirm Your Airport Transfer</h2>
            
            <div className="booking-summary">
              <div className="summary-item">
                <span>Trip Type:</span>
                <div className="trip-type-selector">
                  <button 
                    className={`trip-btn ${pickupType === 'one_way' ? 'active' : ''}`}
                    onClick={() => setPickupType('one_way')}
                    type="button"
                  >
                    One Way
                  </button>
                  <button 
                    className={`trip-btn ${pickupType === 'two_way' ? 'active' : ''}`}
                    onClick={() => setPickupType('two_way')}
                    type="button"
                  >
                    Round Trip
                  </button>
                </div>
              </div>
              <div className="summary-item">
                <span>Service Type:</span>
                <span>{transferServices.find(s => s.type === transferType)?.name}</span>
              </div>
              <div className="summary-item">
                <span>From:</span>
                <span>{airports.find(a => a.id === pickupLocation)?.name}</span>
              </div>
              <div className="summary-item">
                <span>To:</span>
                <span>{popularDestinations.find(d => d.id === dropoffLocation)?.name}</span>
              </div>
              <div className="summary-item">
                <span>Passengers:</span>
                <span>{passengers}</span>
              </div>
              <div className="summary-item">
                <span>Luggage:</span>
                <span>{luggage} pieces</span>
              </div>
              {flightNumber && (
                <div className="summary-item">
                  <span>Flight Number:</span>
                  <span>{flightNumber}</span>
                </div>
              )}
              <div className="summary-item total">
                <span>Total Amount:</span>
                <span>${calculatedPrice}</span>
              </div>
            </div>

            <form className="booking-form" onSubmit={handleFormSubmit}>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone Number *</label>
                    <input 
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+94 XXX XXX XXX"
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Nationality *</label>
                    <input 
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      required 
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Flight Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label>Airline & Flight Number</label>
                    <input 
                      type="text" 
                      value={flightNumber}
                      onChange={(e) => setFlightNumber(e.target.value)}
                      placeholder="e.g., Emirates EK 650"
                    />
                  </div>
                  <div className="form-group">
                    <label>Arrival Date *</label>
                    <input 
                      type="date" 
                      value={arrivalDate}
                      onChange={(e) => setArrivalDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Scheduled Arrival Time *</label>
                    <input 
                      type="time" 
                      value={arrivalTime}
                      onChange={(e) => setArrivalTime(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Terminal (if known)</label>
                    <input type="text" placeholder="e.g., Terminal 1" />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3>Special Requirements</h3>
                <div className="form-group">
                  <label>Additional Notes</label>
                  <textarea 
                    rows={3}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Child seats needed, special assistance required, multiple stops, etc."
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowBookingForm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Submitting...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Airport Transfer Specific Styles */
        .transfer-hero {
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
          background: linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%);
        }

        .transfer-hero-content {
          max-width: 800px;
          padding: 0 20px;
          z-index: 1;
        }

        .transfer-hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .transfer-hero-content p {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }

        .hero-features {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .feature-item .icon {
          font-size: 2rem;
        }

        /* Booking Widget */
        .booking-widget-section {
          padding: 3rem 0;
          background: var(--section-bg);
        }

        .booking-widget {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          max-width: 900px;
          margin: 0 auto;
        }

        .booking-widget h2 {
          text-align: center;
          color: var(--primary-color);
          margin-bottom: 2rem;
        }

        .service-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .service-btn {
          padding: 1.5rem 1rem;
          border: 2px solid var(--border-color);
          background: white;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }

        .service-btn.active {
          border-color: var(--primary-color);
          background: var(--primary-color);
          color: white;
        }

        .service-btn:hover:not(.active) {
          border-color: var(--primary-light);
        }

        .service-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .service-name {
          display: block;
          font-weight: 600;
          margin-bottom: 0.3rem;
        }

        .service-price {
          display: block;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .widget-form .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .widget-form .form-group:last-child {
          grid-column: 1 / -1;
        }

        .widget-form label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--primary-color);
        }

        .widget-form select,
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

        .trip-type-selector {
          display: flex;
          gap: 0.5rem;
        }

        .trip-btn {
          flex: 1;
          padding: 8px 16px;
          border: 2px solid var(--border-color);
          background: white;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .trip-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .trip-btn:hover:not(.active) {
          border-color: var(--primary-light);
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
          .meet-greet-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .widget-form .form-row {
            grid-template-columns: 1fr;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .destinations-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
            gap: 1rem;
          }

          .service-buttons {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .booking-form .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 576px) {
          .transfer-hero {
            height: 60vh;
            min-height: 400px;
          }

          .transfer-hero-content h1 {
            font-size: 1.8rem;
          }

          .booking-widget {
            padding: 1.5rem;
          }

          .modal-content {
            padding: 1rem;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}