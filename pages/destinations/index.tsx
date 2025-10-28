import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';
import { CldImage } from 'next-cloudinary';
import { fadeInUp } from '../../src/utils/animations';

export default function Destinations() {
  const [activeFilter, setActiveFilter] = useState('all');
  const heroRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Autoplay video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  const destinations = [
    { 
      name: 'Sigiriya', 
      image: 'zamzam-tours/destinations/sigiriya', 
      description: 'Ancient rock fortress with breathtaking views',
      longDescription: 'Climb the iconic Lion Rock and explore one of the most spectacular archaeological sites in the world.',
      category: 'cultural',
      duration: '1 Day',
      slug: 'sigiriya' 
    },
    { 
      name: 'Kandy', 
      image: 'zamzam-tours/destinations/kandy', 
      description: 'Cultural capital with the Temple of the Tooth',
      longDescription: 'Visit the sacred Temple of the Tooth Relic and experience traditional Kandyan dance performances.',
      category: 'cultural',
      duration: '1-2 Days',
      slug: 'kandy' 
    },
    { 
      name: 'Galle', 
      image: 'zamzam-tours/destinations/galle', 
      description: 'Historic fort city by the ocean',
      longDescription: 'Walk through the colonial Dutch fort and enjoy stunning ocean views from the ramparts.',
      category: 'cultural',
      duration: '1 Day',
      slug: 'galle' 
    },
    { 
      name: 'Ella', 
      image: 'zamzam-tours/destinations/ella', 
      description: 'Mountain paradise with tea plantations',
      longDescription: 'Hike to Little Adam\'s Peak, visit Nine Arch Bridge, and enjoy panoramic views from Ella Rock.',
      category: 'nature',
      duration: '2-3 Days',
      slug: 'ella' 
    },
    { 
      name: 'Yala', 
      image: 'zamzam-tours/destinations/yala', 
      description: 'Premier wildlife sanctuary',
      longDescription: 'Spot leopards, elephants, and exotic birds in Sri Lanka\'s most famous national park.',
      category: 'wildlife',
      duration: '1-2 Days',
      slug: 'yala' 
    },
    { 
      name: 'Nuwara Eliya', 
      image: 'zamzam-tours/destinations/nuwara-eliya', 
      description: 'Little England in the hills',
      longDescription: 'Experience the cool climate, visit tea factories, and explore colonial-era architecture.',
      category: 'nature',
      duration: '1-2 Days',
      slug: 'nuwara-eliya' 
    },
    { 
      name: 'Mirissa', 
      image: 'zamzam-tours/destinations/mirissa', 
      description: 'Beach paradise and whale watching hub',
      longDescription: 'Relax on pristine beaches and embark on whale watching adventures.',
      category: 'beach',
      duration: '2-3 Days',
      slug: 'mirissa' 
    },
    { 
      name: 'Anuradhapura', 
      image: 'zamzam-tours/destinations/anuradhapura', 
      description: 'Ancient capital with sacred sites',
      longDescription: 'Explore the ruins of an ancient civilization and visit the sacred Bodhi tree.',
      category: 'cultural',
      duration: '1 Day',
      slug: 'anuradhapura' 
    },
    { 
      name: 'Polonnaruwa', 
      image: 'zamzam-tours/destinations/polonnaruwa', 
      description: 'Medieval capital with ancient ruins',
      longDescription: 'Cycle through well-preserved ruins and marvel at the Gal Vihara rock sculptures.',
      category: 'cultural',
      duration: '1 Day',
      slug: 'polonnaruwa' 
    },
    { 
      name: 'Udawalawe', 
      image: 'zamzam-tours/destinations/udawalawe', 
      description: 'Elephant sanctuary and national park',
      longDescription: 'Witness large herds of elephants in their natural habitat.',
      category: 'wildlife',
      duration: '1 Day',
      slug: 'udawalawe' 
    },
    { 
      name: 'Trincomalee', 
      image: 'zamzam-tours/destinations/trincomalee', 
      description: 'Pristine beaches and historic temples',
      longDescription: 'Enjoy crystal-clear waters, world-class diving, and ancient Hindu temples.',
      category: 'beach',
      duration: '2-3 Days',
      slug: 'trincomalee' 
    },
    { 
      name: 'Arugam Bay', 
      image: 'zamzam-tours/destinations/arugam-bay', 
      description: 'World-famous surfing destination',
      longDescription: 'Catch the perfect wave and enjoy the laid-back beach atmosphere.',
      category: 'beach',
      duration: '2-4 Days',
      slug: 'arugam-bay' 
    }
  ];

  const filteredDestinations = activeFilter === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.category === activeFilter);

  return (
    <>
      <Head>
        <title>Destinations in Sri Lanka | ZamZam Tours</title>
        <meta name="description" content="Explore the best destinations in Sri Lanka with ZamZam Tours. From ancient cultural sites to pristine beaches and wildlife sanctuaries." />
        <meta name="keywords" content="Sri Lanka destinations, places to visit Sri Lanka, tourist attractions, cultural sites, beaches, wildlife" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="hero-section"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginTop: 0
        }}
      >
        {/* Background Video */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0
          }}
        >
          <source 
            src="https://res.cloudinary.com/dhfqwxyb4/video/upload/v1737895743/218798_small_ov2k3s.mp4" 
            type="video/mp4" 
          />
        </video>

        {/* Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(5, 59, 60, 0.45), rgba(10, 92, 94, 0.35))',
            zIndex: 1
          }}
        />

        {/* Content */}
        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <h1 
              style={{ 
                fontSize: '3.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1.5rem',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3), 0 0 30px rgba(0,0,0,0.2)'
              }}
            >
              Discover Sri Lanka
            </h1>
            <p 
              style={{ 
                fontSize: '1.3rem', 
                marginBottom: '2rem',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Explore breathtaking destinations from ancient cities to pristine beaches
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div 
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            animation: 'bounce 2s infinite'
          }}
        >
          <div style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
            Scroll to explore
          </div>
          <div style={{ fontSize: '2rem', animation: 'bounce 2s infinite' }}>↓</div>
        </div>
      </section>

      {/* Filters Section */}
      <section style={{ padding: '4rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title">Filter by Category</h2>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '2rem' }}>
                <button 
                  className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('all')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: activeFilter === 'all' ? '2px solid #053b3c' : '2px solid #ddd',
                    background: activeFilter === 'all' ? '#053b3c' : 'white',
                    color: activeFilter === 'all' ? 'white' : '#333',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  All Destinations
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'cultural' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('cultural')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: activeFilter === 'cultural' ? '2px solid #053b3c' : '2px solid #ddd',
                    background: activeFilter === 'cultural' ? '#053b3c' : 'white',
                    color: activeFilter === 'cultural' ? 'white' : '#333',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Cultural Sites
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'nature' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('nature')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: activeFilter === 'nature' ? '2px solid #053b3c' : '2px solid #ddd',
                    background: activeFilter === 'nature' ? '#053b3c' : 'white',
                    color: activeFilter === 'nature' ? 'white' : '#333',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Nature & Hills
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'wildlife' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('wildlife')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: activeFilter === 'wildlife' ? '2px solid #053b3c' : '2px solid #ddd',
                    background: activeFilter === 'wildlife' ? '#053b3c' : 'white',
                    color: activeFilter === 'wildlife' ? 'white' : '#333',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Wildlife
                </button>
                <button 
                  className={`filter-btn ${activeFilter === 'beach' ? 'active' : ''}`}
                  onClick={() => setActiveFilter('beach')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: activeFilter === 'beach' ? '2px solid #053b3c' : '2px solid #ddd',
                    background: activeFilter === 'beach' ? '#053b3c' : 'white',
                    color: activeFilter === 'beach' ? 'white' : '#333',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'all 0.3s ease'
                  }}
                >
                  Beaches
                </button>
              </div>
            </div>
          </AnimatedSection>

          {/* Destinations Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {filteredDestinations.map((destination, index) => (
              <AnimatedSection key={destination.slug} animation="fadeInUp" delay={index * 0.1}>
                <div 
                  style={{
                    background: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '250px' }}>
                    <CldImage 
                      src={destination.image}
                      alt={destination.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div 
                      style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: '#f8b500',
                        color: '#000',
                        padding: '0.5rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}
                    >
                      {destination.duration}
                    </div>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#053b3c' }}>
                      {destination.name}
                    </h3>
                    <p style={{ color: '#666', marginBottom: '0.75rem', fontSize: '0.95rem' }}>
                      {destination.description}
                    </p>
                    <p style={{ color: '#555', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                      {destination.longDescription}
                    </p>
                    <Link 
                      href={`/destinations/${destination.slug}`}
                      style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        background: '#053b3c',
                        color: 'white',
                        borderRadius: '25px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'background 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#0a5c5e'}
                      onMouseLeave={(e) => e.currentTarget.style.background = '#053b3c'}
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 0', background: '#053b3c', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Ready to Explore Sri Lanka?</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
              Let us help you plan the perfect itinerary for your dream vacation
            </p>
            <Link 
              href="/contact"
              style={{
                display: 'inline-block',
                padding: '1rem 2.5rem',
                background: '#f8b500',
                color: '#000',
                borderRadius: '30px',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '1.1rem',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(248, 181, 0, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Plan Your Trip
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        .filter-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem !important;
          }
          p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </>
  );
}
