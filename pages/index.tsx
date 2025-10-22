// pages/index.js - Homepage
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
    { name: 'Bus', capacity: '30-50', type: 'self-drive, with-driver', image: '/vehicles/bus.jpg' },
    { name: 'KDH', capacity: '6-8', type: 'self-drive, with-driver', image: '/vehicles/kdh.jpg' },
    { name: 'Tour Van', capacity: '12-15', type: 'self-drive, with-driver', image: '/vehicles/tour-van.jpg' },
    { name: 'WagonR', capacity: '4', type: 'self-drive, with-driver', image: '/vehicles/wagonr.jpg' },
    { name: 'Shuttle', capacity: '10-12', type: 'self-drive, with-driver', image: '/vehicles/shuttle.jpg' },
    { name: 'Every Buddy Van', capacity: '8-10', type: 'self-drive, with-driver', image: '/vehicles/every-buddy.jpg' },
    { name: 'Aqua', capacity: '4', type: 'self-drive, with-driver', image: '/vehicles/aqua.jpg' },
    { name: 'Prius', capacity: '4', type: 'self-drive, with-driver', image: '/vehicles/prius.jpg' }
  ];
  
  // Popular destinations
  const destinations = [
    { name: 'Sigiriya', image: '/destinations/sigiriya.jpg', description: 'Ancient rock fortress' },
    { name: 'Kandy', image: '/destinations/kandy.jpg', description: 'Cultural capital' },
    { name: 'Galle', image: '/destinations/galle.jpg', description: 'Historic fort city' },
    { name: 'Ella', image: '/destinations/ella.jpg', description: 'Mountain paradise' },
    { name: 'Yala', image: '/destinations/yala.jpg', description: 'Wildlife sanctuary' },
    { name: 'Nuwara Eliya', image: '/destinations/nuwara-eliya.jpg', description: 'Little England' }
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
            <Image src="/logo.png" alt="Zamzam Tours" width={150} height={60} />
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
          <video autoPlay muted loop className="hero-video">
            <source src="/videos/hero-video.mp4" type="video/mp4" />
            {/* Fallback image if video doesn't load */}
            <div className="hero-fallback"></div>
          </video>
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
          <Image src="/whatsapp-icon.png" alt="WhatsApp" width={30} height={30} />
        </button>
      </div>
      
      <style jsx>{`
        /* Global Styles */
        :root {
          --primary-color: #053b3c;
          --primary-light: #0a5c5e;
          --primary-dark: #032626;
          --secondary-color: #f8b500;
          --text-color: #333;
          --text-light: #777;
          --background-color: #fff;
          --section-bg: #f9f9f9;
          --border-color: #eaeaea;
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          font-family: 'Poppins', sans-serif;
          color: var(--text-color);
          line-height: 1.6;
          overflow-x: hidden;
        }
        
        .container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        
        .btn {
          display: inline-block;
          padding: 12px 24px;
          border: none;
          border-radius: 4px;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: center;
        }
        
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover {
          background-color: var(--primary-light);
          transform: translateY(-2px);
        }
        
        .btn-secondary {
          background-color: transparent;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
        }
        
        .btn-secondary:hover {
          background-color: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }
        
        .btn-small {
          padding: 8px 16px;
          font-size: 0.9rem;
        }
        
        .section-title {
          font-size: 2.5rem;
          text-align: center;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        
        .section-subtitle {
          text-align: center;
          margin-bottom: 3rem;
          color: var(--text-light);
          font-size: 1.1rem;
        }
        
        .section-cta {
          text-align: center;
          margin-top: 3rem;
        }
        
        /* Header Styles */
        .header {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .header.scrolled {
          background-color: white;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .header .container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
        }
        
        .logo {
          z-index: 1001;
        }
        
        .nav {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        
        .nav a {
          text-decoration: none;
          color: var(--text-color);
          font-weight: 500;
          transition: color 0.3s ease;
        }
        
        .nav a:hover {
          color: var(--primary-color);
        }
        
        .language-selector {
          margin-left: 1rem;
        }
        
        .language-dropdown {
          padding: 5px 10px;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          background-color: white;
        }
        
        .menu-toggle {
          display: none;
          flex-direction: column;
          background: none;
          border: none;
          cursor: pointer;
          width: 30px;
          height: 24px;
          position: relative;
          z-index: 1001;
        }
        
        .menu-toggle span {
          display: block;
          height: 3px;
          width: 100%;
          background-color: var(--primary-color);
          margin-bottom: 5px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        
        /* Hero Section */
        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
        }
        
        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }
        
        .hero-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .hero-fallback {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
        }
        
        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.4);
        }
        
        .hero-content {
          max-width: 800px;
          padding: 0 20px;
          z-index: 1;
        }
        
        .hero-title {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }
        
        .hero-title span {
          color: var(--secondary-color);
        }
        
        .hero-subtitle {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }
        
        .hero-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          color: white;
          opacity: 0.8;
          animation: bounce 2s infinite;
        }
        
        .arrow-down {
          width: 20px;
          height: 20px;
          border-right: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(45deg);
          margin-top: 5px;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          40% {
            transform: translateY(-10px) translateX(-50%);
          }
          60% {
            transform: translateY(-5px) translateX(-50%);
          }
        }
        
        /* Services Section */
        .services {
          padding: 100px 0;
          background-color: var(--section-bg);
        }
        
        .services-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
          border-bottom: 1px solid var(--border-color);
        }
        
        .tab {
          padding: 15px 30px;
          background: none;
          border: none;
          font-size: 1.1rem;
          font-weight: 500;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
        }
        
        .tab:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 3px;
          background-color: var(--primary-color);
          transition: width 0.3s ease;
        }
        
        .tab.active {
          color: var(--primary-color);
        }
        
        .tab.active:after {
          width: 100%;
        }
        
        .tab:hover {
          color: var(--primary-color);
        }
        
        .service-details {
          animation: fadeIn 0.5s ease;
        }
        
        .service-details h3 {
          font-size: 2rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
          text-align: center;
        }
        
        .service-details > p {
          text-align: center;
          margin-bottom: 3rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .vehicle-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .vehicle-card {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .vehicle-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .vehicle-image {
          height: 200px;
          overflow: hidden;
        }
        
        .vehicle-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .vehicle-card:hover .vehicle-image img {
          transform: scale(1.05);
        }
        
        .vehicle-info {
          padding: 1.5rem;
        }
        
        .vehicle-info h4 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: var(--primary-color);
        }
        
        .vehicle-info p {
          margin-bottom: 1rem;
          color: var(--text-light);
        }
        
        .tour-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        
        .tour-card {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .tour-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .tour-card h4 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: var(--primary-color);
        }
        
        .tour-card .duration {
          color: var(--secondary-color);
          font-weight: 600;
          margin-bottom: 1rem;
        }
        
        .tour-card ul {
          margin-bottom: 1.5rem;
          padding-left: 1.2rem;
        }
        
        .tour-card li {
          margin-bottom: 0.5rem;
        }
        
        .transfer-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .transfer-card {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
          text-align: center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .transfer-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .transfer-card h4 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        
        .transfer-card p {
          margin-bottom: 1.5rem;
          color: var(--text-light);
        }
        
        /* Destinations Section */
        .destinations {
          padding: 100px 0;
        }
        
        .destinations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }
        
        .destination-card {
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          height: 300px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .destination-image {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .destination-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .destination-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(5, 59, 60, 0.8);
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
        
        .destination-card:hover .destination-image img {
          transform: scale(1.05);
        }
        
        .destination-overlay h3 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }
        
        .destination-overlay p {
          margin-bottom: 1.5rem;
        }
        
        /* Testimonials Section */
        .testimonials {
          padding: 100px 0;
          background-color: var(--section-bg);
        }
        
        .testimonials-slider {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        
        .testimonial {
          background: white;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        }
        
        .testimonial-content p {
          font-style: italic;
          margin-bottom: 1.5rem;
          position: relative;
        }
        
        .testimonial-content p:before {
          content: '"';
          font-size: 4rem;
          color: var(--primary-light);
          opacity: 0.3;
          position: absolute;
          top: -20px;
          left: -10px;
        }
        
        .testimonial-author strong {
          display: block;
          color: var(--primary-color);
        }
        
        .testimonial-author span {
          color: var(--text-light);
          font-size: 0.9rem;
        }
        
        /* CTA Section */
        .cta-section {
          padding: 100px 0;
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
        
        .cta-section .btn-primary {
          background-color: var(--secondary-color);
          color: var(--text-color);
        }
        
        .cta-section .btn-primary:hover {
          background-color: #e6a500;
        }
        
        .cta-section .btn-secondary {
          border-color: white;
          color: white;
        }
        
        .cta-section .btn-secondary:hover {
          background-color: white;
          color: var(--primary-color);
        }
        
        /* Footer */
        .footer {
          background-color: var(--primary-dark);
          color: white;
          padding: 60px 0 20px;
        }
        
        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .footer-section h3 {
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
          position: relative;
          padding-bottom: 10px;
        }
        
        .footer-section h3:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background-color: var(--secondary-color);
        }
        
        .footer-section ul {
          list-style: none;
        }
        
        .footer-section li {
          margin-bottom: 0.8rem;
        }
        
        .footer-section a {
          color: #ccc;
          text-decoration: none;
          transition: color 0.3s ease;
        }
        
        .footer-section a:hover {
          color: white;
        }
        
        .contact-info li {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }
        
        .social-links a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }
        
        .social-links a:hover {
          background-color: var(--secondary-color);
        }
        
        .footer-bottom {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          color: #aaa;
          font-size: 0.9rem;
        }
        
        /* WhatsApp Float */
        .whatsapp-float {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1000;
        }
        
        .whatsapp-float button {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #25D366;
          border: none;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        
        .whatsapp-float button:hover {
          transform: scale(1.1);
        }
        
        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Responsive Styles */
        @media (max-width: 992px) {
          .hero-title {
            font-size: 2.8rem;
          }
          
          .section-title {
            font-size: 2rem;
          }
          
          .nav {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 300px;
            height: 100vh;
            background-color: white;
            flex-direction: column;
            align-items: flex-start;
            padding: 80px 30px 30px;
            transition: right 0.3s ease;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
          }
          
          .nav-open {
            right: 0;
          }
          
          .menu-toggle {
            display: flex;
          }
          
          .services-tabs {
            flex-wrap: wrap;
          }
          
          .tab {
            flex: 1;
            min-width: 150px;
          }
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.2rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }
          
          .hero-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .btn {
            width: 100%;
            max-width: 250px;
          }
          
          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
          
          .destinations-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 576px) {
          .container {
            padding: 0 15px;
          }
          
          .hero-title {
            font-size: 1.8rem;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
          
          .services-tabs {
            flex-direction: column;
          }
          
          .tab {
            width: 100%;
          }
          
          .vehicle-grid,
          .tour-grid {
            grid-template-columns: 1fr;
          }
          
          .footer-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
}