// pages/tours/index.js - Tours Main Page
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CONTACT_INFO } from '../../src/constants/config';
import AnimatedSection from '../../components/AnimatedSection';
import { CldImage } from 'next-cloudinary';
import { fadeInUp } from '../../src/utils/animations';
import useTranslation from '../../src/i18n/useTranslation';

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
  priceRange?: string;
  includes?: string[];
  groupSize?: string;
}

export default function Tours() {
  const { t } = useTranslation();
  const get = (key: string, fallback: string) => {
    const val = t(key);
    return val === key ? fallback : val;
  };
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDuration, setSelectedDuration] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showTourDetails, setShowTourDetails] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [bookingFormScrollTop, setBookingFormScrollTop] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [portraitMap, setPortraitMap] = useState<Record<string, boolean>>({});
  
  // Video hero refs
  const heroRef = useRef(null);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  
  // Array of videos from zamzam-tours/heroes/tours folder
  const heroVideos = [
    'https://res.cloudinary.com/dhfqwxyb4/video/upload/v1761571416/218798_small_ov2k3s.mp4',
    'https://res.cloudinary.com/dhfqwxyb4/video/upload/v1761571365/158112-816068529_small_jsqcds.mp4',
    'https://res.cloudinary.com/dhfqwxyb4/video/upload/v1761571370/158220-816359501_small_dp2ik1.mp4',
  ];

  // Fetch packages from database
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/packages');
        if (!response.ok) throw new Error('Failed to fetch packages');
        const packages = await response.json();
        
        // Transform database packages to Tour format
        // Use locale-backed fallbacks: if a translation key exists for the package (tours.packages.<package_id>.*)
        // the localized string will be used, otherwise the backend-provided text is used.
        const transformedTours = packages.map((pkg: any) => ({
          id: parseInt(pkg.package_id.replace('P', '')) || 0,
          name: get(`tours.packages.${pkg.package_id}.name`, pkg.package_name),
          category: 'cultural', // Default category
          duration: pkg.days ? `${pkg.days} ${pkg.days === 1 ? 'day' : 'days'}` : '7 days',
          priceRange: pkg.price ? (pkg.price < 1000 ? 'budget' : pkg.price < 2000 ? 'standard' : 'premium') : 'standard',
          price: pkg.price ? parseFloat(pkg.price) : 0,
          image: pkg.image || '/tours/default.jpg',
          highlights: pkg.highlights ? pkg.highlights.split(/[,\n]/).map((h: string) => h.trim()).filter(Boolean) : [],
          description: get(`tours.packages.${pkg.package_id}.description`, pkg.description || ''),
          includes: pkg.includings ? pkg.includings.split(/[,\n]/).map((i: string) => i.trim()).filter(Boolean) : [],
          difficulty: pkg.difficulty || 'Moderate',
          groupSize: pkg.group_size || '2-12 people',
          season: pkg.season || 'Year-round',
          // rating and reviews removed from tour packages (display suppressed)
          included: pkg.includings ? pkg.includings.split(/[,\n]/).map((i: string) => i.trim()).filter(Boolean) : [],
          itinerary: pkg.itinerary || []
        }));
        
        setTours(transformedTours);
      } catch (error) {
        console.error('Error fetching packages:', error);
        alert('Failed to load tour packages');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPackages();
  }, []);

  // Handle scroll
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
    // pre-check images currently in the page (popular destinations and initial tours)
    popularDestinations.forEach(d => checkImageOrientation(d.image));
    tours.forEach(t => checkImageOrientation(t.image));
  }, []);

  // When tours load, check their image orientations
  useEffect(() => {
    if (tours && tours.length > 0) {
      tours.forEach(t => checkImageOrientation(t.image));
    }
  }, [tours]);

  // Auto-scroll to booking form when it opens
  useEffect(() => {
    if (showBookingForm) {
      setTimeout(() => {
        const formPopup = document.querySelector('.booking-form-popup') as HTMLElement;
        if (formPopup) {
          formPopup.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  }, [showBookingForm]);
  
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

  // Detect image orientation (client-side) and mark portrait images so we can adjust objectPosition
  const checkImageOrientation = (src: string) => {
    if (!src || portraitMap[src] !== undefined) return;
    if (typeof window === 'undefined') return;
    const img = new window.Image();
    img.src = src;
    img.onload = () => {
      const isPortrait = img.naturalHeight > img.naturalWidth;
      setPortraitMap(prev => ({ ...prev, [src]: isPortrait }));
    };
    img.onerror = () => setPortraitMap(prev => ({ ...prev, [src]: false }));
  };

  // Tour categories
  const categories = [
    { id: 'all', name: get('tours.filters.categories.all', 'All Tours') },
    { id: 'cultural', name: get('tours.filters.categories.cultural', 'Cultural') },
    { id: 'adventure', name: get('tours.filters.categories.adventure', 'Adventure') },
    { id: 'beach', name: get('tours.filters.categories.beach', 'Beach & Relaxation') },
    { id: 'wildlife', name: get('tours.filters.categories.wildlife', 'Wildlife') },
    { id: 'north-east', name: get('tours.filters.categories.northeast', 'North East') },
    { id: 'hill-country', name: get('tours.filters.categories.hillCountry', 'Hill Country') },
    { id: 'historical', name: get('tours.filters.categories.historical', 'Historical') }
  ];

  // Duration filters
  const durations = [
    { id: 'all', name: get('tours.filters.durations.any', 'Any Duration') },
    { id: '1-3', name: get('tours.filters.durations.1-3', '1-3 Days') },
    { id: '4-7', name: get('tours.filters.durations.4-7', '4-7 Days') },
    { id: '8-14', name: get('tours.filters.durations.8-14', '8-14 Days') },
    { id: '15+', name: get('tours.filters.durations.15', '15+ Days') }
  ];

  // Price ranges
  const priceRanges = [
    { id: 'all', name: get('tours.filters.prices.any', 'Any Price') },
    { id: 'budget', name: get('tours.filters.prices.budget', 'Budget ($500-$1000)') },
    { id: 'standard', name: get('tours.filters.prices.standard', 'Standard ($1000-$2000)') },
    { id: 'premium', name: get('tours.filters.prices.premium', 'Premium ($2000-$4000)') },
    { id: 'luxury', name: get('tours.filters.prices.luxury', 'Luxury ($4000+)') }
  ];

  // Popular destinations in Sri Lanka
  const popularDestinations = [
    { name: 'Sigiriya', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453704/dylan-shaw-smUAKwMT8XA-unsplash_qhenhx.jpg', description: 'Ancient rock fortress - UNESCO World Heritage Site with stunning frescoes', category: 'Cultural', slug: 'sigiriya' },
    { name: 'Kandy', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454466/chathura-anuradha-subasinghe-40uQmE9Zq8g-unsplash_tvflxt.jpg', description: 'Sacred city with Temple of the Tooth Relic and cultural performances', category: 'Cultural', slug: 'kandy' },
    { name: 'Ella', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453781/adam-vandermeer-Dw9dWTzzsUE-unsplash_l49hhe.jpg', description: 'Mountain paradise with tea plantations, Nine Arch Bridge, and hiking trails', category: 'Nature', slug: 'ella' },
    { name: 'Galle', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453796/chathura-indika-LAj-XlHP6Rs-unsplash_o7mzbc.jpg', description: 'Historic Dutch fort city by the ocean - UNESCO World Heritage Site', category: 'Cultural', slug: 'galle' },
    { name: 'Yala', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453757/gemmmm-FRTpkBIi-1Y-unsplash_iggwsm.jpg', description: 'Premier wildlife sanctuary with highest leopard density in the world', category: 'Wildlife', slug: 'yala' },
    { name: 'Nuwara Eliya', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453797/anton-lecock-TPtaNsBOW9Q-unsplash_g0htag.jpg', description: 'Little England - Cool climate hill station with tea plantations', category: 'Nature', slug: 'nuwara-eliya' },
    { name: 'Mirissa', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454382/siarhei-palishchuk-hgiby6qxvpc-unsplash_prnosl.jpg', description: 'Whale watching capital with pristine beaches and tropical vibes', category: 'Beach', slug: 'mirissa' },
    { name: 'Anuradhapura', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454366/andrea-zanenga-U2-9JKq3Sv8-unsplash_ykmenj.jpg', description: 'Ancient capital with sacred Buddhist sites and massive stupas', category: 'Cultural', slug: 'anuradhapura' },
    { name: 'Polonnaruwa', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454341/birendra-padmaperuma-jB7TbGrC1xM-unsplash_qcpkau.jpg', description: 'Medieval capital with Gal Vihara rock sculptures', category: 'Cultural', slug: 'polonnaruwa' },
    { name: 'Udawalawe', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861324/sachindra-chalaka-ERIYlk3Hppo-unsplash_n41n9c.jpg', description: 'Elephant paradise with guaranteed sightings of wild elephant herds', category: 'Wildlife', slug: 'udawalawe' },
    { name: 'Trincomalee', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453771/claus-giering-YmcSXWcmh6w-unsplash_zw66ck.jpg', description: 'Pristine east coast beaches, diving spots, and historic temples', category: 'Beach', slug: 'trincomalee' },
    { name: 'Arugam Bay', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453785/udara-karunarathna-LfUJO4whcSU-unsplash_xnxl7h.jpg', description: 'World-famous surfing destination on the southeast coast', category: 'Beach', slug: 'arugam-bay' },
    { name: 'Bentota', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453760/ivani-de-silva-p4CkGihlKeI-unsplash_faup7y.jpg', description: 'Golden beaches and water sports paradise on the southwest coast', category: 'Beach', slug: 'bentota' },
    { name: 'Hikkaduwa', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453918/croyde-bay-qw6f1CIXOqQ-unsplash_heu61d.jpg', description: 'Coral reefs, sea turtles, and vibrant beach town atmosphere', category: 'Beach', slug: 'hikkaduwa' },
    { name: 'Dambulla', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861700/agnieszka-stankiewicz-OMgi4DfiO3c-unsplash_dfa3pd.jpg', description: 'Golden Temple with cave shrines and 150+ Buddha statues', category: 'Cultural', slug: 'dambulla' },
    { name: 'Horton Plains', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861681/anupa-uthsara-Prg6PmMQdK4-unsplash_rfz6fv.jpg', description: "World's End cliff with dramatic 880m drop and cloud forests", category: 'Nature', slug: 'horton-plains' },
    { name: 'Unawatuna', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453914/eirik-skarstein-7CsKioF9O6g-unsplash_gb7eow.jpg', description: "Crescent bay paradise voted one of world's best beaches", category: 'Beach', slug: 'unawatuna' },
    { name: 'Wilpattu', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453910/udara-karunarathna-PPGM2ZpCrzc-unsplash_vchneo.jpg', description: 'Largest national park with unique villus (lakes) and leopards', category: 'Wildlife', slug: 'wilpattu' },
    { name: 'Jaffna', image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861565/ajai-s-A4amRej5Hes-unsplash_ofpmmw.jpg', description: 'Northern Tamil cultural capital with unique heritage and islands', category: 'Cultural', slug: 'jaffna' },
    { name: "Adam's Peak", image: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453906/manoj-dharmarathne-sznpwfFhfrU-unsplash_hnkhcg.jpg', description: 'Sacred mountain pilgrimage with spectacular sunrise views', category: 'Nature', slug: 'adams-peak' }
  ];

  // Activities available
  const activities = [
    {
      name: 'Wildlife Safaris',
      icon: '🦁',
      description: 'Elephant, leopard and bird watching in national parks',
      category: 'Wildlife',
      slug: 'wildlife-safaris',
      image: 'zamzam-tours/activities/wildlife-safari'
    },
    {
      name: 'Hiking & Trekking',
      icon: '🥾',
      description: 'Mountain trails and nature walks through stunning landscapes',
      category: 'Adventure',
      slug: 'hiking-trekking',
      image: 'zamzam-tours/activities/hiking'
    },
    {
      name: 'Cultural Tours',
      icon: '🏛️',
      description: 'Ancient temples, forts and historical monuments',
      category: 'Cultural',
      slug: 'cultural-tours',
      image: 'zamzam-tours/activities/cultural-tours'
    },
    {
      name: 'Beach Activities',
      icon: '🏖️',
      description: 'Swimming, surfing, snorkeling and beach relaxation',
      category: 'Beach',
      slug: 'beach-activities',
      image: 'zamzam-tours/activities/beach'
    },
    {
      name: 'Tea Plantation Tours',
      icon: '🍵',
      description: 'Visit tea estates and experience Ceylon tea culture',
      category: 'Cultural',
      slug: 'tea-plantation-tours',
      image: 'zamzam-tours/activities/tea-plantation'
    },
    {
      name: 'Whale Watching',
      icon: '🐋',
      description: 'Witness blue whales and dolphins in their natural habitat',
      category: 'Wildlife',
      slug: 'whale-watching',
      image: 'zamzam-tours/activities/whale-watching'
    },
    {
      name: 'Surfing',
      icon: '�',
      description: 'World-class surf breaks for all skill levels',
      category: 'Adventure',
      slug: 'surfing',
      image: 'zamzam-tours/activities/surfing'
    },
    {
      name: 'Scuba Diving',
      icon: '🤿',
      description: 'Explore vibrant coral reefs and underwater shipwrecks',
      category: 'Adventure',
      slug: 'scuba-diving',
      image: 'zamzam-tours/activities/scuba-diving'
    },
    {
      name: 'Train Journeys',
      icon: '🚂',
      description: 'Scenic train rides through tea country and hill stations',
      category: 'Cultural',
      slug: 'train-journeys',
      image: 'zamzam-tours/activities/train-journey'
    },
    {
      name: 'Bird Watching',
      icon: '🦜',
      description: 'Spot endemic and migratory bird species',
      category: 'Wildlife',
      slug: 'bird-watching',
      image: 'zamzam-tours/activities/bird-watching'
    },
    {
      name: 'White Water Rafting',
      icon: '🚣',
      description: 'Thrilling rapids on Kelani River and other waterways',
      category: 'Adventure',
      slug: 'white-water-rafting',
      image: 'zamzam-tours/activities/rafting'
    },
    {
      name: 'Ayurvedic Spa',
      icon: '💆',
      description: 'Traditional healing treatments and wellness therapies',
      category: 'Wellness',
      slug: 'ayurvedic-spa',
      image: 'zamzam-tours/activities/ayurveda'
    },
    {
      name: 'Cooking Classes',
      icon: '�‍🍳',
      description: 'Learn authentic Sri Lankan cuisine and spices',
      category: 'Cultural',
      slug: 'cooking-classes',
      image: 'zamzam-tours/activities/cooking'
    },
    {
      name: 'Photography Tours',
      icon: '📸',
      description: 'Capture stunning landscapes and wildlife',
      category: 'Cultural',
      slug: 'photography-tours',
      image: 'zamzam-tours/activities/photography'
    },
    {
      name: 'Cycling Tours',
      icon: '🚴',
      description: 'Bike through villages, rice paddies and coastal roads',
      category: 'Adventure',
      slug: 'cycling-tours',
      image: 'zamzam-tours/activities/cycling'
    },
    {
      name: 'Rock Climbing',
      icon: '🧗',
      description: 'Scale ancient rock formations and mountain cliffs',
      category: 'Adventure',
      slug: 'rock-climbing',
      image: 'zamzam-tours/activities/rock-climbing'
    },
    {
      name: 'Snorkeling',
      icon: '🤿',
      description: 'Discover colorful marine life in crystal clear waters',
      category: 'Beach',
      slug: 'snorkeling',
      image: 'zamzam-tours/activities/snorkeling'
    },
    {
      name: 'Temple Visits',
      icon: '🛕',
      description: 'Experience sacred Buddhist and Hindu temples',
      category: 'Cultural',
      slug: 'temple-visits',
      image: 'zamzam-tours/activities/temples'
    },
    {
      name: 'Camping',
      icon: '⛺',
      description: 'Overnight camping in national parks and wilderness',
      category: 'Adventure',
      slug: 'camping',
      image: 'zamzam-tours/activities/camping'
    },
    {
      name: 'Zip-lining',
      icon: '🪂',
      description: 'Soar through forest canopies and mountain valleys',
      category: 'Adventure',
      slug: 'zip-lining',
      image: 'zamzam-tours/activities/ziplining'
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
    const template = get('tours.messages.whatsappTemplate', 'Hello Zamzam Lanka Tours! I\'m interested in booking the "{tour}" tour. Please provide more details and availability.');
    const message = template.replace('{tour}', tour.name);
    const encodedMessage = encodeURIComponent(message);
    window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodedMessage}`, '_blank');
  };

  // Open booking form
  const openBookingForm = (tour: any) => {
    setSelectedTour(tour);
    setShowBookingForm(true);
  };

  const openTourDetails = (tour: any) => {
    const scrollY = window.scrollY;
    setSelectedTour(tour);
    setShowBookingForm(false); // Reset booking form state
    setShowTourDetails(true);
    setTimeout(() => {
      const modalOverlay = document.querySelector('.modal-overlay.fullscreen') as HTMLElement;
      if (modalOverlay) {
        modalOverlay.style.top = `${scrollY}px`;
      }
    }, 10);
  };

  return (
    <>
      <Head>
        <title>{get('tours.pageTitle', 'Sri Lanka Tour Packages | Zamzam Lanka Tours')}</title>
        <meta name="description" content={get('tours.metaDescription', 'Discover amazing Sri Lanka tour packages with Zamzam Lanka Tours. Cultural, adventure, beach, wildlife, and North East tours with expert guides and best prices.')} />
        <meta name="keywords" content={get('tours.metaKeywords', 'Sri Lanka tours, cultural tours, adventure tours, beach tours, wildlife safari, North East Sri Lanka, tour packages')} />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="tours-hero" ref={heroRef} style={{ marginTop: '0', position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
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
        
        <div className="tours-hero-overlay" style={{
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
          <div className="tours-hero-content">
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h1 style={{ 
                textShadow: '2px 2px 8px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 0, 0, 0.5)',
                color: '#ffffff'
              }}>
                {get('tours.hero.title', 'Discover ')}<span style={{ color: '#f8b500' }}>{get('tours.hero.title.highlight', 'Sri Lanka')}</span>{get('tours.hero.title.suffix', ' with Expert Guides')}
              </h1>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <p style={{ 
                textShadow: '1px 1px 6px rgba(0, 0, 0, 0.9), 0 0 15px rgba(0, 0, 0, 0.6)',
                color: '#ffffff'
              }}>
                {get('tours.hero.subtitle', 'Curated tour packages showcasing the best of Sri Lankan culture, nature, and adventure')}
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <div className="hero-search">
                <input
                  type="text"
                  placeholder={get('tours.hero.searchPlaceholder', 'Search tours by name, destination, or activity...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  style={{
                    padding: '15px 20px',
                    fontSize: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50px 0 0 50px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    color: '#053b3c',
                    outline: 'none'
                  }}
                />
                <button className="search-btn" style={{
                  padding: '15px 30px',
                  fontSize: '18px',
                  backgroundColor: '#f8b500',
                  color: '#000000',
                  border: 'none',
                  borderRadius: '0 50px 50px 0',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(248, 181, 0, 0.4)'
                }}>
                  <span>🔍</span>
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
            }}>{get('tours.hero.scrollIndicator', 'Scroll to explore')}</span>
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

      {/* Main Content */}
      <main className="tours-main">
        <div className="container">
          {/* Filters Section */}
          <section className="filters-section">
            <div className="filters-grid">
              {/* Category Filter */}
              <div className="filter-group">
                <label>{get('tours.filters.categoryLabel', 'Tour Category')}</label>
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
                <label>{get('tours.filters.durationLabel', 'Duration')}</label>
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
                <label>{get('tours.filters.priceLabel', 'Price Range')}</label>
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
              <h2>{get('tours.featured.title', 'Featured Tour Packages')}</h2>
              <p>{get('tours.featured.subtitle', 'Handpicked experiences for every type of traveler')}</p>
            </div>

            {loading ? (
              <div className="loading-state">
                <h3>{get('tours.loading.title', 'Loading tour packages...')}</h3>
                <p>{get('tours.loading.subtitle', 'Please wait while we fetch the best tours for you')}</p>
              </div>
            ) : filteredTours.length > 0 ? (
              <div className="tours-grid">
                {filteredTours.map(tour => (
                  <div key={tour.id} className="tour-card">
                    <div className="tour-image">
                      <Image 
                        src={tour.image} 
                        alt={tour.name}
                        width={400}
                        height={250}
                        style={{ objectFit: 'cover', objectPosition: portraitMap[tour.image] ? 'bottom center' : 'center', width: '100%', height: '100%' }}
                      />
                      <div className="tour-badge">{tour.category.replace('-', ' ')}</div>
                      <div className="tour-duration-badge">
                        <span className="duration-icon">🕐</span>
                        <span>{tour.duration}</span>
                      </div>
                    </div>

                    <div className="tour-content">
                      <div className="tour-header">
                        <h3 className="tour-title">{tour.name}</h3>
                        <div className="tour-meta-badges">
                          <span className="meta-badge difficulty">⚡ {tour.difficulty}</span>
                          <span className="meta-badge group">👥 {tour.groupSize}</span>
                        </div>
                      </div>

                      <p className="tour-description">{tour.description}</p>

                      <div className="tour-highlights-section">
                        <div className="section-title">
                          <span className="title-icon">✨</span>
                          <span>{get('tours.card.highlightsTitle', 'Tour Highlights')}</span>
                        </div>
                        <div className="highlights-bubbles">
                          {tour.highlights.slice(0, 5).map((highlight, index) => (
                            <span key={index} className="highlight-bubble">
                              <span className="bubble-check">✓</span>
                              {highlight}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="tour-includes-section">
                        <div className="section-title">
                          <span className="title-icon">📦</span>
                          <span>{get('tours.card.includesTitle', 'What\'s Included')}</span>
                        </div>
                        <div className="includes-list">
                          {(tour.includes || tour.included).slice(0, 4).map((item, index) => (
                            <div key={index} className="include-item">
                              <span className="include-icon">✓</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="tour-footer">
                        <div className="tour-price">
                          <span className="price-label">{get('tours.card.from', 'From')}</span>
                          <div className="price-wrapper">
                            <span className="price-currency">$</span>
                            <span className="price">{tour.price}</span>
                          </div>
                          <span className="per-person">{get('tours.card.perPerson', 'per person')}</span>
                        </div>
                        <div className="tour-actions">
                          <button 
                            className="btn btn-secondary"
                            onClick={() => openTourDetails(tour)}
                          >
                            {get('tours.card.viewDetails', 'View Details')}
                          </button>
                          <button 
                            className="btn btn-primary"
                            onClick={() => handleWhatsAppBooking(tour)}
                          >
                            {get('tours.card.bookNow', 'Book Now')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <h3>{get('tours.noResults.title', 'No tours found matching your criteria')}</h3>
                <p>{get('tours.noResults.subtitle', 'Try adjusting your filters or search terms')}</p>
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setActiveCategory('all');
                    setSelectedDuration('all');
                    setSelectedPriceRange('all');
                    setSearchQuery('');
                  }}
                >
                  {get('tours.noResults.resetFilters', 'Reset Filters')}
                </button>
              </div>
            )}
          </section>

          {/* Popular Destinations */}
          <section className="destinations-section">
            <div className="section-header">
              <h2>{get('tours.destinations.title', 'Popular Destinations in Sri Lanka')}</h2>
              <p>{get('tours.destinations.subtitle', 'Explore 20 amazing destinations across the island')}</p>
            </div>

            <div className="destinations-grid">
              {popularDestinations.map((destination, index) => (
                <Link key={index} href={`/destinations/${destination.slug}`} className="destination-card">
                  <div className="destination-image">
                    <CldImage 
                      src={destination.image} 
                      alt={destination.name}
                      width={300}
                      height={200}
                      style={{ objectFit: 'cover', objectPosition: portraitMap[destination.image] ? 'bottom center' : 'center', width: '100%', height: '100%' }}
                    />
                    <div className="destination-overlay">
                      <span className="destination-category">{destination.category}</span>
                      <h3>{destination.name}</h3>
                      <p>{destination.description}</p>
                      <span className="btn-small">{get('tours.destinations.learnMore', 'Learn More →')}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Activities Section */}
          <section className="activities-section">
            <div className="section-header">
              <h2>{get('tours.activities.title', 'Things to Do in Sri Lanka')}</h2>
              <p>{get('tours.activities.subtitle', 'Experience diverse activities across the island')}</p>
            </div>

            <div className="activities-grid">
              {activities.map((activity, index) => (
                <Link 
                  href={`/activities/${activity.slug}`} 
                  key={index} 
                  className="activity-card"
                >
                  <div className="activity-icon">{activity.icon}</div>
                  <h3>{activity.name}</h3>
                  <p>{activity.description}</p>
                  <span className="link-arrow">
                    {get('tours.activities.learnMore', 'Learn More →')}
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* Special Offers removed per request */}

          {/* Cancellation Policy (short summary + link to full policy) */}
          <section className="policy-section">
            <div className="policy-card">
              <h2>{get('tours.policy.title', 'Flexible Cancellation Policy')}</h2>
              <ul className="policy-summary">
                <li><strong>✅ 14+ Days Notice:</strong> 50% refund of tour cost</li>
                <li><strong>❌ Less than 14 Days:</strong> No refund available</li>
                <li><strong>🔄 Rescheduling:</strong> Free rescheduling up to 7 days before tour</li>
              </ul>
              <p className="policy-note">{get('tours.policy.note', '* Some special tours may have different cancellation policies')}</p>
              <p style={{ marginTop: '0.75rem' }}>
                <Link href="/cancellation" className="btn-link">Read full cancellation policy</Link>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Tour Details Modal - Full Screen */}
      {showTourDetails && selectedTour && (
        <div className="modal-overlay fullscreen" onClick={() => { setShowTourDetails(false); setShowBookingForm(false); }}>
          <button 
            className="modal-close-fullscreen"
            onClick={(e) => {
              e.stopPropagation();
              setShowTourDetails(false);
              setShowBookingForm(false); // Reset booking form when closing tour details
            }}
          >
            ✕
          </button>
          <div className="modal-content modal-fullscreen" onClick={(e) => e.stopPropagation()}>
            <div className="fullscreen-content">
              {/* Hero Section */}
              <div className="detail-hero">
                <div className="detail-hero-image">
                  <Image 
                    src={selectedTour.image} 
                    alt={selectedTour.name}
                    width={1200}
                    height={500}
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                  <div className="detail-hero-overlay">
                    <div className="detail-hero-content">
                      <h1>{selectedTour.name}</h1>
                      <div className="hero-meta">
                        <span>🕐 {selectedTour.duration}</span>
                        <span>⚡ {selectedTour.difficulty}</span>
                        <span>👥 {selectedTour.groupSize}</span>
                        <span>🌍 {selectedTour.season}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="detail-main-content">
                <div className="detail-left-column">
                  {/* Overview */}
                  <section className="detail-section">
                    <h2 className="detail-section-title">
                      <span className="section-icon">📖</span>
                      Tour Overview
                    </h2>
                    <p className="detail-text">{selectedTour.description}</p>
                  </section>

                  {/* Highlights */}
                  <section className="detail-section">
                    <h2 className="detail-section-title">
                      <span className="section-icon">✨</span>
                      Tour Highlights
                    </h2>
                    <div className="detail-highlights-grid">
                      {selectedTour.highlights.map((highlight, index) => (
                        <div key={index} className="detail-highlight-card">
                          <span className="highlight-number">{index + 1}</span>
                          <span className="highlight-text">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Itinerary */}
                  {selectedTour.itinerary && typeof selectedTour.itinerary === 'string' && (
                    <section className="detail-section">
                      <h2 className="detail-section-title">
                        <span className="section-icon">🗓️</span>
                        Day-by-Day Itinerary
                      </h2>
                      <div className="detail-itinerary">
                        {(() => {
                          try {
                            const itineraryData = JSON.parse(selectedTour.itinerary);
                            return itineraryData.map((day: any, index: number) => (
                              <div key={index} className="itinerary-day-card">
                                {day.image && (
                                  <div className="day-image-wrapper">
                                    <Image 
                                      src={day.image} 
                                      alt={day.title}
                                      width={800}
                                      height={400}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  </div>
                                )}
                                <div className="day-header-card">
                                  <div className="day-number-circle">Day {day.day || index + 1}</div>
                                  <h3>{day.title}</h3>
                                </div>
                                <p className="day-description-text">{day.description}</p>
                                {day.activities && (
                                  <div className="day-activities-list">
                                    <strong>Activities:</strong>
                                    <ul>
                                      {(Array.isArray(day.activities) 
                                        ? day.activities 
                                        : day.activities.split('\n').filter((a: string) => a.trim())
                                      ).map((activity: string, actIndex: number) => (
                                        <li key={actIndex}>{activity.trim ? activity.trim() : activity}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </div>
                            ));
                          } catch (e) {
                            return <p className="detail-text">{selectedTour.itinerary}</p>;
                          }
                        })()}
                      </div>
                    </section>
                  )}

                  {/* What's Included */}
                  <section className="detail-section">
                    <h2 className="detail-section-title">
                      <span className="section-icon">📦</span>
                      What's Included
                    </h2>
                    <div className="detail-includes-grid">
                      {(selectedTour.includes || selectedTour.included).map((item, index) => (
                        <div key={index} className="detail-include-item">
                          <span className="include-check-icon">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Sidebar - Booking Card */}
                <div className="detail-right-column">
                  <div className="booking-sticky-card">
                    <div className="booking-card-price">
                      <span className="price-from-label">From</span>
                      <div className="price-main">
                        <span className="price-currency">$</span>
                        <span className="price-amount">{selectedTour.price}</span>
                      </div>
                      <span className="price-per-person">per person</span>
                    </div>

                    <div className="booking-card-info">
                      <div className="info-row">
                        <span className="info-label">Duration:</span>
                        <span className="info-value">{selectedTour.duration}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Group Size:</span>
                        <span className="info-value">{selectedTour.groupSize}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Difficulty:</span>
                        <span className="info-value">{selectedTour.difficulty}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Best Season:</span>
                        <span className="info-value">{selectedTour.season}</span>
                      </div>
                    </div>

                    <div className="booking-card-actions">
                      <button 
                        className="btn btn-primary btn-large btn-block"
                        onClick={(e) => {
                          // Get the modal's scroll position to calculate where the form should appear
                          const modalFullscreen = document.querySelector('.modal-fullscreen') as HTMLElement;
                          if (modalFullscreen) {
                            const scrollTop = modalFullscreen.scrollTop;
                            // Position form at current view in the modal
                            setBookingFormScrollTop(scrollTop);
                          }
                          setShowBookingForm(true);
                        }}
                      >
                        Book This Tour
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form - appears inside tour details modal */}
            {showBookingForm && showTourDetails && (
              <div 
                className="booking-form-overlay"
                onClick={() => setShowBookingForm(false)}
              >
                <div 
                  className="booking-form-popup"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    className="modal-close"
                    onClick={() => setShowBookingForm(false)}
                  >
                    ×
                  </button>
                  
                  <h2>{`${get('tours.modal.bookPrefix', 'Book')} ${selectedTour.name}`}</h2>
                  
                  <div className="tour-summary">
                    <div className="summary-item">
                      <span>{get('tours.modal.summary.duration', 'Duration:')}</span>
                      <span>{selectedTour.duration}</span>
                    </div>
                    <div className="summary-item">
                      <span>{get('tours.modal.summary.price', 'Price:')}</span>
                      <span>{`${selectedTour.price} ${get('tours.modal.summary.perPerson', 'per person')}`}</span>
                    </div>
                    <div className="summary-item">
                      <span>{get('tours.modal.summary.difficulty', 'Difficulty:')}</span>
                      <span>{selectedTour.difficulty}</span>
                    </div>
                    <div className="summary-item">
                      <span>{get('tours.modal.summary.season', 'Best Season:')}</span>
                      <span>{selectedTour.season}</span>
                    </div>
                  </div>

                  <form 
                    className="booking-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const fullName = formData.get('fullName');
                      const email = formData.get('email');
                      const phone = formData.get('phone');
                      const travelDate = formData.get('travelDate');
                      const travelers = formData.get('travelers');
                      const accommodation = formData.get('accommodation');
                      const specialRequests = formData.get('specialRequests');
                      
                      const message = `Hello Zamzam Lanka Tours! I would like to book the following tour:\n\n` +
                        `*Tour:* ${selectedTour.name}\n` +
                        `*Full Name:* ${fullName}\n` +
                        `*Email:* ${email}\n` +
                        `*Phone:* ${phone}\n` +
                        `*Travel Date:* ${travelDate}\n` +
                        `*Number of Travelers:* ${travelers}\n` +
                        `*Accommodation Preference:* ${accommodation}\n` +
                        `${specialRequests ? `*Special Requests:* ${specialRequests}\n` : ''}` +
                        `\nPlease confirm availability and provide booking details.`;
                      
                      const encodedMessage = encodeURIComponent(message);
                      window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodedMessage}`, '_blank');
                      setShowBookingForm(false);
                    }}
                  >
                    <div className="form-group">
                      <label>{get('tours.form.label.fullName', 'Full Name *')}</label>
                      <input type="text" name="fullName" required />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>{get('tours.form.label.email', 'Email *')}</label>
                        <input type="email" name="email" required />
                      </div>
                      <div className="form-group">
                        <label>{get('tours.form.label.phone', 'Phone *')}</label>
                        <input type="tel" name="phone" required inputMode="numeric" />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>{get('tours.form.label.travelDate', 'Travel Date *')}</label>
                        <input type="date" name="travelDate" min={new Date().toISOString().split('T')[0]} required />
                      </div>
                      <div className="form-group">
                        <label>{get('tours.form.label.travelers', 'Number of Travelers *')}</label>
                        <input type="number" name="travelers" min="1" max="50" step="1" onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }} required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>{get('tours.form.label.accommodation', 'Accommodation Preference')}</label>
                      <select name="accommodation">
                        <option value="budget">{get('tours.form.options.budget', 'Budget')}</option>
                        <option value="standard">{get('tours.form.options.standard', 'Standard')}</option>
                        <option value="premium">{get('tours.form.options.premium', 'Premium')}</option>
                        <option value="luxury">{get('tours.form.options.luxury', 'Luxury')}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>{get('tours.form.label.specialRequests', 'Special Requests')}</label>
                      <textarea name="specialRequests" rows={4} placeholder={get('tours.form.placeholder.specialRequests', 'Dietary requirements, accessibility needs, special occasions...')}></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary btn-large btn-block">
                      {get('tours.form.submit', 'Submit Booking Request')}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remove old separate booking modal - it's now inside tour details */}
      {false && showBookingForm && selectedTour && (
        <div 
          className="modal-overlay" 
          style={{ alignItems: 'flex-start', justifyContent: 'center' }}
          onClick={() => setShowBookingForm(false)}
        >
          <div 
            className="modal-content" 
            style={{ 
              marginTop: `${bookingFormScrollTop + 50}px`,
              marginBottom: '50px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close"
              onClick={() => setShowBookingForm(false)}
            >
              ×
            </button>
            
            <h2>{`${get('tours.modal.bookPrefix', 'Book')} ${selectedTour.name}`}</h2>
            
            <div className="tour-summary">
              <div className="summary-item">
                <span>{get('tours.modal.summary.duration', 'Duration:')}</span>
                <span>{selectedTour.duration}</span>
              </div>
              <div className="summary-item">
                <span>{get('tours.modal.summary.price', 'Price:')}</span>
                <span>{`${selectedTour.price} ${get('tours.modal.summary.perPerson', 'per person')}`}</span>
              </div>
              <div className="summary-item">
                <span>{get('tours.modal.summary.difficulty', 'Difficulty:')}</span>
                <span>{selectedTour.difficulty}</span>
              </div>
              <div className="summary-item">
                <span>{get('tours.modal.summary.season', 'Best Season:')}</span>
                <span>{selectedTour.season}</span>
              </div>
            </div>

            <form className="booking-form">
              <div className="form-group">
                <label>{get('tours.form.label.fullName', 'Full Name *')}</label>
                <input type="text" required />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>{get('tours.form.label.email', 'Email *')}</label>
                  <input type="email" required />
                </div>
                <div className="form-group">
                  <label>{get('tours.form.label.phone', 'Phone *')}</label>
                  <input type="tel" required inputMode="numeric" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{get('tours.form.label.travelers', 'Number of Travelers *')}</label>
                  <select required>
                    <option value="">{get('tours.form.select.placeholder', 'Select')}</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? get('tours.form.person', 'person') : get('tours.form.people', 'people')}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{get('tours.form.label.startDate', 'Preferred Start Date *')}</label>
                  <input type="date" min={new Date().toISOString().split('T')[0]} required />
                </div>
              </div>

              <div className="form-group">
                <label>{get('tours.form.label.requirements', 'Special Requirements')}</label>
                <textarea rows={3} placeholder={get('tours.form.placeholder.requirements', 'Dietary restrictions, accessibility needs, etc.')}></textarea>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowBookingForm(false)}
                >
                  {get('tours.form.actions.cancel', 'Cancel')}
                </button>
                <button 
                  type="button"
                  className="btn-primary"
                  onClick={() => handleWhatsAppBooking(selectedTour)}
                >
                  {get('tours.form.actions.proceedWhatsApp', 'Proceed to WhatsApp Booking')}
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
          background: linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%);
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
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .tour-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .tour-image {
          position: relative;
          height: 280px;
          overflow: hidden;
          background: linear-gradient(180deg, #f0f3f4 0%, #eef2f3 100%);
        }

        .tour-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(.2,.8,.2,1);
          will-change: transform;
        }

        .tour-card:hover .tour-image img {
          transform: scale(1.08) translateZ(0);
        }

        .tour-image::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 40%;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%);
          pointer-events: none;
        }

        .tour-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          background: var(--primary-color);
          color: white;
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: capitalize;
          box-shadow: 0 4px 12px rgba(5, 59, 60, 0.4);
        }

        .tour-duration-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255, 255, 255, 0.95);
          color: var(--primary-color);
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(8px);
        }

        .duration-icon {
          font-size: 1rem;
        }

        .tour-content {
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          flex-grow: 1;
        }

        .tour-header {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .tour-title {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--primary-color);
          line-height: 1.3;
          margin: 0;
        }

        .tour-meta-badges {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
        }

        .meta-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: rgba(5, 59, 60, 0.06);
          border: 1px solid rgba(5, 59, 60, 0.12);
          border-radius: 15px;
          font-size: 0.8rem;
          color: var(--primary-color);
          font-weight: 600;
        }

        .tour-description {
          color: var(--text-light);
          line-height: 1.7;
          font-size: 0.95rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .tour-highlights-section,
        .tour-includes-section {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--primary-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .title-icon {
          font-size: 1.1rem;
        }

        .highlights-bubbles {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.5rem;
        }

        .highlight-bubble {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, rgba(46, 213, 115, 0.12), rgba(37, 211, 102, 0.08));
          border: 1px solid rgba(46, 213, 115, 0.25);
          border-radius: 20px;
          font-size: 0.85rem;
          color: #0d6832;
          font-weight: 600;
          transition: all 0.3s ease;
          width: fit-content;
        }

        .highlight-bubble:hover {
          background: linear-gradient(135deg, rgba(46, 213, 115, 0.18), rgba(37, 211, 102, 0.12));
          border-color: rgba(46, 213, 115, 0.4);
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(46, 213, 115, 0.2);
        }

        .bubble-check {
          color: #2ed573;
          font-weight: bold;
          font-size: 0.9rem;
        }

        .includes-list {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }

        .include-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.9rem;
          color: var(--text-color);
          line-height: 1.6;
          padding: 2px 0;
        }

        .include-icon {
          color: var(--primary-color);
          font-weight: bold;
          font-size: 1rem;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .tour-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1.25rem;
          margin-top: auto;
          border-top: 2px solid rgba(5, 59, 60, 0.08);
          gap: 1rem;
        }

        .tour-price {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .price-label {
          font-size: 0.75rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .price-wrapper {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .price-currency {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .tour-price .price {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--primary-color);
          line-height: 1;
        }

        .tour-price .per-person {
          display: block;
          font-size: 0.75rem;
          color: var(--text-light);
        }

        .tour-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: nowrap;
        }

        .tour-actions .btn {
          flex: 1;
          padding: 10px 18px;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 8px;
          white-space: nowrap;
          transition: all 0.3s ease;
        }

        .tour-actions .btn:hover {
          transform: translateY(-2px);
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

        /* Loading State */
        .loading-state {
          text-align: center;
          padding: 4rem 2rem;
          background: var(--section-bg);
          border-radius: 10px;
          margin-bottom: 4rem;
        }

        .loading-state h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .loading-state p {
          color: var(--text-light);
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


        .destination-image {
          position: relative;
          height: 180px;
          overflow: hidden;
          border-radius: 8px;
          background: #f6f7f8;
        }

        .destination-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.45s cubic-bezier(.2,.8,.2,1);
        }

        .destination-card:hover .destination-image img {
          transform: scale(1.03);
        }

        .destination-overlay {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          padding: 1rem;
          color: white;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.45) 100%);
        }
        .destination-card {
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          height: 250px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .destination-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
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
          margin-bottom: 0.75rem;
          font-weight: 700;
        }

        .destination-overlay p {
          margin-bottom: 1rem;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        .tour-count {
          background: var(--primary-color);
          color: white;
          padding: 3px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        /* Activities Section */
        .activities-section {
          margin-bottom: 0 rem;
        }

        .activities-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 2rem;
        }

        .activity-card {
          background: white;
          padding: 1.75rem;
          border-radius: 12px;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
        }

        .activity-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
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

       

       

        /* Policy Section */
        .policy-section {
          margin-bottom: 0 rem;
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
          align-items: flex-start;
          justify-content: center;
          z-index: 10002;
          padding: 0;
          overflow-y: auto;
        }

        .modal-overlay.fullscreen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          padding: 0;
          margin: 0;
          background: transparent;
          align-items: flex-start;
          overflow: hidden;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .modal-content {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          max-height: none;
          overflow-y: visible;
          position: relative;
          margin: 0;
        }

        .modal-fullscreen {
          max-width: none;
          max-height: none;
          width: 100vw;
          height: 100vh;
          border-radius: 0;
          padding: 0;
          overflow-y: auto;
          background: var(--primary-color);
          margin: 0;
          position: fixed;
          top: 0;
          left: 0;
        }

        .modal-close-fullscreen {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.95);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          font-size: 1.8rem;
          cursor: pointer;
          color: var(--primary-color);
          z-index: 10001;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }

        .modal-close-fullscreen:hover {
          background: var(--primary-color);
          color: white;
          transform: rotate(90deg) scale(1.1);
        }

        .fullscreen-content {
          width: 100%;
          min-height: 100%;
        }

        /* Detail Hero */
        .detail-hero {
          position: relative;
          width: 100%;
          height: 500px;
          overflow: hidden;
        }

        .detail-hero-image {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .detail-hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(5,59,60,0.85) 100%);
          display: flex;
          align-items: flex-end;
          padding: 3rem;
        }

        .detail-hero-content {
          max-width: 1200px;
          margin: 0 auto;
          width: 100%;
          color: white;
        }

        .tour-category-badge {
          display: inline-block;
          background: var(--primary-color);
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .detail-hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
        }

        .hero-meta {
          display: flex;
          gap: 2rem;
          font-size: 1.1rem;
          flex-wrap: wrap;
        }

        .hero-meta span {
          background: rgba(255,255,255,0.15);
          padding: 8px 16px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
        }

        /* Main Content */
        .detail-main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 3rem 0;
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 4rem;
        }

        .detail-left-column {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .detail-right-column {
          position: relative;
        }

        .detail-section {
          background: white;
          padding: 2.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.06);
        }

        .detail-section-title {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 3px solid rgba(5,59,60,0.1);
        }

        .section-icon {
          font-size: 2rem;
        }

        .detail-text {
          font-size: 1.05rem;
          line-height: 1.8;
          color: var(--text-color);
        }

        /* Highlights Grid */
        .detail-highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .detail-highlight-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 1rem;
          background: linear-gradient(135deg, rgba(46,213,115,0.08) 0%, rgba(37,211,102,0.04) 100%);
          border: 2px solid rgba(46,213,115,0.2);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .detail-highlight-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(46,213,115,0.15);
          border-color: rgba(46,213,115,0.4);
        }

        .highlight-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #2ed573 0%, #26d07c 100%);
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .highlight-text {
          font-size: 0.95rem;
          color: var(--text-color);
          font-weight: 500;
          line-height: 1.5;
        }

        /* Itinerary */
        .detail-itinerary {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .itinerary-day-card {
          background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
          border: 2px solid rgba(5,59,60,0.1);
          border-left: 5px solid var(--primary-color);
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .itinerary-day-card:hover {
          border-left-color: var(--secondary-color);
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
          transform: translateX(5px);
        }

        .day-image-wrapper {
          width: 100%;
          height: 300px;
          overflow: hidden;
          position: relative;
        }

        .day-image-wrapper img {
          transition: transform 0.4s ease;
        }

        .itinerary-day-card:hover .day-image-wrapper img {
          transform: scale(1.05);
        }

        .day-header-card {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 1rem;
          padding: 2rem 2rem 0 2rem;
        }

        .day-number-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-light) 100%);
          color: white;
          border-radius: 50%;
          font-weight: 700;
          font-size: 0.9rem;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(5,59,60,0.3);
        }

        .day-header-card h3 {
          font-size: 1.4rem;
          color: var(--primary-color);
          margin: 0;
        }

        /* Card without image needs padding at top */
        .itinerary-day-card > .day-header-card:first-child {
          padding-top: 2rem;
        }

        .day-description-text {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--text-color);
          margin-bottom: 1rem;
          padding: 0 2rem;
        }

        .day-activities-list {
          background: white;
          padding: 1.25rem;
          border-radius: 10px;
          border: 1px solid rgba(5,59,60,0.1);
          margin: 0 2rem 2rem 2rem;
        }

        .day-activities-list strong {
          color: var(--primary-color);
          font-size: 0.95rem;
          display: block;
          margin-bottom: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .day-activities-list ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .day-activities-list li {
          padding: 0.5rem 0;
          padding-left: 1.75rem;
          position: relative;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .day-activities-list li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--secondary-color);
          font-weight: bold;
        }

        /* Includes Grid */
        .detail-includes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .detail-include-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1rem;
          background: rgba(5,59,60,0.03);
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .detail-include-item:hover {
          background: rgba(5,59,60,0.06);
          transform: translateX(5px);
        }

        .include-check-icon {
          color: var(--primary-color);
          font-weight: bold;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        /* Booking Sticky Card */
        .booking-sticky-card {
          position: sticky;
          top: 2rem;
          background: white;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
          padding: 2rem;
          border: 2px solid rgba(5,59,60,0.1);
        }

        .booking-card-price {
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(5,59,60,0.05) 0%, rgba(248,181,0,0.05) 100%);
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .price-from-label {
          display: block;
          font-size: 0.85rem;
          color: var(--text-light);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.5rem;
        }

        .price-main {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 6px;
          margin-bottom: 0.5rem;
        }

        .price-currency {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .price-amount {
          font-size: 3rem;
          font-weight: 800;
          color: var(--primary-color);
          line-height: 1;
        }

        .price-per-person {
          display: block;
          font-size: 0.9rem;
          color: var(--text-light);
        }

        .booking-card-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 10px;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
        }

        .info-label {
          font-size: 0.9rem;
          color: var(--text-light);
          font-weight: 600;
        }

        .info-value {
          font-size: 0.95rem;
          color: var(--primary-color);
          font-weight: 600;
        }

        .booking-card-actions {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .btn-block {
          width: 100%;
          justify-content: center;
        }

        .modal-large {
          max-width: 900px;
        }

        .tour-detail-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .detail-image {
          border-radius: 8px;
          overflow: hidden;
        }

        .detail-summary {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .detail-summary .summary-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: var(--section-bg);
          border-radius: 8px;
        }

        .detail-summary .label {
          font-weight: 600;
          color: var(--primary-color);
        }

        .detail-summary .value {
          color: var(--text-color);
        }

        .tour-detail-description,
        .tour-detail-highlights,
        .tour-detail-itinerary,
        .tour-detail-includes {
          margin-bottom: 2rem;
        }

        .tour-detail-description h3,
        .tour-detail-highlights h3,
        .tour-detail-itinerary h3,
        .tour-detail-includes h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .tour-detail-highlights ul,
        .tour-detail-includes ul {
          list-style: none;
          padding: 0;
        }

        .tour-detail-highlights li,
        .tour-detail-includes li {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .tour-detail-highlights li:last-child,
        .tour-detail-includes li:last-child {
          border-bottom: none;
        }

        .itinerary-days {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .itinerary-day {
          background: var(--section-bg);
          padding: 1.5rem;
          border-radius: 10px;
          border-left: 4px solid var(--primary-color);
        }

        .day-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .day-number {
          background: var(--primary-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .day-header h4 {
          color: var(--primary-color);
          margin: 0;
          font-size: 1.2rem;
        }

        .day-description {
          color: var(--text-color);
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .day-activities {
          background: white;
          padding: 1rem;
          border-radius: 8px;
        }

        .day-activities strong {
          color: var(--primary-color);
          display: block;
          margin-bottom: 0.5rem;
        }

        .day-activities ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .day-activities li {
          padding: 0.3rem 0;
          padding-left: 1.5rem;
          position: relative;
        }

        .day-activities li:before {
          content: "→";
          position: absolute;
          left: 0;
          color: var(--primary-color);
        }

        .detail-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid var(--border-color);
        }

        .btn-large {
          flex: 1;
          padding: 1rem 2rem;
          font-size: 1.1rem;
        }

        /* Large Screen Optimizations */
        @media (min-width: 2560px) {
          .tours-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 3rem;
          }

          .tour-hero h1 {
            font-size: 5rem !important;
          }

          .modal-content {
            max-width: 1600px;
          }
        }

        @media (min-width: 1920px) and (max-width: 2559px) {
          .tours-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 2.5rem;
          }

          .tour-hero h1 {
            font-size: 4rem !important;
          }

          .modal-content {
            max-width: 1400px;
          }
        }

        @media (min-width: 1440px) and (max-width: 1919px) {
          .tours-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .tour-hero h1 {
            font-size: 3.5rem !important;
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .tours-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .tour-hero h1 {
            font-size: 3rem !important;
          }

          .modal-content {
            max-width: 90%;
          }

          .detail-includes-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tour-detail-header {
            grid-template-columns: 1fr;
          }

          .detail-actions {
            flex-direction: column;
          }
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
          z-index: 10;
        }

        /* Booking Form Overlay - appears inside tour details modal */
        .booking-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10003;
          padding: 20px;
          overflow-y: auto;
        }

        .booking-form-popup {
          background: white;
          border-radius: 15px;
          padding: 2rem;
          max-width: 600px;
          width: 100%;
          max-height: 85vh;
          overflow-y: auto;
          position: relative;
          margin: 0;
        }

        @media (max-width: 768px) {
          .booking-form-overlay {
            padding: 10px;
            align-items: flex-start;
          }

          .booking-form-popup {
            padding: 1.5rem;
            margin-top: 20px;
            max-height: 90vh;
          }

          .booking-form-popup h2 {
            font-size: 1.3rem;
          }

          .tour-summary {
            padding: 1rem;
          }

          .booking-form input,
          .booking-form select,
          .booking-form textarea {
            font-size: 16px;
          }
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

        .form-actions .btn-secondary,
        .form-actions .btn-primary {
          padding: 0.875rem 2rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          min-width: 150px;
        }

        .form-actions .btn-secondary {
          background: #f3f4f6;
          color: #374151;
          border: 2px solid #e5e7eb;
        }

        .form-actions .btn-secondary:hover {
          background: #e5e7eb;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .form-actions .btn-primary {
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }

        .form-actions .btn-primary:hover {
          background: linear-gradient(135deg, #128C7E 0%, #075E54 100%);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 211, 102, 0.4);
        }

        .form-actions .btn-primary::before {
          content: "📱 ";
          margin-right: 0.5rem;
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

          /* Full-screen modal responsive */
          .detail-main-content {
            grid-template-columns: 1fr;
            padding: 2rem 1.5rem;
            gap: 2rem;
          }

          .detail-right-column {
            order: -1;
          }

          .booking-sticky-card {
            position: relative;
            top: 0;
          }

          .detail-hero {
            height: 400px;
          }

          .detail-hero-content h1 {
            font-size: 2.5rem;
          }

          .detail-highlights-grid {
            grid-template-columns: 1fr;
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

          /* Full-screen modal mobile */
          .detail-hero {
            height: 300px;
          }

          .detail-hero-overlay {
            padding: 1.5rem;
          }

          .detail-hero-content h1 {
            font-size: 1.8rem;
          }

          .hero-meta {
            font-size: 0.9rem;
            gap: 0.75rem;
          }

          .detail-main-content {
            padding: 1.5rem 1rem;
          }

          .detail-section {
            padding: 1.5rem;
          }

          .detail-section-title {
            font-size: 1.4rem;
          }

          .modal-close-fullscreen {
            width: 45px;
            height: 45px;
            top: 15px;
            right: 15px;
          }

          .detail-includes-grid {
            grid-template-columns: 1fr;
          }

          .price-amount {
            font-size: 2.5rem;
          }

          .day-image-wrapper {
            height: 200px;
          }

          .day-header-card {
            padding: 1.5rem 1.5rem 0 1.5rem;
            gap: 1rem;
          }

          .day-number-circle {
            width: 50px;
            height: 50px;
            font-size: 0.85rem;
          }

          .day-header-card h3 {
            font-size: 1.2rem;
          }

          .day-description-text {
            padding: 0 1.5rem;
            font-size: 0.95rem;
          }

          .day-activities-list {
            margin: 0 1.5rem 1.5rem 1.5rem;
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

      <Footer />
    </>
  );
}