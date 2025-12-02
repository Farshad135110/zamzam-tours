// pages/hotels/index.js - Hotel Booking & Integrated Services
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CONTACT_INFO } from '../../src/constants/config';
import { fadeInUp } from '../../src/utils/animations';
import useTranslation from '../../src/i18n/useTranslation'

export default function Hotels() {
  // Video hero refs
  const heroRef = useRef(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);
  const [searchParams, setSearchParams] = useState({
    name: '',
    email: '',
    location: 'all',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1,
    priceRange: [0, 1000],
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
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState<string[]>([]);
  const [hotelGallery, setHotelGallery] = useState<any[]>([]);
  const [showGallery, setShowGallery] = useState(false);

  const { t } = useTranslation()

  const get = (key: string, fallback: string) => {
    const val = t(key)
    return val === key ? fallback : val
  }

  // Hotel locations - All Sri Lankan Districts
  const locations = [
    { id: 'all', name: 'All Sri Lanka' },
    { id: 'colombo', name: 'Colombo' },
    { id: 'gampaha', name: 'Gampaha' },
    { id: 'kalutara', name: 'Kalutara' },
    { id: 'kandy', name: 'Kandy' },
    { id: 'matale', name: 'Matale' },
    { id: 'nuwara-eliya', name: 'Nuwara Eliya' },
    { id: 'galle', name: 'Galle' },
    { id: 'matara', name: 'Matara' },
    { id: 'hambantota', name: 'Hambantota' },
    { id: 'jaffna', name: 'Jaffna' },
    { id: 'kilinochchi', name: 'Kilinochchi' },
    { id: 'mannar', name: 'Mannar' },
    { id: 'vavuniya', name: 'Vavuniya' },
    { id: 'mullaitivu', name: 'Mullaitivu' },
    { id: 'batticaloa', name: 'Batticaloa' },
    { id: 'ampara', name: 'Ampara' },
    { id: 'trincomalee', name: 'Trincomalee' },
    { id: 'kurunegala', name: 'Kurunegala' },
    { id: 'puttalam', name: 'Puttalam' },
    { id: 'anuradhapura', name: 'Anuradhapura' },
    { id: 'polonnaruwa', name: 'Polonnaruwa' },
    { id: 'badulla', name: 'Badulla' },
    { id: 'monaragala', name: 'Monaragala' },
    { id: 'ratnapura', name: 'Ratnapura' },
    { id: 'kegalle', name: 'Kegalle' }
  ];

  // Amenities filter
  const amenitiesList = [
    { id: 'pool', name: get('hotels.amenities.pool', 'Swimming Pool') },
    { id: 'spa', name: get('hotels.amenities.spa', 'Spa') },
    { id: 'gym', name: get('hotels.amenities.gym', 'Gym') },
    { id: 'wifi', name: get('hotels.amenities.wifi', 'Free WiFi') },
    { id: 'breakfast', name: get('hotels.amenities.breakfast', 'Breakfast Included') },
    { id: 'beach', name: get('hotels.amenities.beach', 'Beach Access') },
    { id: 'restaurant', name: get('hotels.amenities.restaurant', 'Restaurant') },
    { id: 'bar', name: get('hotels.amenities.bar', 'Bar') }
  ];

  // Sample hotels data (fallback) - kept as a local fallback if API is unreachable
  const sampleHotels = [
    {
      id: 1,
      name: 'Cinnamon Grand Colombo',
      location: 'colombo',
      rating: 4.8,
      reviews: 1247,
      price: 180,
      class: '5-star',
      hotelClass: 'Luxury',
      image: '/hotels/cinnamon-grand.jpg',
      amenities: ['pool', 'spa', 'gym', 'wifi', 'breakfast', 'restaurant', 'bar'],
      facilities: ['Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Free WiFi', 'Breakfast Included', 'Fine Dining Restaurant', 'Cocktail Bar', '24/7 Room Service', 'Business Center', 'Concierge'],
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
      class: '5-star',
      hotelClass: 'Luxury Resort',
      image: '/hotels/kandalama.jpg',
      amenities: ['pool', 'spa', 'wifi', 'breakfast', 'restaurant', 'bar'],
      facilities: ['Infinity Pool', 'Ayurvedic Spa', 'Free WiFi', 'Breakfast Buffet', 'Multi-Cuisine Restaurant', 'Bar & Lounge', 'Nature Trails', 'Bird Watching', 'Lake View Rooms'],
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
      class: '4-star',
      hotelClass: 'Boutique',
      image: '/hotels/fortaleza.jpg',
      amenities: ['pool', 'wifi', 'breakfast', 'restaurant', 'bar'],
      facilities: ['Rooftop Pool', 'Free WiFi', 'Continental Breakfast', 'Restaurant', 'Bar', 'Colonial Architecture', 'Fort Views', 'Walking Distance to Beach'],
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
      class: '4-star',
      hotelClass: 'Beach Resort',
      image: '/hotels/jetwing-beach.jpg',
      amenities: ['pool', 'spa', 'wifi', 'breakfast', 'beach', 'restaurant', 'bar'],
      facilities: ['Beachfront Pool', 'Spa Services', 'Free WiFi', 'Breakfast Buffet', 'Private Beach Access', 'Seafood Restaurant', 'Beach Bar', 'Water Sports', 'Sunset Views'],
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
      class: '5-star',
      hotelClass: 'Luxury Bungalow',
      image: '/hotels/tea-trails.jpg',
      amenities: ['pool', 'spa', 'wifi', 'breakfast', 'restaurant', 'bar'],
      facilities: ['Private Bungalow', 'Butler Service', 'Spa Treatments', 'Free WiFi', 'Gourmet Dining', 'Tea Tasting', 'Plantation Tours', 'Mountain Views', 'Private Pool'],
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
      class: '5-star',
      hotelClass: 'Luxury Safari Camp',
      image: '/hotels/wild-coast.jpg',
      amenities: ['pool', 'wifi', 'breakfast', 'restaurant', 'bar'],
      facilities: ['Luxury Tents', 'Pool with View', 'Free WiFi', 'All Meals Included', 'Safari Experiences', 'Wildlife Viewing', 'Bar & Lounge', 'Nature Integration', 'Private Decks'],
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

  // Ensure sample hotels have a `facilities` field so the UI shows facilities for fallback data
  sampleHotels.forEach(h => {
    if (!('facilities' in h) || !h.facilities) {
      h.facilities = h.amenities ? [...h.amenities] : [];
    }
  });

  // Hotels loaded from the DB (mapped to UI shape). Falls back to sampleHotels when API is unavailable.
  const [hotelsData, setHotelsData] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadHotels() {
      try {
        const res = await fetch('/api/hotels');
        if (!mounted) return;
        if (res.ok) {
          const data = await res.json();
          // Map DB hotel structure to the UI shape used in this page
          const mapped = (data || []).map((h: any, idx: number) => ({
            id: h.hotel_id || `db-${idx}`,
            name: h.hotel_name || 'Unknown Hotel',
            location: h.location || 'all',
            // If DB doesn't have rating/reviews, use gentle defaults
            rating: h.rating || 4.5,
            reviews: h.reviews || 0,
            // price_range may be a string like "100-200" or a number string; try to extract a number
            price: (() => {
              const pr = h.price_range;
              if (!pr) return 120;
              if (typeof pr === 'number') return pr;
              if (typeof pr === 'string') {
                const m = pr.match(/\d+/);
                return m ? Number(m[0]) : 120;
              }
              return 120;
            })(),
            image: h.image || '/hotels/default.jpg',
            // Parse facilities (DB `facilities` column may be CSV or array). Populate both `facilities` and `amenities` for the UI.
            facilities: (() => {
              if (!h.facilities) return [];
              if (Array.isArray(h.facilities)) return h.facilities.map((s: any) => String(s).trim());
              return String(h.facilities).split(',').map((s: string) => s.trim());
            })(),
            amenities: (() => {
              if (h.amenities && Array.isArray(h.amenities)) return h.amenities.map((s: any) => String(s).trim());
              if (h.facilities && Array.isArray(h.facilities)) return h.facilities.map((s: any) => String(s).trim());
              if (h.facilities) return String(h.facilities).split(',').map((s: string) => s.trim());
              return [];
            })(),
            description: h.description || '',
            coordinates: h.coordinates || { lat: 0, lng: 0 },
            popularPackages: h.popularPackages || []
          }));

          setHotelsData(mapped);
        } else {
          setHotelsData(sampleHotels);
        }
      } catch (err) {
        console.error('Failed to load hotels from API:', err);
        if (mounted) setHotelsData(sampleHotels);
      }
    }

    loadHotels();
    return () => { mounted = false; };
  }, []);

  // Additional services
  const additionalServices = [
    {
      id: 'airport-transfer',
      name: get('hotels.services.airportTransfer.name', 'Airport & All-Island Transfer'),
      description: get('hotels.services.airportTransfer.description', 'Hassle-free pickup from airport to hotel'),
      price: 25,
      types: ['standard', 'premium'],
      image: '/services/airport-transfer.jpg'
    },
    {
      id: 'daily-tours',
      name: get('hotels.services.dailyTours.name', 'Daily Tours'),
      description: get('hotels.services.dailyTours.description', 'Guided tours from your hotel location'),
      price: 50,
      types: ['cultural', 'adventure', 'wildlife', 'beach'],
      image: '/services/daily-tours.jpg'
    },
    {
      id: 'rental-car',
      name: get('hotels.services.rentalCar.name', 'Car Rental'),
      description: get('hotels.services.rentalCar.description', 'Self-drive or with driver vehicle rental'),
      price: 40,
      types: ['self-drive', 'with-driver'],
      image: '/services/car-rental.jpg'
    }
  ];

  // Package deals
  const packageDeals = [
    {
      id: 'beach-paradise',
      name: get('hotels.packages.beachParadise.name', 'Beach Paradise Package'),
      description: get('hotels.packages.beachParadise.description', '7 nights beachfront accommodation + airport & island transfers + daily beach tours'),
      originalPrice: 1200,
      discountedPrice: 999,
      includes: [
        get('hotels.packages.includes.7nights', '7 nights hotel'),
        get('hotels.packages.includes.airportTransfers', 'Airport & island transfers'),
        get('hotels.packages.includes.3beachTours', '3 beach tours'),
        get('hotels.packages.includes.breakfastIncluded', 'Breakfast included')
      ],
      image: '/packages/beach-paradise.jpg'
    },
    {
      id: 'cultural-journey',
      name: get('hotels.packages.culturalJourney.name', 'Cultural Journey Package'),
      description: get('hotels.packages.culturalJourney.description', '5 nights heritage hotels + cultural triangle tours + airport & island transfers'),
      originalPrice: 800,
      discountedPrice: 650,
      includes: [
        get('hotels.packages.includes.5nights', '5 nights hotel'),
        get('hotels.packages.includes.entranceFees', 'All entrance fees'),
        get('hotels.packages.includes.expertGuide', 'Expert guide'),
        get('hotels.packages.includes.breakfastDinner', 'Breakfast & dinner')
      ],
      image: '/packages/cultural-journey.jpg'
    },
    {
      id: 'adventure-combo',
      name: get('hotels.packages.adventureCombo.name', 'Adventure Combo Package'),
      description: get('hotels.packages.adventureCombo.description', '6 nights adventure resorts + hiking + safari + transfers'),
      originalPrice: 1100,
      discountedPrice: 899,
      includes: [
        get('hotels.packages.includes.6nights', '6 nights hotel'),
        get('hotels.packages.includes.safari', 'Safari experience'),
        get('hotels.packages.includes.hikingTours', 'Hiking tours'),
        get('hotels.packages.includes.allTransfers', 'All transfers')
      ],
      image: '/packages/adventure-combo.jpg'
    }
  ];

  // Use hotels loaded from DB when available, otherwise fall back to sampleHotels
  const activeHotels = hotelsData.length > 0 ? hotelsData : sampleHotels;

  // Filter hotels based on search criteria
  const filteredHotels = activeHotels.filter(hotel => {
    const matchesLocation = searchParams.location === 'all' || hotel.location === searchParams.location;
    const matchesPrice = hotel.price >= searchParams.priceRange[0] && hotel.price <= searchParams.priceRange[1];
    const matchesRating = hotel.rating >= searchParams.rating;
    const matchesAmenities = searchParams.amenities.length === 0 || 
      searchParams.amenities.every(amenity => hotel.amenities && hotel.amenities.includes(amenity));
    
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
    let message = `${get('hotels.messages.greeting','Hello Zamzam Lanka Tours! I would like to book accommodation and services:')}\n\n`;
    
    if (selectedHotel) {
      message += `🏨 ${get('hotels.messages.hotelBookingBadge','*Hotel Booking:*')}\n`;
      message += `• ${get('hotels.messages.hotelLabel','Hotel:')} ${selectedHotel.name}\n`;
      message += `• ${get('hotels.messages.locationLabel','Location:')} ${locations.find(l => l.id === selectedHotel.location)?.name}\n`;
      if (searchParams.checkIn) message += `• ${get('hotels.messages.checkInLabel','Check-in:')} ${searchParams.checkIn}\n`;
      if (searchParams.checkOut) message += `• ${get('hotels.messages.checkOutLabel','Check-out:')} ${searchParams.checkOut}\n`;
      message += `• ${get('hotels.messages.guestsLabel','Guests:')} ${searchParams.guests}\n`;
      message += `• ${get('hotels.messages.roomsLabel','Rooms:')} ${searchParams.rooms}\n`;
      message += `• ${get('hotels.messages.hotelPriceLabel','Hotel Price:')} $${selectedHotel.price}/${get('hotels.price.perNightShort','night')}\n\n`;
    }

    message += `🚗 ${get('hotels.messages.additionalServicesBadge','*Additional Services:*')}\n`;
    if (selectedPackages.airportTransfer) message += `• ${get('hotels.services.airportTransfer.name','Airport & All-Island Transfer')}: ${get('hotels.messages.yes','Yes')}\n`;
    if (selectedPackages.dailyTours) message += `• ${get('hotels.services.dailyTours.name','Daily Tours')}: ${get('hotels.messages.yes','Yes')}\n`;
    if (selectedPackages.rentalCar) message += `• ${get('hotels.services.rentalCar.name','Car Rental')}: ${get('hotels.messages.yes','Yes')}\n\n`;

    message += `💰 ${get('hotels.messages.totalEstimatedCost','*Total Estimated Cost:*')} $${calculateTotalPrice()}\n\n`;
    message += get('hotels.messages.pleaseProvide','Please provide availability and complete booking details.');

    const encodedMessage = encodeURIComponent(message);
    window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodedMessage}`, '_blank');
  };

  // Open hotel details and booking
  const openHotelBooking = async (hotel) => {
    setSelectedHotel(hotel);
    setShowBookingForm(true);
    
    // Scroll to top smoothly when modal opens
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
    
    // Fetch gallery images
    try {
      const res = await fetch(`/api/hotel-gallery?hotel_id=${hotel.id}`);
      if (res.ok) {
        const data = await res.json();
        setHotelGallery(data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      setHotelGallery([]);
    }
  };

  return (
    <>
      <Head>
        <title>{t('hotels.pageTitle')}</title>
        <meta name="description" content={t('hotels.metaDescription')} />
        <meta name="keywords" content={t('hotels.metaKeywords')} />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="hero" ref={heroRef} style={{ marginTop: '0', position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Cloudinary Hero Background Video */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'hidden'
        }}>
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster="https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453704/dylan-shaw-smUAKwMT8XA-unsplash_qhenhx.jpg"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
            src="https://res.cloudinary.com/dhfqwxyb4/video/upload/v1761688999/18993612-hd_1920_1080_50fps_eaeogq.mp4"
          />
        </div>
        
        <div className="hero-overlay" style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(5, 59, 60, 0.6), rgba(10, 92, 94, 0.5))',
          zIndex: 1
        }}></div>
        
        <motion.div 
          style={{ position: 'relative', zIndex: 2 }}
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
        >
          <div className="container">
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h1 style={{ 
                textShadow: '3px 3px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 0, 0, 0.6)',
                color: '#ffffff',
                fontSize: '3.5rem',
                fontWeight: '700',
                marginBottom: '1.5rem'
              }}>
                {get('hotels.hero.titlePrefix', 'Luxury')}{' '}
                <span style={{ color: '#f8b500' }}>{get('hotels.hero.titleHighlight', 'Accommodations')}</span>{' '}
                {get('hotels.hero.titleSuffix', 'in Sri Lanka')}
              </h1>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <p style={{ 
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.7)',
                color: '#ffffff',
                fontSize: '1.4rem',
                marginBottom: '2.5rem',
                opacity: '0.98'
              }}>
                {get('hotels.hero.subtitle', 'Book your perfect stay with integrated travel services')}
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <div className="hero-features" style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '3rem',
                flexWrap: 'wrap',
                background: 'rgba(255, 255, 255, 0.12)',
                padding: '2rem 2.5rem',
                borderRadius: '20px',
                backdropFilter: 'blur(15px)',
                maxWidth: '800px',
                margin: '0 auto',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
              }}>
                <div className="feature-item" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.8rem',
                  color: 'white'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🏨</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>{get('hotels.feature.luxuryHotels', 'Luxury Hotels')}</span>
                </div>
                <div className="feature-item" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.8rem',
                  color: 'white'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🚗</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>{get('hotels.feature.airportTransfers', 'Airport & All-Island Transfers')}</span>
                </div>
                <div className="feature-item" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.8rem',
                  color: 'white'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>🗺️</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>{get('hotels.feature.dailyTours', 'Daily Tours')}</span>
                </div>
                <div className="feature-item" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.8rem',
                  color: 'white'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>💼</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>{get('hotels.feature.completePackages', 'Complete Packages')}</span>
                </div>
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
          <div className="scroll-indicator" style={{
            position: 'absolute',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            color: '#ffffff'
          }}>
            <span style={{ 
              display: 'block',
              marginBottom: '10px',
              fontSize: '14px',
              fontWeight: '500',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
            }}>Scroll to explore</span>
            { /* scroll indicator text --- localized */ }
            <span style={{ 
              display: 'block',
              marginBottom: '10px',
              fontSize: '14px',
              fontWeight: '500',
              textShadow: '1px 1px 4px rgba(0, 0, 0, 0.8)'
            }}>{get('hotels.hero.scroll', 'Scroll to explore')}</span>
            <div className="arrow-down" style={{
              width: '30px',
              height: '30px',
              margin: '0 auto',
              borderLeft: '2px solid #ffffff',
              borderBottom: '2px solid #ffffff',
              transform: 'rotate(-45deg)',
              filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.8))'
            }}></div>
          </div>
        </motion.div>
      </section>

      {/* Search & Filters Section */}
      <section className="search-section">
        <div className="container">
          <div className="section-header">
            <h2>{get('hotels.search.title', 'Find Your Perfect Stay')}</h2>
            <p>{get('hotels.search.subtitle', "Tell us your preferences and we'll help you find the ideal accommodation")}</p>
          </div>
          
          <div className="search-card">
            <div className="search-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{get('hotels.form.label.name', 'Your Name *')}</label>
                  <input 
                    type="text" 
                    placeholder={get('hotels.form.placeholder.name', 'Enter your full name')}
                    value={searchParams.name}
                    onChange={(e) => setSearchParams({...searchParams, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>{get('hotels.form.label.email', 'Email Address *')}</label>
                  <input 
                    type="email" 
                    placeholder={get('hotels.form.placeholder.email', 'your.email@example.com')}
                    value={searchParams.email}
                    onChange={(e) => setSearchParams({...searchParams, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{get('hotels.form.label.destination', 'Destination')}</label>
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
                  <label>{get('hotels.form.label.checkIn', 'Check-in Date')}</label>
                  <input 
                    type="date" 
                    value={searchParams.checkIn}
                    onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>{get('hotels.form.label.checkOut', 'Check-out Date')}</label>
                  <input 
                    type="date" 
                    value={searchParams.checkOut}
                    onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                    min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="form-group">
                  <label>{get('hotels.form.label.guests', 'Guests')}</label>
                  <select 
                    value={searchParams.guests}
                    onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7,8,9,10,12,14,16,18,20].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? get('hotels.form.guestSingular','Guest') : get('hotels.form.guestPlural','Guests')}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>{get('hotels.form.label.rooms', 'Rooms')}</label>
                  <select 
                    value={searchParams.rooms}
                    onChange={(e) => setSearchParams({...searchParams, rooms: parseInt(e.target.value)})}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? get('hotels.form.roomSingular','Room') : get('hotels.form.roomPlural','Rooms')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="advanced-filters">
                <div className="filter-group">
                  <label>{get('hotels.filters.priceRange', 'Price Range:')} ${searchParams.priceRange[0]} - ${searchParams.priceRange[1]}</label>
                  <input 
                    type="range" 
                    min="0"
                    max="1000"
                    step="50"
                    value={searchParams.priceRange[1]}
                    onChange={(e) => setSearchParams({
                      ...searchParams, 
                      priceRange: [searchParams.priceRange[0], parseInt(e.target.value)]
                    })}
                    className="price-slider"
                  />
                </div>

                <div className="filter-group">
                  <label>{get('hotels.filters.minimumRating', 'Minimum Rating')}</label>
                  <div className="rating-filters">
                    {[4.5, 4, 3.5, 3, 0].map(rating => (
                      <button
                        key={rating}
                        className={`rating-btn ${searchParams.rating === rating ? 'active' : ''}`}
                        onClick={() => setSearchParams({...searchParams, rating})}
                      >
                        {rating === 0 ? get('hotels.filters.any', 'Any') : `${rating}+`} ⭐
                      </button>
                    ))}
                  </div>
                </div>

                <div className="filter-group">
                  <label>{get('hotels.filters.amenities', 'Amenities')}</label>
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

              {/* Additional Services - Compact Design */}
              <div className="services-compact">
                <label className="services-compact-label">{get('hotels.services.compactLabel', 'Additional Services (Optional)')}</label>
                <div className="services-compact-grid">
                  <div 
                    className={`service-compact-card ${selectedAdditionalServices.includes('airport-transfer') ? 'selected' : ''}`}
                    onClick={() => {
                      if (selectedAdditionalServices.includes('airport-transfer')) {
                        setSelectedAdditionalServices(selectedAdditionalServices.filter(id => id !== 'airport-transfer'));
                      } else {
                        setSelectedAdditionalServices([...selectedAdditionalServices, 'airport-transfer']);
                      }
                    }}
                  >
                    <div className="service-compact-icon">✈️</div>
                    <div className="service-compact-content">
                      <h4>{get('hotels.services.airportTransfer.name', 'Airport & All-Island Transfer')}</h4>
                      <p>{get('hotels.services.airportTransfer.description', 'Hassle-free pickup from airport to hotel')}</p>
                    </div>
                    <div className="service-compact-check">
                      {selectedAdditionalServices.includes('airport-transfer') && '✓'}
                    </div>
                  </div>

                  <div 
                    className={`service-compact-card ${selectedAdditionalServices.includes('daily-tours') ? 'selected' : ''}`}
                    onClick={() => {
                      if (selectedAdditionalServices.includes('daily-tours')) {
                        setSelectedAdditionalServices(selectedAdditionalServices.filter(id => id !== 'daily-tours'));
                      } else {
                        setSelectedAdditionalServices([...selectedAdditionalServices, 'daily-tours']);
                      }
                    }}
                  >
                    <div className="service-compact-icon">🗺️</div>
                    <div className="service-compact-content">
                      <h4>{get('hotels.services.dailyTours.name', 'Daily Tours')}</h4>
                      <p>{get('hotels.services.dailyTours.description', 'Guided tours from your hotel location')}</p>
                    </div>
                    <div className="service-compact-check">
                      {selectedAdditionalServices.includes('daily-tours') && '✓'}
                    </div>
                  </div>

                  <div 
                    className={`service-compact-card ${selectedAdditionalServices.includes('rental-car') ? 'selected' : ''}`}
                    onClick={() => {
                      if (selectedAdditionalServices.includes('rental-car')) {
                        setSelectedAdditionalServices(selectedAdditionalServices.filter(id => id !== 'rental-car'));
                      } else {
                        setSelectedAdditionalServices([...selectedAdditionalServices, 'rental-car']);
                      }
                    }}
                  >
                    <div className="service-compact-icon">🚗</div>
                    <div className="service-compact-content">
                      <h4>{get('hotels.services.rentalCar.name', 'Car Rental')}</h4>
                      <p>{get('hotels.services.rentalCar.description', 'Self-drive or with driver vehicle rental')}</p>
                    </div>
                    <div className="service-compact-check">
                      {selectedAdditionalServices.includes('rental-car') && '✓'}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                className="btn-primary search-btn"
                onClick={() => {
                  let message = `${get('hotels.messages.inquiryBadge','🏨 *HOTEL INQUIRY*')}\n`;
                  message += `${get('hotels.messages.lineSeparator','━━━━━━━━━━━━━━━━━━━━━━━━')}\n\n`;
                  if (searchParams.name) message += `👤 ${get('hotels.messages.nameLabel','*Name:*')} ${searchParams.name}\n`;
                  if (searchParams.email) message += `📧 ${get('hotels.messages.emailLabel','*Email:*')} ${searchParams.email}\n\n`;
                  message += `📍 ${get('hotels.messages.destinationLabel','*Destination:*')} ${locations.find(l => l.id === searchParams.location)?.name}\n`;
                  if (searchParams.checkIn) message += `📅 ${get('hotels.messages.checkInLabel','*Check-in:*')} ${searchParams.checkIn}\n`;
                  if (searchParams.checkOut) message += `📅 ${get('hotels.messages.checkOutLabel','*Check-out:*')} ${searchParams.checkOut}\n`;
                  message += `👥 ${get('hotels.messages.guestsLabel','*Guests:*')} ${searchParams.guests}\n`;
                  message += `🛏️ ${get('hotels.messages.roomsLabel','*Rooms:*')} ${searchParams.rooms}\n`;
                  message += `💰 ${get('hotels.messages.budgetLabel','*Budget:*')} $${searchParams.priceRange[0]} - $${searchParams.priceRange[1]} ${get('hotels.price.perNight','per night')}\n`;
                  if (searchParams.rating > 0) message += `⭐ ${get('hotels.messages.minimumRatingLabel','*Minimum Rating:*')} ${searchParams.rating}+\n`;
                  if (searchParams.amenities.length > 0) {
                    message += `🎯 ${get('hotels.messages.preferredAmenitiesLabel','*Preferred Amenities:*')} ${searchParams.amenities.map(a => amenitiesList.find(am => am.id === a)?.name).join(', ')}\n`;
                  }
                  
                  if (selectedAdditionalServices.length > 0) {
                    message += '\n*ADDITIONAL SERVICES:*\n';
                    selectedAdditionalServices.forEach(serviceId => {
                      const service = additionalServices.find(s => s.id === serviceId);
                      if (service) {
                        message += `✓ ${service.name}\n`;
                      }
                    });
                  }
                  
                  message += '\n━━━━━━━━━━━━━━━━━━━━━━━━\n';
                  message += '_Please share available hotels and packages_';
                  
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodedMessage}`, '_blank');
                }}
              >
                {get('hotels.search.sendWhatsApp', '📱 Send Inquiry via WhatsApp')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hotels Grid */}
      <section className="hotels-grid-section">
        <div className="container">
          <div className="section-header">
            <h2>{get('hotels.grid.title', 'Featured Hotels & Resorts')}</h2>
            <p>{get('hotels.grid.subtitle', 'Curated selection of the best accommodations across Sri Lanka')}</p>
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
                    style={{ objectFit: 'cover' }}
                  />
                  {hotel.class && (
                    <div className="hotel-class-badge">
                      {hotel.class}
                    </div>
                  )}
                  <div className="hotel-location">
                    {locations.find(l => l.id === hotel.location)?.name}
                  </div>
                </div>

                <div className="hotel-content">
                  <div className="hotel-title-row">
                    <h3>{hotel.name}</h3>
                    {hotel.hotelClass && (
                      <span className="hotel-type-badge">{hotel.hotelClass}</span>
                    )}
                  </div>
                  <p className="hotel-description">{hotel.description}</p>

                  {/* Facilities list (from DB 'facilities' column). Show full list as tags or comma list */}
                  {hotel.facilities && hotel.facilities.length > 0 && (
                    <div className="hotel-facilities">
                      <strong>{get('hotels.facilities.label', 'Facilities:')}</strong>
                      <div className="facility-tags">
                        {hotel.facilities.slice(0, 6).map((f: string, idx: number) => (
                          <span key={idx} className="facility-tag">✓ {f.trim()}</span>
                        ))}
                        {hotel.facilities.length > 6 && (
                          <span className="facility-more">+{hotel.facilities.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  
                  

                  <div className="hotel-footer">
                    <div className="hotel-price">
                      <span className="price">{get('hotels.price.from', 'From')} ${hotel.price}</span>
                      <span className="period">{get('hotels.price.perNight', 'per night')}</span>
                    </div>
                    <div className="hotel-actions">
                      <button 
                        className="btn-view-details"
                        onClick={() => openHotelBooking(hotel)}
                      >
                        {get('hotels.buttons.viewDetails', 'View Details')}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Hover overlay with details on gradient */}
                <div className="hotel-overlay">
                  <div className="overlay-content">
                    <h3>{hotel.name}</h3>
                    <div className="overlay-location">
                      📍 {locations.find(l => l.id === hotel.location)?.name}
                    </div>
                    <p className="overlay-description">{hotel.description}</p>
                    
                    {hotel.facilities && hotel.facilities.length > 0 && (
                      <div className="overlay-facilities">
                        {hotel.facilities.slice(0, 6).map((f: string) => (
                          <span key={f} className="overlay-facility-tag">✓ {f.trim()}</span>
                        ))}
                      </div>
                    )}

                    <div className="overlay-price">
                      <span className="overlay-price-label">{get('hotels.price.from', 'From')}</span>
                      <span className="overlay-price-amount">${hotel.price}</span>
                      <span className="overlay-price-period">/{get('hotels.price.perNight', 'night')}</span>
                    </div>

                    <div className="overlay-actions">
                      <button 
                        className="overlay-btn-view"
                        onClick={() => openHotelBooking(hotel)}
                      >
                        {get('hotels.buttons.viewDetails', 'View Details')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredHotels.length === 0 && (
            <div className="no-results">
              <h3>{get('hotels.noResults.title', 'No hotels found matching your criteria')}</h3>
                <p>{get('hotels.noResults.subtitle', 'Try adjusting your filters or search parameters')}</p>
                <button 
                  className="btn-primary"
                  onClick={() => setSearchParams({
                  name: '',
                  email: '',
                  location: 'all',
                  checkIn: '',
                  checkOut: '',
                  guests: 2,
                  rooms: 1,
                  priceRange: [0, 1000],
                  rating: 0,
                  amenities: []
                })}
              >
                  {get('hotels.buttons.resetFilters', 'Reset Filters')}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Integrated Services Banner */}
      <section className="integrated-banner">
        <div className="container">
          <div className="banner-content">
            <h2>{get('hotels.integrated.title', 'One Booking, Complete Journey')}</h2>
            <p>{get('hotels.integrated.subtitle', 'From airport pickup to hotel stay, daily tours, and departure - we handle everything')}</p>
            
            <div className="banner-steps">
              <div className="step">
                <div className="step-icon">🛬</div>
                <div className="step-text">
                  <h4>{get('hotels.integrated.steps.airportPickup.title', 'Airport Pickup')}</h4>
                  <p>{get('hotels.integrated.steps.airportPickup.description', 'Meet & greet service with comfortable transfer to hotel')}</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">🏨</div>
                <div className="step-text">
                  <h4>{get('hotels.integrated.steps.hotelStay.title', 'Hotel Stay')}</h4>
                  <p>{get('hotels.integrated.steps.hotelStay.description', 'Luxury accommodation with best locations and amenities')}</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">🚗</div>
                <div className="step-text">
                  <h4>{get('hotels.integrated.steps.dailyTours.title', 'Daily Tours')}</h4>
                  <p>{get('hotels.integrated.steps.dailyTours.description', 'Guided excursions from your hotel to major attractions')}</p>
                </div>
              </div>
              
              <div className="step">
                <div className="step-icon">✈️</div>
                <div className="step-text">
                  <h4>{get('hotels.integrated.steps.departure.title', 'Departure Transfer')}</h4>
                  <p>{get('hotels.integrated.steps.departure.description', 'Timely pickup from hotel to airport for your flight')}</p>
                </div>
              </div>
            </div>

            <div className="banner-cta">
              <button 
                className="btn-primary large"
                onClick={() => {
                  const message = `Hello Zamzam Lanka Tours! I want to book a complete travel package including hotel, transfers, and tours. Please help me plan my trip.`;
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodedMessage}`, '_blank');
                }}
              >
                {get('hotels.integrated.cta', '💬 Plan My Complete Trip on WhatsApp')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && selectedHotel && (
        <div className="modal-overlay-modern" onClick={() => setShowBookingForm(false)}>
          <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <div className="modal-title-section">
                <h2>{get('hotels.modal.title', 'Book Your Stay')}</h2>
                <p className="modal-subtitle">{selectedHotel.name}</p>
              </div>
              <button 
                className="modal-close-modern"
                onClick={() => setShowBookingForm(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="booking-tabs-modern">
              <button 
                className={`tab-modern ${bookingType === 'hotel-only' ? 'active' : ''}`}
                onClick={() => setBookingType('hotel-only')}
              >
                <span className="tab-icon">🏨</span>
                <span className="tab-label">{get('hotels.modal.tab.hotelOnly', 'Hotel Only')}</span>
              </button>
              <button 
                className={`tab-modern ${bookingType === 'with-services' ? 'active' : ''}`}
                onClick={() => setBookingType('with-services')}
              >
                <span className="tab-icon">🎯</span>
                <span className="tab-label">{get('hotels.modal.tab.hotelPlusServices', 'Hotel + Services')}</span>
              </button>
              <button 
                className={`tab-modern ${bookingType === 'complete-package' ? 'active' : ''}`}
                onClick={() => setBookingType('complete-package')}
              >
                <span className="tab-icon">⭐</span>
                <span className="tab-label">{get('hotels.modal.tab.completePackage', 'Complete Package')}</span>
              </button>
            </div>

            <div className="booking-content-modern">
              {/* Hotel Summary */}
              <div className="hotel-summary-modern">
                <div className="hotel-image-modern">
                  <Image 
                    src={selectedHotel.image} 
                    alt={selectedHotel.name}
                    width={200}
                    height={150}
                    style={{ borderRadius: '12px', objectFit: 'cover' }}
                  />
                </div>
                <div className="hotel-details-modern">
                  <h3>{selectedHotel.name}</h3>
                  <div className="hotel-meta-modern">
                    <span className="meta-item">
                      <span className="meta-icon">⭐</span>
                      <span>{selectedHotel.rating} ({selectedHotel.reviews})</span>
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{locations.find(l => l.id === selectedHotel.location)?.name}</span>
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">💰</span>
                      <span>${selectedHotel.price}/night</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Hotel Gallery */}
              {hotelGallery.length > 0 && (
                <div className="hotel-gallery-section" style={{
                  marginBottom: '1.5rem',
                  padding: '1rem',
                  background: '#f8f9fa',
                  borderRadius: '10px',
                  border: '1.5px solid #e9ecef'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem'
                  }}>
                    <h3 style={{
                      margin: 0,
                      fontSize: '1rem',
                      color: '#053b3c',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      <span>📸</span> Hotel Gallery ({hotelGallery.length} photos)
                    </h3>
                    {hotelGallery.length > 3 && (
                      <button
                        type="button"
                        onClick={() => setShowGallery(!showGallery)}
                        style={{
                          padding: '0.4rem 0.8rem',
                          background: '#053b3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          cursor: 'pointer'
                        }}
                      >
                        {showGallery ? 'Show Less' : 'View All'}
                      </button>
                    )}
                  </div>
                  
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                    gap: '0.75rem'
                  }}>
                    {(showGallery ? hotelGallery : hotelGallery.slice(0, 3)).map((img, idx) => (
                      <div key={img.gallery_id || idx} style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        paddingBottom: '75%',
                        background: '#e9ecef',
                        cursor: 'pointer'
                      }}
                      onClick={() => window.open(img.image_url, '_blank')}
                      >
                        <img 
                          src={img.image_url} 
                          alt={img.caption || `Hotel photo ${idx + 1}`}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        {img.caption && (
                          <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.7rem',
                            lineHeight: '1.2'
                          }}>
                            {img.caption}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Form */}
              <form className="booking-form-modern">
                <div className="form-section-modern">
                  <h3 className="section-heading-modern">
                    <span className="heading-icon">📅</span>
                    {get('hotels.modal.bookingDetails.title', 'Booking Details')}
                  </h3>
                  <div className="form-row-modern">
                    <div className="form-group-modern">
                      <label>{get('hotels.form.label.checkInRequired', 'Check-in Date *')}</label>
                      <input 
                        type="date" 
                        value={searchParams.checkIn}
                        onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div className="form-group-modern">
                      <label>{get('hotels.form.label.checkOutRequired', 'Check-out Date *')}</label>
                      <input 
                        type="date" 
                        value={searchParams.checkOut}
                        onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                        min={searchParams.checkIn || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row-modern">
                    <div className="form-group-modern">
                      <label>{get('hotels.form.label.guestsRequired', 'Guests *')}</label>
                      <select 
                        value={searchParams.guests}
                        onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
                        required
                      >
                          {[1,2,3,4,5,6].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? get('hotels.form.guestSingular','Guest') : get('hotels.form.guestPlural','Guests')}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group-modern">
                      <label>{get('hotels.form.label.roomsRequired', 'Rooms *')}</label>
                      <select 
                        value={searchParams.rooms}
                        onChange={(e) => setSearchParams({...searchParams, rooms: parseInt(e.target.value)})}
                        required
                      >
                          {[1,2,3,4].map(num => (
                          <option key={num} value={num}>{num} {num === 1 ? get('hotels.form.roomSingular','Room') : get('hotels.form.roomPlural','Rooms')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Additional Services */}
                {bookingType !== 'hotel-only' && (
                  <div className="form-section-modern">
                    <h3 className="section-heading-modern">
                      <span className="heading-icon">🎯</span>
                      {get('hotels.modal.additionalServices.title', 'Additional Services')}
                    </h3>
                    <div className="services-selection-modern">
                      {additionalServices.map(service => (
                        <label key={service.id} className="service-checkbox-modern">
                          <input
                            type="checkbox"
                            checked={selectedPackages[service.id]}
                            onChange={(e) => setSelectedPackages({
                              ...selectedPackages,
                              [service.id]: e.target.checked
                            })}
                          />
                          <div className="service-info-modern">
                            <div className="service-header-modern">
                              <span className="service-name">{service.name}</span>
                              <span className="service-price-modern">+${service.price}</span>
                            </div>
                            <span className="service-desc-modern">{service.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                <div className="form-section-modern">
                  <h3 className="section-heading-modern">
                    <span className="heading-icon">💰</span>
                    {get('hotels.modal.priceSummary.title', 'Price Summary')}
                  </h3>
                  <div className="price-summary-modern">
                    <div className="summary-row-modern">
                      <span>{get('hotels.modal.priceSummary.hotelLabel', 'Hotel')} ({searchParams.rooms} {get('hotels.modal.priceSummary.roomsLabel','rooms')})</span>
                      <span className="summary-price">${selectedHotel.price * searchParams.rooms}</span>
                    </div>
                    
                    {selectedPackages.airportTransfer && (
                      <div className="summary-row-modern">
                        <span>✈️ {get('hotels.services.airportTransfer.name','Airport & All-Island Transfer')}</span>
                        <span className="summary-price">+${additionalServices.find(s => s.id === 'airport-transfer')?.price}</span>
                      </div>
                    )}
                    
                    {selectedPackages.dailyTours && (
                      <div className="summary-row-modern">
                        <span>🗺️ {get('hotels.services.dailyTours.name','Daily Tours')}</span>
                        <span className="summary-price">+${additionalServices.find(s => s.id === 'daily-tours')?.price}</span>
                      </div>
                    )}
                    
                    {selectedPackages.rentalCar && (
                      <div className="summary-row-modern">
                        <span>🚗 {get('hotels.services.rentalCar.name','Car Rental')}</span>
                        <span className="summary-price">+${additionalServices.find(s => s.id === 'rental-car')?.price}</span>
                      </div>
                    )}

                    <div className="summary-divider-modern"></div>
                    <div className="summary-row-modern total-modern">
                      <span>{get('hotels.modal.priceSummary.totalLabel','Total Amount')}</span>
                      <span className="summary-total-price">${calculateTotalPrice()}</span>
                    </div>
                  </div>
                </div>

                <div className="form-actions-modern">
                  <button 
                    type="button"
                    className="btn-cancel-modern"
                    onClick={() => setShowBookingForm(false)}
                  >
                    <span className="btn-icon">✕</span>
                    <span className="btn-text">{get('hotels.buttons.cancel','Cancel')}</span>
                  </button>
                  <button 
                    type="button"
                    className="btn-confirm-modern"
                    onClick={handleWhatsAppBooking}
                  >
                    <span className="btn-icon">💬</span>
                    <span className="btn-text">{get('hotels.buttons.confirmAndBook','Confirm & Book via WhatsApp')}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Hotels Page Specific Styles */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
          margin-top: 80px;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(5, 59, 60, 0.6), rgba(10, 92, 94, 0.5));
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          padding: 0 2rem;
          text-align: center;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
          text-shadow: 3px 3px 10px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 0, 0, 0.6);
          color: #ffffff;
        }

        .hero-content p {
          font-size: 1.4rem;
          margin-bottom: 2.5rem;
          opacity: 0.98;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.7);
          color: #ffffff;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: #ffffff;
        }

        /* Search Section */
        .search-section {
          padding: 4rem 0;
          background: var(--section-bg);
        }

        .section-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .section-header p {
          font-size: 1.1rem;
          color: var(--text-light);
          max-width: 600px;
          margin: 0 auto;
        }

        .search-card {
          background: white;
          padding: 2.5rem;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

        /* Compact Services Inside Form */
        .services-compact {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 2px solid #f0f0f0;
        }

        .services-compact-label {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 1rem;
        }

        .services-compact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .service-compact-card {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem;
          background: #f8f9fa;
          border: 2px solid transparent;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .service-compact-card:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .service-compact-card.selected {
          background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);
          border-color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(255,108,0,0.15);
        }

        .service-compact-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .service-compact-content {
          flex: 1;
          min-width: 0;
        }

        .service-compact-content h4 {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-color);
          margin: 0 0 0.25rem 0;
          line-height: 1.2;
        }

        .service-compact-content p {
          font-size: 0.75rem;
          color: var(--text-light);
          margin: 0;
          line-height: 1.3;
        }

        .service-compact-check {
          width: 24px;
          height: 24px;
          border: 2px solid #ddd;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          color: white;
          background: white;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .service-compact-card.selected .service-compact-check {
          background: var(--primary-color);
          border-color: var(--primary-color);
        }

        /* Modern Modal Styles */
        .modal-overlay-modern {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
          overflow-y: auto;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content-modern {
          background: white;
          border-radius: 12px;
          max-width: 700px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 15px 40px rgba(0,0,0,0.25);
          animation: slideUp 0.3s ease;
          margin: auto;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header-modern {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 1.25rem 1.5rem 1rem;
          border-bottom: 2px solid #f0f0f0;
          background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);
        }

        .modal-title-section h2 {
          margin: 0 0 0.25rem 0;
          font-size: 1.4rem;
          color: var(--text-color);
        }

        .modal-subtitle {
          margin: 0;
          font-size: 0.95rem;
          color: var(--primary-color);
          font-weight: 600;
        }

        .modal-close-modern {
          background: rgba(0,0,0,0.05);
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 1.3rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .modal-close-modern:hover {
          background: rgba(0,0,0,0.1);
          color: var(--text-color);
          transform: rotate(90deg);
        }

        .booking-tabs-modern {
          display: flex;
          gap: 0.4rem;
          padding: 1rem 1.5rem;
          background: #f8f9fa;
          border-bottom: 2px solid #e9ecef;
        }

        .tab-modern {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.3rem;
          padding: 0.65rem 0.5rem;
          background: white;
          border: 1.5px solid #dee2e6;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-modern:hover {
          border-color: var(--primary-color);
          transform: translateY(-1px);
        }

        .tab-modern.active {
          background: linear-gradient(135deg, #fff8f0 0%, #ffffff 100%);
          border-color: var(--primary-color);
          box-shadow: 0 2px 8px rgba(255,108,0,0.12);
        }

        .tab-icon {
          font-size: 1.2rem;
        }

        .tab-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-color);
        }

        .booking-content-modern {
          padding: 1.5rem;
        }

        .hotel-summary-modern {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border-radius: 10px;
          margin-bottom: 1.25rem;
          border: 1.5px solid #e9ecef;
        }

        .hotel-image-modern {
          flex-shrink: 0;
        }

        .hotel-details-modern h3 {
          margin: 0 0 0.65rem 0;
          font-size: 1.1rem;
          color: var(--text-color);
        }

        .hotel-meta-modern {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .meta-icon {
          font-size: 0.9rem;
        }

        .booking-form-modern {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-section-modern {
          background: white;
          border: 1.5px solid #f0f0f0;
          border-radius: 10px;
          padding: 1rem;
        }

        .section-heading-modern {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem 0;
          font-size: 1rem;
          color: var(--text-color);
        }

        .heading-icon {
          font-size: 1.1rem;
        }

        .form-row-modern {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .form-row-modern:last-child {
          margin-bottom: 0;
        }

        .form-group-modern {
          display: flex;
          flex-direction: column;
        }

        .form-group-modern label {
          margin-bottom: 0.4rem;
          font-weight: 600;
          color: var(--text-color);
          font-size: 0.8rem;
        }

        .form-group-modern input,
        .form-group-modern select {
          padding: 0.65rem;
          border: 1.5px solid #e9ecef;
          border-radius: 6px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .form-group-modern input:focus,
        .form-group-modern select:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(255,108,0,0.08);
        }

        .services-selection-modern {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
        }

        .service-checkbox-modern {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.75rem;
          background: #f8f9fa;
          border: 1.5px solid transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .service-checkbox-modern:hover {
          background: white;
          border-color: #dee2e6;
        }

        .service-checkbox-modern input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--primary-color);
          margin-top: 1px;
        }

        .service-info-modern {
          flex: 1;
        }

        .service-header-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.3rem;
        }

        .service-name {
          font-weight: 600;
          color: var(--text-color);
          font-size: 0.9rem;
        }

        .service-price-modern {
          font-weight: 700;
          color: var(--primary-color);
          font-size: 0.9rem;
        }

        .service-desc-modern {
          font-size: 0.75rem;
          color: var(--text-light);
          line-height: 1.3;
        }

        .price-summary-modern {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .summary-row-modern {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          font-size: 0.85rem;
        }

        .summary-price {
          font-weight: 600;
          color: var(--text-color);
        }

        .summary-divider-modern {
          height: 1.5px;
          background: linear-gradient(90deg, transparent, #e9ecef, transparent);
          margin: 0.4rem 0;
        }

        .summary-row-modern.total-modern {
          padding: 0.75rem 0 0 0;
          font-size: 1rem;
          font-weight: 700;
        }

        .summary-total-price {
          font-size: 1.3rem;
          color: var(--primary-color);
          font-weight: 700;
        }

        .form-actions-modern {
          display: flex;
          gap: 0.75rem;
          padding-top: 0.75rem;
        }

        .btn-cancel-modern,
        .btn-confirm-modern {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel-modern {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          color: var(--text-color);
          border: 2px solid #dee2e6;
        }

        .btn-cancel-modern:hover {
          background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .btn-confirm-modern {
          background: linear-gradient(135deg, var(--primary-color) 0%, #d96200 100%);
          color: white;
        }

        .btn-confirm-modern:hover {
          background: linear-gradient(135deg, #d96200 0%, var(--primary-color) 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255,108,0,0.25);
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
          background: #053b3c;
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
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        .hotel-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
        }

        .hotel-card:hover .hotel-overlay {
          opacity: 1;
          pointer-events: auto;
        }

        .hotel-image {
          position: relative;
          height: 220px;
          width: 100%;
          overflow: hidden;
          flex-shrink: 0;
          background: #f0f3f4;
        }

        .hotel-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(.2,.8,.2,1);
        }

        .hotel-card:hover .hotel-image img {
          transform: scale(1.08);
        }

        /* Overlay that covers entire card on hover */
        .hotel-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          overflow-y: auto;
        }

        .hotel-overlay::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0.95) 100%);
          z-index: 1;
        }

        .hotel-card:hover .hotel-image {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          height: 100%;
          z-index: 5;
        }

        .overlay-content {
          color: white;
          text-align: center;
          width: 100%;
          max-height: 100%;
          overflow-y: auto;
          position: relative;
          z-index: 2;
        }

        .overlay-content h3 {
          color: white;
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          font-weight: 700;
        }

        .overlay-location {
          color: #f8b500;
          font-size: 0.9rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .overlay-description {
          color: rgba(255,255,255,0.9);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .overlay-facilities {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .overlay-facility-tag {
          background: rgba(255,255,255,0.15);
          padding: 0.3rem 0.6rem;
          border-radius: 5px;
          font-size: 0.75rem;
          color: white;
          backdrop-filter: blur(5px);
          text-align: left;
        }

        .overlay-price {
          margin-bottom: 1.5rem;
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.3rem;
        }

        .overlay-price-label {
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
        }

        .overlay-price-amount {
          color: #f8b500;
          font-size: 2rem;
          font-weight: 700;
        }

        .overlay-price-period {
          color: rgba(255,255,255,0.8);
          font-size: 0.9rem;
        }

        .overlay-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .overlay-btn-view,
        .overlay-btn-book {
          padding: 0.7rem 1.5rem;
          border-radius: 5px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .overlay-btn-view {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid white;
          backdrop-filter: blur(10px);
        }

        .overlay-btn-view:hover {
          background: white;
          color: var(--primary-color);
        }

        .overlay-btn-book {
          background: #f8b500;
          color: white;
        }

        .overlay-btn-book:hover {
          background: #e5a600;
          transform: scale(1.05);
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

        .hotel-class-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: linear-gradient(135deg, #f8b500 0%, #ff8c00 100%);
          color: white;
          padding: 5px 12px;
          border-radius: 15px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          box-shadow: 0 2px 8px rgba(248, 181, 0, 0.4);
          letter-spacing: 0.5px;
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
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .hotel-content h3 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-size: 1.4rem;
          font-weight: 700;
        }

        .hotel-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
        }

        .hotel-title-row h3 {
          margin: 0;
          flex: 0 1 auto;
        }

        .hotel-type-badge {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
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

        /* Facilities (from DB) */
        .hotel-facilities {
          margin-bottom: 1rem;
        }

        .facility-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 0.5rem;
        }

        .facility-tag {
          background: var(--section-bg);
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .facility-more {
          background: linear-gradient(135deg, var(--primary-color) 0%, #d96200 100%);
          color: white;
          padding: 3px 10px;
          border-radius: 10px;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: default;
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

        .btn-view-details,
        .btn-book-now {
          flex: 1;
          padding: 0.65rem 1rem;
          border: none;
          border-radius: 5px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-view-details {
          background: white;
          color: var(--text-color);
          border: 1px solid var(--border-color);
        }

        .btn-view-details:hover {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
        }

        .btn-book-now {
          background: var(--primary-color);
          color: white;
        }

        .btn-book-now:hover {
          background: #d96200;
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(255,108,0,0.2);
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
          position: relative;
          transition: all 0.3s ease;
          border: 3px solid transparent;
        }

        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .service-card.selected {
          border-color: var(--primary-color);
          box-shadow: 0 8px 25px rgba(5, 59, 60, 0.3);
        }

        .service-checkbox-wrapper {
          position: absolute;
          top: 15px;
          right: 15px;
          z-index: 10;
          background: white;
          border-radius: 50%;
          padding: 5px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        }

        .service-checkbox-input {
          width: 24px;
          height: 24px;
          cursor: pointer;
          accent-color: var(--primary-color);
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

        /* Large Screen Optimizations */
        @media (min-width: 2560px) {
          .hotels-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 3rem;
          }
        }

        @media (min-width: 1920px) and (max-width: 2559px) {
          .hotels-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 1440px) and (max-width: 1919px) {
          .hotels-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .hotels-grid {
            grid-template-columns: repeat(2, 1fr);
          }
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

          .hero-content h1 {
            font-size: 2.8rem;
          }

          .hero-content p {
            font-size: 1.2rem;
          }

          .section-header h2 {
            font-size: 2rem;
          }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.2rem;
          }

          .hero-content p {
            font-size: 1.1rem;
          }

          .section-header h2 {
            font-size: 1.8rem;
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
          .hero {
            min-height: 80vh;
          }

          .hero-content h1 {
            font-size: 1.8rem;
          }

          .hero-content p {
            font-size: 1rem;
          }

          .section-header h2 {
            font-size: 1.5rem;
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
        }`}</style>

      <Footer />
    </>
  );
}
