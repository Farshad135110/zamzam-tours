// pages/about/index.js - About Us Page
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function About() {
  const [activeTab, setActiveTab] = useState('story');
  const [counterValues, setCounterValues] = useState({
    travelers: 0,
    tours: 0,
    destinations: 0,
    years: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  // Company milestones
  const milestones = [
    {
      year: '2010',
      title: 'Humble Beginnings',
      description: 'Started with just 2 vehicles and a dream to showcase Sri Lanka\'s beauty',
      icon: '🚗'
    },
    {
      year: '2012',
      title: 'First International Clients',
      description: 'Welcomed our first European tour groups, specializing in cultural experiences',
      icon: '🌍'
    },
    {
      year: '2015',
      title: 'Fleet Expansion',
      description: 'Expanded our vehicle fleet to include luxury vans and buses for larger groups',
      icon: '🚐'
    },
    {
      year: '2018',
      title: 'Award Recognition',
      description: 'Received "Best Tour Operator" award from Sri Lanka Tourism Development Authority',
      icon: '🏆'
    },
    {
      year: '2020',
      title: 'Digital Transformation',
      description: 'Launched comprehensive online booking system and mobile-friendly services',
      icon: '📱'
    },
    {
      year: '2023',
      title: 'Sustainable Tourism',
      description: 'Partnered with local communities for eco-friendly and responsible tourism',
      icon: '🌱'
    }
  ];

  // Team members
  const teamMembers = [
    {
      name: 'Mohamed Zamzam',
      position: 'Founder & CEO',
      experience: '15+ years in tourism',
      specialization: 'Cultural Tours & Operations',
      image: '/team/zamzam-founder.jpg',
      quote: 'Our mission is to create unforgettable Sri Lankan experiences that connect people with our rich culture and natural beauty.',
      social: { linkedin: '#', email: 'zamzam@zamzamtours.com' }
    },
    {
      name: 'Sarah Perera',
      position: 'Head of European Operations',
      experience: '12 years in hospitality',
      specialization: 'European Market & Luxury Travel',
      image: '/team/sarah-operations.jpg',
      quote: 'We understand European travelers\' expectations and deliver exceptional service that exceeds them.',
      social: { linkedin: '#', email: 'sarah@zamzamtours.com' }
    },
    {
      name: 'James Fernando',
      position: 'Tour Experience Manager',
      experience: '10 years as tour guide',
      specialization: 'Adventure & Wildlife Tours',
      image: '/team/james-tours.jpg',
      quote: 'Every tour is crafted to provide authentic experiences while ensuring comfort and safety.',
      social: { linkedin: '#', email: 'james@zamzamtours.com' }
    },
    {
      name: 'Lisa Chen',
      position: 'Customer Relations Manager',
      experience: '8 years in customer service',
      specialization: 'Client Satisfaction & Support',
      image: '/team/lisa-customer.jpg',
      quote: 'We treat every client like family, ensuring their journey with us is seamless from start to finish.',
      social: { linkedin: '#', email: 'lisa@zamzamtours.com' }
    }
  ];

  // Values and principles
  const values = [
    {
      icon: '🤝',
      title: 'Trust & Reliability',
      description: 'We build long-term relationships based on trust, delivering exactly what we promise every time.'
    },
    {
      icon: '🎯',
      title: 'Personalized Service',
      description: 'Every itinerary is customized to match your preferences, pace, and travel style.'
    },
    {
      icon: '🌱',
      title: 'Sustainable Tourism',
      description: 'We support local communities and promote eco-friendly practices in all our operations.'
    },
    {
      icon: '⭐',
      title: 'Quality Excellence',
      description: 'From vehicles to guides, we maintain the highest standards to ensure your comfort and satisfaction.'
    },
    {
      icon: '💝',
      title: 'Cultural Respect',
      description: 'We help you experience Sri Lankan culture authentically while respecting local traditions.'
    },
    {
      icon: '🛡️',
      title: 'Safety First',
      description: 'Your safety is our top priority, with well-maintained vehicles and experienced professionals.'
    }
  ];

  // Certifications and awards
  const certifications = [
    {
      name: 'SLTDA Registered',
      issuer: 'Sri Lanka Tourism Development Authority',
      year: '2010',
      image: '/certifications/sltda.png'
    },
    {
      name: 'Best Tour Operator 2022',
      issuer: 'Sri Lanka Tourism Awards',
      year: '2022',
      image: '/certifications/tourism-award.png'
    },
    {
      name: 'Sustainable Tourism Partner',
      issuer: 'Green Globe Certification',
      year: '2021',
      image: '/certifications/green-globe.png'
    },
    {
      name: 'Quality Service Excellence',
      issuer: 'Sri Lanka Chamber of Tourism',
      year: '2023',
      image: '/certifications/quality-service.png'
    }
  ];

  // Counter animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounters();
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const startCounters = () => {
    const targets = {
      travelers: 12500,
      tours: 4800,
      destinations: 48,
      years: 13
    };

    const duration = 2000;
    const steps = 60;
    const step = duration / steps;

    (Object.keys(targets) as Array<keyof typeof targets>).forEach(key => {
      let current = 0;
      const increment = targets[key] / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= targets[key]) {
          current = targets[key];
          clearInterval(timer);
        }
        setCounterValues(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }));
      }, step);
    });
  };

  return (
    <>
      <Head>
        <title>About Zamzam Tours | Sri Lanka's Premier Tour Operator Since 2010</title>
        <meta name="description" content="Learn about Zamzam Tours' journey, team, values, and commitment to providing exceptional travel experiences in Sri Lanka since 2010." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="about-hero" style={{ marginTop: '80px' }}>
        <div className="hero-background">
          <Image 
            src="/about/hero-about.jpg" 
            alt="Zamzam Tours Team" 
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <div className="hero-text">
            <h1>Creating Unforgettable Sri Lankan Journeys Since 2010</h1>
            <p>From humble beginnings to becoming Sri Lanka's trusted travel partner, we've been crafting authentic experiences that connect travelers with the soul of our beautiful island.</p>
          </div>
          
          <div className="hero-stats-preview">
            <div className="stat-preview">
              <span className="number">13+</span>
              <span className="label">Years Experience</span>
            </div>
            <div className="stat-preview">
              <span className="number">12.5K+</span>
              <span className="label">Happy Travelers</span>
            </div>
            <div className="stat-preview">
              <span className="number">48</span>
              <span className="label">Destinations</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="story-mission">
        <div className="container">
          <div className="section-tabs">
            <button 
              className={`tab ${activeTab === 'story' ? 'active' : ''}`}
              onClick={() => setActiveTab('story')}
            >
              Our Story
            </button>
            <button 
              className={`tab ${activeTab === 'mission' ? 'active' : ''}`}
              onClick={() => setActiveTab('mission')}
            >
              Mission & Vision
            </button>
            <button 
              className={`tab ${activeTab === 'approach' ? 'active' : ''}`}
              onClick={() => setActiveTab('approach')}
            >
              Our Approach
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'story' && (
              <div className="content-story">
                <div className="story-text">
                  <h2>From Local Passion to Premier Tour Operator</h2>
                  <p>
                    Founded in 2010 by Mohamed Zamzam, our journey began with a simple Toyota car and a big dream: 
                    to share the authentic beauty of Sri Lanka with the world. What started as a small transfer service 
                    has grown into a comprehensive tour operation trusted by thousands of international travelers.
                  </p>
                  <p>
                    We've remained true to our roots while expanding our services. Our deep local knowledge, combined 
                    with understanding international travelers' needs, allows us to create experiences that are both 
                    authentic and comfortable.
                  </p>
                  <div className="story-highlights">
                    <div className="highlight">
                      <span className="icon">🚗</span>
                      <span>Started with just 2 vehicles</span>
                    </div>
                    <div className="highlight">
                      <span className="icon">🌍</span>
                      <span>Now serving travelers from 30+ countries</span>
                    </div>
                    <div className="highlight">
                      <span className="icon">⭐</span>
                      <span>98% customer satisfaction rate</span>
                    </div>
                  </div>
                </div>
                <div className="story-image">
                  <Image 
                    src="/about/founder-story.jpg" 
                    alt="Founder Story" 
                    width={500}
                    height={400}
                    objectFit="cover"
                  />
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="content-mission">
                <div className="mission-cards">
                  <div className="mission-card">
                    <h3>Our Mission</h3>
                    <p>
                      To provide exceptional, personalized travel experiences that showcase the true essence of Sri Lanka 
                      while maintaining the highest standards of service, safety, and sustainability.
                    </p>
                  </div>
                  <div className="mission-card">
                    <h3>Our Vision</h3>
                    <p>
                      To be Sri Lanka's most trusted and innovative tour operator, recognized for creating meaningful 
                      connections between travelers and local culture while driving positive impact in our communities.
                    </p>
                  </div>
                </div>
                <div className="mission-values">
                  <h3>What Drives Us</h3>
                  <ul>
                    <li>✅ Authentic cultural experiences</li>
                    <li>✅ Uncompromising safety standards</li>
                    <li>✅ Sustainable tourism practices</li>
                    <li>✅ Personalized service excellence</li>
                    <li>✅ Local community empowerment</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'approach' && (
              <div className="content-approach">
                <div className="approach-steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <div className="step-content">
                      <h4>Personalized Planning</h4>
                      <p>We listen to your preferences and craft custom itineraries that match your travel style</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>Local Expertise</h4>
                      <p>Our deep local knowledge ensures you experience authentic Sri Lanka beyond the tourist trails</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>Seamless Execution</h4>
                      <p>From airport pickup to departure, every detail is managed for a hassle-free experience</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>Continuous Support</h4>
                      <p>24/7 assistance throughout your journey ensures peace of mind and immediate problem-solving</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Counter Section */}
      <section className="counter-section" ref={counterRef}>
        <div className="container">
          <div className="counters-grid">
            <div className="counter-item">
              <span className="counter-number">{counterValues.travelers}+</span>
              <span className="counter-label">Happy Travelers</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">{counterValues.tours}+</span>
              <span className="counter-label">Tours Completed</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">{counterValues.destinations}</span>
              <span className="counter-label">Destinations</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">{counterValues.years}+</span>
              <span className="counter-label">Years Experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Values & Principles</h2>
            <p>The foundation of everything we do at Zamzam Tours</p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>Meet Our Expert Team</h2>
            <p>Passionate professionals dedicated to making your Sri Lankan journey unforgettable</p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="member-image">
                  <Image 
                    src={member.image} 
                    alt={member.name}
                    width={300}
                    height={350}
                    objectFit="cover"
                  />
                  <div className="member-overlay">
                    <div className="social-links">
                      <a href={member.social.linkedin} aria-label="LinkedIn">💼</a>
                      <a href={`mailto:${member.social.email}`} aria-label="Email">✉️</a>
                    </div>
                  </div>
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="position">{member.position}</p>
                  <p className="experience">{member.experience}</p>
                  <p className="specialization">{member.specialization}</p>
                  <p className="quote">"{member.quote}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Journey Through the Years</h2>
            <p>Milestones that shaped Zamzam Tours into Sri Lanka's trusted travel partner</p>
          </div>

          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <div className="timeline-icon">{milestone.icon}</div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="certifications-section">
        <div className="container">
          <div className="section-header">
            <h2>Certifications & Recognition</h2>
            <p>Official recognition of our commitment to quality and excellence</p>
          </div>

          <div className="certifications-grid">
            {certifications.map((cert, index) => (
              <div key={index} className="certification-card">
                <div className="cert-image">
                  <Image 
                    src={cert.image} 
                    alt={cert.name}
                    width={100}
                    height={100}
                    objectFit="contain"
                  />
                </div>
                <div className="cert-info">
                  <h3>{cert.name}</h3>
                  <p className="issuer">{cert.issuer}</p>
                  <p className="year">{cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Sri Lanka with Us?</h2>
            <p>Join thousands of satisfied travelers who have discovered the magic of Sri Lanka through our expert guidance</p>
            <div className="cta-buttons">
              <Link href="/contact" className="btn-primary">
                Start Planning Your Trip
              </Link>
              <button 
                className="btn-secondary"
                onClick={() => {
                  const message = "Hello Zamzam Tours! I'd like to learn more about your company and services.";
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`https://wa.me/94766135110?text=${encodedMessage}`, '_blank');
                }}
              >
                Chat with Our Team
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* About Page Specific Styles */
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
        .about-hero {
          position: relative;
          height: 72vh;
          min-height: 520px;
          display: flex;
          align-items: center;
          color: white;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%);
        }

        .hero-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          width: 100%;
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .hero-text h1 {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          text-shadow: 0 6px 30px rgba(3,20,20,0.6);
        }

        .hero-text p {
          font-size: 1.3rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        .hero-stats-preview {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .stat-preview {
          text-align: center;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .stat-preview .number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .stat-preview .label {
          font-size: 1rem;
          opacity: 0.9;
        }

        /* Story & Mission Section */
        .story-mission {
          padding: 5rem 0;
          background: var(--section-bg);
        }

        .section-tabs {
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
          border-bottom: 2px solid var(--border-color);
        }

        .section-tabs .tab {
          padding: 1rem 2rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-light);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .section-tabs .tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
        }

        .section-tabs .tab:hover {
          color: var(--primary-color);
        }

        .tab-content {
          max-width: 1000px;
          margin: 0 auto;
        }

        .content-story {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .story-text h2 {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
        }

        .story-text p {
          color: var(--text-light);
          line-height: 1.7;
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .story-highlights {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 2rem;
        }

        .highlight {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .highlight .icon {
          font-size: 1.5rem;
        }

        .content-mission {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        .mission-cards {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .mission-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .mission-card h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .mission-card p {
          color: var(--text-light);
          line-height: 1.6;
        }

        .mission-values h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .mission-values ul {
          list-style: none;
          padding: 0;
        }

        .mission-values li {
          padding: 0.8rem 0;
          border-bottom: 1px solid var(--border-color);
          color: var(--text-light);
        }

        .content-approach {
          max-width: 800px;
          margin: 0 auto;
        }

        .approach-steps {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .step {
          display: flex;
          gap: 2rem;
          align-items: flex-start;
        }

        .step-number {
          width: 60px;
          height: 60px;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        .step-content h4 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-size: 1.3rem;
        }

        .step-content p {
          color: var(--text-light);
          line-height: 1.6;
        }

        /* Counter Section */
        .counter-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
        }

        .counters-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          text-align: center;
        }

        .counter-item {
          padding: 2rem;
        }

        .counter-number {
          display: block;
          font-size: 3rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0.5rem;
        }

        .counter-label {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        /* Values Section */
        .values-section {
          padding: 5rem 0;
        }

        .values-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .value-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
        }

        .value-card:hover {
          transform: translateY(-5px);
        }

        .value-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
        }

        .value-card h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }

        .value-card p {
          color: var(--text-light);
          line-height: 1.6;
        }

        /* Team Section */
        .team-section {
          padding: 5rem 0;
          background: var(--section-bg);
        }

        .team-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .team-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
        }

        .team-card:hover {
          transform: translateY(-5px);
        }

        .member-image {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .member-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(5, 59, 60, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .team-card:hover .member-overlay {
          opacity: 1;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-links a {
          width: 50px;
          height: 50px;
          background: var(--secondary-color);
          color: var(--text-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .social-links a:hover {
          background: #ffd700;
          transform: scale(1.1);
        }

        .member-info {
          padding: 2rem;
        }

        .member-info h3 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-size: 1.4rem;
        }

        .position {
          color: var(--secondary-color);
          font-weight: 600;
          margin-bottom: 0.3rem;
        }

        .experience {
          color: var(--text-light);
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
        }

        .specialization {
          color: var(--primary-color);
          font-weight: 600;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .quote {
          color: var(--text-light);
          font-style: italic;
          line-height: 1.6;
          border-left: 3px solid var(--secondary-color);
          padding-left: 1rem;
        }

        /* Timeline Section */
        .timeline-section {
          padding: 5rem 0;
        }

        .timeline {
          position: relative;
          max-width: 1000px;
          margin: 3rem auto 0;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          height: 100%;
          background: var(--primary-color);
        }

        .timeline-item {
          position: relative;
          margin-bottom: 3rem;
          width: 45%;
        }

        .timeline-item.left {
          left: 0;
        }

        .timeline-item.right {
          left: 55%;
        }

        .timeline-content {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          position: relative;
        }

        .timeline-year {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary-color);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .timeline-icon {
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .timeline-content h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .timeline-content p {
          color: var(--text-light);
          line-height: 1.6;
        }

        /* Certifications Section */
        .certifications-section {
          padding: 5rem 0;
          background: var(--section-bg);
        }

        .certifications-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .certification-card {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }

        .cert-image {
          flex-shrink: 0;
        }

        .cert-info h3 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .issuer {
          color: var(--text-light);
          margin-bottom: 0.3rem;
          font-weight: 600;
        }

        .year {
          color: var(--secondary-color);
          font-weight: 600;
        }

        /* CTA Section */
        .about-cta {
          padding: 5rem 0;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.2rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }

          .hero-stats-preview {
            flex-direction: row;
            justify-content: center;
          }

          .content-story,
          .content-mission {
            grid-template-columns: 1fr;
          }

          .values-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .team-grid {
            grid-template-columns: 1fr;
          }

          .counters-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .certifications-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .hero-text h1 {
            font-size: 2.5rem;
          }

          .section-tabs {
            flex-direction: column;
            align-items: center;
          }

          .timeline::before {
            left: 30px;
          }

          .timeline-item {
            width: calc(100% - 60px);
            left: 60px !important;
          }

          .timeline-year {
            left: -75px;
            transform: none;
          }

          .step {
            flex-direction: column;
            text-align: center;
          }

          .hero-stats-preview {
            flex-direction: column;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }

        @media (max-width: 576px) {
          .hero-text h1 {
            font-size: 2rem;
          }

          .values-grid {
            grid-template-columns: 1fr;
          }

          .counters-grid {
            grid-template-columns: 1fr;
          }

          .mission-cards {
            gap: 1rem;
          }

          .mission-card {
            padding: 1.5rem;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}