import { useRouter } from 'next/router';
import { useRef, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import AnimatedSection from '../../components/AnimatedSection';
import { CldImage } from 'next-cloudinary';
import { fadeInUp } from '../../src/utils/animations';

// Destination data
const destinationsData: { [key: string]: any } = {
  'sigiriya': {
    name: 'Sigiriya',
    tagline: 'The Eighth Wonder of the World',
    description: 'Sigiriya, also known as Lion Rock, is an ancient rock fortress and one of Sri Lanka\'s most iconic landmarks. This UNESCO World Heritage Site rises 200 meters above the surrounding plains and offers breathtaking views.',
    image: 'zamzam-tours/destinations/sigiriya',
    category: 'Cultural & Historical',
    duration: '1 Day',
    bestTime: 'December to April',
    highlights: [
      'Climb the iconic Lion Rock fortress',
      'View the ancient frescoes of Sigiriya Damsels',
      'Explore the Water Gardens and Boulder Gardens',
      'Visit the Mirror Wall with ancient graffiti',
      'Enjoy panoramic views from the summit'
    ],
    activities: [
      'Rock climbing and fortress exploration',
      'Photography of ancient art and architecture',
      'Guided historical tours',
      'Sunrise/sunset viewing',
      'Nature walks in surrounding forests'
    ],
    thingsToDo: [
      'Visit Pidurangala Rock for sunrise views',
      'Explore Dambulla Cave Temple nearby',
      'Take a village tour and cooking class',
      'Visit Minneriya National Park for elephant safaris',
      'Experience authentic Sri Lankan spa treatments'
    ],
    gettingThere: 'Located in central Sri Lanka, Sigiriya is approximately 170km from Colombo (4-5 hours drive) and 90km from Kandy (2.5 hours). Regular buses and private vehicles are available.',
    accommodation: 'Luxury resorts, boutique hotels, and budget guesthouses available in Sigiriya and nearby Dambulla.',
    tips: [
      'Start early morning to avoid heat and crowds',
      'Wear comfortable shoes with good grip',
      'Bring water and sun protection',
      'Photography is not allowed at certain sections',
      'Expect to see monkeys - keep belongings secure'
    ]
  },
  'kandy': {
    name: 'Kandy',
    tagline: 'The Cultural Heart of Sri Lanka',
    description: 'Kandy, the last royal capital of Sri Lanka, is a sacred city renowned for the Temple of the Tooth Relic. Nestled among misty hills and surrounded by the Mahaweli River, it\'s a UNESCO World Heritage Site and cultural hub.',
    image: 'zamzam-tours/destinations/kandy',
    category: 'Cultural & Historical',
    duration: '1-2 Days',
    bestTime: 'December to April, August (Esala Perahera festival)',
    highlights: [
      'Temple of the Sacred Tooth Relic',
      'Kandy Lake and scenic surroundings',
      'Royal Palace and Audience Hall',
      'Traditional Kandyan dance performances',
      'Botanical Gardens at Peradeniya'
    ],
    activities: [
      'Visit sacred temples and shrines',
      'Attend cultural dance shows',
      'Explore spice and tea gardens',
      'Boating on Kandy Lake',
      'Shopping for handicrafts and gems'
    ],
    thingsToDo: [
      'Watch the Esala Perahera festival (August)',
      'Visit Peradeniya Botanical Gardens',
      'Take a tea factory tour',
      'Explore Bahirawakanda Temple for city views',
      'Experience authentic Kandyan cuisine'
    ],
    gettingThere: 'Located 115km from Colombo (3 hours drive), easily accessible by train (scenic route), bus, or car. The Colombo-Kandy train journey is one of the most beautiful in the world.',
    accommodation: 'Wide range from luxury hotels overlooking the lake to budget guesthouses in the city center.',
    tips: [
      'Dress modestly when visiting temples (cover knees and shoulders)',
      'Remove shoes and hats before entering temples',
      'Book Esala Perahera tickets well in advance',
      'Try traditional Kandyan rice and curry',
      'Evening is best time to visit the lake'
    ]
  },
  'galle': {
    name: 'Galle',
    tagline: 'Dutch Colonial Gem by the Sea',
    description: 'Galle Fort is a UNESCO World Heritage Site and the finest example of a fortified city built by Europeans in South Asia. This 36-hectare fortress combines Portuguese, Dutch, and British architecture with a vibrant modern culture.',
    image: 'zamzam-tours/destinations/galle',
    category: 'Cultural & Coastal',
    duration: '1 Day',
    bestTime: 'November to April',
    highlights: [
      'Walk the historic fort ramparts',
      'Dutch Reformed Church and lighthouse',
      'Colonial architecture and museums',
      'Art galleries and boutique shops',
      'Sunset views from the fort walls'
    ],
    activities: [
      'Fort wall walk at sunset',
      'Visit museums and historical sites',
      'Shopping for local crafts and gems',
      'Cafe hopping in colonial buildings',
      'Swimming at nearby Unawatuna beach'
    ],
    thingsToDo: [
      'Explore the Maritime Museum',
      'Visit the Japanese Peace Pagoda',
      'Take a whale watching tour',
      'Shop for handmade lace and textiles',
      'Enjoy seafood at harbor restaurants'
    ],
    gettingThere: 'Located 116km south of Colombo (2-3 hours drive). Regular buses and trains available along the coastal railway.',
    accommodation: 'Boutique hotels within the fort, luxury beach resorts nearby, and budget guesthouses in Unawatuna.',
    tips: [
      'Best explored on foot',
      'Visit early morning or late afternoon to avoid heat',
      'Many buildings are private residences - respect privacy',
      'The fort is beautiful at sunset',
      'Combine with Unawatuna beach visit'
    ]
  },
  'ella': {
    name: 'Ella',
    tagline: 'Mountain Paradise in the Clouds',
    description: 'Ella is a small mountain village surrounded by lush tea plantations, cascading waterfalls, and dramatic viewpoints. It\'s the perfect destination for hikers, nature lovers, and those seeking a cooler climate.',
    image: 'zamzam-tours/destinations/ella',
    category: 'Nature & Adventure',
    duration: '2-3 Days',
    bestTime: 'January to March',
    highlights: [
      'Nine Arch Bridge railway viaduct',
      'Little Adam\'s Peak sunrise hike',
      'Ella Rock trekking',
      'Ravana Falls waterfall',
      'Tea plantation tours'
    ],
    activities: [
      'Hiking and trekking',
      'Train journey through tea country',
      'Zip-lining adventures',
      'Tea factory visits',
      'Waterfall swimming'
    ],
    thingsToDo: [
      'Hike to Ella Rock for panoramic views',
      'Visit Ravana Cave temple',
      'Take the famous train ride to/from Kandy',
      'Explore Diyaluma Falls',
      'Enjoy local cuisine at hillside cafes'
    ],
    gettingThere: 'Located 200km from Colombo. The scenic train journey from Kandy to Ella (7 hours) is one of the world\'s most beautiful rail trips.',
    accommodation: 'Guesthouses with mountain views, eco-lodges, and budget hostels popular with backpackers.',
    tips: [
      'Book train tickets early for window seats',
      'Wear good hiking shoes',
      'Start hikes early to avoid afternoon mist',
      'Bring warm clothes for cool evenings',
      'Try Ceylon tea at local plantations'
    ]
  },
  'yala': {
    name: 'Yala National Park',
    tagline: 'Sri Lanka\'s Premier Wildlife Sanctuary',
    description: 'Yala National Park is home to the highest density of leopards in the world. This vast wilderness also shelters elephants, sloth bears, crocodiles, and over 200 bird species across diverse ecosystems.',
    image: 'zamzam-tours/destinations/yala',
    category: 'Wildlife & Nature',
    duration: '1-2 Days',
    bestTime: 'February to July (park closed September-October)',
    highlights: [
      'Leopard spotting safaris',
      'Asian elephant herds',
      'Sloth bears and crocodiles',
      'Over 200 bird species',
      'Beautiful lagoons and beaches'
    ],
    activities: [
      'Early morning and evening game drives',
      'Bird watching expeditions',
      'Photography safaris',
      'Beach visits within the park',
      'Camping under the stars'
    ],
    thingsToDo: [
      'Take a full-day safari for best wildlife viewing',
      'Visit nearby Kataragama temple',
      'Explore the coastal Bundala National Park',
      'Bird watching at Palatupana',
      'Relax at Kirinda beach'
    ],
    gettingThere: 'Located 305km from Colombo (6 hours) and 260km from Kandy. Nearest town is Tissamaharama with good accommodation options.',
    accommodation: 'Safari lodges near park entrance, luxury tented camps, and hotels in Tissamaharama.',
    tips: [
      'Book safaris in advance during peak season',
      'Early morning safaris offer best wildlife viewing',
      'Bring binoculars and good camera',
      'Wear neutral colors and comfortable clothes',
      'Stay quiet during wildlife encounters'
    ]
  },
  'nuwara-eliya': {
    name: 'Nuwara Eliya',
    tagline: 'Little England in the Hills',
    description: 'Nuwara Eliya, Sri Lanka\'s highest town, offers a cool climate reminiscent of English countryside. Known for pristine tea estates, colonial architecture, and temperate climate, it\'s a favorite highland retreat.',
    image: 'zamzam-tours/destinations/nuwara-eliya',
    category: 'Nature & Heritage',
    duration: '1-2 Days',
    bestTime: 'March to May, December to February',
    highlights: [
      'Verdant tea plantations',
      'Colonial-era architecture',
      'Victoria Park gardens',
      'Gregory Lake boating',
      'Ceylon tea factory tours'
    ],
    activities: [
      'Tea plantation and factory tours',
      'Boating on Gregory Lake',
      'Golf at historic club',
      'Strawberry picking',
      'Nature walks and hiking'
    ],
    thingsToDo: [
      'Visit Pedro Tea Estate',
      'Explore Hakgala Botanical Gardens',
      'Take scenic train from Kandy',
      'Visit Seetha Amman Temple',
      'Try fresh strawberries and cream'
    ],
    gettingThere: 'Located 180km from Colombo (6 hours) and 80km from Kandy (3 hours). The train journey from Kandy offers spectacular scenery.',
    accommodation: 'Colonial-era hotels, modern resorts, tea estate bungalows, and budget guesthouses.',
    tips: [
      'Bring warm clothes - it gets cold at night',
      'April is flower season with blooming gardens',
      'Try authentic Ceylon tea',
      'Visit during weekdays for fewer crowds',
      'Book train tickets in advance'
    ]
  },
  'mirissa': {
    name: 'Mirissa',
    tagline: 'Whale Watching Capital of Sri Lanka',
    description: 'Mirissa is a tranquil beach town famous for whale and dolphin watching. With its crescent-shaped bay, golden sands, and swaying palm trees, it\'s the perfect tropical paradise for relaxation and marine adventures.',
    image: 'zamzam-tours/destinations/mirissa',
    category: 'Beach & Wildlife',
    duration: '2-3 Days',
    bestTime: 'November to April',
    highlights: [
      'Blue whale and dolphin watching tours',
      'Pristine crescent beach',
      'Secret Beach and Coconut Tree Hill',
      'Surfing and stand-up paddleboarding',
      'Fresh seafood restaurants'
    ],
    activities: [
      'Whale watching excursions',
      'Snorkeling and diving',
      'Beach relaxation',
      'Surfing lessons',
      'Sunset watching'
    ],
    thingsToDo: [
      'Take early morning whale watching tour',
      'Visit Parrot Rock for panoramic views',
      'Explore nearby Weligama for surfing',
      'Relax at beach bars and cafes',
      'Visit turtle hatchery at Rekawa'
    ],
    gettingThere: 'Located 150km south of Colombo (3 hours drive). Accessible by train to nearby Weligama station, then short tuk-tuk ride.',
    accommodation: 'Beach resorts, boutique hotels, guesthouses, and budget hostels right on the beach.',
    tips: [
      'Book whale watching tours in advance during peak season',
      'Best whale sightings from December to April',
      'Carry sunscreen and hat for boat trips',
      'Try local seafood at beachfront restaurants',
      'Visit early morning for peaceful beach time'
    ]
  },
  'anuradhapura': {
    name: 'Anuradhapura',
    tagline: 'Ancient Kingdom of Sacred Sites',
    description: 'Anuradhapura is one of the ancient capitals of Sri Lanka and a UNESCO World Heritage Site. This sacred city is home to magnificent stupas, ancient monasteries, and the sacred Bo Tree, making it a major pilgrimage site.',
    image: 'zamzam-tours/destinations/anuradhapura',
    category: 'Cultural & Historical',
    duration: '1 Day',
    bestTime: 'December to March',
    highlights: [
      'Sri Maha Bodhi - sacred Bo Tree',
      'Ruwanwelisaya Stupa',
      'Jetavanaramaya - ancient brick structure',
      'Twin Ponds (Kuttam Pokuna)',
      'Abhayagiri Monastery complex'
    ],
    activities: [
      'Temple and stupa exploration',
      'Bicycle tours around ruins',
      'Photography of ancient architecture',
      'Meditation at sacred sites',
      'Museum visits'
    ],
    thingsToDo: [
      'Cycle between the sacred sites',
      'Witness evening puja ceremonies',
      'Visit Mihintale holy mountain',
      'Explore the Archaeological Museum',
      'Experience the Moonstone carvings'
    ],
    gettingThere: 'Located 205km north of Colombo (4-5 hours drive). Regular buses and trains available. Can be combined with Polonnaruwa visit.',
    accommodation: 'Hotels and guesthouses near the sacred area and in town center.',
    tips: [
      'Dress modestly - cover shoulders and knees',
      'Remove shoes when entering sacred areas',
      'Hire a bicycle to explore the vast site',
      'Start early to avoid afternoon heat',
      'Bring water and snacks'
    ]
  },
  'polonnaruwa': {
    name: 'Polonnaruwa',
    tagline: 'Medieval Capital of Kings',
    description: 'Polonnaruwa is Sri Lanka\'s second ancient capital and a UNESCO World Heritage Site. This well-preserved medieval city features spectacular ruins, including the famous Gal Vihara rock sculptures and the Royal Palace complex.',
    image: 'zamzam-tours/destinations/polonnaruwa',
    category: 'Cultural & Historical',
    duration: '1 Day',
    bestTime: 'December to March',
    highlights: [
      'Gal Vihara rock-cut Buddha statues',
      'Royal Palace and Audience Hall',
      'Parakrama Samudra reservoir',
      'Vatadage circular relic house',
      'Lankatilaka and Thuparama temples'
    ],
    activities: [
      'Cycling tour of ancient ruins',
      'Photography expeditions',
      'Guided historical tours',
      'Museum visits',
      'Wildlife spotting around the lake'
    ],
    thingsToDo: [
      'Explore the Archaeological Museum',
      'Visit Minneriya National Park nearby',
      'Cycle around Parakrama Samudra',
      'See the Lotus Pond and Moonstone',
      'Visit at sunset for golden light photography'
    ],
    gettingThere: 'Located 216km from Colombo (5 hours drive) and 104km from Kandy (3 hours). Well connected by bus and train.',
    accommodation: 'Hotels and guesthouses in the new town, some with views of the ancient city.',
    tips: [
      'Rent a bicycle to explore the spread-out ruins',
      'Dress modestly for temple visits',
      'Bring sun protection and water',
      'Hire a guide for detailed historical context',
      'Combine with Sigiriya and Dambulla visit'
    ]
  },
  'udawalawe': {
    name: 'Udawalawe National Park',
    tagline: 'Land of Giants - Elephant Paradise',
    description: 'Udawalawe National Park is renowned for its large elephant population and open grassland landscapes. With guaranteed elephant sightings and diverse wildlife, it\'s one of the best safari destinations in Sri Lanka.',
    image: 'zamzam-tours/destinations/udawalawe',
    category: 'Wildlife & Nature',
    duration: '1 Day',
    bestTime: 'Year-round (especially December to May)',
    highlights: [
      'Large elephant herds (300+ elephants)',
      'Elephant Transit Home visits',
      'Water buffalo and deer',
      'Crocodiles and water birds',
      'Beautiful reservoir landscapes'
    ],
    activities: [
      'Morning and evening safaris',
      'Elephant watching',
      'Bird watching expeditions',
      'Photography safaris',
      'Visit Elephant Transit Home'
    ],
    thingsToDo: [
      'Take a jeep safari through the park',
      'Watch baby elephants at Transit Home',
      'Bird watching at the reservoir',
      'Visit nearby Bundala National Park',
      'Explore the Udawalawe Reservoir'
    ],
    gettingThere: 'Located 200km from Colombo (4 hours) and 190km from Kandy. Safari base is at Udawalawe village near the park entrance.',
    accommodation: 'Safari lodges and hotels near the park entrance, ranging from budget to luxury.',
    tips: [
      'Almost guaranteed elephant sightings',
      'Early morning safaris offer best viewing',
      'Less crowded than Yala National Park',
      'Bring binoculars and camera with zoom lens',
      'Combine with visit to Elephant Transit Home'
    ]
  },
  'trincomalee': {
    name: 'Trincomalee',
    tagline: 'East Coast Paradise',
    description: 'Trincomalee, on Sri Lanka\'s northeast coast, boasts some of the finest beaches in Asia. With its natural deep-water harbor, historic temples, and crystal-clear waters, it\'s perfect for beach lovers and history enthusiasts.',
    image: 'zamzam-tours/destinations/trincomalee',
    category: 'Beach & Cultural',
    duration: '2-3 Days',
    bestTime: 'April to September',
    highlights: [
      'Nilaveli and Uppuveli beaches',
      'Koneswaram Hindu Temple',
      'Pigeon Island National Park',
      'Hot water wells at Kanniya',
      'Whale and dolphin watching'
    ],
    activities: [
      'Swimming and beach relaxation',
      'Snorkeling at Pigeon Island',
      'Scuba diving',
      'Temple visits',
      'Whale watching tours'
    ],
    thingsToDo: [
      'Visit Pigeon Island for snorkeling with reef sharks',
      'Explore Koneswaram Temple on Swami Rock',
      'Relax at Nilaveli Beach',
      'Take a whale watching tour',
      'Visit Fort Frederick and Maritime Museum'
    ],
    gettingThere: 'Located 257km from Colombo (6-7 hours drive). Train journey along the coast is scenic. Flights available from Colombo.',
    accommodation: 'Beach resorts at Nilaveli and Uppuveli, hotels in town center.',
    tips: [
      'Visit during dry season (April-September)',
      'Snorkeling at Pigeon Island is world-class',
      'Respect temple dress codes',
      'Try fresh seafood at beach restaurants',
      'Book accommodation in advance during peak season'
    ]
  },
  'arugam-bay': {
    name: 'Arugam Bay',
    tagline: 'Surfing Paradise of the East',
    description: 'Arugam Bay is a laid-back surf town on the southeast coast, famous for its perfect point break. This bohemian paradise attracts surfers, backpackers, and beach lovers seeking an authentic coastal experience.',
    image: 'zamzam-tours/destinations/arugam-bay',
    category: 'Beach & Adventure',
    duration: '2-4 Days',
    bestTime: 'May to September',
    highlights: [
      'World-class surfing waves',
      'Main Point surf break',
      'Pottuvil Point and Whiskey Point',
      'Lagoon and mangrove tours',
      'Kumana National Park'
    ],
    activities: [
      'Surfing and surf lessons',
      'Beach yoga sessions',
      'Lagoon kayaking',
      'Safari to Kumana National Park',
      'Beachside dining and nightlife'
    ],
    thingsToDo: [
      'Learn to surf at Baby Point',
      'Visit Kumana Bird Sanctuary',
      'Take a tuk-tuk to Crocodile Rock',
      'Explore Pottuvil Lagoon',
      'Enjoy sunset at the beach'
    ],
    gettingThere: 'Located 320km from Colombo (7-8 hours drive) on the east coast. Long journey but worth it for surf enthusiasts.',
    accommodation: 'Surf camps, beach cabanas, guesthouses, and eco-lodges right on the beach.',
    tips: [
      'Best surf season is April to October',
      'Rent surfboards from beach shops',
      'Book accommodation early during surf season',
      'The vibe is very laid-back and bohemian',
      'Bring mosquito repellent'
    ]
  },
  'bentota': {
    name: 'Bentota',
    tagline: 'Golden Beaches and Water Sports Hub',
    description: 'Bentota is a premier beach resort town on the southwest coast, famous for its golden beaches, luxury resorts, and water sports. The Bentota River adds a unique dimension with mangrove ecosystems and river adventures.',
    image: 'zamzam-tours/destinations/bentota',
    category: 'Beach & Adventure',
    duration: '2-3 Days',
    bestTime: 'November to April',
    highlights: [
      'Pristine golden beaches',
      'Water sports paradise',
      'Bentota River boat safaris',
      'Brief Garden by Bevis Bawa',
      'Turtle hatchery at Kosgoda'
    ],
    activities: [
      'Jet skiing and banana boat rides',
      'River safaris and mangrove tours',
      'Surfing and bodyboarding',
      'Ayurvedic spa treatments',
      'Turtle watching'
    ],
    thingsToDo: [
      'Visit Lunuganga Estate (Geoffrey Bawa)',
      'Take a river cruise to see monitor lizards',
      'Explore Brief Garden',
      'Visit turtle conservation project',
      'Try water skiing and wakeboarding'
    ],
    gettingThere: 'Located 65km south of Colombo (1.5 hours drive). Well connected by train along the coastal railway.',
    accommodation: 'Luxury beach resorts, boutique hotels, and family-friendly properties along the beach.',
    tips: [
      'Book water sports activities in advance',
      'Visit turtle hatchery in the evening',
      'Try Ayurvedic treatments at resort spas',
      'Combine with visits to Galle and Hikkaduwa',
      'River safari best early morning or late afternoon'
    ]
  },
  'hikkaduwa': {
    name: 'Hikkaduwa',
    tagline: 'Coral Gardens and Beach Vibes',
    description: 'Hikkaduwa is a vibrant beach town known for its coral reefs, sea turtles, and lively beach scene. Popular with both families and party-goers, it offers great surfing, diving, and a fun beachfront atmosphere.',
    image: 'zamzam-tours/destinations/hikkaduwa',
    category: 'Beach & Marine Life',
    duration: '2-3 Days',
    bestTime: 'November to April',
    highlights: [
      'Coral reef sanctuary',
      'Sea turtle encounters',
      'Beach festivals and nightlife',
      'Surfing waves',
      'Glass-bottom boat tours'
    ],
    activities: [
      'Snorkeling with sea turtles',
      'Scuba diving on coral reefs',
      'Surfing lessons',
      'Beach parties and nightlife',
      'Shopping at local markets'
    ],
    thingsToDo: [
      'Feed sea turtles in shallow waters',
      'Take a glass-bottom boat tour',
      'Visit Tsunami Photo Museum',
      'Explore the Coral Sanctuary',
      'Enjoy beachside cafes and bars'
    ],
    gettingThere: 'Located 100km south of Colombo (2 hours drive). Regular trains and buses along the coastal road.',
    accommodation: 'Beach hotels, guesthouses, and party hostels along the main beach strip.',
    tips: [
      'Be careful swimming - strong currents at times',
      'Snorkeling equipment available for rent',
      'Visit early morning to see turtles',
      'Nightlife is vibrant on weekends',
      'Combine with Galle Fort visit'
    ]
  },
  'dambulla': {
    name: 'Dambulla',
    tagline: 'Golden Temple of Cave Wonders',
    description: 'Dambulla Cave Temple, also known as the Golden Temple, is a UNESCO World Heritage Site featuring five cave shrines with over 150 Buddha statues and ancient murals. It\'s the largest and best-preserved cave temple complex in Sri Lanka.',
    image: 'zamzam-tours/destinations/dambulla',
    category: 'Cultural & Historical',
    duration: 'Half Day',
    bestTime: 'Year-round (avoid rainy season)',
    highlights: [
      'Five magnificent cave temples',
      '150+ Buddha statues',
      'Ancient ceiling murals',
      'Golden Buddha statue',
      'Panoramic views from cave entrance'
    ],
    activities: [
      'Cave temple exploration',
      'Photography (outside caves)',
      'Guided historical tours',
      'Climbing to cave entrance',
      'Museum visits'
    ],
    thingsToDo: [
      'Explore all five cave shrines',
      'View the massive Golden Buddha',
      'Visit the nearby Dambulla Museum',
      'Combine with Sigiriya visit',
      'Try local vegetarian meals at temple'
    ],
    gettingThere: 'Located 148km from Colombo (3.5 hours) and 72km from Kandy (2 hours). Well positioned between Colombo and the Cultural Triangle.',
    accommodation: 'Hotels in Dambulla town, or stay in nearby Sigiriya (20 minutes away).',
    tips: [
      'Remove shoes before entering caves',
      'Dress modestly (shoulders and knees covered)',
      'Photography not allowed inside caves',
      'Climb can be steep - wear comfortable shoes',
      'Best combined with Sigiriya on same day'
    ]
  },
  'horton-plains': {
    name: 'Horton Plains',
    tagline: 'World\'s End - Edge of the Earth',
    description: 'Horton Plains National Park is a stunning highland plateau with cloud forests, grasslands, and the dramatic World\'s End precipice. This UNESCO World Heritage Site offers one of Sri Lanka\'s best hiking experiences with breathtaking views.',
    image: 'zamzam-tours/destinations/horton-plains',
    category: 'Nature & Adventure',
    duration: '1 Day',
    bestTime: 'January to March (dry season)',
    highlights: [
      'World\'s End cliff (880m drop)',
      'Baker\'s Falls waterfall',
      'Endemic wildlife and flora',
      'Cloud forest ecosystems',
      'Mini World\'s End viewpoint'
    ],
    activities: [
      'Hiking the 9km circular trail',
      'Wildlife spotting',
      'Bird watching',
      'Nature photography',
      'Waterfall visits'
    ],
    thingsToDo: [
      'Complete the World\'s End circuit trek',
      'Spot sambar deer and endemic birds',
      'Visit before 10am for clear views',
      'Photograph the dramatic cliff edge',
      'Explore Baker\'s Falls'
    ],
    gettingThere: 'Located 32km from Nuwara Eliya (1.5 hours drive on rough roads). 4WD vehicle recommended. Day trip from Nuwara Eliya or Ella.',
    accommodation: 'Stay in Nuwara Eliya or Ella and do day trip. No accommodation within the park.',
    tips: [
      'Start before 6am to see World\'s End before clouds arrive',
      'Bring warm clothes - it\'s very cold at dawn',
      'Wear good hiking boots',
      'Bring own food and water',
      'Entry closes at 6pm, last entry at 2pm'
    ]
  },
  'unawatuna': {
    name: 'Unawatuna',
    tagline: 'Crescent Bay Paradise',
    description: 'Unawatuna is a picture-perfect crescent bay just south of Galle, famous for its golden sand beach, coral reefs, and laid-back vibe. Voted one of the world\'s best beaches, it\'s ideal for swimming, snorkeling, and relaxation.',
    image: 'zamzam-tours/destinations/unawatuna',
    category: 'Beach & Marine Life',
    duration: '2-3 Days',
    bestTime: 'November to April',
    highlights: [
      'Crescent-shaped golden beach',
      'Coral reef for snorkeling',
      'Japanese Peace Pagoda',
      'Jungle Beach',
      'Galle Fort nearby'
    ],
    activities: [
      'Swimming in protected bay',
      'Snorkeling and diving',
      'Beach relaxation',
      'Coastal walks',
      'Water sports'
    ],
    thingsToDo: [
      'Snorkel at the coral reef',
      'Visit Japanese Peace Pagoda for sunset',
      'Walk to hidden Jungle Beach',
      'Explore nearby Galle Fort',
      'Try fresh seafood at beach restaurants'
    ],
    gettingThere: 'Located 5km from Galle (10 minutes drive), 145km from Colombo (2.5 hours). Easily accessible by train to Galle, then short tuk-tuk ride.',
    accommodation: 'Beachfront guesthouses, boutique hotels, and budget hostels right on the beach.',
    tips: [
      'Visit Jungle Beach for fewer crowds',
      'Snorkeling best near the rocks',
      'Combine with Galle Fort visit',
      'Beachfront gets busy on weekends',
      'Watch sunset from Peace Pagoda'
    ]
  },
  'wilpattu': {
    name: 'Wilpattu National Park',
    tagline: 'Sri Lanka\'s Largest Wildlife Sanctuary',
    description: 'Wilpattu is Sri Lanka\'s largest and oldest national park, famous for its unique "villus" (natural lakes) and elusive leopards. Less crowded than Yala, it offers a more pristine wilderness experience with diverse wildlife.',
    image: 'zamzam-tours/destinations/wilpattu',
    category: 'Wildlife & Nature',
    duration: '1-2 Days',
    bestTime: 'February to October',
    highlights: [
      'Leopard sightings around villus',
      'Sloth bears and elephants',
      'Natural lakes (villus)',
      'Diverse bird species',
      'Pristine wilderness'
    ],
    activities: [
      'Full-day safari tours',
      'Leopard tracking',
      'Bird watching expeditions',
      'Photography safaris',
      'Camping experiences'
    ],
    thingsToDo: [
      'Take early morning leopard safari',
      'Visit multiple villus for wildlife',
      'Spot sloth bears and elephants',
      'Bird watching at wetlands',
      'Explore ancient Buddhist sites within park'
    ],
    gettingThere: 'Located 180km north of Colombo (3.5 hours) and 26km from Anuradhapura. Park entrance at Hunuwilagama.',
    accommodation: 'Basic park bungalows, camping sites, or hotels in nearby Anuradhapura.',
    tips: [
      'Less touristy than Yala National Park',
      'Leopards seen around villus (lakes)',
      'Full-day safari recommended',
      'Bring plenty of water and snacks',
      'Park can close during dry season for wildlife protection'
    ]
  },
  'jaffna': {
    name: 'Jaffna',
    tagline: 'Gateway to Tamil Culture',
    description: 'Jaffna, the cultural capital of Sri Lanka\'s Tamil community, offers a unique blend of Indian Tamil influence and Sri Lankan heritage. With ancient temples, Dutch forts, and remote islands, it\'s an off-the-beaten-path destination.',
    image: 'zamzam-tours/destinations/jaffna',
    category: 'Cultural & Heritage',
    duration: '2-3 Days',
    bestTime: 'December to March',
    highlights: [
      'Nallur Kandaswamy Temple',
      'Jaffna Fort (Dutch colonial)',
      'Delft Island with wild horses',
      'Nainativu Island temples',
      'Authentic Tamil cuisine'
    ],
    activities: [
      'Temple visits and religious festivals',
      'Island hopping tours',
      'Exploring Dutch colonial sites',
      'Cycling through palmyra groves',
      'Culinary experiences'
    ],
    thingsToDo: [
      'Visit vibrant Nallur Temple',
      'Take boat to Delft Island',
      'Explore Jaffna Public Library',
      'Try authentic Jaffna crab curry',
      'Visit Nagadeepa Buddhist temple'
    ],
    gettingThere: 'Located 400km north of Colombo (7-8 hours drive or 1-hour flight). Scenic train journey also available.',
    accommodation: 'Heritage hotels, guesthouses, and basic accommodations in town center.',
    tips: [
      'Very different culture from rest of Sri Lanka',
      'Try local palmyra-based sweets',
      'Dress conservatively for temple visits',
      'August Nallur Festival is spectacular',
      'English less commonly spoken'
    ]
  },
  'adams-peak': {
    name: 'Adam\'s Peak',
    tagline: 'Sacred Mountain Pilgrimage',
    description: 'Adam\'s Peak (Sri Pada) is a sacred mountain revered by Buddhists, Hindus, Muslims, and Christians. The pilgrimage to see the sunrise from the 2,243m summit and the sacred "footprint" is a spiritual and physical journey.',
    image: 'zamzam-tours/destinations/adams-peak',
    category: 'Nature & Spiritual',
    duration: '1 Day',
    bestTime: 'December to May (pilgrimage season)',
    highlights: [
      'Sacred footprint at summit',
      'Spectacular sunrise views',
      'Pilgrimage climb with thousands',
      'Tea plantation landscapes',
      'Spiritual experience'
    ],
    activities: [
      'Night climb to summit',
      'Sunrise viewing',
      'Pilgrimage experience',
      'Photography',
      'Tea country exploration'
    ],
    thingsToDo: [
      'Climb the 5,500 steps overnight',
      'Watch sunrise from summit',
      'Ring the bell at the top',
      'Visit surrounding tea estates',
      'Experience the pilgrimage atmosphere'
    ],
    gettingThere: 'Located 130km from Colombo. Main starting points: Dalhousie (Nallathanniya) for pilgrims, or Ratnapura route. 2-3 hour drive from Colombo to base.',
    accommodation: 'Basic guesthouses in Dalhousie village at the base of the mountain.',
    tips: [
      'Start climb at 2-3am to reach summit for sunrise',
      'Bring warm clothes - very cold at summit',
      'Wear good shoes with grip',
      'Bring water and energy snacks',
      'Pilgrimage season has more facilities and lights'
    ]
  }
};

export default function DestinationDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  if (!slug || typeof slug !== 'string' || !destinationsData[slug]) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '80px' }}>
          <div style={{ textAlign: 'center' }}>
            <h1>Destination Not Found</h1>
            <Link href="/destinations" style={{ color: '#053b3c', textDecoration: 'underline' }}>
              Back to All Destinations
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const destination = destinationsData[slug];

  return (
    <>
      <Head>
        <title>{destination.name} - Sri Lanka | Zamzam Lanka Tours</title>
        <meta name="description" content={destination.description} />
        <meta name="keywords" content={`${destination.name}, Sri Lanka, tourism, travel, ${destination.category}`} />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section 
        style={{
          position: 'relative',
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginTop: 0
        }}
      >
        {/* Background Image */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0
        }}>
          <CldImage 
            src={destination.image}
            alt={destination.name}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>

        {/* Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(135deg, rgba(5, 59, 60, 0.7), rgba(10, 92, 94, 0.5))',
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
                fontSize: '4rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                color: 'white',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              {destination.name}
            </h1>
            <p 
              style={{ 
                fontSize: '1.5rem', 
                marginBottom: '2rem',
                color: '#f8b500',
                textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                fontWeight: '600'
              }}
            >
              {destination.tagline}
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span style={{ 
                background: 'rgba(248, 181, 0, 0.9)', 
                color: '#000', 
                padding: '0.5rem 1.5rem', 
                borderRadius: '25px',
                fontWeight: '600'
              }}>
                {destination.category}
              </span>
              {/* duration removed per request */}
              <span style={{ 
                background: 'rgba(255, 255, 255, 0.9)', 
                color: '#053b3c', 
                padding: '0.5rem 1.5rem', 
                borderRadius: '25px',
                fontWeight: '600'
              }}>
                ☀️ {destination.bestTime}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section style={{ padding: '5rem 0', background: 'white' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <AnimatedSection animation="fadeInUp">
              <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#053b3c' }}>
                About {destination.name}
              </h2>
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#555', marginBottom: '3rem' }}>
                {destination.description}
              </p>
            </AnimatedSection>

            {/* Highlights */}
            <AnimatedSection animation="fadeInUp" delay={0.2}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#053b3c' }}>
                ✨ Highlights
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
                {destination.highlights.map((highlight: string, index: number) => (
                  <div 
                    key={index}
                    style={{
                      background: '#f8f9fa',
                      padding: '1.5rem',
                      borderRadius: '10px',
                      borderLeft: '4px solid #f8b500'
                    }}
                  >
                    <p style={{ margin: 0, color: '#333' }}>✓ {highlight}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            {/* Activities */}
            <AnimatedSection animation="fadeInUp" delay={0.3}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#053b3c' }}>
                🎯 Activities
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '3rem' }}>
                {destination.activities.map((activity: string, index: number) => (
                  <li 
                    key={index}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #eee',
                      fontSize: '1.05rem',
                      color: '#555'
                    }}
                  >
                    🔸 {activity}
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Things to Do */}
            <AnimatedSection animation="fadeInUp" delay={0.4}>
              <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#053b3c' }}>
                📍 Things to Do
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '3rem' }}>
                {destination.thingsToDo.map((thing: string, index: number) => (
                  <li 
                    key={index}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #eee',
                      fontSize: '1.05rem',
                      color: '#555'
                    }}
                  >
                    ➤ {thing}
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            {/* Practical Information */}
            <AnimatedSection animation="fadeInUp" delay={0.5}>
              <div style={{ 
                background: 'linear-gradient(135deg, #053b3c, #0a5c5e)',
                color: 'white',
                padding: '3rem',
                borderRadius: '15px',
                marginBottom: '3rem'
              }}>
                <h3 style={{ fontSize: '2rem', marginBottom: '2rem', color: '#f8b500' }}>
                  📋 Practical Information
                </h3>
                
                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#f8b500' }}>
                    🚗 Getting There
                  </h4>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                    {destination.gettingThere}
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#f8b500' }}>
                    🏨 Accommodation
                  </h4>
                  <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                    {destination.accommodation}
                  </p>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: '#f8b500' }}>
                    💡 Tips for Visitors
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0 }}>
                    {destination.tips.map((tip: string, index: number) => (
                      <li key={index} style={{ padding: '0.5rem 0', fontSize: '1.05rem' }}>
                        ⚡ {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>

            {/* CTA Buttons */}
            <AnimatedSection animation="fadeInUp" delay={0.6}>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                    transition: 'transform 0.3s ease'
                  }}
                >
                  📞 Plan Your Trip
                </Link>
                <Link 
                  href="/destinations"
                  style={{
                    display: 'inline-block',
                    padding: '1rem 2.5rem',
                    background: '#053b3c',
                    color: 'white',
                    borderRadius: '30px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    fontSize: '1.1rem',
                    transition: 'transform 0.3s ease'
                  }}
                >
                  ← All Destinations
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
