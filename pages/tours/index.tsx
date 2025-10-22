// pages/tours/index.js - Tours Main Page
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

interface Tour {
  id: number;
  name: string;
  duration: string;
  price: number;
  difficulty: string;
  season: string;
  category: string;
  description: string;
  image: string;
  highlights: string[];
  included: string[];
  itinerary: any[];
}

export default function Tours() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tour categories
  const categories = [
    { id: 'all', name: 'All Tours' },
    { id: 'cultural', name: 'Cultural' },
    { id: 'adventure', name: 'Adventure' },
    { id: 'beach', name: 'Beach & Relaxation' },
    { id: 'wildlife', name: 'Wildlife' },
    { id: 'north-east', name: 'North East' },
    { id: 'hill-country', name: 'Hill Country' },
    { id: 'historical', name: 'Historical' }
  ];

  // Duration filters
  const durations = [
    { id: 'all', name: 'Any Duration' },
    { id: '1-3', name: '1-3 Days' },
    { id: '4-7', name: '4-7 Days' },
    { id: '8-14', name: '8-14 Days' },
    { id: '15+', name: '15+ Days' }
  ];

  // Price ranges
  const priceRanges = [
    { id: 'all', name: 'Any Price' },
    { id: 'budget', name: 'Budget ($500-$1000)' },
    { id: 'standard', name: 'Standard ($1000-$2000)' },
    { id: 'premium', name: 'Premium ($2000-$4000)' },
    { id: 'luxury', name: 'Luxury ($4000+)' }
  ];

  // Sample tour data
  const tours = [
    {
      id: 1,
      name: 'North East Cultural Explorer',
      category: 'north-east',
      duration: '7 days',
      priceRange: 'standard',
      price: 1250,
      image: '/tours/north-east.jpg',
      highlights: ['Trincomalee Beaches', 'Koneswaram Temple', 'Batticaloa Lagoon', 'Arugam Bay Surfing'],
      description: 'Explore the untouched beauty of Sri Lanka\'s North Eastern region with its pristine beaches, rich Tamil culture, and historical sites.',
      includes: ['Accommodation', 'Transport', 'English Guide', 'Entrance Fees', 'Breakfast'],
      difficulty: 'Easy',
      groupSize: '2-12 people',
      season: 'Year-round',
      rating: 4.8,
      reviews: 124
    },
    {
      id: 2,
      name: 'Cultural Triangle Heritage Tour',
      category: 'cultural',
      duration: '5 days',
      priceRange: 'budget',
      price: 750,
      image: '/tours/cultural-triangle.jpg',
      highlights: ['Sigiriya Rock Fortress', 'Dambulla Cave Temple', 'Polonnaruwa Ancient City', 'Minneriya Safari'],
      description: 'Journey through Sri Lanka\'s ancient kingdoms and UNESCO World Heritage sites in the cultural heartland.',
      includes: ['Accommodation', 'Transport', 'Guide', 'Entrance Fees', 'All Meals'],
      difficulty: 'Moderate',
      groupSize: '2-15 people',
      season: 'Year-round',
      rating: 4.9,
      reviews: 203
    },
    {
      id: 3,
      name: 'Hill Country Adventure',
      category: 'adventure',
      duration: '6 days',
      priceRange: 'standard',
      price: 1100,
      image: '/tours/hill-country.jpg',
      highlights: ['Ella Rock Hike', 'Adam\'s Peak Pilgrimage', 'Tea Plantation Tour', 'Nine Arch Bridge', 'Ravana Falls'],
      description: 'Trek through misty mountains, visit tea estates, and experience the cool climate of Sri Lanka\'s hill country.',
      includes: ['Accommodation', 'Transport', 'Adventure Guide', 'All Meals', 'Activity Equipment'],
      difficulty: 'Moderate to Challenging',
      groupSize: '2-8 people',
      season: 'December to April',
      rating: 4.7,
      reviews: 89
    },
    {
      id: 4,
      name: 'Wildlife Safari Expedition',
      category: 'wildlife',
      duration: '4 days',
      priceRange: 'premium',
      price: 1800,
      image: '/tours/wildlife-safari.jpg',
      highlights: ['Yala National Park', 'Udawalawe Elephant Sanctuary', 'Wilpattu Leopard Spotting', 'Bird Watching'],
      description: 'Get up close with Sri Lanka\'s diverse wildlife including elephants, leopards, and hundreds of bird species.',
      includes: ['Luxury Tented Camp', 'Safari Jeep', 'Expert Naturalist', 'All Meals', 'Park Fees'],
      difficulty: 'Easy',
      groupSize: '2-6 people',
      season: 'February to July',
      rating: 4.9,
      reviews: 156
    },
    {
      id: 5,
      name: 'Beach Paradise Tour',
      category: 'beach',
      duration: '8 days',
      priceRange: 'standard',
      price: 1350,
      image: '/tours/beach-paradise.jpg',
      highlights: ['Mirissa Whale Watching', 'Unawatuna Beach', 'Tangalle Bay', 'Galle Fort Exploration', 'Snorkeling'],
      description: 'Relax on pristine beaches, enjoy water sports, and explore coastal fortresses on this tropical getaway.',
      includes: ['Beach Resorts', 'Transport', 'Some Meals', 'Water Activities', 'Guide'],
      difficulty: 'Easy',
      groupSize: '2-10 people',
      season: 'November to April',
      rating: 4.6,
      reviews: 178
    },
    {
      id: 6,
      name: 'Ancient Kingdoms Tour',
      category: 'historical',
      duration: '10 days',
      priceRange: 'premium',
      price: 2200,
      image: '/tours/ancient-kingdoms.jpg',
      highlights: ['Anuradhapura Sacred City', 'Mihintale', 'Ritigala Monastery', 'Yapahuwa Rock Fortress'],
      description: 'Discover the grandeur of Sri Lanka\'s ancient civilizations and their remarkable architectural achievements.',
      includes: ['Boutique Hotels', 'Private Transport', 'Archaeology Expert', 'All Meals', 'Special Access'],
      difficulty: 'Moderate',
      groupSize: '2-8 people',
      season: 'Year-round',
      rating: 4.8,
      reviews: 67
    }
  ];

  // Popular destinations in Sri Lanka
  const popularDestinations = [
    {
      name: 'Sigiriya',
      image: '/destinations/sigiriya.jpg',
      description: 'Ancient rock fortress with stunning frescoes and water gardens',
      tours: 15
    },
    {
      name: 'Ella',
      image: '/destinations/ella.jpg',
      description: 'Mountain town with hiking trails and panoramic views',
      tours: 12
    },
    {
      name: 'Galle',
      image: '/destinations/galle.jpg',
      description: 'Historic Dutch fort with boutique shops and cafes',
      tours: 18
    },
    {
      name: 'Kandy',
      image: '/destinations/kandy.jpg',
      description: 'Cultural capital with the Temple of the Sacred Tooth',
      tours: 20
    },
    {
      name: 'Yala',
      image: '/destinations/yala.jpg',
      description: 'Famous national park for leopard and elephant spotting',
      tours: 8
    },
    {
      name: 'Arugam Bay',
      image: '/destinations/arugam-bay.jpg',
      description: 'Surfing paradise on the East Coast',
      tours: 6
    }
  ];

  // Activities available
  const activities = [
    {
      name: 'Wildlife Safaris',
      icon: '🦁',
      description: 'Elephant, leopard and bird watching in national parks'
    },
    {
      name: 'Hiking & Trekking',
      icon: '🥾',
      description: 'Mountain trails and nature walks'
    },
    {
      name: 'Cultural Sites',
      icon: '🏛️',
      description: 'Ancient temples, forts and historical monuments'
    },
    {
      name: 'Beach Activities',
      icon: '🏖️',
      description: 'Swimming, surfing, snorkeling and relaxation'
    },
    {
      name: 'Tea Experiences',
      icon: '🍵',
      description: 'Tea plantation tours and tasting sessions'
    },
    {
      name: 'Adventure Sports',
      icon: '🚵',
      description: 'White water rafting, cycling and more'
    }
  ];

  // Filter tours based on selected criteria
  const filteredTours = tours.filter(tour => {
    const matchesCategory = activeCategory === 'all' || tour.category === activeCategory;
    const matchesDuration = selectedDuration === 'all' || 
      (selectedDuration === '1-3' && tour.duration.includes('3')) ||
      (selectedDuration === '4-7' && (tour.duration.includes('5') || tour.duration.includes('6') || tour.duration.includes('7'))) ||
      (selectedDuration === '8-14' && (tour.duration.includes('8') || tour.duration.includes('10'))) ||
      (selectedDuration === '15+' && parseInt(tour.duration) >= 15);
    const matchesPrice = selectedPriceRange === 'all' || tour.priceRange === selectedPriceRange;
    const matchesSearch = searchQuery === '' || 
      tour.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDuration && matchesPrice && matchesSearch;
  });

  // Handle WhatsApp booking
  const handleWhatsAppBooking = (tour: any) => {
    const message = `Hello Zamzam Tours! I'm interested in booking the "${tour.name}" tour. Please provide more details and availability.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/94766135110?text=${encodedMessage}`, '_blank');
  };

  // Open booking form
  const openBookingForm = (tour: any) => {
    setSelectedTour(tour);
    setShowBookingForm(true);
  };

  return (
    <>
      <Head>
        <title>Sri Lanka Tour Packages | Zamzam Tours</title>
        <meta name="description" content="Discover amazing Sri Lanka tour packages with Zamzam Tours. Cultural, adventure, beach, wildlife, and North East tours with expert guides and best prices." />
        <meta name="keywords" content="Sri Lanka tours, cultural tours, adventure tours, beach tours, wildlife safari, North East Sri Lanka, tour packages" />
      </Head>

      {/* Header/Navbar */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <Link href="/">
              <Image src="/logo.svg" alt="Zamzam Tours" width={150} height={60} />
            </Link>
          </div>
          
          <nav className={`nav ${isMenuOpen ? 'nav-open' : ''}`}>
            <Link href="/">Home</Link>
            <Link href="/tours">Tours</Link>
            <Link href="/self-drive">Self Drive</Link>
            <Link href="/airport-transfer">Airport Transfer</Link>
            <Link href="/hotels">Hotels</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            
            <div className="language-selector">
              <button className="lang-btn">EN</button>
              <button className="lang-btn">DE</button>
            </div>
          </nav>

          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="tours-hero">
        <div className="tours-hero-background">
          <Image 
            src="/tours/hero-tours.jpg" 
            alt="Sri Lanka Tours" 
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="tours-hero-overlay"></div>
        </div>
        
        <div className="tours-hero-content">
          <h1>Discover Sri Lanka with Expert Guides</h1>
          <p>Curated tour packages showcasing the best of Sri Lankan culture, nature, and adventure</p>
          
          <div className="hero-search">
            <input
              type="text"
              placeholder="Search tours by name, destination, or activity..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button className="search-btn">
              <span>🔍</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="tours-main">
        <div className="container">
          {/* Filters Section */}
          <section className="filters-section">
            <div className="filters-grid">
              {/* Category Filter */}
              <div className="filter-group">
                <label>Tour Category</label>
                <div className="filter-buttons">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div className="filter-group">
                <label>Duration</label>
                <select 
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="filter-select"
                >
                  {durations.map(duration => (
                    <option key={duration.id} value={duration.id}>
                      {duration.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div className="filter-group">
                <label>Price Range</label>
                <select 
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="filter-select"
                >
                  {priceRanges.map(range => (
                    <option key={range.id} value={range.id}>
                      {range.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Tours Grid */}
          <section className="tours-grid-section">
            <div className="section-header">
              <h2>Featured Tour Packages</h2>
              <p>Handpicked experiences for every type of traveler</p>
            </div>

            {filteredTours.length > 0 ? (
              <div className="tours-grid">
                {filteredTours.map(tour => (
                  <div key={tour.id} className="tour-card">
                    <div className="tour-image">
                      <Image 
                        src={tour.image} 
                        alt={tour.name}
                        width={400}
                        height={250}
                        objectFit="cover"
                      />
                      <div className="tour-badge">{tour.category.replace('-', ' ')}</div>
                      <div className="tour-rating">
                        <span>⭐ {tour.rating}</span>
                        <span>({tour.reviews})</span>
                      </div>
                    </div>

                    <div className="tour-content">
                      <div className="tour-meta">
                        <span className="duration">🕐 {tour.duration}</span>
                        <span className="difficulty">⚡ {tour.difficulty}</span>
                        <span className="group">👥 {tour.groupSize}</span>
                      </div>

                      <h3>{tour.name}</h3>
                      <p className="tour-description">{tour.description}</p>

                      <div className="tour-highlights">
                        <h4>Highlights:</h4>
                        <ul>
                          {tour.highlights.slice(0, 3).map((highlight, index) => (
                            <li key={index}>✓ {highlight}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="tour-includes">
                        <h4>Includes:</h4>
                        <p>{tour.includes.join(', ')}</p>
                      </div>

                      <div className="tour-footer">
                        <div className="tour-price">
                          <span className="price">${tour.price}</span>
                          <span className="per-person">per person</span>
                        </div>
                        <div className="tour-actions">
                          <button 
                            className="btn-secondary"
                            onClick={() => openBookingForm(tour)}
                          >
                            View Details
                          </button>
                          <button 
                            className="btn-primary"
                            onClick={() => handleWhatsAppBooking(tour)}
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>No tours found matching your criteria</h3>
                <p>Try adjusting your filters or search terms</p>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setActiveCategory('all');
                    setSelectedDuration('all');
                    setSelectedPriceRange('all');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>

          {/* Popular Destinations */}
          <section className="destinations-section">
            <div className="section-header">
              <h2>Popular Destinations in Sri Lanka</h2>
              <p>Explore the most sought-after locations across the island</p>
            </div>

            <div className="destinations-grid">
              {popularDestinations.map((destination, index) => (
                <div key={index} className="destination-card">
                  <div className="destination-image">
                    <Image 
                      src={destination.image} 
                      alt={destination.name}
                      width={300}
                      height={200}
                      objectFit="cover"
                    />
                    <div className="destination-overlay">
                      <h3>{destination.name}</h3>
                      <p>{destination.description}</p>
                      <span className="tour-count">{destination.tours} tours available</span>
                      <Link href={`/destinations/${destination.name.toLowerCase().replace(' ', '-')}`} className="btn-small">
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Activities Section */}
          <section className="activities-section">
            <div className="section-header">
              <h2>Things to Do in Sri Lanka</h2>
              <p>Experience diverse activities across the island</p>
            </div>

            <div className="activities-grid">
              {activities.map((activity, index) => (
                <div key={index} className="activity-card">
                  <div className="activity-icon">{activity.icon}</div>
                  <h3>{activity.name}</h3>
                  <p>{activity.description}</p>
                  <Link href={`/activities/${activity.name.toLowerCase().replace(' ', '-')}`} className="link-arrow">
                    Find Tours →
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Special Offers */}
          <section className="offers-section">
            <div className="offer-banner">
              <div className="offer-content">
                <h2>Special Offer: North East Tour Package</h2>
                <p>Book our exclusive North East cultural tour and get 15% off with free airport transfer</p>
                <div className="offer-details">
                  <span className="original-price">$1250</span>
                  <span className="discounted-price">$1062</span>
                  <span className="discount-badge">Save 15%</span>
                </div>
                <button 
                  className="btn-primary"
                  onClick={() => handleWhatsAppBooking(tours[0])}
                >
                  Grab This Offer
                </button>
              </div>
              <div className="offer-image">
                <Image 
                  src="/tours/special-offer.jpg" 
                  alt="Special Offer"
                  width={400}
                  height={250}
                  objectFit="cover"
                />
              </div>
            </div>
          </section>

          {/* Cancellation Policy */}
          <section className="policy-section">
            <div className="policy-card">
              <h2>Flexible Cancellation Policy</h2>
              <div className="policy-details">
                <div className="policy-item">
                  <h3>✅ 14+ Days Notice</h3>
                  <p>50% refund of tour cost</p>
                </div>
                <div className="policy-item">
                  <h3>❌ Less than 14 Days</h3>
                  <p>No refund available</p>
                </div>
                <div className="policy-item">
                  <h3>🔄 Rescheduling</h3>
                  <p>Free rescheduling up to 7 days before tour</p>
                </div>
              </div>
              <p className="policy-note">* Some special tours may have different cancellation policies</p>
            </div>
          </section>
        </div>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && selectedTour && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="modal-close"
              onClick={() => setShowBookingForm(false)}
            >
              ×
            </button>
            
            <h2>Book {selectedTour.name}</h2>
            
            <div className="tour-summary">
              <div className="summary-item">
                <span>Duration:</span>
                <span>{selectedTour.duration}</span>
              </div>
              <div className="summary-item">
                <span>Price:</span>
                <span>${selectedTour.price} per person</span>
              </div>
              <div className="summary-item">
                <span>Difficulty:</span>
                <span>{selectedTour.difficulty}</span>
              </div>
              <div className="summary-item">
                <span>Best Season:</span>
                <span>{selectedTour.season}</span>
              </div>
            </div>

            <form className="booking-form">
              <div className="form-group">
                <label>Full Name *</label>
                <input type="text" required />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input type="email" required />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input type="tel" required />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Number of Travelers *</label>
                  <select required>
                    <option value="">Select</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'person' : 'people'}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Preferred Start Date *</label>
                  <input type="date" required />
                </div>
              </div>

              <div className="form-group">
                <label>Special Requirements</label>
                <textarea rows={3} placeholder="Dietary restrictions, accessibility needs, etc."></textarea>
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
                  onClick={() => handleWhatsAppBooking(selectedTour)}
                >
                  Proceed to WhatsApp Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Tours Page Specific Styles */
        .tours-hero {
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

        .tours-hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .tours-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(5, 59, 60, 0.8) 0%, rgba(5, 59, 60, 0.4) 100%);
        }

        .tours-hero-content {
          max-width: 800px;
          padding: 0 20px;
          z-index: 1;
        }

        .tours-hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .tours-hero-content p {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }

        .hero-search {
          display: flex;
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 50px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        }

        .search-input {
          flex: 1;
          padding: 15px 25px;
          border: none;
          outline: none;
          font-size: 1rem;
        }

        .search-btn {
          padding: 15px 25px;
          background: var(--primary-color);
          border: none;
          color: white;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .search-btn:hover {
          background: var(--primary-light);
        }

        /* Main Content */
        .tours-main {
          padding: 80px 0;
        }

        /* Filters Section */
        .filters-section {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          margin-bottom: 3rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 2rem;
          align-items: end;
        }

        .filter-group label {
          display: block;
          margin-bottom: 0.8rem;
          font-weight: 600;
          color: var(--primary-color);
        }

        .filter-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          background: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .filter-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .filter-btn:hover:not(.active) {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }

        .filter-select {
          width: 100%;
          padding: 10px 15px;
          border: 1px solid var(--border-color);
          border-radius: 5px;
          background: white;
          font-size: 1rem;
        }

        /* Section Headers */
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
          max-width: 600px;
          margin: 0 auto;
        }

        /* Tours Grid */
        .tours-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .tour-card {
          background: white;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .tour-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .tour-image {
          position: relative;
          height: 250px;
          overflow: hidden;
        }

        .tour-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: var(--secondary-color);
          color: var(--text-color);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .tour-rating {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(255, 255, 255, 0.9);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .tour-content {
          padding: 1.5rem;
        }

        .tour-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .tour-meta span {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .tour-content h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }

        .tour-description {
          color: var(--text-light);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .tour-highlights {
          margin-bottom: 1.5rem;
        }

        .tour-highlights h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: var(--primary-color);
        }

        .tour-highlights ul {
          list-style: none;
          padding: 0;
        }

        .tour-highlights li {
          margin-bottom: 0.3rem;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .tour-includes {
          margin-bottom: 1.5rem;
        }

        .tour-includes h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: var(--primary-color);
        }

        .tour-includes p {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .tour-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .tour-price .price {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .tour-price .per-person {
          display: block;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .tour-actions {
          display: flex;
          gap: 0.5rem;
        }

        /* No Results */
        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--section-bg);
          border-radius: 10px;
          margin-bottom: 4rem;
        }

        .no-results h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .no-results p {
          color: var(--text-light);
          margin-bottom: 2rem;
        }

        /* Destinations Section */
        .destinations-section {
          margin-bottom: 4rem;
        }

        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .destination-card {
          border-radius: 10px;
          overflow: hidden;
          position: relative;
          height: 250px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .destination-image {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .destination-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(5, 59, 60, 0.85);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 2rem;
          text-align: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .destination-card:hover .destination-overlay {
          opacity: 1;
        }

        .destination-overlay h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .destination-overlay p {
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .tour-count {
          background: var(--secondary-color);
          color: var(--text-color);
          padding: 3px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        /* Activities Section */
        .activities-section {
          margin-bottom: 4rem;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .activity-card {
          background: white;
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease;
        }

        .activity-card:hover {
          transform: translateY(-5px);
        }

        .activity-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .activity-card h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }

        .activity-card p {
          color: var(--text-light);
          margin-bottom: 1.5rem;
          font-size: 0.9rem;
        }

        .link-arrow {
          color: var(--primary-color);
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
        }

        .link-arrow:hover {
          color: var(--primary-light);
        }

        /* Offers Section */
        .offers-section {
          margin-bottom: 4rem;
        }

        .offer-banner {
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          border-radius: 15px;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: white;
        }

        .offer-content {
          flex: 1;
          max-width: 500px;
        }

        .offer-content h2 {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .offer-content p {
          margin-bottom: 1.5rem;
          opacity: 0.9;
        }

        .offer-details {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .original-price {
          text-decoration: line-through;
          opacity: 0.7;
        }

        .discounted-price {
          font-size: 1.5rem;
          font-weight: 700;
        }

        .discount-badge {
          background: var(--secondary-color);
          color: var(--text-color);
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: 600;
        }

        .offer-image {
          flex: 0 0 300px;
        }

        /* Policy Section */
        .policy-section {
          margin-bottom: 4rem;
        }

        .policy-card {
          background: var(--section-bg);
          padding: 3rem;
          border-radius: 15px;
          text-align: center;
        }

        .policy-card h2 {
          color: var(--primary-color);
          margin-bottom: 2rem;
        }

        .policy-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .policy-item h3 {
          margin-bottom: 0.5rem;
          color: var(--primary-color);
        }

        .policy-item p {
          color: var(--text-light);
        }

        .policy-note {
          font-size: 0.9rem;
          color: var(--text-light);
          font-style: italic;
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
          max-width: 600px;
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

        .tour-summary {
          background: var(--section-bg);
          padding: 1.5rem;
          border-radius: 10px;
          margin-bottom: 2rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .summary-item:last-child {
          margin-bottom: 0;
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
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .filters-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .filter-buttons {
            justify-content: center;
          }

          .tours-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }

          .offer-banner {
            flex-direction: column;
            text-align: center;
          }

          .offer-content {
            max-width: 100%;
            margin-bottom: 2rem;
          }
        }

        @media (max-width: 768px) {
          .tours-hero-content h1 {
            font-size: 2.2rem;
          }

          .tours-hero-content p {
            font-size: 1.1rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }

          .tours-grid {
            grid-template-columns: 1fr;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .tour-footer {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
          }

          .tour-actions {
            justify-content: space-between;
          }
        }

        @media (max-width: 576px) {
          .tours-hero {
            height: 60vh;
            min-height: 400px;
          }

          .tours-hero-content h1 {
            font-size: 1.8rem;
          }

          .hero-search {
            flex-direction: column;
            border-radius: 10px;
          }

          .search-input {
            padding: 12px 20px;
          }

          .search-btn {
            padding: 12px 20px;
          }

          .filter-buttons {
            justify-content: flex-start;
          }

          .filter-btn {
            font-size: 0.8rem;
            padding: 6px 12px;
          }

          .activities-grid {
            grid-template-columns: 1fr;
          }

          .policy-details {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}