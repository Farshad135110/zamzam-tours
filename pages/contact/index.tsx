// pages/contact/index.js - Contact Us Page
import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

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
  const mapRef = useRef(null);

  // Contact methods
  const contactMethods = [
    {
      icon: '📞',
      title: 'Phone Call',
      description: 'Speak directly with our travel experts',
      details: '+94 77 123 4567',
      action: 'call',
      availability: '24/7 Support'
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      description: 'Quick responses and easy communication',
      details: '+94 77 123 4567',
      action: 'whatsapp',
      availability: 'Instant Replies'
    },
    {
      icon: '📧',
      title: 'Email',
      description: 'Detailed inquiries and documentation',
      details: 'info@zamzamtours.com',
      action: 'email',
      availability: 'Within 2 hours'
    },
    {
      icon: '📍',
      title: 'Visit Us',
      description: 'Meet us at our main office',
      details: '123 Galle Road, Colombo 03, Sri Lanka',
      action: 'visit',
      availability: 'Mon-Sun: 8:00 AM - 8:00 PM'
    }
  ];

  // Service types for inquiry
  const serviceTypes = [
    { value: 'general-inquiry', label: 'General Inquiry' },
    { value: 'tour-booking', label: 'Tour Package Booking' },
    { value: 'hotel-booking', label: 'Hotel Reservation' },
    { value: 'car-rental', label: 'Vehicle Rental' },
    { value: 'airport-transfer', label: 'Airport Transfer' },
    { value: 'custom-package', label: 'Custom Package Request' },
    { value: 'group-booking', label: 'Group Booking' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'partnership', label: 'Partnership Inquiry' }
  ];

  // Urgency levels
  const urgencyLevels = [
    { value: 'low', label: 'Low - Planning Phase', color: 'green' },
    { value: 'normal', label: 'Normal - Ready to Book', color: 'blue' },
    { value: 'high', label: 'High - Urgent Booking', color: 'orange' },
    { value: 'emergency', label: 'Emergency - Immediate Assistance', color: 'red' }
  ];

  // Office locations
  const officeLocations = [
    {
      name: 'Main Office - Colombo',
      address: '123 Galle Road, Colombo 03, Sri Lanka',
      phone: '+94 77 123 4567',
      email: 'colombo@zamzamtours.com',
      hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
      coordinates: { lat: 6.9271, lng: 79.8612 },
      image: '/contact/colombo-office.jpg'
    },
    {
      name: 'Airport Counter - CMB',
      address: 'Arrival Hall, Bandaranaike International Airport, Katunayake',
      phone: '+94 77 123 4568',
      email: 'airport@zamzamtours.com',
      hours: '24/7 Operation',
      coordinates: { lat: 7.1805, lng: 79.8841 },
      image: '/contact/airport-counter.jpg'
    },
    {
      name: 'Kandy City Office',
      address: '45 Dalada Veediya, Kandy, Sri Lanka',
      phone: '+94 77 123 4569',
      email: 'kandy@zamzamtours.com',
      hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
      coordinates: { lat: 7.2906, lng: 80.6337 },
      image: '/contact/kandy-office.jpg'
    }
  ];

  // FAQ items
  const faqItems = [
    {
      question: 'What is your response time for inquiries?',
      answer: 'We respond to all inquiries within 2 hours during business hours. WhatsApp messages are answered instantly, and emails are replied within 2 hours.'
    },
    {
      question: 'Do you provide 24/7 customer support?',
      answer: 'Yes! Our main phone line and WhatsApp are available 24/7 for urgent matters, especially for existing bookings and airport transfers.'
    },
    {
      question: 'What information should I provide when contacting?',
      answer: 'Please include your travel dates, number of travelers, preferred destinations, and any specific requirements. This helps us provide accurate recommendations quickly.'
    },
    {
      question: 'Can I modify my booking after confirmation?',
      answer: 'Yes, modifications are possible based on availability. Contact us immediately for any changes. Please refer to our cancellation policy for details.'
    },
    {
      question: 'Do you have English-speaking staff?',
      answer: 'All our staff are fluent in English. We also have team members who speak French, German, and Chinese to assist international travelers.'
    }
  ];

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
        const whatsappMessage = `Hello Zamzam Tours! I would like to get more information about your services.`;
        window.open(`https://wa.me/94766135110?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${method.details}?subject=Inquiry from Zamzam Tours Website`);
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
New Inquiry from Zamzam Tours Website:

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
      window.open(`https://wa.me/94766135110?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
      
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

  // Initialize map (simplified version)
  useEffect(() => {
    // In a real implementation, you would initialize Google Maps or similar here
    console.log('Map would be initialized here');
  }, []);

  return (
    <>
      <Head>
        <title>Contact Zamzam Tours | 24/7 Support in Sri Lanka</title>
        <meta name="description" content="Get in touch with Zamzam Tours. Multiple contact methods including phone, WhatsApp, email, and office locations across Sri Lanka." />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="contact-hero" style={{ marginTop: '80px' }}>
        <div className="hero-background">
          <Image 
            src="/contact/contact-hero.jpg" 
            alt="Contact Zamzam Tours" 
            layout="fill"
            objectFit="cover"
            priority
          />
          <div className="hero-overlay"></div>
        </div>
        
        <div className="hero-content">
          <h1>We're Here to Help Your Sri Lankan Adventure</h1>
          <p>Multiple ways to reach us, 24/7 support for your convenience</p>
          
          <div className="hero-contact-badges">
            <div className="contact-badge">
              <span className="badge-icon">📞</span>
              <span className="badge-text">24/7 Phone Support</span>
            </div>
            <div className="contact-badge">
              <span className="badge-icon">💬</span>
              <span className="badge-text">Instant WhatsApp</span>
            </div>
            <div className="contact-badge">
              <span className="badge-icon">⏱️</span>
              <span className="badge-text">2-Hour Response</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Contact Methods */}
      <section className="quick-contact">
        <div className="container">
          <div className="section-header">
            <h2>Choose Your Preferred Contact Method</h2>
            <p>We're available through multiple channels for your convenience</p>
          </div>

          <div className="contact-methods-grid">
            {contactMethods.map((method, index) => (
              <div key={index} className="contact-method-card">
                <div className="method-icon">{method.icon}</div>
                <h3>{method.title}</h3>
                <p>{method.description}</p>
                <div className="method-details">
                  <span className="detail">{method.details}</span>
                  <span className="availability">{method.availability}</span>
                </div>
                <button 
                  className="method-action-btn"
                  onClick={() => handleContactAction(method)}
                >
                  {method.action === 'call' && 'Call Now'}
                  {method.action === 'whatsapp' && 'Message on WhatsApp'}
                  {method.action === 'email' && 'Send Email'}
                  {method.action === 'visit' && 'Get Directions'}
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
              <h2>Send Us a Detailed Message</h2>
              <p>Fill out the form below and we'll get back to you promptly</p>
            </div>

            <div className="inquiry-tabs">
              <button 
                className={`tab ${activeTab === 'general' ? 'active' : ''}`}
                onClick={() => setActiveTab('general')}
              >
                General Inquiry
              </button>
              <button 
                className={`tab ${activeTab === 'booking' ? 'active' : ''}`}
                onClick={() => setActiveTab('booking')}
              >
                Booking Request
              </button>
              <button 
                className={`tab ${activeTab === 'urgent' ? 'active' : ''}`}
                onClick={() => setActiveTab('urgent')}
              >
                Urgent Assistance
              </button>
            </div>

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+94 77 123 4567"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="serviceType">Service Type *</label>
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
                  <label htmlFor="urgency">Urgency Level</label>
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
                  <label htmlFor="subject">Subject *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="Brief subject of your inquiry"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Please provide details about your inquiry, including travel dates, number of travelers, preferred destinations, and any specific requirements..."
                ></textarea>
              </div>

              {submitStatus === 'success' && (
                <div className="form-message success">
                  ✅ Thank you! Your message has been sent. We'll contact you shortly.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-message error">
                  ❌ There was an error sending your message. Please try again or contact us directly.
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
                      Sending...
                    </>
                  ) : (
                    'Send Message via WhatsApp'
                  )}
                </button>
                
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    const message = `Hello! I need assistance with: ${formData.subject || 'General inquiry'}`;
                    window.open(`https://wa.me/94766135110?text=${encodeURIComponent(message)}`, '_blank');
                  }}
                >
                  Quick WhatsApp Chat
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="locations-section" id="locations">
        <div className="container">
          <div className="section-header">
            <h2>Our Office Locations</h2>
            <p>Visit us at any of our conveniently located offices across Sri Lanka</p>
          </div>

          <div className="locations-grid">
            {officeLocations.map((office, index) => (
              <div key={index} className="location-card">
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
                      onClick={() => window.open(`tel:${office.phone}`)}
                    >
                      Call Office
                    </button>
                    <button 
                      className="btn-small secondary"
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(office.address)}`, '_blank')}
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="map-container">
            <div className="map-header">
              <h2>Find Us on the Map</h2>
              <p>Interactive map showing all our office locations across Sri Lanka</p>
            </div>
            <div className="map-placeholder" ref={mapRef}>
              <div className="map-fallback">
                <div className="fallback-content">
                  <span className="map-icon">🗺️</span>
                  <h3>Interactive Map</h3>
                  <p>Our offices are strategically located for your convenience</p>
                  <div className="map-locations-list">
                    {officeLocations.map((office, index) => (
                      <div key={index} className="map-location-item">
                        <span className="location-marker">{index + 1}</span>
                        <span className="location-name">{office.name}</span>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="btn-primary"
                    onClick={() => window.open('https://maps.google.com/maps?q=Zamzam+Tours+Colombo+Sri+Lanka', '_blank')}
                  >
                    Open in Google Maps
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions about contacting us</p>
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
                <h3>24/7 Emergency Support</h3>
                <p>Urgent assistance for existing bookings and emergencies</p>
              </div>
            </div>
            <div className="emergency-actions">
              <button 
                className="btn-primary"
                onClick={() => window.open('tel:+94766135110')}
              >
                Emergency Call
              </button>
              <button 
                className="btn-secondary"
                onClick={() => {
                  const message = 'EMERGENCY: I need immediate assistance with my booking.';
                  window.open(`https://wa.me/94766135110?text=${encodeURIComponent(message)}`, '_blank');
                }}
              >
                Emergency WhatsApp
              </button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Contact Page Specific Styles */
        .contact-hero {
          position: relative;
          height: 60vh;
          min-height: 500px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
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
          max-width: 800px;
          padding: 0 20px;
          z-index: 1;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .hero-content p {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }

        .hero-contact-badges {
          display: flex;
          justify-content: center;
          gap: 2rem;
          flex-wrap: wrap;
        }

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
        }

        .badge-text {
          font-weight: 600;
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
          padding: 12px 20px;
          background: var(--primary-color);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .method-action-btn:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
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
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
        }

        .location-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.08);
          transition: transform 0.3s ease;
        }

        .location-card:hover {
          transform: translateY(-5px);
        }

        .location-image {
          height: 200px;
          overflow: hidden;
        }

        .location-info {
          padding: 2rem;
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
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }

        .btn-small:not(.secondary) {
          background: var(--primary-color);
          color: white;
        }

        .btn-small.secondary {
          background: var(--section-bg);
          color: var(--primary-color);
          border: 1px solid var(--border-color);
        }

        .btn-small:hover {
          transform: translateY(-2px);
        }

        /* Map Section */
        .map-section {
          padding: 5rem 0;
        }

        .map-container {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .map-header {
          padding: 2rem;
          text-align: center;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
          color: white;
        }

        .map-header h2 {
          margin-bottom: 0.5rem;
        }

        .map-placeholder {
          height: 400px;
          background: var(--section-bg);
        }

        .map-fallback {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fallback-content {
          text-align: center;
          max-width: 400px;
        }

        .map-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .fallback-content h3 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .fallback-content p {
          color: var(--text-light);
          margin-bottom: 2rem;
        }

        .map-locations-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .map-location-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.8rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .location-marker {
          width: 30px;
          height: 30px;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .location-name {
          font-weight: 600;
          color: var(--primary-color);
        }

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
          color: #053b3c;
        }

        .emergency-banner .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
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
