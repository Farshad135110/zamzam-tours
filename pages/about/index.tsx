// pages/about/index.js - About Us Page
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CONTACT_INFO } from '../../src/constants/config';
import useTranslation from '../../src/i18n/useTranslation'

export default function About() {
  const [activeTab, setActiveTab] = useState('mission');
  const [counterValues, setCounterValues] = useState({
    travelers: 0,
    tours: 0,
    destinations: 0,
    years: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);
  const { t } = useTranslation()

  // helper to return fallback when a translation key is missing
  const get = (key: string, fallback: string) => {
    const val = t(key)
    return val === key ? fallback : val
  }

  // (timeline removed per request)

  // Team members — only founder kept per request
  const teamMembers = [
    {
      name: 'Mohamed Zamzam',
      position: 'Founder & CEO',
      experience: '15+ years in tourism',
      specialization: 'Cultural Tours & Operations',
      image: '/team/zamzam-founder.jpg',
      quote: 'Our mission is to create unforgettable Sri Lankan experiences that connect people with our rich culture and natural beauty.',
      social: { linkedin: '#', email: 'zamzam@zamzamtours.com' }
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

  // certifications removed per request

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
        <title>{t('about.pageTitle')}</title>
        <meta name="description" content={t('about.metaDescription')} />
      </Head>

  <Navbar />

  {/* Hero Section */}
  <section className="about-hero">
        <div className="hero-background">
          <Image 
            src="/about/hero-about.jpg" 
            alt="Zamzam Lanka Tours Team" 
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="hero-overlay"></div>
        </div>
        
  <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">{t('about.hero.title.prefix')} <span style={{ color: 'var(--secondary-color)' }}>{t('about.hero.title.highlight')}</span> {t('about.hero.title.suffix')}</h1>
            <p className="hero-subtitle">{t('about.hero.subtitle')}</p>
          </div>

          <div className="hero-stats-preview">
            <div className="stat-preview">
              <span className="number">13+</span>
              <span className="label">{t('about.stats.yearsLabel')}</span>
            </div>
            <div className="stat-preview">
              <span className="number">12.5K+</span>
              <span className="label">{t('about.stats.travelersLabel')}</span>
            </div>
            <div className="stat-preview">
              <span className="number">48</span>
              <span className="label">{t('about.stats.destinationsLabel')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story & Mission Section */}
      <section className="story-mission">
        <div className="container">
          <div className="section-tabs">
            <button 
              className={`tab ${activeTab === 'mission' ? 'active' : ''}`}
              onClick={() => setActiveTab('mission')}
            >
              {t('about.tabs.mission')}
            </button>
            <button 
              className={`tab ${activeTab === 'approach' ? 'active' : ''}`}
              onClick={() => setActiveTab('approach')}
            >
              {t('about.tabs.approach')}
            </button>
          </div>

          <div className="tab-content">

            {activeTab === 'mission' && (
              <div className="content-mission">
                <div className="mission-cards">
                  <div className="mission-card">
                      <h3>{t('about.mission.ourMission.title')}</h3>
                      <p>{t('about.mission.ourMission.paragraph')}</p>
                    </div>
                    <div className="mission-card">
                      <h3>{t('about.mission.ourVision.title')}</h3>
                      <p>{t('about.mission.ourVision.paragraph')}</p>
                    </div>
                </div>
                <div className="mission-values">
                    <h3>{t('about.mission.valuesTitle')}</h3>
                    <ul>
                      <li>{t('about.mission.values.item1')}</li>
                      <li>{t('about.mission.values.item2')}</li>
                      <li>{t('about.mission.values.item3')}</li>
                      <li>{t('about.mission.values.item4')}</li>
                      <li>{t('about.mission.values.item5')}</li>
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
                      <h4>{t('about.approach.step1.title')}</h4>
                      <p>{t('about.approach.step1.text')}</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <div className="step-content">
                      <h4>{t('about.approach.step2.title')}</h4>
                      <p>{t('about.approach.step2.text')}</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <div className="step-content">
                      <h4>{t('about.approach.step3.title')}</h4>
                      <p>{t('about.approach.step3.text')}</p>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-number">4</div>
                    <div className="step-content">
                      <h4>{t('about.approach.step4.title')}</h4>
                      <p>{t('about.approach.step4.text')}</p>
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
              <span className="counter-label">{t('about.stats.travelersLabel')}</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">{counterValues.tours}+</span>
              <span className="counter-label">{t('about.stats.toursLabel') /* fallback: Tours Completed */}</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">{counterValues.destinations}</span>
              <span className="counter-label">{t('about.stats.destinationsLabel')}</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">{counterValues.years}+</span>
              <span className="counter-label">{t('about.stats.yearsLabel')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('about.values.title')}</h2>
            <p>{t('about.values.subtitle')}</p>
          </div>

          <div className="values-grid">
            {values.map((value, index) => (
              <div key={index} className="value-card">
                <div className="value-icon">{value.icon}</div>
                <h3>{t(`about.values.items.${index}.title`)}</h3>
                <p>{t(`about.values.items.${index}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <div className="section-header">
            <h2>{t('about.team.title')}</h2>
            <p>{t('about.team.subtitle')}</p>
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
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
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
                  <p className="position">{get('about.team.members.0.position', member.position)}</p>
                  <p className="experience">{get('about.team.members.0.experience', member.experience)}</p>
                  <p className="specialization">{get('about.team.members.0.specialization', member.specialization)}</p>
                  <p className="quote">"{get('about.team.members.0.quote', member.quote)}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline and Certifications removed per request */}

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>{t('about.cta.title')}</h2>
            <p>{t('about.cta.subtitle')}</p>
            <div className="cta-buttons">
              <Link
                href="/contact"
                className="btn btn-primary"
                style={{ backgroundColor: 'var(--secondary-color)', color: 'var(--text-color)' }}
              >
                {t('about.cta.startPlanning')}
              </Link>
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  const message = "Hello Zamzam Lanka Tours! I'd like to learn more about your company and services.";
                  const encodedMessage = encodeURIComponent(message);
                  window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodedMessage}`, '_blank');
                }}
              >
                {t('about.cta.chat')}
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
          justify-content: center; /* center horizontally like homepage */
          color: white;
          overflow: hidden;
          padding-top: 72px; /* leave gap from fixed navbar */
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
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px; /* match homepage hero container */
          width: 100%;
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.6rem;
          align-items: center;
          text-align: center; /* center text like homepage */
        }

        /* make sure hero heading matches homepage scale and spacing */
        .hero-title {
          margin: 0 auto 0.6rem auto;
          line-height: 1.06; /* reduce big gap between heading lines */
        }

        .hero-subtitle {
          margin: 0 auto;
          opacity: 0.95;
        }

        /* use global .hero-title and .hero-subtitle for consistent sizing */

        .hero-stats-preview {
          display: flex;
          flex-direction: row;
          gap: 1rem;
          align-items: center;
          justify-content: center; /* center the stat blocks under the hero */
          flex-wrap: wrap;
          margin-top: 0.8rem;
        }

        .stat-preview {
          text-align: center;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(6px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.12);
          min-width: 100px;
        }

        .stat-preview .number {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--secondary-color);
          margin-bottom: 0.25rem;
        }

        .stat-preview .label {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        /* Story & Mission Section */
        .story-mission {
          padding: 5rem 0;
          background: var(--section-bg);
        }

        /* Section Headers - match other pages */
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
          /* center a single card and keep consistent size */
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 2rem;
          margin-top: 3rem;
          flex-wrap: wrap;
        }

        .team-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
          width: 360px; /* fixed block size so it stays consistent and centered */
          max-width: 100%;
          margin: 0 auto;
        }

        .team-card:hover {
          transform: translateY(-5px);
        }

        .member-image {
          position: relative;
          height: 300px;
          overflow: hidden;
          margin: 0 auto; /* center image container */
          width: 100%;
          max-width: 320px;
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
          text-align: center; /* center member text */
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

        /* Match homepage CTA colors: gold primary, white-outline secondary */
        .about-cta .btn-primary {
          background-color: var(--secondary-color);
          color: var(--text-color);
        }

        .about-cta .btn-primary:hover {
          background-color: #e6a500;
        }

        .about-cta .btn-secondary {
          border-color: white;
          color: white;
          background-color: transparent;
        }

        .about-cta .btn-secondary:hover {
          background-color: white;
          color: var(--primary-color);
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
          .hero-title {
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
          .hero-title {
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