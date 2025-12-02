import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import useTranslation from '../../src/i18n/useTranslation';
import BreadcrumbSchema from '../../components/SEO/BreadcrumbSchema';
import ServiceSchema from '../../components/SEO/ServiceSchema';

const ActivitiesPage = () => {
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  const activities = [
    {
      name: t('activities.wildlifeSafaris.name'),
      icon: '🦁',
      description: t('activities.wildlifeSafaris.description'),
      longDescription: t('activities.wildlifeSafaris.longDescription'),
      category: 'Wildlife',
      slug: 'wildlife-safaris',
      image: 'zamzam-tours/activities/wildlife-safari',
      difficulty: t('activities.wildlifeSafaris.difficulty'),
      duration: t('activities.wildlifeSafaris.duration')
    },
    {
      name: t('activities.hikingTrekking.name'),
      icon: '🥾',
      description: t('activities.hikingTrekking.description'),
      longDescription: t('activities.hikingTrekking.longDescription'),
      category: 'Adventure',
      slug: 'hiking-trekking',
      image: 'zamzam-tours/activities/hiking',
      difficulty: t('activities.hikingTrekking.difficulty'),
      duration: t('activities.hikingTrekking.duration')
    },
    {
      name: t('activities.culturalTours.name'),
      icon: '🏛️',
      description: t('activities.culturalTours.description'),
      longDescription: t('activities.culturalTours.longDescription'),
      category: 'Cultural',
      slug: 'cultural-tours',
      image: 'zamzam-tours/activities/cultural-tours',
      difficulty: t('activities.culturalTours.difficulty'),
      duration: t('activities.culturalTours.duration')
    },
    {
      name: t('activities.beachActivities.name'),
      icon: '🏖️',
      description: t('activities.beachActivities.description'),
      longDescription: t('activities.beachActivities.longDescription'),
      category: 'Beach',
      slug: 'beach-activities',
      image: 'zamzam-tours/activities/beach',
      difficulty: t('activities.beachActivities.difficulty'),
      duration: t('activities.beachActivities.duration')
    },
    {
      name: t('activities.teaPlantationTours.name'),
      icon: '🍵',
      description: t('activities.teaPlantationTours.description'),
      longDescription: t('activities.teaPlantationTours.longDescription'),
      category: 'Cultural',
      slug: 'tea-plantation-tours',
      image: 'zamzam-tours/activities/tea-plantation',
      difficulty: t('activities.teaPlantationTours.difficulty'),
      duration: t('activities.teaPlantationTours.duration')
    },
    {
      name: t('activities.whaleWatching.name'),
      icon: '🐋',
      description: t('activities.whaleWatching.description'),
      longDescription: t('activities.whaleWatching.longDescription'),
      category: 'Wildlife',
      slug: 'whale-watching',
      image: 'zamzam-tours/activities/whale-watching',
      difficulty: t('activities.whaleWatching.difficulty'),
      duration: t('activities.whaleWatching.duration')
    },
    {
      name: t('activities.surfing.name'),
      icon: '🏄',
      description: t('activities.surfing.description'),
      longDescription: t('activities.surfing.longDescription'),
      category: 'Adventure',
      slug: 'surfing',
      image: 'zamzam-tours/activities/surfing',
      difficulty: t('activities.surfing.difficulty'),
      duration: t('activities.surfing.duration')
    },
    {
      name: t('activities.scubaDiving.name'),
      icon: '🤿',
      description: t('activities.scubaDiving.description'),
      longDescription: t('activities.scubaDiving.longDescription'),
      category: 'Adventure',
      slug: 'scuba-diving',
      image: 'zamzam-tours/activities/scuba-diving',
      difficulty: t('activities.scubaDiving.difficulty'),
      duration: t('activities.scubaDiving.duration')
    },
    {
      name: t('activities.trainJourneys.name'),
      icon: '🚂',
      description: t('activities.trainJourneys.description'),
      longDescription: t('activities.trainJourneys.longDescription'),
      category: 'Cultural',
      slug: 'train-journeys',
      image: 'zamzam-tours/activities/train-journey',
      difficulty: t('activities.trainJourneys.difficulty'),
      duration: t('activities.trainJourneys.duration')
    },
    {
      name: t('activities.birdWatching.name'),
      icon: '🦜',
      description: t('activities.birdWatching.description'),
      longDescription: t('activities.birdWatching.longDescription'),
      category: 'Wildlife',
      slug: 'bird-watching',
      image: 'zamzam-tours/activities/bird-watching',
      difficulty: t('activities.birdWatching.difficulty'),
      duration: t('activities.birdWatching.duration')
    },
    {
      name: t('activities.whiteWaterRafting.name'),
      icon: '🚣',
      description: t('activities.whiteWaterRafting.description'),
      longDescription: t('activities.whiteWaterRafting.longDescription'),
      category: 'Adventure',
      slug: 'white-water-rafting',
      image: 'zamzam-tours/activities/rafting',
      difficulty: t('activities.whiteWaterRafting.difficulty'),
      duration: t('activities.whiteWaterRafting.duration')
    },
    {
      name: t('activities.ayurvedicSpa.name'),
      icon: '💆',
      description: t('activities.ayurvedicSpa.description'),
      longDescription: t('activities.ayurvedicSpa.longDescription'),
      category: 'Wellness',
      slug: 'ayurvedic-spa',
      image: 'zamzam-tours/activities/ayurveda',
      difficulty: t('activities.ayurvedicSpa.difficulty'),
      duration: t('activities.ayurvedicSpa.duration')
    },
    {
      name: t('activities.cookingClasses.name'),
      icon: '👨‍🍳',
      description: t('activities.cookingClasses.description'),
      longDescription: t('activities.cookingClasses.longDescription'),
      category: 'Cultural',
      slug: 'cooking-classes',
      image: 'zamzam-tours/activities/cooking',
      difficulty: t('activities.cookingClasses.difficulty'),
      duration: t('activities.cookingClasses.duration')
    },
    {
      name: t('activities.photographyTours.name'),
      icon: '📸',
      description: t('activities.photographyTours.description'),
      longDescription: t('activities.photographyTours.longDescription'),
      category: 'Cultural',
      slug: 'photography-tours',
      image: 'zamzam-tours/activities/photography',
      difficulty: t('activities.photographyTours.difficulty'),
      duration: t('activities.photographyTours.duration')
    },
    {
      name: t('activities.cyclingTours.name'),
      icon: '🚴',
      description: t('activities.cyclingTours.description'),
      longDescription: t('activities.cyclingTours.longDescription'),
      category: 'Adventure',
      slug: 'cycling-tours',
      image: 'zamzam-tours/activities/cycling',
      difficulty: t('activities.cyclingTours.difficulty'),
      duration: t('activities.cyclingTours.duration')
    },
    {
      name: t('activities.rockClimbing.name'),
      icon: '🧗',
      description: t('activities.rockClimbing.description'),
      longDescription: t('activities.rockClimbing.longDescription'),
      category: 'Adventure',
      slug: 'rock-climbing',
      image: 'zamzam-tours/activities/rock-climbing',
      difficulty: t('activities.rockClimbing.difficulty'),
      duration: t('activities.rockClimbing.duration')
    },
    {
      name: t('activities.snorkeling.name'),
      icon: '🤿',
      description: t('activities.snorkeling.description'),
      longDescription: t('activities.snorkeling.longDescription'),
      category: 'Beach',
      slug: 'snorkeling',
      image: 'zamzam-tours/activities/snorkeling',
      difficulty: t('activities.snorkeling.difficulty'),
      duration: t('activities.snorkeling.duration')
    },
    {
      name: t('activities.templeVisits.name'),
      icon: '🛕',
      description: t('activities.templeVisits.description'),
      longDescription: t('activities.templeVisits.longDescription'),
      category: 'Cultural',
      slug: 'temple-visits',
      image: 'zamzam-tours/activities/temples',
      difficulty: t('activities.templeVisits.difficulty'),
      duration: t('activities.templeVisits.duration')
    },
    {
      name: t('activities.camping.name'),
      icon: '⛺',
      description: t('activities.camping.description'),
      longDescription: t('activities.camping.longDescription'),
      category: 'Adventure',
      slug: 'camping',
      image: 'zamzam-tours/activities/camping',
      difficulty: t('activities.camping.difficulty'),
      duration: t('activities.camping.duration')
    },
    {
      name: t('activities.zipLining.name'),
      icon: '🪂',
      description: t('activities.zipLining.description'),
      longDescription: t('activities.zipLining.longDescription'),
      category: 'Adventure',
      slug: 'zip-lining',
      image: 'zamzam-tours/activities/ziplining',
      difficulty: t('activities.zipLining.difficulty'),
      duration: t('activities.zipLining.duration')
    }
  ];

  const filteredActivities = activeCategory === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === activeCategory);

  const categories = ['all', 'Adventure', 'Cultural', 'Wildlife', 'Beach', 'Wellness'];

  return (
    <div className="activities-page">
      <Head>
        <title>{t('activities.pageTitle')}</title>
        <meta name="description" content={t('activities.hero.subtitle')} />
      </Head>

      {/* Structured Data Schemas */}
      <BreadcrumbSchema items={[
        { name: 'Home', url: '/' },
        { name: 'Activities', url: '/activities' }
      ]} />
      <ServiceSchema
        name="Sri Lanka Adventure & Cultural Activities"
        description="Experience the best of Sri Lanka with our curated activities including wildlife safaris, cultural tours, beach activities, hiking, and more."
        serviceType="Tourist Activities"
        areaServed={['Sri Lanka', 'Colombo', 'Kandy', 'Ella', 'Yala', 'Sigiriya']}
      />
      
      {/* Hero Section */}
      <section className="hero-section" style={{ position: 'relative', height: '50vh', overflow: 'hidden', background: '#053b3c' }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
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
            <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#f8b500' }}>{t('activities.hero.title')}</h1>
            <p style={{ fontSize: '1.2rem', maxWidth: '700px' }}>
              {t('activities.hero.subtitle')}
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
                <div style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#053b3c' }}>
                    <div style={{ fontSize: '3rem' }}>{activity.icon}</div>
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
                    color: '#053b3c',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'color 0.3s ease'
                  }}>
                    {t('activities.learnMore')} <span>→</span>
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

        /* Large Screen Layouts */
        @media (min-width: 2560px) {
          .activities-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 3rem;
          }

          .hero-content h1 {
            font-size: 5rem !important;
          }
        }

        @media (min-width: 1920px) and (max-width: 2559px) {
          .activities-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .hero-content h1 {
            font-size: 4rem !important;
          }
        }

        @media (min-width: 1440px) and (max-width: 1919px) {
          .activities-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .hero-content h1 {
            font-size: 3.5rem !important;
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .activities-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .hero-content h1 {
            font-size: 3rem !important;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 50vh !important;
          }

          .hero-content h1 {
            font-size: 2rem !important;
            padding: 0 1rem;
          }
          
          .hero-content p {
            font-size: 1.1rem !important;
            padding: 0 1rem;
          }

          .activities-grid {
            grid-template-columns: 1fr !important;
          }

          .activity-card {
            max-width: 100%;
          }

          button, a {
            min-height: 44px;
            padding: 12px 24px;
          }
        }

        @media (max-width: 576px) {
          .hero-content h1 {
            font-size: 1.6rem !important;
          }
          
          .container {
            padding: 0 1rem;
          }

          .activity-card {
            padding: 1.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivitiesPage;
