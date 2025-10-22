// pages/hotels/index.js - Hotel Booking & Integrated Services
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Hotels() {
  const [searchParams, setSearchParams] = useState({
    location: 'all',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1,
    priceRange: [0, 500],
    rating: 0,
    amenities: []
  });
  
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingType, setBookingType] = useState('hotel-only');
  const [selectedPackages, setSelectedPackages] = useState({
    airportTransfer: false,
    dailyTours: false,
    rentalCar: false
  });

  // Hotel locations
  const locations = [
    { id: 'all', name: 'All Sri Lanka' },
    { id: 'colombo', name: 'Colombo' },
    { id: 'kandy', name: 'Kandy' },
    { id: 'galle', name: 'Galle' },
    { id: 'negombo', name: 'Negombo' },
    { id: 'bentota', name: 'Bentota' },
    { id: 'sigiriya', name: 'Sigiriya' },
    { id: 'ella', name: 'Ella' },
    { id: 'nuwara-eliya', name: 'Nuwara Eliya' },
    { id: 'trincomalee', name: 'Trincomalee' }
  ];

  // Amenities filter
  const amenitiesList = [
    { id: 'pool', name: 'Swimming Pool' },
    { id: 'spa', name: 'Spa' },
    { id: 'gym', name: 'Gym' },
    { id: 'wifi', name: 'Free WiFi' },
    { id: 'breakfast', name: 'Breakfast Included' },
    { id: 'beach', name: 'Beach Access' },
    { id: 'restaurant', name: 'Restaurant' },
    { id: 'bar', name: 'Bar' }
  ];

  // Sample hotels data
  const hotels = [
    {
      id: 1,
      name: 'Cinnamon Grand Colombo',
      location: 'colombo',
      rating: 4.8,
      reviews: 1247,
      price: 180,
      image: '/hotels/cinnamon-grand.jpg',
      amenities: ['pool', 'spa', 'gym', 'wifi', 'breakfast', 'restaurant', 'bar'],
      description: 'Luxury 5-star hotel in the heart of Colombo with world-class amenities',
      coordinates: { lat: 6.9271, lng: 79.8612 },
      popularPackages: ['airport-transfer', 'city-tour']
    },
    {
      id: 2,
      name: 'Heritance Kandalama',
      location: 'kandy',
      rating: 4.9,
      reviews: 892,
      price: 220,
      image: '/hotels/kandalama.jpg',
      amenities: ['pool', 'spa', 'wifi', 'breakfast', 'restaurant', 'bar'],
      description: 'Architectural masterpiece nestled between jungle and lake',
      coordinates: { lat: 7.8731, lng: 80.7718 },
      popularPackages: ['airport-transfer', 'cultural-tour']
    },
    {
      id: 3,
      name: 'Fortaleza Hotel Galle',
      location: 'galle',
      rating: 4.7,
      reviews: 567,
      price: 150,
      image: '/hotels/fortaleza.jpg',
      amenities: ['pool', 'wifi', 'breakfast', 'restaurant', 'bar'],
      description: 'Boutique hotel within Galle Fort with colonial charm',
      coordinates: { lat: 6.0320, lng: 80.2160 },
      popularPackages: ['airport-transfer', 'beach-tour']
    },
    {
      id: 4,
      name: 'Jetwing Beach Negombo',
      location: 'negombo',
      rating: 4.6,
      reviews: 734,
      price: 120,
      image: '/hotels/jetwing-beach.jpg',
      amenities: ['pool', 'spa', 'wifi', 'breakfast', 'beach', 'restaurant', 'bar'],
      description: 'Beachfront paradise perfect for relaxation and water sports',
      coordinates: { lat: 7.2080, lng: 79.8450 },
      popularPackages: ['airport-transfer', 'beach-tour']
    },
    {
      id: 5,
      name: 'Ceylon Tea Trails',
      location: 'nuwara-eliya',
      rating: 4.9,
      reviews: 423,
      price: 350,
      image: '/hotels/tea-trails.jpg',
      amenities: ['pool', 'spa', 'wifi', 'breakfast', 'restaurant', 'bar'],
      description: 'Luxury bungalow experience in Sri Lankan tea country',
      coordinates: { lat: 6.9497, lng: 80.7891 },
      popularPackages: ['tea-tour', 'hill-country-tour']
    },
    {
      id: 6,
      name: 'Wild Coast Tented Lodge',
      location: 'yala',
      rating: 4.8,
      reviews: 389,
      price: 280,
      image: '/hotels/wild-coast.jpg',
      amenities: ['pool', 'wifi', 'breakfast', 'restaurant', 'bar'],
      description: 'Luxury tented safari camp near Yala National Park',
      coordinates: { lat: 6.3733, lng: 81.5011 },
      popularPackages: ['safari-tour', 'wildlife-tour']
    },
    {
      id: 7,
      name: 'Uga Jungle Beach',
      location: 'trincomalee',
      rating: 4.5,
      reviews: 298,
      price: 190,
      image: '/hotels/uga-jungle.jpg',
      amenities: ['pool', 'spa', 'wifi', 'breakfast', 'beach', 'restaurant', 'bar'],
      description: 'Secluded beach resort perfect for honeymooners',
      coordinates: { lat: 8.5874, lng: 81.2154 },
      popularPackages: ['beach-tour', 'whale-watching']
    },
    {
      id: 8,
      name: '98 Acres Resort Ella',
      location: 'ella',
      rating: 4.7,
      reviews: 512,
      price: 160,
      image: '/hotels/98-acres.jpg',
      amenities: ['pool', 'spa', 'wifi', 'breakfast', 'restaurant', 'bar'],
      description: 'Eco-luxury resort with stunning views of Ella Gap',
      coordinates: { lat: 6.8767, lng: 81.0583 },
      popularPackages: ['hiking-tour', 'adventure-tour']
    }
  ];

  // Additional services
  const additionalServices = [
    {
      id: 'airport-transfer',
      name: 'Airport Transfer',
      description: 'Hassle-free pickup from airport to hotel',
      price: 25,
      types: ['standard', 'premium'],
      image: '/services/airport-transfer.jpg'
    },
    {
      id: 'daily-tours',
      name: 'Daily Tours',
      description: 'Guided tours from your hotel location',
      price: 50,
      types: ['cultural', 'adventure', 'wildlife', 'beach'],
      image: '/services/daily-tours.jpg'
    },
    {
      id: 'rental-car',
      name: 'Car Rental',
      description: 'Self-drive or with driver vehicle rental',
      price: 40,
      types: ['self-drive', 'with-driver'],
      image: '/services/car-rental.jpg'
    }
  ];

  // Package deals
  const packageDeals = [
    {
      id: 'beach-paradise',
      name: 'Beach Paradise Package',
      description: '7 nights beachfront accommodation + airport transfers + daily beach tours',
      originalPrice: 1200,
      discountedPrice: 999,
      includes: ['7 nights hotel', 'Airport transfers', '3 beach tours', 'Breakfast included'],
      image: '/packages/beach-paradise.jpg'
    },
    {
      id: 'cultural-journey',
      name: 'Cultural Journey Package',
      description: '5 nights heritage hotels + cultural triangle tours + airport transfers',
      originalPrice: 800,
      discountedPrice: 650,
      includes: ['5 nights hotel', 'All entrance fees', 'Expert guide', 'Breakfast & dinner'],
      image: '/packages/cultural-journey.jpg'
    },
    {
      id: 'adventure-combo',
      name: 'Adventure Combo Package',
      description: '6 nights adventure resorts + hiking + safari + transfers',
      originalPrice: 1100,
      discountedPrice: 899,
      includes: ['6 nights hotel', 'Safari experience', 'Hiking tours', 'All transfers'],
      image: '/packages/adventure-combo.jpg'
    }
  ];

  // Filter hotels based on search criteria
  const filteredHotels = hotels.filter(hotel => {
    const matchesLocation = searchParams.location === 'all' || hotel.location === searchParams.location;
    const matchesPrice = hotel.price >= searchParams.priceRange[0] && hotel.price <= searchParams.priceRange[1];
    const matchesRating = hotel.rating >= searchParams.rating;
    const matchesAmenities = searchParams.amenities.length === 0 || 
      searchParams.amenities.every(amenity => hotel.amenities.includes(amenity));
    
    return matchesLocation && matchesPrice && matchesRating && matchesAmenities;
  });

  // Calculate total price for booking
  const calculateTotalPrice = () => {
    if (!selectedHotel) return 0;
    
    let total = selectedHotel.price;
    
    if (selectedPackages.airportTransfer) {
      total += additionalServices.find(s => s.id === 'airport-transfer')?.price || 0;
    }
    if (selectedPackages.dailyTours) {
      total += additionalServices.find(s => s.id === 'daily-tours')?.price || 0;
    }
    if (selectedPackages.rentalCar) {
      total += additionalServices.find(s => s.id === 'rental-car')?.price || 0;
    }
    
    return total;
  };

  // Handle WhatsApp booking
  const handleWhatsAppBooking = () => {
    let message = `Hello Zamzam Tours! I would like to book accommodation and services:\n\n`;
    
    if (selectedHotel) {
      message += `🏨 *Hotel Booking:*\n`;
      message += `• Hotel: ${selectedHotel.name}\n`;
      message += `• Location: ${locations.find(l => l.id === selectedHotel.location)?.name}\n`;
      if (searchParams.checkIn) message += `• Check-in: ${searchParams.checkIn}\n`;
      if (searchParams.checkOut) message += `• Check-out: ${searchParams.checkOut}\n`;
      message += `• Guests: ${searchParams.guests}\n`;
      message += `• Rooms: ${searchParams.rooms}\n`;
      message += `• Hotel Price: $${selectedHotel.price}/night\n\n`;
    }

    message += `🚗 *Additional Services:*\n`;
    if (selectedPackages.airportTransfer) message += `• Airport Transfer: Yes\n`;
    if (selectedPackages.dailyTours) message += `• Daily Tours: Yes\n`;
    if (selectedPackages.rentalCar) message += `• Car Rental: Yes\n\n`;

    message += `💰 *Total Estimated Cost:* $${calculateTotalPrice()}\n\n`;
    message += `Please provide availability and complete booking details.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/94771234567?text=${encodedMessage}`, '_blank');
  };

  // Open hotel details and booking
  const openHotelBooking = (hotel) => {
    setSelectedHotel(hotel);
    setShowBookingForm(true);
  };

  return (
    <>
      <Head>
        <title>Hotel Booking Sri Lanka | Best Accommodations & Packages | Zamzam Tours</title>
        <meta name="description" content="Book best hotels in Sri Lanka with Zamzam Tours. Complete packages with airport transfers, daily tours, and car rentals. Best prices guaranteed." />
        <meta name="keywords" content="Sri Lanka hotels, accommodation booking, hotel packages, beach resorts, luxury hotels, Colombo hotels, Galle hotels" />
      </Head>

      {/* Hero Section */}
      <section className="hotels-hero">
        <div className="hotels-hero-background">
          <Image 
            src="/hotels/hotel-hero.jpg" 
            alt="Luxury Hotels Sri Lanka" 
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="hotels-hero-overlay"></div>
        </div>
        
        <div className="hotels-hero-content">
          <h1>Luxury Accommodations in Sri Lanka</h1>
          <p>Book your perfect stay with integrated travel services</p>
        </div>
      </section>

      {/* Search & Filters Section */}
      <section className="search-section">
        <div className="container">
          <div className="search-card">
            <h2>Find Your Perfect Stay</h2>
            
            <div className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Destination</label>
                  <select 
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                  >
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Check-in Date</label>
                  <input 
                    type="date" 
                    value={searchParams.checkIn}
                    onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Check-out Date</label>
                  <input 
                    type="date" 
                    value={searchParams.checkOut}
                    onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                    min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>Guests</label>
                  <select 
                    value={searchParams.guests}
                    onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Rooms</label>
                  <select 
                    value={searchParams.rooms}
                    onChange={(e) => setSearchParams({...searchParams, rooms: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="advanced-filters">
                <div className="filter-group">
                  <label>Price Range: ${searchParams.priceRange[0]} - ${searchParams.priceRange[1]}</label>
                  <input 
                    type="range" 
                    min="0"
                    max="500"
                    step="10"
                    value={searchParams.priceRange[1]}
                    onChange={(e) => setSearchParams({
                      ...searchParams, 
                      priceRange: [searchParams.priceRange[0], parseInt(e.target.value)]
                    })}
                    className="price-slider"
                  />
                </div>

                <div className="filter-group">
                  <label>Minimum Rating</label>
                  <div className="rating-filters">
                    {[4.5, 4, 3.5, 3, 0].map(rating => (
                      <button
                        key={rating}
                        className={`rating-btn ${searchParams.rating === rating ? 'active' : ''}`}
                        onClick={() => setSearchParams({...searchParams, rating})}
                      >
                        {rating === 0 ? 'Any' : `${rating}+`} ⭐
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>Amenities</label>
                  <div className="amenities-filters">
                    {amenitiesList.map(amenity => (
                      <label key={amenity.id} className="amenity-checkbox">
                        <input
                          type="checkbox"
                          checked={searchParams.amenities.includes(amenity.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSearchParams({
                                ...searchParams,
                                amenities: [...searchParams.amenities, amenity.id]
                              });
                            } else {
                              setSearchParams({
                                ...searchParams,
                                amenities: searchParams.amenities.filter(a => a !== amenity.id)
                              });
                            }
                          }}
                        />
                        <span>{amenity.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button className="btn-primary search-btn">
                Search {filteredHotels.length} Hotels
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Package Deals */}
      <section className="packages-section">
        <div className="container">
          <div className="section-header">
            <h2>All-Inclusive Package Deals</h2>
            <p>Complete vacation packages with hotels, transfers, and tours</p>
          </div>

          <div className="packages-grid">
            {packageDeals.map(pkg => (
              <div key={pkg.id} className="package-card">
                <div className="package-image">
                  <Image 
                    src={pkg.image} 
                    alt={pkg.name}
                    width={400}
                    height={250}
                    objectFit="cover"
                  />
                  <div className="package-badge">Popular Package</div>
                </div>

                <div className="package-content">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  
                  <div className="package-includes">
                    <h4>Includes:</h4>
                    <ul>
                      {pkg.includes.map((item, index) => (
                        <li key={index}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="package-pricing">
                    <div className="price-original">${pkg.originalPrice}</div>
                    <div className="price-discounted">${pkg.discountedPrice}</div>
                    <div className="price-save">Save ${pkg.originalPrice - pkg.discountedPrice}</div>
                  </div>

                  <button 
                    className="btn-primary"
                    onClick={() => {
                      const message = `Hello Zamzam Tours! I'm interested in the "${pkg.name}" package. Please send me more details and availability.`;
                      const encodedMessage = encodeURIComponent(message);
                      window.open(`https://wa.me/94771234567?text=${encodedMessage}`, '_blank');
                    }}
                  >
                    Book This Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="hotels-grid-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Hotels & Resorts</h2>
            <p>Curated selection of the best accommodations across Sri Lanka</p>
          </div>

          <div className="hotels-grid">
            {filteredHotels.map(hotel => (
              <div key={hotel.id} className="hotel-card">
                <div className="hotel-image">
                  <Image 
                    src={hotel.image} 
                    alt={hotel.name}
                    width={400}
                    height={250}
                    objectFit="cover"
                  />
                  <div className="hotel-rating">
                    <span>⭐ {hotel.rating}</span>
                    <span>({hotel.reviews})</span>
                  </div>
                  <div className="hotel-location">
                    {locations.find(l => l.id === hotel.location)?.name}
                  </div>
                </div>

                <div className="hotel-content">
                  <h3>{hotel.name}</h3>
                  <p className="hotel-description">{hotel.description}</p>
                  
                  <div className="hotel-amenities">
                    {hotel.amenities.slice(0, 4).map(amenity => (
                      <span key={amenity} className="amenity-tag">
                        {amenitiesList.find(a => a.id === amenity)?.name}
                      </span>
                    ))}
                    {hotel.amenities.length > 4 && (
                      <span className="amenity-more">+{hotel.amenities.length - 4} more</span>
                    )}
                  </div>

                  <div className="hotel-popular">
                    <span>Popular with:</span>
                    <div className="popular-tags">
                      {hotel.popularPackages.map(pkg => (
                        <span key={pkg} className="popular-tag">{pkg.replace('-', ' ')}</span>
                      ))}
                    </div>
                  </div>

                  <div className="hotel-footer">
                    <div className="hotel-price">
                      <span className="price">${hotel.price}</span>
                      <span className="period">per night</span>
                    </div>
                    <div className="hotel-actions">
                      <button 
                        className="btn-secondary"
                        onClick={() => openHotelBooking(hotel)}
                      >
                        View Details
                      </button>
                      <button 
                        className="btn-primary"
                        onClick={() => {
                          setSelectedHotel(hotel);
                          setShowBookingForm(true);
                        }}
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredHotels.length === 0 && (
            <div className="no-results">
              <h3>No hotels found matching your criteria</h3>
              <p>Try adjusting your filters or search parameters</p>
              <button 
                className="btn-primary"
                onClick={() => setSearchParams({
                  location: 'all',
                  checkIn: '',
                  checkOut: '',
                  guests: 2,
                  rooms: 1,
                  priceRange: [0, 500],
                  rating: 0,
                  amenities: []
                })}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Additional Services */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Complete Your Travel Experience</h2>
            <p>Add these services to make your trip seamless</p>
          </div>

          <div className="services-grid">
            {additionalServices.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-image">
                  <Image 
                    src={service.image} 
                    alt={service.name}
                    width={300}
                    height={200}
                    objectFit="cover"
                  />
                </div>
                
                <div className="service-content">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  
                  <div className="service-types">
                    {service.types.map(type => (
                      <span key={type} className="type-tag">{type}</span>
                    ))}
                  </div>

                  <div className="service-price">
                    <span>From ${service.price}</span>
                  </div>

                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      const message = `Hello Zamzam Tours! I'm interested in ${service.name} service. Please provide more details.`;
                      const encodedMessage = encodeURIComponent(message);
                      window.open(`https://wa.me/94771234567?text=${encodedMessage}`, '_blank');
                    }}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrated Services Banner */}
      <section className="integrated-banner">
        <div className="container">
          <div className="banner-content">
            <h2>One Booking, Complete Journey</h2>
            <p>From airport pickup to hotel stay, daily tours, and departure - we handle everything</p>
            
            <div className="banner-steps">
              <div className="step">
                <div className="step-icon">🛬</div>
                <div className="step-text">
                  <h4>Airport Pickup</h4>
                  <p>Meet & greet service with comfortable transfer to hotel</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">🏨</div>
                <div className="step-text">
                  <h4>Hotel Stay</h4>
                  <p>Luxury accommodation with best locations and amenities</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">🚗</div>
                <div className="step-text">
                  <h4>Daily Tours</h4>
                  <p>Guided excursions from your hotel to major attractions</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">✈️</div>
                <div className="step-text">
                  <h4>Departure Transfer</h4>
                  <p>Timely pickup from hotel to airport for your flight</p>
                </div>
              </div>
            </div>

            <div className="banner-cta">
              <button 
                className="btn-primary large"
                onClick={() => {
                  const message = `Hello Zamzam Tours! I want to book a complete travel package including hotel, transfers, and tours. Please help me plan my trip.`;
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/94771234567?text=${encodedMessage}`, '_blank');
                }}
              >
                💬 Plan My Complete Trip on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && selectedHotel && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <button 
              className="modal-close"
              onClick={() => setShowBookingForm(false)}
            >
              ×
            </button>
            
            <h2>Book {selectedHotel.name}</h2>
            
            <div className="booking-tabs">
              <button 
                className={`tab ${bookingType === 'hotel-only' ? 'active' : ''}`}
                onClick={() => setBookingType('hotel-only')}
              >
                Hotel Only
              </button>
              <button 
                className={`tab ${bookingType === 'with-services' ? 'active' : ''}`}
                onClick={() => setBookingType('with-services')}
              >
                Hotel + Services
              </button>
              <button 
                className={`tab ${bookingType === 'complete-package' ? 'active' : ''}`}
                onClick={() => setBookingType('complete-package')}
              >
                Complete Package
              </button>
            </div>

            <div className="booking-content">
              {/* Hotel Summary */}
              <div className="hotel-summary">
                <div className="hotel-image">
                  <Image 
                    src={selectedHotel.image} 
                    alt={selectedHotel.name}
                    width={200}
                    height={150}
                    objectFit="cover"
                  />
                </div>
                <div className="hotel-details">
                  <h3>{selectedHotel.name}</h3>
                  <div className="hotel-meta">
                    <span>⭐ {selectedHotel.rating} ({selectedHotel.reviews} reviews)</span>
                    <span>📍 {locations.find(l => l.id === selectedHotel.location)?.name}</span>
                    <span>💰 ${selectedHotel.price}/night</span>
                  </div>
                </div>
              </div>

              {/* Booking Form */}
              <form className="booking-form">
                <div className="form-section">
                  <h3>Booking Details</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Check-in Date *</label>
                      <input 
                        type="date" 
                        value={searchParams.checkIn}
                        onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Check-out Date *</label>
                      <input 
                        type="date" 
                        value={searchParams.checkOut}
                        onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Guests *</label>
                      <select 
                        value={searchParams.guests}
                        onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
                        required
                      >
                        {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Rooms *</label>
                      <select 
                        value={searchParams.rooms}
                        onChange={(e) => setSearchParams({...searchParams, rooms: parseInt(e.target.value)})}
                        required
                      >
                        {[1,2,3,4].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? 'Room' : 'Rooms'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                {bookingType !== 'hotel-only' && (
                  <div className="form-section">
                    <h3>Additional Services</h3>
                    <div className="services-selection">
                      {additionalServices.map(service => (
                        <label key={service.id} className="service-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedPackages[service.id]}
                            onChange={(e) => setSelectedPackages({
                              ...selectedPackages,
                              [service.id]: e.target.checked
                            })}
                          />
                          <div className="service-info">
                            <span className="service-name">{service.name}</span>
                            <span className="service-desc">{service.description}</span>
                            <span className="service-price">+${service.price}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                <div className="form-section">
                  <h3>Price Summary</h3>
                  <div className="price-summary">
                    <div className="summary-row">
                      <span>Hotel ({searchParams.rooms} rooms)</span>
                      <span>${selectedHotel.price * searchParams.rooms}</span>
                    </div>
                    
                    {selectedPackages.airportTransfer && (
                      <div className="summary-row">
                        <span>Airport Transfer</span>
                        <span>+${additionalServices.find(s => s.id === 'airport-transfer')?.price}</span>
                      </div>
                    )}
                    
                    {selectedPackages.dailyTours && (
                      <div className="summary-row">
                        <span>Daily Tours</span>
                        <span>+${additionalServices.find(s => s.id === 'daily-tours')?.price}</span>
                      </div>
                    )}
                    
                    {selectedPackages.rentalCar && (
                      <div className="summary-row">
                        <span>Car Rental</span>
                        <span>+${additionalServices.find(s => s.id === 'rental-car')?.price}</span>
                      </div>
                    )}

                    <div className="summary-row total">
                      <span>Total Amount</span>
                      <span>${calculateTotalPrice()}</span>
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
                    onClick={handleWhatsAppBooking}
                  >
                    Confirm & Book via WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Hotels Page Specific Styles */
        .hotels-hero {
          position: relative;
          height: 60vh;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }

        .hotels-hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .hotels-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(5, 59, 60, 0.8) 0%, rgba(5, 59, 60, 0.4) 100%);
        }

        .hotels-hero-content {
          max-width: 800px;
          padding: 0 20px;
          z-index: 1;
        }

        .hotels-hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .hotels-hero-content p {
          font-size: 1.3rem;
          opacity: 0.9;
        }

        /* Search Section */
        .search-section {
          padding: 3rem 0;
          background: var(--section-bg);
        }

        .search-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .search-card h2 {
          text-align: center;
          color: var(--primary-color);
          margin-bottom: 2rem;
        }

        .search-form .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
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

        .advanced-filters {
          border-top: 1px solid var(--border-color);
          padding-top: 2rem;
          margin-bottom: 2rem;
        }

        .filter-group {
          margin-bottom: 1.5rem;
        }

        .filter-group label {
          display: block;
          margin-bottom: 1rem;
          font-weight: 600;
          color: var(--primary-color);
        }

        .price-slider {
          width: 100%;
          height: 5px;
          border-radius: 5px;
          background: var(--border-color);
          outline: none;
        }

        .rating-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .rating-btn {
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          background: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .rating-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .amenities-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.5rem;
        }

        .amenity-checkbox {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .amenity-checkbox input {
          width: auto;
        }

        .search-btn {
          width: 100%;
          padding: 15px;
          font-size: 1.1rem;
        }

        /* Packages Section */
        .packages-section {
          padding: 4rem 0;
        }

        .packages-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .package-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .package-card:hover {
          transform: translateY(-5px);
        }

        .package-image {
          position: relative;
          height: 200px;
        }

        .package-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: var(--secondary-color);
          color: var(--text-color);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .package-content {
          padding: 1.5rem;
        }

        .package-content h3 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .package-content p {
          color: var(--text-light);
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .package-includes {
          margin-bottom: 1.5rem;
        }

        .package-includes h4 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }

        .package-includes ul {
          list-style: none;
          padding: 0;
        }

        .package-includes li {
          margin-bottom: 0.3rem;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .package-pricing {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .price-original {
          text-decoration: line-through;
          color: var(--text-light);
          font-size: 1.1rem;
        }

        .price-discounted {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .price-save {
          background: #e74c3c;
          color: white;
          padding: 3px 8px;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        /* Hotels Grid */
        .hotels-grid-section {
          padding: 4rem 0;
          background: var(--section-bg);
        }

        .hotels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        .hotel-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .hotel-card:hover {
          transform: translateY(-5px);
        }

        .hotel-image {
          position: relative;
          height: 200px;
        }

        .hotel-rating {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .hotel-location {
          position: absolute;
          bottom: 15px;
          left: 15px;
          background: var(--primary-color);
          color: white;
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .hotel-content {
          padding: 1.5rem;
        }

        .hotel-content h3 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .hotel-description {
          color: var(--text-light);
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .hotel-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .amenity-tag {
          background: var(--section-bg);
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
          color: var(--text-light);
        }

        .amenity-more {
          background: var(--primary-light);
          color: white;
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .hotel-popular {
          margin-bottom: 1.5rem;
        }

        .hotel-popular span {
          font-size: 0.8rem;
          color: var(--text-light);
          margin-bottom: 0.5rem;
          display: block;
        }

        .popular-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
        }

        .popular-tag {
          background: var(--secondary-color);
          color: var(--text-color);
          padding: 2px 6px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .hotel-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .hotel-price .price {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .hotel-price .period {
          display: block;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .hotel-actions {
          display: flex;
          gap: 0.5rem;
        }

        /* Services Section */
        .services-section {
          padding: 4rem 0;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .service-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }

        .service-image {
          height: 150px;
        }

        .service-content {
          padding: 1.5rem;
        }

        .service-content h3 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .service-content p {
          color: var(--text-light);
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .service-types {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-bottom: 1rem;
        }

        .type-tag {
          background: var(--section-bg);
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
          color: var(--text-light);
          text-transform: capitalize;
        }

        .service-price {
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        /* Integrated Banner */
        .integrated-banner {
          padding: 4rem 0;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
        }

        .banner-content h2 {
          text-align: center;
          margin-bottom: 1rem;
          font-size: 2.5rem;
        }

        .banner-content > p {
          text-align: center;
          margin-bottom: 3rem;
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .banner-steps {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .step {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .step-icon {
          font-size: 2.5rem;
          flex-shrink: 0;
        }

        .step-text h4 {
          margin-bottom: 0.5rem;
          font-size: 1.2rem;
        }

        .step-text p {
          opacity: 0.9;
          font-size: 0.9rem;
        }

        .banner-cta {
          text-align: center;
        }

        .btn-primary.large {
          padding: 15px 30px;
          font-size: 1.1rem;
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

        .modal-content.large {
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
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

        .booking-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          margin-bottom: 2rem;
        }

        .booking-tabs .tab {
          flex: 1;
          padding: 1rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .booking-tabs .tab.active {
          border-bottom-color: var(--primary-color);
          color: var(--primary-color);
          font-weight: 600;
        }

        .hotel-summary {
          display: flex;
          gap: 1.5rem;
          background: var(--section-bg);
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .hotel-image {
          flex: 0 0 200px;
        }

        .hotel-details h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .hotel-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          color: var(--text-light);
        }

        .services-selection {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .service-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .service-checkbox:hover {
          border-color: var(--primary-color);
        }

        .service-checkbox input {
          margin-top: 0.3rem;
        }

        .service-info {
          flex: 1;
        }

        .service-name {
          display: block;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 0.3rem;
        }

        .service-desc {
          display: block;
          color: var(--text-light);
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
        }

        .service-price {
          display: block;
          font-weight: 600;
          color: var(--primary-color);
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
          .search-form .form-row {
            grid-template-columns: 1fr 1fr;
          }

          .amenities-filters {
            grid-template-columns: 1fr 1fr;
          }

          .banner-steps {
            grid-template-columns: 1fr;
          }

          .hotel-summary {
            flex-direction: column;
          }
        }

        @media (max-width: 768px) {
          .hotels-hero-content h1 {
            font-size: 2.2rem;
          }

          .hotels-hero-content p {
            font-size: 1.1rem;
          }

          .search-form .form-row {
            grid-template-columns: 1fr;
          }

          .packages-grid {
            grid-template-columns: 1fr;
          }

          .hotels-grid {
            grid-template-columns: 1fr;
          }

          .services-grid {
            grid-template-columns: 1fr;
          }

          .booking-tabs {
            flex-direction: column;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 576px) {
          .hotels-hero {
            height: 50vh;
            min-height: 300px;
          }

          .hotels-hero-content h1 {
            font-size: 1.8rem;
          }

          .search-card {
            padding: 1.5rem;
          }

          .amenities-filters {
            grid-template-columns: 1fr;
          }

          .modal-content.large {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}