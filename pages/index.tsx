// pages/index.tsx - Homepage
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { CldImage, CldVideoPlayer } from 'next-cloudinary';
import 'next-cloudinary/dist/cld-video-player.css';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CONTACT_INFO } from '../src/constants/config';
import AnimatedSection from '../components/AnimatedSection';
import { fadeInUp, staggerContainer, cardHover } from '../src/utils/animations';
import useTranslation from '../src/i18n/useTranslation';
import LocalBusinessSchema from '../components/SEO/LocalBusinessSchema';
import BreadcrumbSchema from '../components/SEO/BreadcrumbSchema';
import OrganizationSchema from '../components/SEO/OrganizationSchema';

export default function Home() {
  const { t } = useTranslation();
  const get = (key: string, fallback: string) => {
    const val = t(key);
    return val === key ? fallback : val;
  };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('tours');
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [isScrolled, setIsScrolled] = useState(false);
  const heroRef = useRef(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const router = useRouter();
  
  // Array of new Cloudinary hero videos
  const heroVideos = [
    'https://res.cloudinary.com/dhqhxma30/video/upload/v1766841868/191283-889685028_small_b8dplp.mp4',
    'https://res.cloudinary.com/dhqhxma30/video/upload/v1766841614/180699-864967760_hzwddy.mp4',
    'https://res.cloudinary.com/dhqhxma30/video/upload/v1766841213/173497-849651784_small_lpsxdo.mp4',
  ];
  
  // Language options
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'it', name: 'Italiano' }
  ];
  
  // Vehicle fleet data - fetched from backend API with optimization
  const [vehicles, setVehicles] = useState<Array<{ name: string; capacity: string; type: string; image: string; description: string }>>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchVehicles = async () => {
      try {
        setVehiclesLoading(true);
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const res = await fetch('/api/vehicles', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error('Failed to fetch vehicles');
        const data = await res.json();

        if (!isMounted) return;

        const mapped = data.slice(0, 8).map((v: any) => ({
          name: get(`home.vehicles.${v.vehicle_id || v.id || v.vehicle_name}.name`, v.vehicle_name || v.name || 'Vehicle'),
          capacity: v.capacity ? `${v.capacity}` : (v.seats ? `${v.seats}` : '4'),
          type: (v.available_for || v.type || 'self-drive, with-driver').toString(),
          // If backend provides a cloudinary public id use it, otherwise fall back to image URL or default
          image: v.image || v.cloudinary_id || 'zamzam-tours/vehicles/default',
          description: get(`home.vehicles.${v.vehicle_id || v.id || v.vehicle_name}.description`, v.description || v.vehicle_name || '')
        }));

        setVehicles(mapped);
      } catch (err: any) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Error loading vehicles for homepage:', err);
          const fallback = [
            { name: 'Prius', capacity: '4', type: 'self-drive, with-driver', image: 'zamzam-tours/vehicles/prius', description: 'Premium hybrid sedan' },
            { name: 'Aqua', capacity: '4', type: 'self-drive, with-driver', image: 'zamzam-tours/vehicles/aqua', description: 'Fuel-efficient hybrid' },
            { name: 'KDH Van', capacity: '6-8', type: 'with-driver', image: 'zamzam-tours/vehicles/kdh-van', description: 'Comfortable family vehicle' },
          ];
          setVehicles(fallback);
        }
      } finally {
        if (isMounted) {
          setVehiclesLoading(false);
        }
      }
    };

    fetchVehicles();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  
  // Popular destinations - with Cloudinary image IDs
  const destinations = [
  { name: 'Sigiriya', image: 'https://res.cloudinary.com/dhqhxma30/image/upload/v1766843237/dylan-shaw-smUAKwMT8XA-unsplash_k21uuc.jpg', description: 'Ancient rock fortress', slug: 'sigiriya' },
  { name: 'Kandy', image: 'https://res.cloudinary.com/dhqhxma30/image/upload/v1767550687/chathura-anuradha-subasinghe-40uQmE9Zq8g-unsplash_pnyinr.jpg', description: 'Cultural capital', slug: 'kandy' },
  { name: 'Galle', image: 'https://res.cloudinary.com/dhqhxma30/image/upload/v1766843255/chathura-indika-LAj-XlHP6Rs-unsplash_icfodb.jpg', description: 'Historic fort city', slug: 'galle' },
  { name: 'Ella', image: 'https://res.cloudinary.com/dhqhxma30/image/upload/v1766843253/adam-vandermeer-Dw9dWTzzsUE-unsplash_lcyp9r.jpg', description: 'Mountain paradise', slug: 'ella' },
  { name: 'Yala', image: 'https://res.cloudinary.com/dhqhxma30/image/upload/v1766842969/sachindra-chalaka-ERIYlk3Hppo-unsplash_t66kqu.jpg', description: 'Wildlife sanctuary', slug: 'yala' },
  { name: 'Nuwara Eliya', image: 'https://res.cloudinary.com/dhqhxma30/image/upload/v1766843115/subodha-karunarathne-PuWCoG8WHok-unsplash_mthga0.jpg', description: 'Little England', slug: 'nuwara-eliya' }
  ];

  // Activities / Things to do (show a few popular activities and link to detailed pages)
  // Note: emojis-only presentation — no photos as requested.
  const activities = [
    { name: 'Wildlife Safaris', icon: '🦁', description: 'Elephant, leopard and bird watching in national parks', slug: 'wildlife-safaris' },
    { name: 'Hiking & Trekking', icon: '🥾', description: 'Mountain trails and nature walks through stunning landscapes', slug: 'hiking-trekking' },
    { name: 'Cultural Tours', icon: '🏛️', description: 'Ancient temples, forts and historical monuments', slug: 'cultural-tours' },
    { name: 'Beach Activities', icon: '🏖️', description: 'Swimming, surfing, snorkeling and beach relaxation', slug: 'beach-activities' },
    { name: 'Tea Plantation Tours', icon: '🍵', description: 'Visit tea estates and experience Ceylon tea culture', slug: 'tea-plantation-tours' },
    { name: 'Whale Watching', icon: '🐋', description: 'Witness blue whales and dolphins in their natural habitat', slug: 'whale-watching' },
    { name: 'Cooking Classes', icon: '👨‍🍳', description: 'Learn authentic Sri Lankan cuisine with hands-on cooking experiences', slug: 'cooking-classes' }
  ];
  
  // Default tour packages (used as a fallback)
  const defaultTourPackages = [
    { name: 'North East Tour', duration: '7 days', highlights: ['Trincomalee', 'Batticaloa', 'Arugam Bay'] },
    { name: 'Cultural Triangle', duration: '5 days', highlights: ['Sigiriya', 'Dambulla', 'Polonnaruwa'] },
    { name: 'Hill Country', duration: '6 days', highlights: ['Kandy', 'Nuwara Eliya', 'Ella'] },
    { name: 'Beach Paradise', duration: '8 days', highlights: ['Mirissa', 'Galle', 'Hikkaduwa'] }
  ];

  // Homepage tours loaded from API with optimization
  const [homeTours, setHomeTours] = useState<any[]>(defaultTourPackages);
  const [homeToursLoading, setHomeToursLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    
    const fetchHomeTours = async () => {
      try {
        setHomeToursLoading(true);
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const res = await fetch('/api/packages', { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (!res.ok) throw new Error('Failed to fetch packages');
        const packages = await res.json();

        if (!isMounted) return;

        const transformedTours = packages.slice(0, 6).map((pkg: any) => {
          // Parse highlights - handle both comma and newline separated
          let highlightsArray: string[] = [];
          if (pkg.highlights) {
            if (typeof pkg.highlights === 'string') {
              // Split by newlines first, then commas, filter empty
              highlightsArray = pkg.highlights
                .split(/[\n,]/)
                .map((h: string) => h.trim())
                .filter((h: string) => h.length > 0);
            } else if (Array.isArray(pkg.highlights)) {
              highlightsArray = pkg.highlights;
            }
          }
          
          return {
            id: pkg.package_id ? parseInt(pkg.package_id.replace('P', '')) || 0 : 0,
            name: get(`home.tours.${pkg.package_id}.name`, pkg.package_name || pkg.name || 'Tour'),
            duration: get(`home.tours.${pkg.package_id}.duration`, pkg.duration || 'N/A'),
            price: pkg.price ? parseFloat(pkg.price) : 0,
            priceRange: pkg.price ? (pkg.price < 1000 ? 'budget' : pkg.price < 2000 ? 'standard' : 'premium') : 'standard',
            image: pkg.image || '/tours/default.jpg',
            highlights: highlightsArray.slice(0, 3),
            description: get(`home.tours.${pkg.package_id}.description`, pkg.description || ''),
          };
        });

        if (isMounted && transformedTours && transformedTours.length > 0) setHomeTours(transformedTours);
      } catch (err: any) {
        if (err.name !== 'AbortError' && isMounted) {
          console.error('Failed to load home tour packages:', err);
        }
      } finally {
        if (isMounted) {
          setHomeToursLoading(false);
        }
      }
    };

    fetchHomeTours();
    
    return () => {
      isMounted = false;
      controller.abort();
    };
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
    const message = `Hello Zamzam Lanka Tours! I'm interested in booking ${service}. Please provide more details.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodedMessage}`, '_blank');
  };
  
  return (
    <>
      <Head>
  <title>ZamZam Lanka Tours — Best Sri Lanka Tours, Private Drivers & Holiday Packages</title>
  <meta name="description" content="Book your Sri Lanka holiday with ZamZam Lanka Tours. Private drivers, round tours, cultural tours, wildlife safaris, airport transfers & custom itineraries." />
  <meta name="keywords" content="Sri Lanka tours, car rental Sri Lanka, airport transfer Colombo, Sri Lanka safari, private driver Sri Lanka, Colombo to Kandy transfer, self drive Sri Lanka, tour packages, holiday packages Sri Lanka" />
  <meta name="robots" content="index,follow" />
  <link rel="canonical" href="https://www.zamzamlankatours.com/" />
  <link rel="alternate" href="https://zamzamlankatours.com/" hreflang="x-default" />
  <meta property="og:title" content="ZamZam Lanka Tours — Best Sri Lanka Tours, Private Drivers & Holiday Packages" />
  <meta property="og:description" content="Book your Sri Lanka holiday with ZamZam Lanka Tours. Private drivers, round tours, cultural tours, wildlife safaris, airport transfers & custom itineraries." />
  <meta property="og:image" content="https://zamzamlankatours.com/images/og-image.jpg" />
  <meta property="og:url" content="https://zamzamlankatours.com/" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ZamZam Lanka Tours — Best Sri Lanka Tours, Private Drivers & Holiday Packages" />
  <meta name="twitter:description" content="Book your Sri Lanka holiday with ZamZam Lanka Tours. Private drivers, round tours, safaris & custom itineraries." />
  <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Structured Data Schemas */}
      <OrganizationSchema />
      <LocalBusinessSchema />
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }]} />
      
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
            preload="metadata"
            poster="https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453704/dylan-shaw-smUAKwMT8XA-unsplash_qhenhx.jpg"
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
            preload="metadata"
            poster="https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453704/dylan-shaw-smUAKwMT8XA-unsplash_qhenhx.jpg"
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
                {get('home.hero.title.prefix', 'Discover the Wonders of ')}<br />
                <span style={{ 
                  color: '#f8b500',
                  textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)'
                }}>{get('home.hero.title.highlight', 'Sri Lanka')}</span>
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
                {get('home.hero.subtitle', 'Premium self-drive car rentals, guided tours, airport & all-island transfers across Sri Lanka')}
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <div className="hero-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/tours')}
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
                  {get('home.hero.cta.bookTour', 'Book a Tour')}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => router.push('/car-rental')}
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
                  {get('home.hero.cta.rentVehicle', 'Rent a Vehicle')}
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
            <span>{get('home.hero.scrollIndicator', 'Scroll to explore')}</span>
            <div className="arrow-down"></div>
          </div>
        </motion.div>
      </section>
      
      {/* Services Section */}
      <section className="services">
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <h2 className="section-title">{get('home.services.title', 'Our Services')}</h2>
          </AnimatedSection>
          
          <AnimatedSection animation="fadeInUp" delay={0.2}>
            <div className="services-tabs">
              <button 
                className={`tab ${activeTab === 'tours' ? 'active' : ''}`}
                onClick={() => setActiveTab('tours')}
              >
                {get('home.services.tabs.tours', 'Tour Packages')}
              </button>
              <button 
                className={`tab ${activeTab === 'vehicles' ? 'active' : ''}`}
                onClick={() => setActiveTab('vehicles')}
              >
                {get('home.services.tabs.vehicles', 'Vehicle Rentals')}
              </button>
              <button 
                className={`tab ${activeTab === 'transfer' ? 'active' : ''}`}
                onClick={() => setActiveTab('transfer')}
              >
                {get('home.services.tabs.transfer', 'Airport & All-Island Transfers')}
              </button>
            </div>
          </AnimatedSection>
          
          <div className="services-content">
            {activeTab === 'vehicles' && (
              <div className="service-details">
                <AnimatedSection animation="fadeInUp">
                    <h3>{get('home.vehicles.sectionTitle', 'Flexible Vehicle Rentals')}</h3>
                    <p>{get('home.vehicles.sectionDesc', 'Choose from our extensive fleet with both self-drive and with-driver options. All vehicles are well-maintained and fully insured for your safety and comfort.')}</p>
                  <div style={{ height: '1rem' }} />
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
                            alt={`${vehicle.name} - Car rental in Sri Lanka`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            quality={85}
                            loading={index < 3 ? 'eager' : 'lazy'}
                            priority={index < 2}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </div>
                        <div className="vehicle-info">
                          <h4>{get(`home.vehicles.${vehicle.name}.name`, vehicle.name)}</h4>
                          <p>{get('home.vehicles.capacityLabel', 'Capacity:')} {vehicle.capacity} {get('home.vehicles.passengers', 'passengers')}</p>
                          <p className="vehicle-desc">{get(`home.vehicles.${vehicle.name}.description`, vehicle.description)}</p>
                          <Link href="/car-rental" className="btn-view-details">
                            {get('home.vehicles.viewMoreDetails', 'View More Details')}
                          </Link>
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
                    <h3>{get('home.tours.sectionTitle', 'Curated Tour Experiences')}</h3>
                    <p>{get('home.tours.sectionDesc', 'Explore Sri Lanka\'s rich culture, stunning landscapes, and pristine beaches with our expert guides.')}</p>
                  <div style={{ height: '1rem' }} />
                </AnimatedSection>
                
                    <div className="tour-packages-grid">
                      {homeTours.map((tour, index) => (
                        <AnimatedSection
                          key={index}
                          animation="fadeInUp"
                          delay={index * 0.12}
                        >
                          <div className="tour-package-card">
                            <div className="tour-card-image-wrapper">
                              <Image 
                                src={tour.image || '/placeholder.jpg'} 
                                alt={`${tour.name} - Sri Lanka tour package`}
                                width={400}
                                height={280}
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                quality={85}
                                loading={index < 3 ? 'eager' : 'lazy'}
                                priority={index < 2}
                                placeholder="blur"
                                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAB8H/9k="
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                              />
                              <div className="tour-duration-badge">
                                <span className="duration-icon">🕐</span>
                                <span>{tour.duration}</span>
                              </div>
                              {tour.priceRange && (
                                <div className={`tour-category-badge ${tour.priceRange}`}>
                                  {tour.priceRange === 'budget' && '💰 Budget'}
                                  {tour.priceRange === 'standard' && '⭐ Standard'}
                                  {tour.priceRange === 'premium' && '👑 Premium'}
                                </div>
                              )}
                            </div>
                            
                            <div className="tour-card-body">
                              <h3 className="tour-card-title">{get(`home.tours.${tour.id}.name`, tour.name)}</h3>
                              <p className="tour-card-description">{get(`home.tours.${tour.id}.description`, tour.description)}</p>
                              
                              <div className="tour-highlights-section">
                                <div className="highlights-header">
                                  <span className="highlights-icon">✨</span>
                                  <span className="highlights-label">{get('home.tours.highlightsLabel', 'Highlights')}</span>
                                </div>
                                <ul className="highlights-list">
                                  {(() => {
                                    let highlightsList: string[] = [];
                                    if (Array.isArray(tour.highlights)) {
                                      highlightsList = tour.highlights;
                                    } else if (typeof tour.highlights === 'string' && tour.highlights) {
                                      highlightsList = tour.highlights
                                        .split(/[\n,]/)
                                        .map((h: string) => h.trim())
                                        .filter((h: string) => h.length > 0);
                                    }
                                    return highlightsList.slice(0, 3).map((highlight, i) => (
                                      <li key={i} className="highlight-item">
                                        <span className="highlight-check">✓</span>
                                        <span>{highlight}</span>
                                      </li>
                                    ));
                                  })()}
                                </ul>
                              </div>

                              <div className="tour-card-footer">
                                <div className="tour-price-section">
                                  {tour.price && tour.price > 0 ? (
                                    <>
                                      <span className="price-from">{get('home.tours.fromPrice', 'From')}</span>
                                      <div className="price-wrapper">
                                        <span className="price-currency">$</span>
                                        <span className="price-value">{tour.price}</span>
                                        <span className="price-unit">/person</span>
                                      </div>
                                    </>
                                  ) : (
                                    <div className="price-inquire">
                                      <span className="price-value">{get('home.tours.priceOnRequest', 'Price on Request')}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="tour-actions">
                                  <Link href="/tours" className="btn-view-details">
                                    {get('home.tours.viewDetails', 'View Details')}
                                  </Link>
                                  <button
                                    className="btn-book-now"
                                    onClick={() => handleWhatsAppBooking(`the ${tour.name} package`)}
                                  >
                                    <span>{get('home.tours.bookNow', 'Book Now')}</span>
                                  </button>
                                </div>
                              </div>
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
                  <h3>{get('home.transfer.sectionTitle', 'Seamless Airport & All-Island Transfers')}</h3>
                    <p>{get('home.transfer.sectionDesc', 'Enjoy hassle-free airport pickups and drop-offs with our meet & greet service, or travel anywhere across Sri Lanka. We monitor your flight for any delays and provide comfortable, reliable transportation island-wide.')}</p>
                  <div style={{ height: '1rem' }} />
                </AnimatedSection>
                
                <div className="transfer-options">
                  <AnimatedSection animation="fadeInUp" delay={0.15}>
                    <div className="transfer-info-grid">
                      <div className="transfer-info-card">
                        <div className="info-icon">✈️</div>
                        <h4>{get('home.transfer.features.airports', 'All Airports Covered')}</h4>
                        <p>{get('home.transfer.features.airportsDesc', 'CMB Colombo, HRI Hambantota, RML Ratmalana - we cover all airports with meet & greet service')}</p>
                      </div>
                      <div className="transfer-info-card">
                        <div className="info-icon">🗺️</div>
                        <h4>{get('home.transfer.features.islandWide', 'All-Island Transfers')}</h4>
                        <p>{get('home.transfer.features.islandWideDesc', 'Travel to any district, city, or destination across Sri Lanka with our professional drivers')}</p>
                      </div>
                      <div className="transfer-info-card">
                        <div className="info-icon">🚗</div>
                        <h4>{get('home.transfer.features.fleet', 'Comfortable Fleet')}</h4>
                        <p>{get('home.transfer.features.fleetDesc', 'From cars to luxury vans - well-maintained vehicles for 1 to 14 passengers')}</p>
                      </div>
                      <div className="transfer-info-card">
                        <div className="info-icon">🛑</div>
                        <h4>{get('home.transfer.features.stops', 'Flexible Stops')}</h4>
                        <p>{get('home.transfer.features.stopsDesc', 'Request additional stops at temples, attractions, restaurants, or shopping centers along your route')}</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                      <Link href="/transfers" className="btn btn-primary">
                        {get('home.transfer.bookNow', 'Book Your Transfer Now')}
                      </Link>
                    </div>
                  </AnimatedSection>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Contact topic removed per request */}

      {/* Destinations Section */}
      <section className="destinations">
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <h2 className="section-title">{get('home.destinations.title', 'Popular Destinations')}</h2>
            <p className="section-subtitle">{get('home.destinations.subtitle', 'Explore the diverse beauty of Sri Lanka')}</p>
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
                    {destination.image.startsWith('http') ? (
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index < 3}
                      />
                    ) : (
                      <CldImage
                        src={destination.image}
                        alt={destination.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        priority={index < 3}
                      />
                    )}
                    <div className="destination-overlay">
                      <h3>{destination.name}</h3>
                      <p>{destination.description}</p>
                      <Link href={`/destinations/${destination.slug}`} className="btn btn-small">
                        {get('home.destinations.exploreBtn', 'Explore')}
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
            <h2 className="section-title">{get('home.activities.title', 'Things to Do')}</h2>
            <p className="section-subtitle">{get('home.activities.subtitle', 'Popular activities and experiences you can book')}</p>
          </AnimatedSection>

          <div className="destinations-grid">
            {activities.map((act, index) => (
              <AnimatedSection key={act.slug} animation="fadeInUp" delay={index * 0.08}>
                <div className="destination-card">
                  {/* emoji header instead of photo */}
                  <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary-color)' }}>
                    <div style={{ fontSize: '3rem' }}>{act.icon}</div>
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem' }}>{act.name}</h3>
                    <p style={{ color: '#666', margin: '0 0 0.8rem' }}>{act.description}</p>
                    <Link href={`/activities/${act.slug}`} className="btn btn-small">{get('home.activities.exploreBtn', 'Explore')}</Link>
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
            <h2 className="section-title">{get('home.testimonials.title', 'What Our Customers Say')}</h2>
          </AnimatedSection>
          
          <div className="testimonials-slider" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeInLeft" delay={0.2}>
              <div className="testimonial" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="testimonial-content" style={{ flex: 1 }}>
                  <p>"We had an amazing 7-day tour with Zam Zam Lanka Tours. From start to finish, everything was perfectly organized and exceeded our expectations. Our driver-guide was friendly, knowledgeable, and always made sure we were comfortable. The itinerary covered all the major attractions, hidden gems, and beautiful scenic spots of Sri Lanka.<br/><br/>The vehicle was clean and comfortable, and the service throughout the trip was professional and reliable. We truly felt well taken care of and enjoyed every moment of the journey and prices were affordable.<br/><br/>Highly recommended for anyone looking to explore Sri Lanka with a trustworthy and well-organized tour company. Thank you, Zam Zam Lanka Tours, for a memorable experience."</p>
                  <div className="testimonial-author">
                    <strong>Widerbe</strong>
                    <span>Google Review</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <AnimatedSection animation="fadeInRight" delay={0.3}>
                <div className="testimonial" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="testimonial-content" style={{ flex: 1 }}>
                    <p>"A few months ago, I hired a driver from them to guide me through Sri Lanka for 12 days. The trip was great. I was traveling alone and felt safe at all times. Whenever a problem arose, they tried to find a solution quickly. Faizan, the driver's name, was very kind, polite, and friendly. Sri Lanka is worth getting to know; it's a wonderful country, and so are its people. I'll be back. 🫶🏻🇱🇰🫶🏻"</p>
                    <div className="testimonial-author">
                      <strong>Le Tol</strong>
                      <span>Google Review</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInRight" delay={0.4}>
                <div className="testimonial" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="testimonial-content" style={{ flex: 1 }}>
                    <p>"Great service. Excellent driver. Nice car. Very punctual. I will choose this service again for sure."</p>
                    <div className="testimonial-author">
                      <strong>Carlos Rodrigues</strong>
                      <span>Google Review</span>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>

          <AnimatedSection animation="fadeInUp" delay={0.5}>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <a 
                href="https://g.page/r/CQZmXOgmix1OEAE/review" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary"
                style={{
                  display: 'inline-block',
                  padding: '0.875rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                Write a Review
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <div className="cta-content">
              <h2>{get('home.cta.title', 'Ready to Explore Sri Lanka?')}</h2>
              <p>{get('home.cta.subtitle', 'Contact us now to plan your perfect Sri Lankan adventure')}</p>
              <div className="cta-buttons">
                <button 
                  className="btn btn-primary"
                  onClick={() => handleWhatsAppBooking('more information')}
                >
                  {get('home.cta.primary', 'Contact via WhatsApp')}
                </button>
                <Link href="/contact" className="btn btn-secondary">
                  {get('home.cta.secondary', 'Other Contact Methods')}
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
