// pages/contact/index.js - Contact Us Page
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CONTACT_INFO } from '../../src/constants/config';
import useTranslation from '../../src/i18n/useTranslation';

export default function Contact() {
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    serviceType: 'general-inquiry',
    urgency: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const { t } = useTranslation();

  // Hero title helpers: prefer full title key if present, otherwise use split prefix/highlight/suffix
  const contactFullTitle = t('contact.hero.title');
  const contactTitlePrefix = t('contact.hero.title.prefix');
  const contactTitleHighlight = t('contact.hero.title.highlight');
  const contactTitleSuffix = t('contact.hero.title.suffix');

  // Contact methods
  const contactMethods = [
    {
      icon: '📞',
      title: t('contact.methods.phone.title'),
      description: t('contact.methods.phone.description'),
      details: t('contact.methods.phone.details'),
      action: 'call',
      availability: t('contact.badge.phone')
    },
    {
      icon: (<span className="svg-icon"><Image src="/whatsapp-icon.svg" alt="WhatsApp" width={74} height={74} /></span>),
      title: t('contact.methods.whatsapp.title'),
      description: t('contact.methods.whatsapp.description'),
      details: t('contact.methods.whatsapp.details'),
      action: 'whatsapp',
      availability: t('contact.badge.whatsapp')
    },
    {
      icon: '📧',
      title: t('contact.methods.email.title'),
      description: t('contact.methods.email.description'),
      details: t('contact.methods.email.details'),
      action: 'email',
      availability: t('contact.badge.response')
    },
    {
      icon: '📍',
      title: t('contact.methods.visit.title'),
      description: t('contact.methods.visit.description'),
      details: t('contact.methods.visit.details'),
      action: 'visit',
      availability: t('contact.methods.visit.details')
    }
  ];

  // Service types for inquiry
  const serviceTypes = [
    { value: 'general-inquiry', label: t('contact.service.general-inquiry') },
    { value: 'tour-booking', label: t('contact.service.tour-booking') },
    { value: 'hotel-booking', label: t('contact.service.hotel-booking') },
    { value: 'car-rental', label: t('contact.service.car-rental') },
    { value: 'airport-transfer', label: t('contact.service.airport-transfer') },
    { value: 'custom-package', label: t('contact.service.custom-package') },
    { value: 'group-booking', label: t('contact.service.group-booking') },
    { value: 'complaint', label: t('contact.service.complaint') },
    { value: 'partnership', label: t('contact.service.partnership') }
  ];

  // Urgency levels
  const urgencyLevels = [
    { value: 'low', label: t('contact.urgency.low'), color: 'green' },
    { value: 'normal', label: t('contact.urgency.normal'), color: 'blue' },
    { value: 'high', label: t('contact.urgency.high'), color: 'orange' },
    { value: 'emergency', label: t('contact.urgency.emergency'), color: 'red' }
  ];

  // Office locations
  const officeLocations = [
    {
      // Keep only the main office (Galle)
      name: t('contact.locations.office1.name'),
      address: CONTACT_INFO.address,
      phone: CONTACT_INFO.phone,
      email: CONTACT_INFO.email,
      hours: t('contact.locations.office1.hours'),
      coordinates: { lat: 6.0535, lng: 80.2210 },
      image: '/contact/colombo-office.jpg'
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: t('contact.faq.q1.question'),
      answer: t('contact.faq.q1.answer')
    },
    {
      question: t('contact.faq.q2.question'),
      answer: t('contact.faq.q2.answer')
    },
    {
      question: t('contact.faq.q3.question'),
      answer: t('contact.faq.q3.answer')
    },
    {
      question: t('contact.faq.q4.question'),
      answer: t('contact.faq.q4.answer')
    },
    {
      question: t('contact.faq.q5.question'),
      answer: t('contact.faq.q5.answer')
    }
  ];

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle contact method actions
  const handleContactAction = (method) => {
    switch (method.action) {
      case 'call':
        window.open(`tel:${method.details}`);
        break;
      case 'whatsapp':
        const whatsappMessage = `Hello Zamzam Lanka Tours! I would like to get more information about your services.`;
        window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${method.details}?subject=Inquiry from Zamzam Lanka Tours Website`);
        break;
      case 'visit':
        // Scroll to locations section
        document.getElementById('locations').scrollIntoView({ behavior: 'smooth' });
        break;
      default:
        break;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Prepare WhatsApp message
      const whatsappMessage = `
New Inquiry from Zamzam Lanka Tours Website:

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${serviceTypes.find(s => s.value === formData.serviceType)?.label}
Urgency: ${urgencyLevels.find(u => u.value === formData.urgency)?.label}
Subject: ${formData.subject}

Message:
${formData.message}

Please respond promptly.
      `.trim();

      // Open WhatsApp with pre-filled message
      window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        serviceType: 'general-inquiry',
        urgency: 'normal'
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // map initialization removed (interactive map section was removed)

  return (
    <>
      <Head>
        <title>{t('contact.pageTitle')}</title>
        <meta name="description" content={t('contact.metaDescription')} />
      </Head>

  <Navbar />

      {/* Hero Section - use shared hero styles for consistency */}
      <section className="hero contact-hero" style={{ background: '#053b3c' }}>
        
        <div className="hero-content">
          <h1 className="hero-title">
            {contactFullTitle && contactFullTitle !== 'contact.hero.title' ? (
              contactFullTitle
            ) : (
              <>
                {contactTitlePrefix} <span className="hero-highlight">{contactTitleHighlight}</span> {contactTitleSuffix}
              </>
            )}
          </h1>
          <p className="hero-subtitle">{t('contact.hero.subtitle')}</p>

          <div className="hero-buttons">
            <div className="contact-badge">
              <span className="badge-icon">📞</span>
              <span className="badge-text">{t('contact.badge.phone')}</span>
            </div>
            <div className="contact-badge">
              <span className="badge-icon svg-icon"><Image src="/whatsapp-icon.svg" alt="WhatsApp" width={24} height={24} /></span>
              <span className="badge-text">{t('contact.badge.whatsapp')}</span>
            </div>
            <div className="contact-badge">
              <span className="badge-icon">⏱️</span>
              <span className="badge-text">{t('contact.badge.response')}</span>
            </div>
            </div>
          </div>
        </section>

      {/* Quick Contact Methods */}
      <section className="quick-contact">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">{t('contact.section.chooseMethod.title')}</h2>
            <p className="section-subtitle">{t('contact.section.chooseMethod.subtitle')}</p>
          </div>

          <div className="contact-methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="contact-method-card">
                <div className="method-icon">{method.icon}</div>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
                <div className="method-details">
                  <span className="detail">{method.details}</span>
                  {method.action !== 'visit' && (
                    <span className="availability">{method.availability}</span>
                  )}
                </div>
                <button 
                  className="method-action-btn"
                  onClick={() => handleContactAction(method)}
                >
                  {t(`contact.action.${method.action}`)}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>{t('contact.form.title')}</h2>
              <p>{t('contact.form.subtitle')}</p>
            </div>

            <div className="inquiry-tabs">
              <button 
                className={`tab ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                {t('contact.form.tab.general')}
              </button>
              <button 
                className={`tab ${activeTab === 'booking' ? 'active' : ''}`}
                onClick={() => setActiveTab('booking')}
              >
                {t('contact.form.tab.booking')}
              </button>
              <button 
                className={`tab ${activeTab === 'urgent' ? 'active' : ''}`}
                onClick={() => setActiveTab('urgent')}
              >
                {t('contact.form.tab.urgent')}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">{t('contact.form.label.name')}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder={t('contact.form.label.name')}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t('contact.form.label.email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder={t('contact.form.label.email')}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">{t('contact.form.label.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                      placeholder={t('contact.form.label.phone')}
                  />
                </div>
                <div className="form-group">
                    <label htmlFor="serviceType">{t('contact.form.label.serviceType')}</label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                  >
                    {serviceTypes.map(service => (
                      <option key={service.value} value={service.value}>
                        {service.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="urgency">{t('contact.form.label.urgency')}</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    {urgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                    <label htmlFor="subject">{t('contact.form.label.subject')}</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                      placeholder={t('contact.form.label.subject')}
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">{t('contact.form.label.message')}</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder={t('contact.form.label.message')}
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="form-message success">
                  {t('contact.form.success')}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-message error">
                  {t('contact.form.error')}
                </div>
              )}

              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      {t('contact.form.submit')}
                    </>
                  ) : (
                    t('contact.form.submit')
                  )}
                </button>
                
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    const message = `Hello! I need assistance with: ${formData.subject || 'General inquiry'}`;
                    window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                >
                  {t('contact.form.quickChat')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="locations-section" id="locations">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">{t('contact.locations.title')}</h2>
            <p className="section-subtitle">{t('contact.locations.subtitle')}</p>
          </div>

          <div className="locations-grid">
            {officeLocations.map((office, index) => (
              <div key={index} className="location-card-with-map">
                <div className="location-content-wrapper">
                  <div className="location-left">
                    <div className="location-card">
                      <div className="location-image">
                        <Image 
                          src={office.image} 
                          alt={office.name}
                          width={400}
                          height={250}
                          objectFit="cover"
                        />
                      </div>
                      <div className="location-info">
                        <h3>{office.name}</h3>
                        <div className="location-details">
                          <div className="detail-item">
                            <span className="icon">📍</span>
                            <span className="text">{office.address}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">📞</span>
                            <span className="text">{office.phone}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">📧</span>
                            <span className="text">{office.email}</span>
                          </div>
                          <div className="detail-item">
                            <span className="icon">⏰</span>
                            <span className="text">{office.hours}</span>
                          </div>
                        </div>
                        <div className="location-actions">
                          <button 
                            className="btn-small"
                            onClick={() => window.open(`tel:${office.phone.replace(/\s+/g, '')}`)}
                          >
                            {t('contact.action.call')}
                          </button>
                          <button 
                            className="btn-small secondary"
                            onClick={() => window.open('https://www.google.com/maps/place/ZamZam+Lanka+Tours/@6.0544274,80.2129969,17z/data=!4m2!3m1!1s0x0:0x4e1d8b26e85c6606?sa=X&ved=1t:2428&ictx=111', '_blank')}
                          >
                            {t('contact.action.visit')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="location-right">
                    <div className="location-map">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3967.5447267891547!2d80.2129969!3d6.0544274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x4e1d8b26e85c6606!2sZamZam%20Lanka%20Tours!5e0!3m2!1sen!2slk!4v1234567890"
                        width="100%"
                        height="100%"
                        style={{ border: 0, borderRadius: '10px' }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map removed per request */}

      {/* FAQ Section */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">{t('contact.faq.title')}</h2>
            <p className="section-subtitle">{t('contact.faq.subtitle')}</p>
          </div>

          <div className="faq-grid">
            {faqItems.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Contact Banner */}
      <section className="emergency-banner">
        <div className="container">
          <div className="emergency-content">
            <div className="emergency-info">
              <div className="emergency-icon">🚨</div>
              <div className="emergency-text">
                <h3>{t('contact.emergency.title')}</h3>
                <p>{t('contact.emergency.subtitle')}</p>
              </div>
            </div>
            <div className="emergency-actions">
              <button 
                className="btn-primary"
                onClick={() => window.open(`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`)}
              >
                {t('contact.emergency.call')}
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  const message = 'EMERGENCY: I need immediate assistance with my booking.';
                  window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                {t('contact.emergency.whatsapp')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Contact Page Specific Styles */
        .contact-hero {
          position: relative;
          height: 72vh;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          overflow: hidden;
          padding-top: 55px;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
          width: 100%;
          z-index: 1;
        }

        /* Use global .hero-title and .hero-subtitle from styles/home.css so hero matches other pages */

        .hero-contact-badges {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-top: 2rem;
        }

        /* Hero spacing consistent with other pages */
        .hero-title { 
          margin-bottom: 1.5rem; 
          font-size: 3.5rem;
          line-height: 1.2;
        }
        .hero-subtitle {
          font-size: 1.5rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        .hero-highlight { color: var(--secondary-color); }

        .contact-badge {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 1rem 1.5rem;
          border-radius: 50px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .badge-icon {
          font-size: 1.5rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .badge-text {
          font-weight: 600;
        }

        /* Ensure SVG icons match emoji sizing */
        .svg-icon img {
          width: 1.5rem !important;
          height: 1.5rem !important;
          display: inline-block;
          vertical-align: middle;
          object-fit: contain;
        }

        /* Section header (homepage-like) */
        .section-header.centered {
          text-align: center;
          max-width: 900px;
          margin: 0 auto 1.5rem;
        }

        .section-title {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          color: var(--primary-color);
          font-weight: 400; /* not bold */
        }

        .section-subtitle {
          color: var(--text-light);
          margin-bottom: 1.5rem;
          font-size: 1.05rem;
        }

        /* Quick Contact Methods */
        .quick-contact {
          padding: 5rem 0;
          background: var(--section-bg);
        }

        .contact-methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        /* Large Screen Optimizations */
        @media (min-width: 2560px) {
          .contact-methods-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 3rem;
          }

          .form-container {
            max-width: 1200px;
          }
        }

        @media (min-width: 1440px) and (max-width: 2559px) {
          .contact-methods-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .form-container {
            max-width: 1000px;
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .contact-methods-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .contact-method-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: 15px;
          text-align: center;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
        }

        .contact-method-card:hover {
          transform: translateY(-5px);
        }

        .method-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .method-icon .svg-icon img {
          width: 3rem !important;
          height: 3rem !important;
          display: inline-block;
          vertical-align: middle;
          object-fit: contain;
        }

        .contact-method-card h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-size: 1.4rem;
        }

        .contact-method-card p {
          color: var(--text-light);
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .method-details {
          margin-bottom: 2rem;
        }

        .method-details .detail {
          display: block;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
          font-size: 1.1rem;
        }

        .method-details .availability {
          display: block;
          color: var(--secondary-color);
          font-weight: 600;
          font-size: 0.9rem;
        }

        .method-action-btn {
          width: 100%;
          padding: 14px 28px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(5, 59, 60, 0.2);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .method-action-btn:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(5, 59, 60, 0.3);
        }

        /* Contact Form Section */
        .contact-form-section {
          padding: 5rem 0;
        }

        .form-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .form-header {
          padding: 2.5rem 2.5rem 1rem;
          text-align: center;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
        }

        .form-header h2 {
          margin-bottom: 0.5rem;
          font-size: 2rem;
        }

        .form-header p {
          opacity: 0.9;
        }

        .inquiry-tabs {
          display: flex;
          background: var(--section-bg);
          border-bottom: 1px solid var(--border-color);
        }

        .inquiry-tabs .tab {
          flex: 1;
          padding: 1.2rem 1rem;
          background: none;
          border: none;
          border-bottom: 3px solid transparent;
          cursor: pointer;
          font-weight: 600;
          color: var(--text-light);
          transition: all 0.3s ease;
        }

        .inquiry-tabs .tab.active {
          color: var(--primary-color);
          border-bottom-color: var(--primary-color);
          background: white;
        }

        .contact-form {
          padding: 2.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-group label {
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--primary-color);
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 15px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(5, 59, 60, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 120px;
        }

        .form-message {
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }

        .form-message.success {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }

        .form-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .form-actions .btn-primary {
          flex: 2;
        }

        .form-actions .btn-secondary {
          flex: 1;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Locations Section */
        .locations-section {
          padding: 5rem 0;
          background: var(--section-bg);
        }

        .locations-grid {
          display: grid;
          grid-template-columns: 1fr;
          justify-items: center;
          gap: 1.25rem;
          margin-top: 3rem;
        }

        /* Two-column card with map */
        .location-card-with-map {
          background: transparent;
          border-radius: 0;
          overflow: visible;
          box-shadow: none;
          transition: none;
          max-width: 1200px;
          width: 100%;
        }

        .location-card-with-map:hover {
          transform: none;
        }

        .location-content-wrapper {
          display: grid;
          grid-template-columns: 400px 1fr;
          gap: 2rem;
          align-items: stretch;
        }

        .location-left {
          display: flex;
          flex-direction: column;
        }

        .location-left .location-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          transition: transform 0.18s ease;
          max-width: 400px;
          width: 100%;
          height: 100%;
        }

        .location-left .location-card:hover {
          transform: translateY(-3px);
        }

        .location-right {
          display: flex;
          align-items: stretch;
          min-height: 500px;
        }

        .location-map {
          width: 100%;
          height: 100%;
          min-height: 500px;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
        }

        .location-map iframe {
          width: 100%;
          height: 100%;
          min-height: 500px;
        }

        /* Compact centered card */
        .location-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          transition: transform 0.18s ease;
          max-width: 400px;
          width: 100%;
        }

        .location-card:hover {
          transform: translateY(-3px);
        }

        .location-image {
          height: 180px;
          overflow: hidden;
          background: #f0f0f0;
          position: relative;
          width: 100%;
        }

        .location-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .location-info {
          padding: 1.2rem;
        }

        .location-info h3 {
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
        }

        .location-details {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .detail-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .detail-item .icon {
          font-size: 1.2rem;
          flex-shrink: 0;
          margin-top: 0.1rem;
        }

        .detail-item .text {
          color: var(--text-light);
          line-height: 1.5;
        }

        .location-actions {
          display: flex;
          gap: 0.8rem;
        }

        .btn-small {
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }

        .btn-small:not(.secondary) {
          background: var(--primary-color);
          color: white;
          box-shadow: 0 4px 12px rgba(5, 59, 60, 0.2);
        }

        .btn-small.secondary {
          background: white;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
        }

        .btn-small:not(.secondary):hover {
          background: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(5, 59, 60, 0.3);
        }

        .btn-small.secondary:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        /* Form buttons: green primary and white secondary */
        .btn-primary {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 14px 32px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(5, 59, 60, 0.2);
          transition: all 0.3s ease;
        }

        .btn-primary:hover:not(:disabled) {
          background: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(5, 59, 60, 0.3);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: white;
          color: var(--primary-color);
          border: 2px solid var(--primary-color);
          padding: 12px 32px;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover {
          background: var(--primary-color);
          color: white;
          transform: translateY(-2px);
        }

        /* Map section removed */

        /* FAQ Section */
        .faq-section {
          padding: 5rem 0;
          background: var(--section-bg);
        }

        .faq-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .faq-item {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
        }

        .faq-item h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .faq-item p {
          color: var(--text-light);
          line-height: 1.6;
        }

        /* Emergency Banner */
        .emergency-banner {
          padding: 3rem 0;
          background: linear-gradient(135deg, #053b3c, #032626);
          color: white;
        }

        .emergency-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .emergency-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .emergency-icon {
          font-size: 3rem;
        }

        .emergency-text h3 {
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .emergency-text p {
          opacity: 0.9;
        }

        .emergency-actions {
          display: flex;
          gap: 1rem;
        }

        .emergency-banner .btn-primary {
          background: white;
          color: var(--primary-color);
          box-shadow: 0 4px 12px rgba(255, 255, 255, 0.3);
        }

        .emergency-banner .btn-primary:hover {
          background: #f9f9f9;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 255, 255, 0.4);
        }

        .emergency-banner .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .emergency-banner .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .emergency-content {
            flex-direction: column;
            text-align: center;
          }

          .emergency-info {
            justify-content: center;
          }
        }

        @media (max-width: 768px) {
          .hero-content h1 {
            font-size: 2.2rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .contact-hero {
            height: 55vh;
            min-height: 450px;
            padding-top: 70px;
          }

          .hero-contact-badges {
            flex-direction: column;
            align-items: center;
          }

          .contact-badge {
            width: 100%;
            max-width: 300px;
            justify-content: center;
          }

          .inquiry-tabs {
            flex-direction: column;
          }

          .location-content-wrapper {
            grid-template-columns: 1fr;
          }

          .location-map {
            min-height: 300px;
          }

          .form-actions {
            flex-direction: column;
          }

          .locations-grid {
            grid-template-columns: 1fr;
          }

          .faq-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 576px) {
          .hero-content h1 {
            font-size: 1.8rem;
          }

          .contact-form {
            padding: 1.5rem;
          }

          .emergency-actions {
            flex-direction: column;
            width: 100%;
          }

          .emergency-actions button {
            width: 100%;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}
