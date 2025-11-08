// pages/index.tsx - Homepage
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';
import { fadeInUp, staggerContainer, cardHover } from '../src/utils/animations';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('vehicles');
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  
  // Array of videos from zamzam-tours/heroes/home folder
  const heroVideos = [
    'https://res.cloudinary.com/dhfqwxyb4/video/upload/v1761564719/191283-889685028_small_eyum5p.mp4',
    'https://res.cloudinary.com/dhfqwxyb4/video/upload/v1761565698/180699-864967760_udzhyj.mp4',
  ];
  
  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' }
  ];
  
  // Vehicle fleet data - fetched from backend API (pages/api/vehicles)
  const [vehicles, setVehicles] = useState<Array<{ name: string; capacity: string; type: string; image: string; description: string }>>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setVehiclesLoading(true);
        const res = await fetch('/api/vehicles');
        if (!res.ok) throw new Error('Failed to fetch vehicles');
        const data = await res.json();

        const mapped = data.map((v: any) => ({
          name: v.vehicle_name || v.name || 'Vehicle',
          capacity: v.capacity ? `${v.capacity}` : (v.seats ? `${v.seats}` : '4'),
          type: (v.available_for || v.type || 'self-drive, with-driver').toString(),
          // If backend provides a cloudinary public id use it, otherwise fall back to image URL or default
          image: v.image || v.cloudinary_id || 'zamzam-tours/vehicles/default',
          description: v.description || v.vehicle_name || ''
        }));

        setVehicles(mapped);
      } catch (err) {
        console.error('Error loading vehicles for homepage:', err);
        // Fallback: use a small local set so the homepage still shows vehicles when the DB/API isn't available locally
        const fallback = [
          { name: 'Prius', capacity: '4', type: 'self-drive, with-driver', image: 'zamzam-tours/vehicles/prius', description: 'Premium hybrid sedan' },
          { name: 'Aqua', capacity: '4', type: 'self-drive, with-driver', image: 'zamzam-tours/vehicles/aqua', description: 'Fuel-efficient hybrid' },
          { name: 'KDH Van', capacity: '6-8', type: 'with-driver', image: 'zamzam-tours/vehicles/kdh-van', description: 'Comfortable family vehicle' },
        ];
        setVehicles(fallback);
      } finally {
        setVehiclesLoading(false);
      }
    };

    fetchVehicles();
  }, []);
  
  // Popular destinations - with Cloudinary image IDs
  const destinations = [
  { name: 'Sigiriya', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453704/dylan-shaw-smUAKwMT8XA-unsplash_qhenhx.jpg', description: 'Ancient rock fortress', slug: 'sigiriya' },
  { name: 'Kandy', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454466/chathura-anuradha-subasinghe-40uQmE9Zq8g-unsplash_tvflxt.jpg', description: 'Cultural capital', slug: 'kandy' },
  { name: 'Galle', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453796/chathura-indika-LAj-XlHP6Rs-unsplash_o7mzbc.jpg', description: 'Historic fort city', slug: 'galle' },
  { name: 'Ella', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453781/adam-vandermeer-Dw9dWTzzsUE-unsplash_l49hhe.jpg', description: 'Mountain paradise', slug: 'ella' },
  { name: 'Yala', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453757/gemmmm-FRTpkBIi-1Y-unsplash_iggwsm.jpg', description: 'Wildlife sanctuary', slug: 'yala' },
  { name: 'Nuwara Eliya', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453797/anton-lecock-TPtaNsBOW9Q-unsplash_g0htag.jpg', description: 'Little England', slug: 'nuwara-eliya' }
  ];

  // Activities / Things to do (show a few popular activities and link to detailed pages)
  // Note: emojis-only presentation — no photos as requested.
  const activities = [
    { name: 'Wildlife Safaris', icon: '🦁', description: 'Elephant, leopard and bird watching in national parks', slug: 'wildlife-safaris' },
    { name: 'Hiking & Trekking', icon: '🥾', description: 'Mountain trails and nature walks through stunning landscapes', slug: 'hiking-trekking' },
    { name: 'Cultural Tours', icon: '🏛️', description: 'Ancient temples, forts and historical monuments', slug: 'cultural-tours' },
    { name: 'Beach Activities', icon: '🏖️', description: 'Swimming, surfing, snorkeling and beach relaxation', slug: 'beach-activities' },
    { name: 'Tea Plantation Tours', icon: '🍵', description: 'Visit tea estates and experience Ceylon tea culture', slug: 'tea-plantation-tours' },
    { name: 'Whale Watching', icon: '🐋', description: 'Witness blue whales and dolphins in their natural habitat', slug: 'whale-watching' }
  ];
  
  // Default tour packages (used as a fallback)
  const defaultTourPackages = [
    { name: 'North East Tour', duration: '7 days', highlights: ['Trincomalee', 'Batticaloa', 'Arugam Bay'] },
    { name: 'Cultural Triangle', duration: '5 days', highlights: ['Sigiriya', 'Dambulla', 'Polonnaruwa'] },
    { name: 'Hill Country', duration: '6 days', highlights: ['Kandy', 'Nuwara Eliya', 'Ella'] },
    { name: 'Beach Paradise', duration: '8 days', highlights: ['Mirissa', 'Galle', 'Hikkaduwa'] }
  ];

  // Homepage tours loaded from API (/api/packages). Falls back to defaultTourPackages when API fails.
  const [homeTours, setHomeTours] = useState<any[]>(defaultTourPackages);
  const [homeToursLoading, setHomeToursLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchHomeTours = async () => {
      try {
        setHomeToursLoading(true);
        const res = await fetch('/api/packages');
        if (!res.ok) throw new Error('Failed to fetch packages');
        const packages = await res.json();

        const transformedTours = packages.map((pkg: any) => ({
          id: pkg.package_id ? parseInt(pkg.package_id.replace('P', '')) || 0 : 0,
          name: pkg.package_name || pkg.name || 'Tour',
          duration: pkg.duration || 'N/A',
          price: pkg.price ? parseFloat(pkg.price) : 0,
          priceRange: pkg.price ? (pkg.price < 1000 ? 'budget' : pkg.price < 2000 ? 'standard' : 'premium') : 'standard',
          image: pkg.image || '/tours/default.jpg',
          highlights: pkg.highlights ? pkg.highlights.split(',').map((h: string) => h.trim()) : (pkg.highlights || []).slice(0,3),
          description: pkg.description || '',
        }));

        if (transformedTours && transformedTours.length > 0) setHomeTours(transformedTours);
      } catch (err) {
        console.error('Failed to load home tour packages:', err);
        // keep fallback
      } finally {
        setHomeToursLoading(false);
      }
    };

    fetchHomeTours();
  }, []);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Handle video autoplay
  useEffect(() => {
    if (video1Ref.current) {
      video1Ref.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);
  
  // Handle video end - switch to other player
  const handleVideo1End = () => {
    const nextIndex = (currentVideoIndex + 1) % heroVideos.length;
    
    if (video2Ref.current) {
      video2Ref.current.src = heroVideos[nextIndex];
      video2Ref.current.load();
      video2Ref.current.play();
      setActivePlayer(2);
      setCurrentVideoIndex(nextIndex);
    }
  };
  
  const handleVideo2End = () => {
    const nextIndex = (currentVideoIndex + 1) % heroVideos.length;
    
    if (video1Ref.current) {
      video1Ref.current.src = heroVideos[nextIndex];
      video1Ref.current.load();
      video1Ref.current.play();
      setActivePlayer(1);
      setCurrentVideoIndex(nextIndex);
    }
  };
  
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
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero" ref={heroRef} style={{ marginTop: '0', position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Cloudinary Hero Background Video - Dual Player for Seamless Loop */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden'
        }}>
          {/* Video Player 1 */}
          <video
            ref={video1Ref}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={handleVideo1End}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: activePlayer === 1 ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
            src={heroVideos[0]}
          />
          {/* Video Player 2 */}
          <video
            ref={video2Ref}
            muted
            playsInline
            preload="auto"
            onEnded={handleVideo2End}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: activePlayer === 2 ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          />
        </div>
        
        <div className="hero-overlay" style={{
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
          <div className="hero-content">
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h1 className="hero-title" style={{ 
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
                color: '#ffffff'
              }}>
                Discover the Wonders of <span style={{ 
                  color: '#f8b500',
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)'
                }}>Sri Lanka</span>
              </h1>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <p className="hero-subtitle" style={{ 
                textShadow: '1px 1px 6px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.6)',
                color: '#ffffff'
              }}>
                Premium self-drive car rentals, guided tours, and airport transfers across the island
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <div className="hero-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleWhatsAppBooking('a tour package')}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: '#f8b500',
                    color: '#000000',
                    padding: '15px 40px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '50px',
                    boxShadow: '0 6px 20px rgba(248, 181, 0, 0.4), 0 0 30px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(248, 181, 0, 0.6), 0 0 40px rgba(0, 0, 0, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(248, 181, 0, 0.4), 0 0 30px rgba(0, 0, 0, 0.5)';
                  }}
                >
                  Book a Tour
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => handleWhatsAppBooking('a vehicle')}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    padding: '15px 40px',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    border: '3px solid #ffffff',
                    borderRadius: '50px',
                    boxShadow: '0 6px 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(0, 0, 0, 0.5)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.color = '#053b3c';
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(255, 255, 255, 0.5), 0 0 40px rgba(0, 0, 0, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.3), 0 0 30px rgba(0, 0, 0, 0.5)';
                  }}
                >
                  Rent a Vehicle
                </button>
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
          <div className="scroll-indicator">
            <span>Scroll to explore</span>
            <div className="arrow-down"></div>
          </div>
        </motion.div>
      </section>
      
      {/* Services Section */}
      <section className="services">
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <h2 className="section-title">Our Services</h2>
          </AnimatedSection>
          
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <div className="services-tabs">
              <button 
                className={`tab ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                Vehicle Rentals
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
          </AnimatedSection>
          
          <div className="services-content">
            {activeTab === 'vehicles' && (
              <div className="service-details">
                <AnimatedSection animation="fadeInUp">
                  <h3>Flexible Vehicle Rentals</h3>
                  <p>Choose from our extensive fleet with both self-drive and with-driver options. All vehicles are well-maintained and fully insured for your safety and comfort.</p>
                </AnimatedSection>
                
                <div className="vehicle-grid">
                  {vehicles.map((vehicle, index) => (
                    <AnimatedSection 
                      key={index} 
                      animation="fadeInUp" 
                      delay={index * 0.1}
                    >
                      <div className="vehicle-card">
                        <div className="vehicle-image" style={{ position: 'relative', width: '100%', height: '200px' }}>
                          <CldImage 
                            src={vehicle.image} 
                            alt={vehicle.name} 
                            fill
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </div>
                        <div className="vehicle-info">
                          <h4>{vehicle.name}</h4>
                          <p>Capacity: {vehicle.capacity} passengers</p>
                          <p className="vehicle-desc">{vehicle.description}</p>
                          <button 
                            className="btn btn-small"
                            onClick={() => handleWhatsAppBooking(`a ${vehicle.name}`)}
                          >
                            Check Rates
                          </button>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            )}
            
            {activeTab === 'tours' && (
              <div className="service-details">
                <AnimatedSection animation="fadeInUp">
                  <h3>Curated Tour Experiences</h3>
                  <p>Explore Sri Lanka's rich culture, stunning landscapes, and pristine beaches with our expert guides.</p>
                </AnimatedSection>
                
                    <div className="tour-grid">
                      {homeTours.map((tour, index) => (
                        <AnimatedSection
                          key={index}
                          animation="fadeInUp"
                          delay={index * 0.12}
                        >
                          <div className="tour-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                              <div>
                                <h4 style={{ margin: '0 0 6px' }}>{tour.name}</h4>
                                <p className="duration" style={{ margin: '0 0 8px' }}>{tour.duration}</p>
                                <p style={{ margin: 0 }}><strong>Highlights:</strong> {Array.isArray(tour.highlights) ? tour.highlights.join(', ') : tour.highlights}</p>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <p style={{ margin: 0, fontWeight: 700 }}>From $—</p>
                                <p className="muted" style={{ margin: '6px 0 0' }}>Starting price depends on group size</p>
                              </div>
                            </div>

                            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                              <button
                                className="btn btn-small"
                                onClick={() => handleWhatsAppBooking(`the ${tour.name} package`)}
                              >
                                Book This Tour
                              </button>
                              <Link href={`/tours`} className="btn btn-secondary">View details</Link>
                            </div>
                          </div>
                        </AnimatedSection>
                      ))}
                    </div>
              </div>
            )}
            
            {activeTab === 'transfer' && (
              <div className="service-details">
                <AnimatedSection animation="fadeInUp">
                  <h3>Seamless Airport Transfers</h3>
                  <p>Enjoy hassle-free airport pickups and drop-offs with our meet & greet service. We monitor your flight for any delays.</p>
                </AnimatedSection>
                
                <div className="transfer-options">
                  {[
                    { key: 'one-way', title: 'One-way Transfer', desc: 'Airport → Hotel (single trip). Ideal for arrivals.', price: 'From $25' },
                    { key: 'round-trip', title: 'Round-trip (Two-way)', desc: 'Airport pickup and return transfer. Best for return flights.', price: 'From $45' }
                  ].map((t, idx) => (
                    <AnimatedSection key={t.key} animation={idx % 2 === 0 ? 'fadeInLeft' : 'fadeInRight'} delay={0.15 * idx}>
                      <div className="transfer-card">
                        <h4>{t.title}</h4>
                        <p>{t.desc}</p>
                        <p style={{ fontWeight: 700, marginTop: 6 }}>{t.price}</p>
                        <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                          <button
                            className="btn btn-small"
                            onClick={() => handleWhatsAppBooking(t.title)}
                          >
                            Book
                          </button>
                          <Link href={`/airport-transfer?type=${t.key}`} className="btn btn-secondary">Details</Link>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Destinations Section */}
      <section className="destinations">
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Explore the diverse beauty of Sri Lanka</p>
          </AnimatedSection>
          
          <div className="destinations-grid">
            {destinations.map((destination, index) => (
              <AnimatedSection 
                key={index} 
                animation="fadeInUp" 
                delay={index * 0.1}
              >
                <div className="destination-card">
                  <div className="destination-image" style={{ position: 'relative', width: '100%', height: '300px' }}>
                    <CldImage 
                      src={destination.image} 
                      alt={destination.name} 
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="destination-overlay">
                      <h3>{destination.name}</h3>
                      <p>{destination.description}</p>
                      <Link href={`/destinations/${destination.slug}`} className="btn btn-small">
                        Explore
                      </Link>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          
          <AnimatedSection animation="fadeInUp" delay={0.3}>
            <div className="section-cta">
              <Link href="/destinations" className="btn btn-primary">
                View All Destinations
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      {/* Activities / Things to Do Section */}
      <section className="activities-section">
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <h2 className="section-title">Things to Do</h2>
            <p className="section-subtitle">Popular activities and experiences you can book</p>
          </AnimatedSection>

          <div className="destinations-grid">
            {activities.map((act, index) => (
              <AnimatedSection key={act.slug} animation="fadeInUp" delay={index * 0.08}>
                <div className="destination-card">
                  {/* emoji header instead of photo */}
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(5,59,60,0.04), rgba(248,181,0,0.04))' }}>
                    <div style={{ fontSize: '3rem' }}>{act.icon}</div>
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem' }}>{act.name}</h3>
                    <p style={{ color: '#666', margin: '0 0 0.8rem' }}>{act.description}</p>
                    <Link href={`/activities/${act.slug}`} className="btn btn-small">Explore</Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <div className="section-cta">
              <Link href="/activities" className="btn btn-primary">View All Activities</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <h2 className="section-title">What Our Customers Say</h2>
          </AnimatedSection>
          
          <div className="testimonials-slider">
            <AnimatedSection animation="fadeInLeft" delay={0.2}>
              <div className="testimonial">
                <div className="testimonial-content">
                  <p>"Zamzam Tours made our Sri Lanka trip unforgettable. The self-drive car was in perfect condition, and their recommendations for accommodations were spot on!"</p>
                  <div className="testimonial-author">
                    <strong>Sarah Johnson</strong>
                    <span>United Kingdom</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeInUp" delay={0.3}>
              <div className="testimonial">
                <div className="testimonial-content">
                  <p>"The North East tour was incredible! Our guide was knowledgeable and friendly. The entire experience was seamless from start to finish."</p>
                  <div className="testimonial-author">
                    <strong>Michael Schmidt</strong>
                    <span>Germany</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection animation="fadeInRight" delay={0.4}>
              <div className="testimonial">
                <div className="testimonial-content">
                  <p>"Airport transfer with meet & greet service was excellent. They were waiting for us even though our flight was delayed. Highly recommended!"</p>
                  <div className="testimonial-author">
                    <strong>Isabelle Moreau</strong>
                    <span>France</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <AnimatedSection animation="fadeInUp">
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
          </AnimatedSection>
        </div>
      </section>
      
      

      <Footer />
    </>
  );
}
