import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ActivitiesPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const activities = [
    {
      name: 'Wildlife Safaris',
      icon: '🦁',
      description: 'Elephant, leopard and bird watching in national parks',
      longDescription: 'Experience thrilling wildlife safaris in Sri Lanka\'s renowned national parks. Spot elephants, leopards, sloth bears, and diverse bird species in their natural habitats.',
      category: 'Wildlife',
      slug: 'wildlife-safaris',
      image: 'zamzam-tours/activities/wildlife-safari',
      difficulty: 'Easy',
      duration: '3-4 hours'
    },
    {
      name: 'Hiking & Trekking',
      icon: '🥾',
      description: 'Mountain trails and nature walks through stunning landscapes',
      longDescription: 'Trek through misty mountains, rolling tea plantations, and ancient forests. From gentle nature walks to challenging mountain climbs, Sri Lanka offers trails for all levels.',
      category: 'Adventure',
      slug: 'hiking-trekking',
      image: 'zamzam-tours/activities/hiking',
      difficulty: 'Moderate to Hard',
      duration: '2-8 hours'
    },
    {
      name: 'Cultural Tours',
      icon: '🏛️',
      description: 'Ancient temples, forts and historical monuments',
      longDescription: 'Explore Sri Lanka\'s rich cultural heritage through ancient Buddhist temples, colonial forts, and UNESCO World Heritage Sites dating back over 2,000 years.',
      category: 'Cultural',
      slug: 'cultural-tours',
      image: 'zamzam-tours/activities/cultural-tours',
      difficulty: 'Easy',
      duration: 'Full Day'
    },
    {
      name: 'Beach Activities',
      icon: '🏖️',
      description: 'Swimming, surfing, snorkeling and beach relaxation',
      longDescription: 'Enjoy pristine beaches with golden sands, turquoise waters, and perfect waves. Relax under palm trees or engage in exciting water sports along the coast.',
      category: 'Beach',
      slug: 'beach-activities',
      image: 'zamzam-tours/activities/beach',
      difficulty: 'Easy',
      duration: 'Flexible'
    },
    {
      name: 'Tea Plantation Tours',
      icon: '🍵',
      description: 'Visit tea estates and experience Ceylon tea culture',
      longDescription: 'Walk through emerald tea plantations, learn about Ceylon tea production, and enjoy fresh tea tasting sessions with breathtaking mountain views.',
      category: 'Cultural',
      slug: 'tea-plantation-tours',
      image: 'zamzam-tours/activities/tea-plantation',
      difficulty: 'Easy',
      duration: '2-3 hours'
    },
    {
      name: 'Whale Watching',
      icon: '🐋',
      description: 'Witness blue whales and dolphins in their natural habitat',
      longDescription: 'Embark on an unforgettable ocean adventure to see the world\'s largest mammals. Mirissa and Trincomalee offer some of the best whale watching opportunities globally.',
      category: 'Wildlife',
      slug: 'whale-watching',
      image: 'zamzam-tours/activities/whale-watching',
      difficulty: 'Easy',
      duration: '3-4 hours'
    },
    {
      name: 'Surfing',
      icon: '🏄',
      description: 'World-class surf breaks for all skill levels',
      longDescription: 'Ride the waves at renowned surf spots like Arugam Bay, Hikkaduwa, and Weligama. Perfect conditions for beginners and experienced surfers alike.',
      category: 'Adventure',
      slug: 'surfing',
      image: 'zamzam-tours/activities/surfing',
      difficulty: 'Moderate',
      duration: '2-3 hours'
    },
    {
      name: 'Scuba Diving',
      icon: '🤿',
      description: 'Explore vibrant coral reefs and underwater shipwrecks',
      longDescription: 'Dive into crystal-clear waters to discover colorful coral reefs, tropical fish, and fascinating shipwrecks. Sri Lanka\'s east and south coasts offer world-class diving sites.',
      category: 'Adventure',
      slug: 'scuba-diving',
      image: 'zamzam-tours/activities/scuba-diving',
      difficulty: 'Moderate',
      duration: '3-4 hours'
    },
    {
      name: 'Train Journeys',
      icon: '🚂',
      description: 'Scenic train rides through tea country and hill stations',
      longDescription: 'Experience one of the world\'s most scenic train journeys from Kandy to Ella, passing through misty mountains, tea estates, and stunning viaducts.',
      category: 'Cultural',
      slug: 'train-journeys',
      image: 'zamzam-tours/activities/train-journey',
      difficulty: 'Easy',
      duration: '6-7 hours'
    },
    {
      name: 'Bird Watching',
      icon: '🦜',
      description: 'Spot endemic and migratory bird species',
      longDescription: 'Sri Lanka is home to over 400 bird species, including 33 endemic species. Explore wetlands, forests, and national parks with expert ornithologists.',
      category: 'Wildlife',
      slug: 'bird-watching',
      image: 'zamzam-tours/activities/bird-watching',
      difficulty: 'Easy',
      duration: '3-5 hours'
    },
    {
      name: 'White Water Rafting',
      icon: '🚣',
      description: 'Thrilling rapids on Kelani River and other waterways',
      longDescription: 'Navigate exciting rapids through lush jungle landscapes. Kitulgala on the Kelani River offers the best white water rafting experiences in Sri Lanka.',
      category: 'Adventure',
      slug: 'white-water-rafting',
      image: 'zamzam-tours/activities/rafting',
      difficulty: 'Hard',
      duration: '2-3 hours'
    },
    {
      name: 'Ayurvedic Spa',
      icon: '💆',
      description: 'Traditional healing treatments and wellness therapies',
      longDescription: 'Rejuvenate with ancient Ayurvedic treatments, herbal massages, and wellness therapies. Experience holistic healing at authentic Ayurvedic centers.',
      category: 'Wellness',
      slug: 'ayurvedic-spa',
      image: 'zamzam-tours/activities/ayurveda',
      difficulty: 'Easy',
      duration: '1-3 hours'
    },
    {
      name: 'Cooking Classes',
      icon: '👨‍🍳',
      description: 'Learn authentic Sri Lankan cuisine and spices',
      longDescription: 'Master the art of Sri Lankan cooking with hands-on classes. Learn to prepare curries, hoppers, and other local delicacies using fresh spices.',
      category: 'Cultural',
      slug: 'cooking-classes',
      image: 'zamzam-tours/activities/cooking',
      difficulty: 'Easy',
      duration: '2-3 hours'
    },
    {
      name: 'Photography Tours',
      icon: '📸',
      description: 'Capture stunning landscapes and wildlife',
      longDescription: 'Join professional photographers to capture Sri Lanka\'s breathtaking landscapes, wildlife, and cultural scenes. Perfect for all photography skill levels.',
      category: 'Cultural',
      slug: 'photography-tours',
      image: 'zamzam-tours/activities/photography',
      difficulty: 'Easy',
      duration: 'Full Day'
    },
    {
      name: 'Cycling Tours',
      icon: '🚴',
      description: 'Bike through villages, rice paddies and coastal roads',
      longDescription: 'Pedal through scenic countryside, traditional villages, and coastal paths. Experience local life up close on guided cycling adventures.',
      category: 'Adventure',
      slug: 'cycling-tours',
      image: 'zamzam-tours/activities/cycling',
      difficulty: 'Moderate',
      duration: '3-5 hours'
    },
    {
      name: 'Rock Climbing',
      icon: '🧗',
      description: 'Scale ancient rock formations and mountain cliffs',
      longDescription: 'Challenge yourself on Sri Lanka\'s unique rock formations. From beginner-friendly climbs to advanced routes, experience climbing with stunning views.',
      category: 'Adventure',
      slug: 'rock-climbing',
      image: 'zamzam-tours/activities/rock-climbing',
      difficulty: 'Hard',
      duration: '3-4 hours'
    },
    {
      name: 'Snorkeling',
      icon: '🤿',
      description: 'Discover colorful marine life in crystal clear waters',
      longDescription: 'Float above vibrant coral reefs teeming with tropical fish, sea turtles, and other marine life. Perfect for families and beginners.',
      category: 'Beach',
      slug: 'snorkeling',
      image: 'zamzam-tours/activities/snorkeling',
      difficulty: 'Easy',
      duration: '2-3 hours'
    },
    {
      name: 'Temple Visits',
      icon: '🛕',
      description: 'Experience sacred Buddhist and Hindu temples',
      longDescription: 'Visit ancient temples adorned with intricate carvings, Buddha statues, and colorful murals. Witness religious ceremonies and learn about spiritual traditions.',
      category: 'Cultural',
      slug: 'temple-visits',
      image: 'zamzam-tours/activities/temples',
      difficulty: 'Easy',
      duration: '2-4 hours'
    },
    {
      name: 'Camping',
      icon: '⛺',
      description: 'Overnight camping in national parks and wilderness',
      longDescription: 'Sleep under the stars in Sri Lanka\'s wilderness. Experience camping adventures in national parks with campfires and wildlife sounds.',
      category: 'Adventure',
      slug: 'camping',
      image: 'zamzam-tours/activities/camping',
      difficulty: 'Moderate',
      duration: 'Overnight'
    },
    {
      name: 'Zip-lining',
      icon: '🪂',
      description: 'Soar through forest canopies and mountain valleys',
      longDescription: 'Experience the thrill of flying through the air on zip-lines over tea plantations, forests, and scenic valleys. An adrenaline-pumping adventure.',
      category: 'Adventure',
      slug: 'zip-lining',
      image: 'zamzam-tours/activities/ziplining',
      difficulty: 'Moderate',
      duration: '1-2 hours'
    }
  ];

  const filteredActivities = activeCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === activeCategory);

  const categories = ['all', 'Adventure', 'Cultural', 'Wildlife', 'Beach', 'Wellness'];

  return (
    <div className="activities-page">
      
      {/* Hero Section */}
      <section className="hero-section" style={{ position: 'relative', height: '50vh', overflow: 'hidden' }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            top: 0,
            left: 0
          }}
        >
          <source src="/videos/srilanka-hero.mp4" type="video/mp4" />
        </video>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(5, 59, 60, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          color: 'white',
          textAlign: 'center',
          padding: '0 20px'
        }}>
          {/* Navbar inside hero for consistent layout with other pages */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 3 }}>
            <Navbar />
          </div>

          <div style={{ marginTop: '64px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#f8b500' }}>Things to Do in Sri Lanka</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '700px' }}>
              Discover exciting activities and unforgettable experiences across the island
            </p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section style={{ padding: '2rem 5%', background: '#f9f9f9' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '2rem'
          }}>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                style={{
                  padding: '0.6rem 1.3rem',
                  border: 'none',
                  borderRadius: '25px',
                  background: activeCategory === category ? '#f8b500' : '#fff',
                  color: activeCategory === category ? '#fff' : '#053b3c',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  textTransform: 'capitalize',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Activities Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredActivities.map((activity, index) => (
              <Link 
                href={`/activities/${activity.slug}`}
                key={index}
                style={{
                  background: '#fff',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  textDecoration: 'none',
                  color: 'inherit'
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
                <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(5,59,60,0.04), rgba(248,181,0,0.04))' }}>
                    <div style={{ fontSize: '3rem' }}>{activity.icon}</div>
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#f8b500',
                      color: '#fff',
                      padding: '0.3rem 0.7rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {activity.category}
                    </div>
                  </div>
                
                  <div style={{ padding: '1.2rem' }}>
                  <h3 style={{ 
                    fontSize: '1.3rem', 
                    marginBottom: '0.5rem',
                    color: '#053b3c'
                  }}>
                    {activity.name}
                  </h3>
                  <p style={{ 
                    color: '#666', 
                    marginBottom: '0.8rem',
                    lineHeight: '1.5',
                    fontSize: '0.95rem'
                  }}>
                    {activity.description}
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '1rem',
                    marginBottom: '0.8rem',
                    fontSize: '0.85rem',
                    color: '#888'
                  }}>
                    <span>⏱️ {activity.duration}</span>
                    <span>📊 {activity.difficulty}</span>
                  </div>
                  
                  <div style={{
                    color: '#f8b500',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    Learn More <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .activities-page {
          min-height: 100vh;
        }

        @media (max-width: 768px) {
          .hero-section h1 {
            font-size: 2rem !important;
          }
          
          .hero-section p {
            font-size: 1.1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivitiesPage;
