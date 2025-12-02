import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';
import { CldImage } from 'next-cloudinary';
import { fadeInUp } from '../../src/utils/animations';
import useTranslation from '../../src/i18n/useTranslation';

export default function Destinations() {
  const { t } = useTranslation();
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
    { name: 'Sigiriya', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453704/dylan-shaw-smUAKwMT8XA-unsplash_qhenhx.jpg', description: 'Ancient rock fortress with breathtaking views', longDescription: 'Climb the iconic Lion Rock and explore one of the most spectacular archaeological sites in the world.', category: 'cultural', duration: '1 Day', slug: 'sigiriya' },
  { name: 'Kandy', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454466/chathura-anuradha-subasinghe-40uQmE9Zq8g-unsplash_tvflxt.jpg', description: 'Cultural capital with the Temple of the Tooth', longDescription: 'Visit the sacred Temple of the Tooth Relic and experience traditional Kandyan dance performances.', category: 'cultural', duration: '1-2 Days', slug: 'kandy' },
    { name: 'Galle', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453796/chathura-indika-LAj-XlHP6Rs-unsplash_o7mzbc.jpg', description: 'Historic fort city by the ocean', longDescription: 'Walk through the colonial Dutch fort and enjoy stunning ocean views from the ramparts.', category: 'cultural', duration: '1 Day', slug: 'galle' },
    { name: 'Ella', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453781/adam-vandermeer-Dw9dWTzzsUE-unsplash_l49hhe.jpg', description: 'Mountain paradise with tea plantations', longDescription: 'Hike to Little Adam\'s Peak, visit Nine Arch Bridge, and enjoy panoramic views from Ella Rock.', category: 'nature', duration: '2-3 Days', slug: 'ella' },
    { name: 'Yala', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453757/gemmmm-FRTpkBIi-1Y-unsplash_iggwsm.jpg', description: 'Premier wildlife sanctuary', longDescription: 'Spot leopards, elephants, and exotic birds in Sri Lanka\'s most famous national park.', category: 'wildlife', duration: '1-2 Days', slug: 'yala' },
    { name: 'Nuwara Eliya', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453797/anton-lecock-TPtaNsBOW9Q-unsplash_g0htag.jpg', description: 'Little England in the hills', longDescription: 'Experience the cool climate, visit tea factories, and explore colonial-era architecture.', category: 'nature', duration: '1-2 Days', slug: 'nuwara-eliya' },
    { name: 'Mirissa', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454382/siarhei-palishchuk-hgiby6qxvpc-unsplash_prnosl.jpg', description: 'Beach paradise and whale watching hub', longDescription: 'Relax on pristine beaches and embark on whale watching adventures.', category: 'beach', duration: '2-3 Days', slug: 'mirissa' },
    { name: 'Anuradhapura', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454366/andrea-zanenga-U2-9JKq3Sv8-unsplash_ykmenj.jpg', description: 'Ancient capital with sacred sites', longDescription: 'Explore the ruins of an ancient civilization and visit the sacred Bodhi tree.', category: 'cultural', duration: '1 Day', slug: 'anuradhapura' },
    { name: 'Polonnaruwa', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454341/birendra-padmaperuma-jB7TbGrC1xM-unsplash_qcpkau.jpg', description: 'Medieval capital with ancient ruins', longDescription: 'Cycle through well-preserved ruins and marvel at the Gal Vihara rock sculptures.', category: 'cultural', duration: '1 Day', slug: 'polonnaruwa' },
    { name: 'Udawalawe', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861324/sachindra-chalaka-ERIYlk3Hppo-unsplash_n41n9c.jpg', description: 'Elephant sanctuary and national park', longDescription: 'Witness large herds of elephants in their natural habitat.', category: 'wildlife', duration: '1 Day', slug: 'udawalawe' },
    { name: 'Trincomalee', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453771/claus-giering-YmcSXWcmh6w-unsplash_zw66ck.jpg', description: 'Pristine beaches and historic temples', longDescription: 'Enjoy crystal-clear waters, world-class diving, and ancient Hindu temples.', category: 'beach', duration: '2-3 Days', slug: 'trincomalee' },
    { name: 'Arugam Bay', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453785/udara-karunarathna-LfUJO4whcSU-unsplash_xnxl7h.jpg', description: 'World-famous surfing destination', longDescription: 'Catch the perfect wave and enjoy the laid-back beach atmosphere.', category: 'beach', duration: '2-4 Days', slug: 'arugam-bay' },
    { name: 'Bentota', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453760/ivani-de-silva-p4CkGihlKeI-unsplash_faup7y.jpg', description: 'Golden beaches and water sports paradise', longDescription: 'Enjoy pristine beaches, water sports, and luxury resorts on the southwest coast.', category: 'beach', duration: '2-3 Days', slug: 'bentota' },
    { name: 'Hikkaduwa', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453918/croyde-bay-qw6f1CIXOqQ-unsplash_heu61d.jpg', description: 'Coral reefs and vibrant nightlife', longDescription: 'Snorkel with sea turtles, explore coral reefs, and enjoy beachside cafes.', category: 'beach', duration: '2-3 Days', slug: 'hikkaduwa' },
    { name: 'Dambulla', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861700/agnieszka-stankiewicz-OMgi4DfiO3c-unsplash_dfa3pd.jpg', description: 'Golden Temple and cave monasteries', longDescription: 'Discover the UNESCO World Heritage cave temple complex with stunning Buddha statues.', category: 'cultural', duration: 'Half Day', slug: 'dambulla' },
    { name: 'Horton Plains', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861681/anupa-uthsara-Prg6PmMQdK4-unsplash_rfz6fv.jpg', description: 'World\'s End cliff and cloud forests', longDescription: 'Trek through misty highlands to the dramatic World\'s End precipice.', category: 'nature', duration: '1 Day', slug: 'horton-plains' },
    { name: 'Unawatuna', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453914/eirik-skarstein-7CsKioF9O6g-unsplash_gb7eow.jpg', description: 'Crescent bay with coral reefs', longDescription: 'Swim in the protected bay, snorkel among colorful fish, and relax on golden sands.', category: 'beach', duration: '2-3 Days', slug: 'unawatuna' },
    { name: 'Wilpattu', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453910/udara-karunarathna-PPGM2ZpCrzc-unsplash_vchneo.jpg', description: 'Largest national park with leopards', longDescription: 'Safari through ancient lakes and dense forests to spot leopards and sloth bears.', category: 'wildlife', duration: '1-2 Days', slug: 'wilpattu' },
    { name: 'Jaffna', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861565/ajai-s-A4amRej5Hes-unsplash_ofpmmw.jpg', description: 'Northern peninsula with Tamil culture', longDescription: 'Experience unique Tamil culture, visit historic temples, and explore remote islands.', category: 'cultural', duration: '2-3 Days', slug: 'jaffna' },
    { name: 'Adams Peak', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453906/manoj-dharmarathne-sznpwfFhfrU-unsplash_hnkhcg.jpg', description: 'Sacred mountain pilgrimage', longDescription: 'Climb the holy peak for sunrise views and visit the sacred footprint at the summit.', category: 'nature', duration: '1 Day', slug: 'adams-peak' }
  ];

  const filteredDestinations = activeFilter === 'all' ? destinations : destinations.filter(dest => dest.category === activeFilter);

  return (
    <>
      <Head>
        <title>{t('destinations.pageTitle')}</title>
        <meta name="description" content={t('destinations.metaDescription')} />
        <meta name="keywords" content={t('destinations.metaKeywords')} />
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
              {t('destinations.hero.title')}
            </h1>
            <p 
              style={{ 
                fontSize: '1.3rem', 
                marginBottom: '2rem',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              {t('destinations.hero.subtitle')}
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
            {t('destinations.hero.scrollText')}
          </div>
          <div style={{ fontSize: '2rem', animation: 'bounce 2s infinite' }}>↓</div>
        </div>
      </section>

      {/* Filters Section */}
      <section style={{ padding: '4rem 0', background: '#f8f9fa' }}>
        <div className="container">
          <AnimatedSection animation="fadeInUp">
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <h2 className="section-title">{t('destinations.filters.title')}</h2>
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
                  {t('destinations.filters.all')}
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
                  {t('destinations.filters.cultural')}
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
                  {t('destinations.filters.nature')}
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
                  {t('destinations.filters.wildlife')}
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
                  {t('destinations.filters.beaches')}
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
                    {/* duration removed per request */}
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
                      {t('destinations.learnMore')}
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
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('destinations.cta.title')}</h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
              {t('destinations.cta.subtitle')}
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
              {t('destinations.cta.button')}
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

        /* Large Screens */
        @media (min-width: 2560px) {
          .destinations-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 3rem;
          }

          h1 {
            font-size: 4.5rem !important;
          }
        }

        @media (min-width: 1920px) and (max-width: 2559px) {
          .destinations-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 2.5rem;
          }

          h1 {
            font-size: 4rem !important;
          }
        }

        @media (min-width: 1440px) and (max-width: 1919px) {
          .destinations-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          h1 {
            font-size: 3.5rem !important;
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .destinations-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          h1 {
            font-size: 3rem !important;
          }
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem !important;
          }
          p {
            font-size: 1rem !important;
          }
          .destinations-grid {
            grid-template-columns: 1fr !important;
          }
          .destination-card {
            max-width: 100%;
          }
          button, a {
            min-height: 44px;
            padding: 12px 24px;
          }
        }

        @media (max-width: 576px) {
          h1 {
            font-size: 2rem !important;
          }
          .container {
            padding: 0 1rem;
          }
        }
      `}</style>
    </>
  );
}
