// pages/tours/index.js - Tours Main Page
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
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
  rating?: number;
  reviews?: number;
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
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
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
          duration: pkg.duration || '7 days', // prefer backend duration when available
          priceRange: pkg.price ? (pkg.price < 1000 ? 'budget' : pkg.price < 2000 ? 'standard' : 'premium') : 'standard',
          price: pkg.price ? parseFloat(pkg.price) : 0,
          image: pkg.image || '/tours/default.jpg',
          highlights: pkg.highlights ? pkg.highlights.split(',').map((h: string) => h.trim()) : [],
          description: get(`tours.packages.${pkg.package_id}.description`, pkg.description || ''),
          includes: pkg.includings ? pkg.includings.split(',').map((i: string) => i.trim()) : [],
          difficulty: pkg.difficulty || 'Moderate',
          groupSize: pkg.group_size || '2-12 people',
          season: pkg.season || 'Year-round',
          rating: pkg.rating ? Number(pkg.rating) : 4.5,
          reviews: pkg.reviews ? Number(pkg.reviews) : 0,
          included: pkg.includings ? pkg.includings.split(',').map((i: string) => i.trim()) : [],
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
    const template = get('tours.messages.whatsappTemplate', 'Hello Zamzam Tours! I\'m interested in booking the "{tour}" tour. Please provide more details and availability.');
    const message = template.replace('{tour}', tour.name);
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
        <title>{get('tours.pageTitle', 'Sri Lanka Tour Packages | Zamzam Tours')}</title>
        <meta name="description" content={get('tours.metaDescription', 'Discover amazing Sri Lanka tour packages with Zamzam Tours. Cultural, adventure, beach, wildlife, and North East tours with expert guides and best prices.')} />
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
                        <h4>{get('tours.card.highlightsTitle', 'Highlights:')}</h4>
                        <ul>
                          {tour.highlights.slice(0, 3).map((highlight, index) => (
                            <li key={index}>✓ {highlight}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="tour-includes">
                        <h4>{get('tours.card.includesTitle', 'Includes:')}</h4>
                        <p>{tour.includes?.join(', ') || tour.included.join(', ')}</p>
                      </div>

                      <div className="tour-footer">
                        <div className="tour-price">
                          <span className="price">${tour.price}</span>
                          <span className="per-person">{get('tours.card.perPerson', 'per person')}</span>
                        </div>
                        <div className="tour-actions">
                          <button 
                            className="btn-secondary"
                            onClick={() => openBookingForm(tour)}
                          >
                            {get('tours.card.viewDetails', 'View Details')}
                          </button>
                          <button 
                            className="btn-primary"
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

          {/* Cancellation Policy */}
          <section className="policy-section">
            <div className="policy-card">
              <h2>{get('tours.policy.title', 'Flexible Cancellation Policy')}</h2>
              <div className="policy-details">
                <div className="policy-item">
                  <h3>{get('tours.policy.noticeTitle', '✅ 14+ Days Notice')}</h3>
                  <p>{get('tours.policy.noticeDetail', '50% refund of tour cost')}</p>
                </div>
                <div className="policy-item">
                  <h3>{get('tours.policy.lessTitle', '❌ Less than 14 Days')}</h3>
                  <p>{get('tours.policy.lessDetail', 'No refund available')}</p>
                </div>
                <div className="policy-item">
                  <h3>{get('tours.policy.rescheduleTitle', '🔄 Rescheduling')}</h3>
                  <p>{get('tours.policy.rescheduleDetail', 'Free rescheduling up to 7 days before tour')}</p>
                </div>
              </div>
              <p className="policy-note">{get('tours.policy.note', '* Some special tours may have different cancellation policies')}</p>
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
                  <input type="tel" required />
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
                  <input type="date" required />
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
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          background: linear-gradient(180deg, #f0f3f4 0%, #eef2f3 100%);
        }

        .tour-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(.2,.8,.2,1), filter 0.35s ease;
          will-change: transform;
        }

        .tour-image:hover img {
          transform: scale(1.06) translateZ(0);
        }

        .tour-image::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 40%;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.35) 100%);
          pointer-events: none;
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
          margin-bottom: 0 rem;
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

      <Footer />
    </>
  );
}