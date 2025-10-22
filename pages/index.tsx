// pages/index.tsx - Homepage
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('self-drive');
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  
  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' }
  ];
  
  // Vehicle fleet data
  const vehicles = [
    { name: 'Bus', capacity: '30-50', type: 'self-drive, with-driver', image: '/vehicles/bus.svg' },
    { name: 'KDH', capacity: '6-8', type: 'self-drive, with-driver', image: '/vehicles/kdh.svg' },
    { name: 'Tour Van', capacity: '12-15', type: 'self-drive, with-driver', image: '/vehicles/tour-van.svg' },
    { name: 'WagonR', capacity: '4', type: 'self-drive, with-driver', image: '/vehicles/wagonr.svg' },
    { name: 'Shuttle', capacity: '10-12', type: 'self-drive, with-driver', image: '/vehicles/shuttle.svg' },
    { name: 'Every Buddy Van', capacity: '8-10', type: 'self-drive, with-driver', image: '/vehicles/every-buddy.svg' },
    { name: 'Aqua', capacity: '4', type: 'self-drive, with-driver', image: '/vehicles/aqua.svg' },
    { name: 'Prius', capacity: '4', type: 'self-drive, with-driver', image: '/vehicles/prius.svg' }
  ];
  
  // Popular destinations
  const destinations = [
    { name: 'Sigiriya', image: '/destinations/sigiriya.svg', description: 'Ancient rock fortress' },
    { name: 'Kandy', image: '/destinations/kandy.svg', description: 'Cultural capital' },
    { name: 'Galle', image: '/destinations/galle.svg', description: 'Historic fort city' },
    { name: 'Ella', image: '/destinations/ella.svg', description: 'Mountain paradise' },
    { name: 'Yala', image: '/destinations/yala.svg', description: 'Wildlife sanctuary' },
    { name: 'Nuwara Eliya', image: '/destinations/nuwara-eliya.svg', description: 'Little England' }
  ];
  
  // Tour packages
  const tourPackages = [
    { name: 'North East Tour', duration: '7 days', highlights: ['Trincomalee', 'Batticaloa', 'Arugam Bay'] },
    { name: 'Cultural Triangle', duration: '5 days', highlights: ['Sigiriya', 'Dambulla', 'Polonnaruwa'] },
    { name: 'Hill Country', duration: '6 days', highlights: ['Kandy', 'Nuwara Eliya', 'Ella'] },
    { name: 'Beach Paradise', duration: '8 days', highlights: ['Mirissa', 'Galle', 'Hikkaduwa'] }
  ];
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle WhatsApp booking
  const handleWhatsAppBooking = (service: string) => {
    const message = `Hello Zamzam Tours! I'm interested in booking ${service}. Please provide more details.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/94766135110?text=${encodedMessage}`, '_blank');
  };
  
  return (
    <>
      <Head>
        <title>Zamzam Tours - Best Travel Experience in Sri Lanka</title>
        <meta name="description" content="Zamzam Tours offers premium self-drive car rentals, guided tours, and airport transfers across Sri Lanka. Experience the best of Sri Lankan hospitality with our extensive fleet and professional services." />
        <meta name="keywords" content="Sri Lanka tours, car rental Sri Lanka, airport transfer, self-drive, guided tours, hotel booking, things to do in Sri Lanka" />
        <meta property="og:title" content="Zamzam Tours - Best Travel Experience in Sri Lanka" />
        <meta property="og:description" content="Premium travel services including self-drive car rentals, guided tours, and airport transfers across Sri Lanka." />
        <meta property="og:image" content="/images/og-image.jpg" />
        <meta property="og:url" content="https://zamzamtours.com" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      {/* Header */}
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="logo">
            <Image src="/logo.svg" alt="Zamzam Tours" width={150} height={60} />
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
              <select 
                value={activeLanguage} 
                onChange={(e) => setActiveLanguage(e.target.value)}
                className="language-dropdown"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
            </div>
          </nav>
          
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <div className="hero-background">
          {/* Using gradient fallback instead of video for now */}
          <div className="hero-fallback"></div>
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">
            Discover the Wonders of <span>Sri Lanka</span>
          </h1>
          <p className="hero-subtitle">
            Premium self-drive car rentals, guided tours, and airport transfers across the island
          </p>
          
          <div className="hero-buttons">
            <button 
              className="btn btn-primary"
              onClick={() => handleWhatsAppBooking('a tour package')}
            >
              Book a Tour
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleWhatsAppBooking('a vehicle')}
            >
              Rent a Vehicle
            </button>
          </div>
        </div>
        
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="arrow-down"></div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="services">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          
          <div className="services-tabs">
            <button 
              className={`tab ${activeTab === 'self-drive' ? 'active' : ''}`}
              onClick={() => setActiveTab('self-drive')}
            >
              Self-Drive Rentals
            </button>
            <button 
              className={`tab ${activeTab === 'tours' ? 'active' : ''}`}
              onClick={() => setActiveTab('tours')}
            >
              Guided Tours
            </button>
            <button 
              className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
              onClick={() => setActiveTab('transfer')}
            >
              Airport Transfers
            </button>
          </div>
          
          <div className="services-content">
            {activeTab === 'self-drive' && (
              <div className="service-details">
                <h3>Flexible Vehicle Rentals</h3>
                <p>Choose from our extensive fleet for self-drive or with driver options. All vehicles are well-maintained and fully insured for your safety.</p>
                
                <div className="vehicle-grid">
                  {vehicles.map((vehicle, index) => (
                    <div key={index} className="vehicle-card">
                      <div className="vehicle-image">
                        <Image 
                          src={vehicle.image} 
                          alt={vehicle.name} 
                          width={300} 
                          height={200} 
                        />
                      </div>
                      <div className="vehicle-info">
                        <h4>{vehicle.name}</h4>
                        <p>Capacity: {vehicle.capacity} passengers</p>
                        <p>Available: {vehicle.type}</p>
                        <button 
                          className="btn btn-small"
                          onClick={() => handleWhatsAppBooking(`a ${vehicle.name}`)}
                        >
                          Check Rates
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'tours' && (
              <div className="service-details">
                <h3>Curated Tour Experiences</h3>
                <p>Explore Sri Lanka's rich culture, stunning landscapes, and pristine beaches with our expert guides.</p>
                
                <div className="tour-grid">
                  {tourPackages.map((tour, index) => (
                    <div key={index} className="tour-card">
                      <h4>{tour.name}</h4>
                      <p className="duration">{tour.duration}</p>
                      <ul>
                        {tour.highlights.map((highlight, i) => (
                          <li key={i}>{highlight}</li>
                        ))}
                      </ul>
                      <button 
                        className="btn btn-small"
                        onClick={() => handleWhatsAppBooking(`the ${tour.name} package`)}
                      >
                        Book This Tour
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'transfer' && (
              <div className="service-details">
                <h3>Seamless Airport Transfers</h3>
                <p>Enjoy hassle-free airport pickups and drop-offs with our meet & greet service. We monitor your flight for any delays.</p>
                
                <div className="transfer-options">
                  <div className="transfer-card">
                    <h4>Standard Transfer</h4>
                    <p>Direct transfer from airport to your destination</p>
                    <button 
                      className="btn btn-small"
                      onClick={() => handleWhatsAppBooking('an airport transfer')}
                    >
                      Book Transfer
                    </button>
                  </div>
                  
                  <div className="transfer-card">
                    <h4>Premium Transfer</h4>
                    <p>Includes meet & greet, refreshments, and assistance with luggage</p>
                    <button 
                      className="btn btn-small"
                      onClick={() => handleWhatsAppBooking('a premium airport transfer')}
                    >
                      Book Premium
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Destinations Section */}
      <section className="destinations">
        <div className="container">
          <h2 className="section-title">Popular Destinations</h2>
          <p className="section-subtitle">Explore the diverse beauty of Sri Lanka</p>
          
          <div className="destinations-grid">
            {destinations.map((destination, index) => (
              <div key={index} className="destination-card">
                <div className="destination-image">
                  <Image 
                    src={destination.image} 
                    alt={destination.name} 
                    width={400} 
                    height={300} 
                  />
                  <div className="destination-overlay">
                    <h3>{destination.name}</h3>
                    <p>{destination.description}</p>
                    <Link href={`/destinations/${destination.name.toLowerCase().replace(' ', '-')}`} className="btn btn-small">
                      Explore
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="section-cta">
            <Link href="/destinations" className="btn btn-primary">
              View All Destinations
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          
          <div className="testimonials-slider">
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"Zamzam Tours made our Sri Lanka trip unforgettable. The self-drive car was in perfect condition, and their recommendations for accommodations were spot on!"</p>
                <div className="testimonial-author">
                  <strong>Sarah Johnson</strong>
                  <span>United Kingdom</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"The North East tour was incredible! Our guide was knowledgeable and friendly. The entire experience was seamless from start to finish."</p>
                <div className="testimonial-author">
                  <strong>Michael Schmidt</strong>
                  <span>Germany</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial">
              <div className="testimonial-content">
                <p>"Airport transfer with meet & greet service was excellent. They were waiting for us even though our flight was delayed. Highly recommended!"</p>
                <div className="testimonial-author">
                  <strong>Isabelle Moreau</strong>
                  <span>France</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Explore Sri Lanka?</h2>
            <p>Contact us now to plan your perfect Sri Lankan adventure</p>
            <div className="cta-buttons">
              <button 
                className="btn btn-primary"
                onClick={() => handleWhatsAppBooking('more information')}
              >
                Contact via WhatsApp
              </button>
              <Link href="/contact" className="btn btn-secondary">
                Other Contact Methods
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-logo">
                <Image src="/logo.png" alt="Zamzam Tours" width={150} height={60} />
              </div>
              <p>Your trusted partner for premium travel experiences in Sri Lanka since 2010.</p>
              <div className="social-links">
                <a href="#" aria-label="Facebook">FB</a>
                <a href="#" aria-label="Instagram">IG</a>
                <a href="#" aria-label="Twitter">TW</a>
                <a href="#" aria-label="YouTube">YT</a>
              </div>
            </div>
            
            <div className="footer-section">
              <h3>Services</h3>
              <ul>
                <li><Link href="/self-drive">Self-Drive Rentals</Link></li>
                <li><Link href="/tours">Guided Tours</Link></li>
                <li><Link href="/airport-transfer">Airport Transfers</Link></li>
                <li><Link href="/hotels">Hotel Booking</Link></li>
                <li><Link href="/activities">Activities</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Company</h3>
              <ul>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/gallery">Gallery</Link></li>
                <li><Link href="/testimonials">Testimonials</Link></li>
                <li><Link href="/blog">Blog</Link></li>
                <li><Link href="/careers">Careers</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Support</h3>
              <ul>
                <li><Link href="/contact">Contact Us</Link></li>
                <li><Link href="/faq">FAQ</Link></li>
                <li><Link href="/terms">Terms & Conditions</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/cancellation">Cancellation Policy</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <h3>Contact Info</h3>
              <ul className="contact-info">
                <li>📍 123 Galle Road, Colombo, Sri Lanka</li>
                <li>📞 +94 77 123 4567</li>
                <li>📧 info@zamzamtours.com</li>
                <li>🕒 Open 24/7</li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Zamzam Tours. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* WhatsApp Floating Button */}
      <div className="whatsapp-float">
        <button 
          onClick={() => handleWhatsAppBooking('assistance')}
          aria-label="Contact via WhatsApp"
        >
          <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={30} height={30} />
        </button>
      </div>
    </>
  );
}
