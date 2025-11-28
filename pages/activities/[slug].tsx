import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CldImage } from 'next-cloudinary';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CONTACT_INFO } from '../../src/constants/config';

const ActivityDetailPage = () => {
  const router = useRouter();
  const { slug } = router.query;

  const activitiesData: any = {
    'wildlife-safaris': {
      name: 'Wildlife Safaris',
      tagline: 'Encounter Majestic Wildlife in Their Natural Habitat',
      icon: '🦁',
      description: 'Experience thrilling wildlife safaris in Sri Lanka\'s renowned national parks. Spot elephants, leopards, sloth bears, and diverse bird species in their natural habitats. Sri Lanka is one of the best places in Asia for wildlife viewing, with high leopard density and large elephant herds.',
      image: 'zamzam-tours/activities/wildlife-safari',
      category: 'Wildlife',
      difficulty: 'Easy',
      duration: '3-4 hours',
      bestTime: 'February to July (Dry season for best wildlife viewing)',
      bestLocations: [
        'Yala National Park - Highest leopard density in the world',
        'Udawalawe National Park - Large elephant herds',
        'Wilpattu National Park - Sloth bears and leopards',
        'Minneriya National Park - Elephant gathering',
        'Bundala National Park - Bird watching paradise'
      ],
      highlights: [
        'Spot elusive Sri Lankan leopards in Yala',
        'Watch elephant herds at waterholes',
        'Over 400 bird species including endemic varieties',
        'Sloth bears, crocodiles, and water buffalo',
        'Experienced safari guides and 4x4 vehicles'
      ],
      included: [
        'Jeep safari with professional driver/guide',
        'National park entrance fees',
        'Binoculars and wildlife guidebook',
        'Bottled water and refreshments',
        'Hotel pickup and drop-off'
      ],
      tips: [
        'Book morning safaris (6:00 AM) for best wildlife sightings',
        'Wear neutral-colored clothing (khaki, green, brown)',
        'Bring sunscreen, hat, and sunglasses',
        'Camera with good zoom lens recommended',
        'Stay quiet and patient for best wildlife encounters',
        'Respect park rules and maintain safe distance from animals'
      ]
    },
    'hiking-trekking': {
      name: 'Hiking & Trekking',
      tagline: 'Conquer Scenic Mountain Trails and Lush Landscapes',
      icon: '🥾',
      description: 'Trek through misty mountains, rolling tea plantations, and ancient forests. From gentle nature walks to challenging mountain climbs, Sri Lanka offers trails for all levels. Experience breathtaking views, diverse ecosystems, and encounters with local wildlife.',
      image: 'zamzam-tours/activities/hiking',
      category: 'Adventure',
      difficulty: 'Moderate to Hard',
      duration: '2-8 hours',
      bestTime: 'December to March (Dry season in hill country)',
      bestLocations: [
        'Adam\'s Peak - Sacred pilgrimage climb (5-6 hours)',
        'Ella Rock - Stunning tea country views (2-3 hours)',
        'Little Adam\'s Peak - Easy scenic walk (1 hour)',
        'Horton Plains - World\'s End trek (3-4 hours)',
        'Knuckles Mountain Range - Multi-day treks available',
        'Riverston Peak - Cloud forest hiking'
      ],
      highlights: [
        'Sunrise views from mountain peaks',
        'Walk through cloud forests and tea plantations',
        'Waterfalls and natural pools along trails',
        'Endemic flora and fauna',
        'Local village experiences'
      ],
      included: [
        'Experienced trekking guide',
        'Trail permits and entrance fees',
        'Walking sticks if needed',
        'First aid kit',
        'Refreshments and packed lunch for full-day treks'
      ],
      tips: [
        'Wear proper hiking boots with good grip',
        'Bring layers - mountain weather changes quickly',
        'Start early to avoid midday heat',
        'Carry 2-3 liters of water per person',
        'Use insect repellent in forested areas',
        'Hire local guides for safety and best routes'
      ]
    },
    'cultural-tours': {
      name: 'Cultural Tours',
      tagline: 'Journey Through 2,500 Years of Rich Heritage',
      icon: '🏛️',
      description: 'Explore Sri Lanka\'s rich cultural heritage through ancient Buddhist temples, colonial forts, and UNESCO World Heritage Sites dating back over 2,000 years. Witness stunning architecture, religious ceremonies, and living traditions.',
      image: 'zamzam-tours/activities/cultural-tours',
      category: 'Cultural',
      difficulty: 'Easy',
      duration: 'Full Day',
      bestTime: 'Year-round (avoid heavy rain seasons)',
      bestLocations: [
        'Sigiriya Rock Fortress - Ancient palace complex',
        'Temple of the Tooth, Kandy - Sacred Buddhist temple',
        'Dambulla Cave Temple - Golden temple with Buddha statues',
        'Anuradhapura - Ancient capital with stupas',
        'Polonnaruwa - Medieval kingdom ruins',
        'Galle Fort - Dutch colonial architecture'
      ],
      highlights: [
        'Climb Sigiriya Rock and see ancient frescoes',
        'Witness traditional Kandyan dance performances',
        'Explore ancient Buddhist monasteries',
        'Colonial architecture and museums',
        'Religious ceremonies and festivals'
      ],
      included: [
        'Professional cultural guide',
        'Entrance fees to all sites',
        'Transportation between locations',
        'Traditional lunch',
        'Cultural show tickets'
      ],
      tips: [
        'Dress modestly - cover shoulders and knees at temples',
        'Remove shoes before entering religious sites',
        'Be respectful during religious ceremonies',
        'Bring a scarf to cover if needed',
        'Photography restrictions apply in some areas',
        'Start early to avoid crowds and heat'
      ]
    },
    'beach-activities': {
      name: 'Beach Activities',
      tagline: 'Relax on Golden Sands and Azure Waters',
      icon: '🏖️',
      description: 'Enjoy pristine beaches with golden sands, turquoise waters, and perfect waves. Relax under palm trees or engage in exciting water sports along the coast. Sri Lanka offers diverse beach experiences from party beaches to secluded coves.',
      image: 'zamzam-tours/activities/beach',
      category: 'Beach',
      difficulty: 'Easy',
      duration: 'Flexible',
      bestTime: 'West/South coast: November-April, East coast: May-September',
      bestLocations: [
        'Unawatuna - Swimming and snorkeling',
        'Mirissa - Beach parties and whale watching',
        'Bentota - Water sports hub',
        'Arugam Bay - Surfing paradise',
        'Trincomalee - Crystal clear waters',
        'Hikkaduwa - Coral reefs and diving'
      ],
      highlights: [
        'Swimming in calm, warm waters',
        'Beach volleyball and sunset views',
        'Fresh seafood at beach restaurants',
        'Water sports: jet skiing, banana boats, parasailing',
        'Beachfront yoga and massage'
      ],
      included: [
        'Beach access and loungers',
        'Basic equipment for selected activities',
        'Safety gear and life jackets',
        'Beach towels',
        'Shade umbrellas'
      ],
      tips: [
        'Apply waterproof sunscreen regularly (SPF 50+)',
        'Swim only in designated safe areas',
        'Watch for strong currents and undertows',
        'Drink plenty of water to stay hydrated',
        'Peak season beaches can be crowded',
        'Support local vendors and restaurants'
      ]
    },
    'tea-plantation-tours': {
      name: 'Tea Plantation Tours',
      tagline: 'Experience the World-Famous Ceylon Tea Heritage',
      icon: '🍵',
      description: 'Walk through emerald tea plantations, learn about Ceylon tea production, and enjoy fresh tea tasting sessions with breathtaking mountain views. Sri Lanka is one of the world\'s top tea producers with a fascinating colonial tea industry history.',
      image: 'zamzam-tours/activities/tea-plantation',
      category: 'Cultural',
      difficulty: 'Easy',
      duration: '2-3 hours',
      bestTime: 'Year-round, peak season December-March',
      bestLocations: [
        'Nuwara Eliya - Tea capital of Sri Lanka',
        'Ella - Pedro Tea Factory and plantations',
        'Haputale - Dambatenne Tea Factory',
        'Kandy - Giragama Tea Factory',
        'Hatton - Mackwoods Tea Centre'
      ],
      highlights: [
        'Walk through carpet-like tea estates',
        'Learn tea plucking from local workers',
        'Factory tour showing tea processing',
        'Sample different tea varieties',
        'Purchase premium Ceylon tea direct',
        'Scenic viewpoints and photo opportunities'
      ],
      included: [
        'Factory tour with guide',
        'Tea tasting session',
        'Plantation walk',
        'Transport to/from tea estates',
        'Tea-making demonstration'
      ],
      tips: [
        'Wear comfortable walking shoes',
        'Bring a light jacket - hill country is cool',
        'Best light for photography in morning',
        'Try different tea grades during tasting',
        'Buy tea directly from factory for best prices',
        'Respect tea pickers at work'
      ]
    },
    'whale-watching': {
      name: 'Whale Watching',
      tagline: 'Witness Giants of the Ocean in Their Natural Habitat',
      icon: '🐋',
      description: 'Embark on an unforgettable ocean adventure to see the world\'s largest mammals. Mirissa and Trincomalee offer some of the best whale watching opportunities globally, with blue whales, sperm whales, and dolphin pods.',
      image: 'zamzam-tours/activities/whale-watching',
      category: 'Wildlife',
      difficulty: 'Easy',
      duration: '3-4 hours',
      bestTime: 'South coast: November-April, East coast: May-September',
      bestLocations: [
        'Mirissa - Blue whale hotspot',
        'Trincomalee - Sperm whales and dolphins',
        'Kalpitiya - Dolphin mega pods'
      ],
      highlights: [
        'Blue whales - largest animals on Earth',
        'Sperm whales and fin whales',
        'Spinner and bottlenose dolphins',
        'Flying fish and sea turtles',
        'Professional marine biologist guides'
      ],
      included: [
        'Boat trip with experienced captain',
        'Life jackets and safety equipment',
        'Marine biologist guide',
        'Light breakfast/snacks',
        'Whale sighting guarantee or rebooking'
      ],
      tips: [
        'Take motion sickness tablets if prone to seasickness',
        'Book early morning tours (6-7 AM departure)',
        'Bring sunscreen, hat, and sunglasses',
        'Camera with good zoom recommended',
        'Wear layers - it can be cool on the water',
        '90%+ success rate in peak season'
      ]
    },
    'surfing': {
      name: 'Surfing',
      tagline: 'Ride World-Class Waves in Tropical Paradise',
      icon: '🏄',
      description: 'Ride the waves at renowned surf spots like Arugam Bay, Hikkaduwa, and Weligama. Perfect conditions for beginners and experienced surfers alike, with warm water year-round and consistent swells.',
      image: 'zamzam-tours/activities/surfing',
      category: 'Adventure',
      difficulty: 'Moderate',
      duration: '2-3 hours',
      bestTime: 'East coast: May-September, West/South coast: November-April',
      bestLocations: [
        'Arugam Bay - World-class right-hand point break',
        'Weligama - Perfect for beginners',
        'Hikkaduwa - Consistent beach breaks',
        'Mirissa - Less crowded spots',
        'Ahangama - Reef breaks for experienced surfers'
      ],
      highlights: [
        'Warm tropical waters (27-30°C)',
        'Consistent waves throughout surf season',
        'Professional surf instructors',
        'Beginner-friendly beach breaks',
        'Advanced reef and point breaks',
        'Vibrant surf community and beach culture'
      ],
      included: [
        'Surfboard rental (soft-top or fiberglass)',
        'Professional surf instructor for lessons',
        'Rash guard or wetsuit if needed',
        'Safety briefing and ocean awareness',
        'Video analysis for improvement'
      ],
      tips: [
        'Take a lesson before hitting bigger waves',
        'Apply reef-safe sunscreen',
        'Start on foam boards for safety',
        'Respect local surfers and surf etiquette',
        'Check tides and conditions before surfing',
        'Beware of rocks and reef at some spots'
      ]
    },
    'scuba-diving': {
      name: 'Scuba Diving',
      tagline: 'Explore Vibrant Underwater Worlds and Historic Wrecks',
      icon: '🤿',
      description: 'Dive into crystal-clear waters to discover colorful coral reefs, tropical fish, and fascinating shipwrecks. Sri Lanka\'s east and south coasts offer world-class diving sites with excellent visibility and diverse marine life.',
      image: 'zamzam-tours/activities/scuba-diving',
      category: 'Adventure',
      difficulty: 'Moderate',
      duration: '3-4 hours',
      bestTime: 'East coast: May-September, West/South coast: November-April',
      bestLocations: [
        'Trincomalee - Wreck diving and coral reefs',
        'Hikkaduwa - Coral sanctuary',
        'Pigeon Island - Marine national park',
        'Kalpitiya - Bar reef and mantas',
        'Batticaloa - Wreck diving'
      ],
      highlights: [
        'Historic shipwrecks to explore',
        'Colorful coral reefs and fish',
        'Sea turtles, rays, and reef sharks',
        'Visibility 15-30 meters',
        'PADI certification courses available',
        'Night diving opportunities'
      ],
      included: [
        'All diving equipment (tank, BCD, regulator)',
        'PADI certified dive master',
        'Boat transfer to dive sites',
        'Weight belt and weights',
        'Refreshments between dives'
      ],
      tips: [
        'Must have valid diving certification or take course',
        'Book morning dives for best visibility',
        'No diving 24 hours before flying',
        'Underwater camera rental available',
        'Dive insurance recommended',
        'Respect coral - don\'t touch or stand on it'
      ]
    },
    'train-journeys': {
      name: 'Scenic Train Journeys',
      tagline: 'One of the World\'s Most Beautiful Train Rides',
      icon: '🚂',
      description: 'Experience one of the world\'s most scenic train journeys from Kandy to Ella, passing through misty mountains, tea estates, and stunning viaducts. The slow-paced colonial-era trains offer panoramic views and authentic local experiences.',
      image: 'zamzam-tours/activities/train-journey',
      category: 'Cultural',
      difficulty: 'Easy',
      duration: '6-7 hours',
      bestTime: 'December to March for clear mountain views',
      bestLocations: [
        'Kandy to Ella - Most scenic route (6-7 hours)',
        'Colombo to Kandy - Lake and mountain views',
        'Nanu Oya to Ella - Tea country highlights',
        'Coastal line: Colombo to Galle - Ocean views'
      ],
      highlights: [
        'Nine Arch Bridge in Ella',
        'Endless tea plantations',
        'Misty mountain tunnels',
        'Waterfalls and valleys',
        'Local vendors selling snacks',
        'Hanging out of doors for photos'
      ],
      included: [
        'Train ticket (2nd or 3rd class)',
        'Reserved seating when available',
        'Local guide for station assistance',
        'Snacks and water for journey',
        'Photography tips and best viewpoints'
      ],
      tips: [
        'Book tickets in advance (especially 1st/2nd class)',
        'Sit on right side Kandy→Ella for best views',
        'Arrive early to secure window seat',
        'Keep doors open for photos but be careful',
        'Bring snacks - food carts have limited options',
        'Be prepared for delays - trains run on flexible schedule'
      ]
    },
    'bird-watching': {
      name: 'Bird Watching',
      tagline: 'Discover 400+ Species Including Rare Endemics',
      icon: '🦜',
      description: 'Sri Lanka is home to over 400 bird species, including 33 endemic species. Explore wetlands, forests, and national parks with expert ornithologists to spot colorful kingfishers, hornbills, and rare endemics.',
      image: 'zamzam-tours/activities/bird-watching',
      category: 'Wildlife',
      difficulty: 'Easy',
      duration: '3-5 hours',
      bestTime: 'November to April for migratory species',
      bestLocations: [
        'Sinharaja Rain Forest - Endemic species hotspot',
        'Bundala National Park - Migratory water birds',
        'Kumana National Park - Breeding ground',
        'Kitulgala - Wet zone species',
        'Talangama Wetland - Near Colombo'
      ],
      highlights: [
        'Sri Lankan blue magpie and junglefowl',
        'Colorful kingfishers and bee-eaters',
        'Hornbills and woodpeckers',
        'Water birds and waders',
        'Expert ornithologist guides',
        'Photography opportunities'
      ],
      included: [
        'Professional bird guide',
        'Binoculars and field guides',
        'Park entrance fees',
        'Transportation to birding sites',
        'Bird checklist and species identification'
      ],
      tips: [
        'Wear muted green or brown colors',
        'Bring camera with telephoto lens',
        'Early morning (6-9 AM) is best for birding',
        'Move slowly and quietly',
        'Insect repellent for forested areas',
        'Download bird identification apps'
      ]
    },
    'white-water-rafting': {
      name: 'White Water Rafting',
      tagline: 'Navigate Thrilling Rapids Through Jungle Rivers',
      icon: '🚣',
      description: 'Navigate exciting rapids through lush jungle landscapes. Kitulgala on the Kelani River offers the best white water rafting experiences in Sri Lanka, with Class 2-3 rapids perfect for adventure seekers.',
      image: 'zamzam-tours/activities/rafting',
      category: 'Adventure',
      difficulty: 'Hard',
      duration: '2-3 hours',
      bestTime: 'May to December (monsoon season for best water levels)',
      bestLocations: [
        'Kitulgala, Kelani River - Main rafting destination',
        'Kithulgala Adventure Park - Grade 2-3 rapids'
      ],
      highlights: [
        '7 major rapids and 4 minor rapids',
        'Lush rainforest scenery',
        'Professional safety kayakers',
        'Cliff jumping opportunities',
        'Natural pools for swimming',
        'Bridge of the River Kwai filming location'
      ],
      included: [
        'All safety equipment (helmet, life jacket)',
        'Professional rafting guide',
        'Safety kayakers for support',
        'Rafting gear and paddles',
        'Changing rooms and lockers',
        'Safety briefing and training'
      ],
      tips: [
        'Must be able to swim',
        'Wear quick-dry clothing',
        'Secure waterproof bag for valuables',
        'Follow guide instructions carefully',
        'Don\'t wear flip-flops - strap sandals only',
        'GoPro or waterproof camera recommended'
      ]
    },
    'ayurvedic-spa': {
      name: 'Ayurvedic Spa & Wellness',
      tagline: 'Ancient Healing Traditions for Modern Wellness',
      icon: '💆',
      description: 'Rejuvenate with ancient Ayurvedic treatments, herbal massages, and wellness therapies. Experience holistic healing at authentic Ayurvedic centers with traditional physicians and natural herbal remedies.',
      image: 'zamzam-tours/activities/ayurveda',
      category: 'Wellness',
      difficulty: 'Easy',
      duration: '1-3 hours',
      bestTime: 'Year-round',
      bestLocations: [
        'Siddhalepa Ayurveda Resort, Wadduwa',
        'Barberyn Ayurveda Resorts, Beruwala',
        'Jetwing Ayurveda Pavilions, Negombo',
        'Heritance Ayurveda Maha Gedara, Beruwala',
        'Ayurveda Walauwa, Colombo'
      ],
      highlights: [
        'Traditional Ayurvedic massages',
        'Herbal steam baths and therapy',
        'Shirodhara (oil treatment on forehead)',
        'Customized wellness programs',
        'Detox and rejuvenation packages',
        'Authentic Ayurvedic doctors'
      ],
      included: [
        'Consultation with Ayurvedic physician',
        'Personalized treatment plan',
        'Herbal oils and medicines',
        'Treatment session(s)',
        'Herbal tea and refreshments',
        'Wellness advice and diet recommendations'
      ],
      tips: [
        'Book multi-day packages for best results',
        'Arrive 15 minutes early for consultation',
        'Wear comfortable, loose clothing',
        'Avoid heavy meals before treatment',
        'Stay hydrated after treatments',
        'Follow post-treatment dietary advice'
      ]
    },
    'cooking-classes': {
      name: 'Sri Lankan Cooking Classes',
      tagline: 'Master the Art of Authentic Sri Lankan Cuisine',
      icon: '👨‍🍳',
      description: 'Master the art of Sri Lankan cooking with hands-on classes. Learn to prepare curries, hoppers, and other local delicacies using fresh spices. Take home recipes and spice blends to recreate flavors at home.',
      image: 'zamzam-tours/activities/cooking',
      category: 'Cultural',
      difficulty: 'Easy',
      duration: '2-3 hours',
      bestTime: 'Year-round',
      bestLocations: [
        'Arugam Bay - Beach-side cooking with fresh seafood',
        'Galle - Traditional coastal cuisine and Dutch influences',
        'Kandy - Traditional hill country cuisine',
        'Colombo - Modern cooking schools',
        'Village homes - Authentic rural experiences'
      ],
      highlights: [
        'Visit local markets for fresh ingredients',
        'Learn about Sri Lankan spices',
        'Prepare 3-5 traditional dishes',
        'Master curry-making techniques',
        'Enjoy your cooked meal',
        'Receive recipe cards and spice packets'
      ],
      included: [
        'Professional chef instructor',
        'All ingredients and equipment',
        'Recipe booklet',
        'Spice packet to take home',
        'Apron and cooking tools',
        'Lunch or dinner (what you cook)'
      ],
      tips: [
        'Morning classes often include market visit',
        'Ask about vegetarian/vegan options',
        'Take photos of preparation steps',
        'Note spice ratios for recipes',
        'Buy spices at local markets for best prices',
        'Great activity for families'
      ]
    },
    'photography-tours': {
      name: 'Photography Tours',
      tagline: 'Capture Sri Lanka\'s Beauty Through Your Lens',
      icon: '📸',
      description: 'Join professional photographers to capture Sri Lanka\'s breathtaking landscapes, wildlife, and cultural scenes. Perfect for all photography skill levels, from smartphone users to professionals.',
      image: 'zamzam-tours/activities/photography',
      category: 'Cultural',
      difficulty: 'Easy',
      duration: 'Full Day',
      bestTime: 'Year-round, golden hours best for landscape',
      bestLocations: [
        'Sigiriya sunrise photography',
        'Tea plantations in Nuwara Eliya',
        'Stilt fishermen in Galle',
        'Wildlife in Yala National Park',
        'Temples and cultural sites',
        'Coastal sunsets'
      ],
      highlights: [
        'Professional photographer guide',
        'Learn composition and lighting',
        'Access to exclusive photo spots',
        'Wildlife and landscape photography',
        'Cultural and street photography',
        'Post-processing workshops'
      ],
      included: [
        'Professional photographer guide',
        'Transportation to locations',
        'Entrance fees to sites',
        'Photography tips and techniques',
        'Best timing for golden hour',
        'Photo editing basic tips'
      ],
      tips: [
        'Bring extra batteries and memory cards',
        'Tripod useful for landscape shots',
        'Polarizing filter for landscapes',
        'Wake up early for sunrise shots',
        'Ask permission before photographing people',
        'Backup photos daily to cloud storage'
      ]
    },
    'cycling-tours': {
      name: 'Cycling Tours',
      tagline: 'Pedal Through Scenic Villages and Coastal Roads',
      icon: '🚴',
      description: 'Pedal through scenic countryside, traditional villages, and coastal paths. Experience local life up close on guided cycling adventures through rice paddies, jungle trails, and historic towns.',
      image: 'zamzam-tours/activities/cycling',
      category: 'Adventure',
      difficulty: 'Moderate',
      duration: '3-5 hours',
      bestTime: 'November to March for cooler weather',
      bestLocations: [
        'Galle Fort and coastal roads',
        'Anuradhapura ancient city',
        'Ella to Bandarawela mountain route',
        'Negombo lagoon area',
        'Village cycling in Cultural Triangle'
      ],
      highlights: [
        'Scenic countryside and villages',
        'Interact with local communities',
        'Visit temples and local markets',
        'Rice paddy trails and back roads',
        'Beach and coastal cycling',
        'Support vehicle for safety'
      ],
      included: [
        'Quality mountain or hybrid bike',
        'Safety helmet and gear',
        'Professional cycling guide',
        'Support vehicle following',
        'Water and refreshments',
        'Lunch at local restaurant'
      ],
      tips: [
        'Wear comfortable athletic clothing',
        'Apply sunscreen and reapply',
        'Bring sunglasses and cap',
        'Moderate fitness level required',
        'Traffic can be chaotic - follow guide',
        'Start early to avoid midday heat'
      ]
    },
    'rock-climbing': {
      name: 'Rock Climbing',
      tagline: 'Scale Ancient Rock Formations and Mountain Cliffs',
      icon: '🧗',
      description: 'Challenge yourself on Sri Lanka\'s unique rock formations. From beginner-friendly climbs to advanced routes, experience climbing with stunning views of tea country and jungle landscapes.',
      image: 'zamzam-tours/activities/rock-climbing',
      category: 'Adventure',
      difficulty: 'Hard',
      duration: '3-4 hours',
      bestTime: 'December to March (dry season)',
      bestLocations: [
        'Ella Rock climbing spots',
        'Riverston Peak area',
        'Knuckles Mountain Range',
        'Bambarakanda Falls area',
        'Indoor climbing walls in Colombo'
      ],
      highlights: [
        'Natural rock faces and boulders',
        'Various difficulty grades available',
        'Professional climbing instructors',
        'All safety equipment provided',
        'Spectacular mountain views',
        'Beginner courses available'
      ],
      included: [
        'All climbing equipment (harness, rope, helmet)',
        'Professional climbing instructor',
        'Safety briefing and training',
        'Belay devices and carabiners',
        'Climbing shoes',
        'First aid kit'
      ],
      tips: [
        'No prior experience needed for beginner routes',
        'Wear athletic clothing',
        'Trim fingernails short',
        'Listen carefully to safety instructions',
        'Build strength with easier climbs first',
        'Don\'t look down if you\'re afraid of heights'
      ]
    },
    'snorkeling': {
      name: 'Snorkeling',
      tagline: 'Float Above Vibrant Coral Reefs and Marine Life',
      icon: '🤿',
      description: 'Float above vibrant coral reefs teeming with tropical fish, sea turtles, and other marine life. Perfect for families and beginners, with calm shallow waters and excellent visibility.',
      image: 'zamzam-tours/activities/snorkeling',
      category: 'Beach',
      difficulty: 'Easy',
      duration: '2-3 hours',
      bestTime: 'West/South: November-April, East: May-September',
      bestLocations: [
        'Pigeon Island, Trincomalee - Marine park',
        'Hikkaduwa Coral Sanctuary',
        'Unawatuna - Sea turtles',
        'Kalpitiya Bar Reef',
        'Pasikudah Bay'
      ],
      highlights: [
        'Colorful coral gardens',
        'Tropical fish varieties',
        'Sea turtles and rays',
        'Clear water (15-20m visibility)',
        'Shallow, calm conditions',
        'Family-friendly activity'
      ],
      included: [
        'Snorkel, mask, and fins',
        'Life jacket if needed',
        'Boat transfer to reef',
        'Snorkeling guide',
        'Underwater photos/videos',
        'Refreshments'
      ],
      tips: [
        'Apply reef-safe sunscreen',
        'Anti-fog solution for mask',
        'Don\'t touch coral or fish',
        'Wear rash guard for sun protection',
        'Practice breathing through snorkel first',
        'Stay close to your group'
      ]
    },
    'temple-visits': {
      name: 'Temple Visits',
      tagline: 'Experience Sacred Buddhist and Hindu Temples',
      icon: '🛕',
      description: 'Visit ancient temples adorned with intricate carvings, Buddha statues, and colorful murals. Witness religious ceremonies and learn about spiritual traditions in this deeply religious island nation.',
      image: 'zamzam-tours/activities/temples',
      category: 'Cultural',
      difficulty: 'Easy',
      duration: '2-4 hours',
      bestTime: 'Year-round, early morning for ceremonies',
      bestLocations: [
        'Temple of the Tooth, Kandy - Most sacred Buddhist temple',
        'Dambulla Cave Temple - Golden temple complex',
        'Gangaramaya Temple, Colombo - Active Buddhist temple',
        'Kelaniya Raja Maha Vihara - Beautiful murals',
        'Nallur Kandaswamy Kovil, Jaffna - Hindu temple'
      ],
      highlights: [
        'Ancient Buddha statues and relics',
        'Colorful religious murals',
        'Evening puja ceremonies',
        'Temple architecture and art',
        'Monks chanting and blessings',
        'Offering flowers and incense'
      ],
      included: [
        'Temple entrance fees',
        'Cultural guide',
        'Appropriate clothing if needed',
        'Ceremony timing information',
        'Cultural etiquette briefing'
      ],
      tips: [
        'Dress modestly - no shorts or sleeveless tops',
        'Remove shoes before entering',
        'Remove hats and sunglasses inside',
        'Be quiet and respectful during ceremonies',
        'Ask before taking photos',
        'Don\'t point feet toward Buddha images'
      ]
    },
    'camping': {
      name: 'Camping & Glamping',
      tagline: 'Sleep Under Stars in Sri Lanka\'s Wilderness',
      icon: '⛺',
      description: 'Sleep under the stars in Sri Lanka\'s wilderness. Experience camping adventures in national parks with campfires and wildlife sounds, or enjoy luxury glamping with all amenities.',
      image: 'zamzam-tours/activities/camping',
      category: 'Adventure',
      difficulty: 'Moderate',
      duration: 'Overnight',
      bestTime: 'December to March (dry season)',
      bestLocations: [
        'Yala National Park - Wildlife camping',
        'Knuckles Mountain Range - Mountain camping',
        'Kumana National Park - Bird watching camps',
        'Horton Plains - High-altitude camping',
        'Kaudulla - Elephant camps'
      ],
      highlights: [
        'Campfire under the stars',
        'Wildlife sounds at night',
        'Bush breakfast experiences',
        'Night safari opportunities',
        'Astronomy in dark sky areas',
        'Luxury glamping options available'
      ],
      included: [
        'Tent and sleeping bag (or glamping tent)',
        'Camping equipment',
        'Meals and campfire cooking',
        'Professional camp guide',
        'Safety briefing',
        'Portable toilets and shower facilities'
      ],
      tips: [
        'Bring insect repellent and antihistamine',
        'Warm clothes for night (can be cool)',
        'Headlamp or flashlight essential',
        'Store food securely from wildlife',
        'Follow camp rules and fire safety',
        'Book permits in advance for national parks'
      ]
    },
    'zip-lining': {
      name: 'Zip-lining',
      tagline: 'Soar Through Forest Canopies and Tea Valleys',
      icon: '🪂',
      description: 'Experience the thrill of flying through the air on zip-lines over tea plantations, forests, and scenic valleys. An adrenaline-pumping adventure with breathtaking aerial views.',
      image: 'zamzam-tours/activities/ziplining',
      category: 'Adventure',
      difficulty: 'Moderate',
      duration: '1-2 hours',
      bestTime: 'Year-round',
      bestLocations: [
        'Ella Flying Ravana Mega Zipline',
        'Nuwara Eliya Adventure Park',
        'Pussellawa Zip Line',
        'Kitulgala Adventure Zone'
      ],
      highlights: [
        'Sri Lanka\'s longest zip-lines (500m+)',
        'Fly over tea plantations',
        'Multiple zip-line courses',
        'Spectacular valley views',
        'Professional safety equipment',
        'Great for thrill-seekers'
      ],
      included: [
        'All safety equipment (harness, helmet, gloves)',
        'Professional instructors',
        'Safety briefing and training',
        'Multiple zip-line runs',
        'Transport to launch points',
        'Certificate of completion'
      ],
      tips: [
        'Wear closed-toe shoes (sneakers)',
        'Secure long hair',
        'Leave valuables in locker',
        'Follow all safety instructions',
        'Don\'t wear loose clothing',
        'GoPro mounts usually available for rent'
      ]
    }
  };

  const activity = slug ? activitiesData[slug as string] : null;

  if (!activity) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h1>Activity not found</h1>
          <Link href="/activities" style={{ color: '#f8b500', fontSize: '1.2rem' }}>
            ← Back to Activities
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleWhatsAppBooking = () => {
    const message = `Hi! I'm interested in booking ${activity.name}. Can you provide more information?`;
    const whatsappUrl = `${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="activity-detail-page">
      <Navbar />

      {/* Hero Section */}
      <section style={{ position: 'relative', height: '60vh', overflow: 'hidden' }}>
        <CldImage
          src={activity.image}
          alt={activity.name}
          width={1920}
          height={1080}
          crop="fill"
          gravity="auto"
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(5,59,60,0.5), rgba(5,59,60,0.8))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          textAlign: 'center',
          padding: '0 20px'
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{activity.icon}</div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '0.3rem', color: '#fff' }}>{activity.name}</h1>
          <p style={{ fontSize: '1.3rem', color: '#f8b500', marginBottom: '1.5rem', maxWidth: '800px' }}>
            {activity.tagline}
          </p>
          
          <div style={{ 
            display: 'flex', 
            gap: '1.2rem', 
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '25px',
              backdropFilter: 'blur(10px)',
              fontSize: '0.95rem'
            }}>
              <strong>Category:</strong> {activity.category}
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '25px',
              backdropFilter: 'blur(10px)',
              fontSize: '0.95rem'
            }}>
              <strong>Duration:</strong> {activity.duration}
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.2)', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '25px',
              backdropFilter: 'blur(10px)',
              fontSize: '0.95rem'
            }}>
              <strong>Difficulty:</strong> {activity.difficulty}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button 
              onClick={handleWhatsAppBooking}
              style={{
                padding: '0.9rem 2rem',
                background: '#f8b500',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'transform 0.3s ease',
                boxShadow: '0 4px 15px rgba(248,181,0,0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Book Now via WhatsApp
            </button>
            <Link 
              href="/activities"
              style={{
                padding: '0.9rem 2rem',
                background: 'rgba(255,255,255,0.2)',
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: '30px',
                fontSize: '1rem',
                fontWeight: '600',
                textDecoration: 'none',
                display: 'inline-block',
                backdropFilter: 'blur(10px)'
              }}
            >
              ← All Activities
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '3rem 5%', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#053b3c', marginBottom: '1.5rem' }}>About This Activity</h2>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#555', marginBottom: '2rem' }}>
            {activity.description}
          </p>
          
          {activity.bestTime && (
            <div style={{
              background: '#f0f8f8',
              padding: '1.5rem',
              borderRadius: '10px',
              borderLeft: '4px solid #f8b500'
            }}>
              <strong style={{ color: '#053b3c', fontSize: '1.1rem' }}>🗓️ Best Time to Visit:</strong>
              <p style={{ marginTop: '0.5rem', color: '#555' }}>{activity.bestTime}</p>
            </div>
          )}
        </div>
      </section>

      {/* Best Locations */}
      {activity.bestLocations && (
        <section style={{ padding: '3rem 5%', background: '#f9f9f9' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', color: '#053b3c', marginBottom: '1.5rem' }}>Best Locations</h2>
            <div style={{ display: 'grid', gap: '0.8rem' }}>
              {activity.bestLocations.map((location: string, index: number) => (
                <div 
                  key={index}
                  style={{
                    background: '#fff',
                    padding: '1rem 1.2rem',
                    borderRadius: '10px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    borderLeft: '4px solid #f8b500'
                  }}
                >
                  <span style={{ fontSize: '1.3rem', marginRight: '0.8rem' }}>📍</span>
                  {location}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Highlights */}
      {activity.highlights && (
        <section style={{ padding: '3rem 5%', background: '#fff' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#053b3c', marginBottom: '2rem' }}>Highlights</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem'
            }}>
              {activity.highlights.map((highlight: string, index: number) => (
                <div 
                  key={index}
                  style={{
                    background: '#f0f8f8',
                    padding: '1.5rem',
                    borderRadius: '10px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>✨</div>
                  <p style={{ color: '#555', lineHeight: '1.6' }}>{highlight}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What's Included */}
      {activity.included && (
        <section style={{ padding: '3rem 5%', background: '#f9f9f9' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', color: '#053b3c', marginBottom: '1.5rem' }}>What's Included</h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '0.8rem'
            }}>
              {activity.included.map((item: string, index: number) => (
                <div 
                  key={index}
                  style={{
                    background: '#fff',
                    padding: '0.9rem 1.2rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <span style={{ fontSize: '1.3rem', color: '#f8b500' }}>✓</span>
                  <span style={{ color: '#555', fontSize: '0.95rem' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Tips Section */}
      {activity.tips && (
        <section style={{ padding: '3rem 5%', background: '#fff' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', color: '#053b3c', marginBottom: '2rem' }}>Tips & Recommendations</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {activity.tips.map((tip: string, index: number) => (
                <div 
                  key={index}
                  style={{
                    background: '#f0f8f8',
                    padding: '1.2rem 1.5rem',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem'
                  }}
                >
                  <span style={{ fontSize: '1.5rem', minWidth: '30px' }}>💡</span>
                  <span style={{ color: '#555', lineHeight: '1.6' }}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section style={{ padding: '3rem 5%', background: '#053b3c', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', color: '#25D366', marginBottom: '0.8rem' }}>
            Ready for an Adventure?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '1.5rem', opacity: 0.9 }}>
            Book your {activity.name} experience with Zamzam Lanka Tours today!
          </p>
          <button 
            onClick={handleWhatsAppBooking}
            style={{
              padding: '1rem 2.5rem',
              background: '#25D366',
              color: '#fff',
              border: 'none',
              borderRadius: '30px',
              fontSize: '1.1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
              boxShadow: '0 4px 15px rgba(37,211,102,0.3)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Contact Us on WhatsApp
          </button>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .activity-detail-page {
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          h1 {
            font-size: 2.5rem !important;
          }
          
          h2 {
            font-size: 2rem !important;
          }
          
          p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityDetailPage;
