import React, { useEffect } from 'react';
import Image from 'next/image';
import { SITE_INFO, CONTACT_INFO, SOCIAL_MEDIA } from '../src/constants/config';
import Link from 'next/link';

export default function Footer() {
  // Load Trustpilot widget script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleWhatsAppBooking = (service = 'assistance') => {
    const message = `Hello Zamzam Lanka Tours! I need ${service}`;
    const encoded = encodeURIComponent(message);
    if (typeof window !== 'undefined') {
      window.open(`${CONTACT_INFO.whatsappUrl}?text=${encoded}`, '_blank');
    }
  };

  return (
    <>
      {/* Review Request Section */}
      <section style={{ padding: '60px 0', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', color: 'white', maxWidth: '900px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Enjoyed Your Experience?
            </h2>
            <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.95 }}>
              Share your feedback and help other travelers discover Sri Lanka with us!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem', marginTop: '2rem', flexWrap: 'wrap' }}>
              <a 
                href="https://www.tripadvisor.com/UserReviewEdit-g12364193-d34116256-ZamZam_Lanka_Tours-Galle_District_Southern_Province.html"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Image 
                  src="https://static.tacdn.com/img2/brand_refresh/Tripadvisor_lockup_horizontal_secondary_registered.svg" 
                  alt="Review us on TripAdvisor" 
                  width={180} 
                  height={36}
                />
              </a>
              <a 
                href="https://www.trustpilot.com/review/zamzamlankatours.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: 'inline-block', backgroundColor: 'white', padding: '8px 16px', borderRadius: '8px', transition: 'transform 0.3s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Image 
                  src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-black.svg" 
                  alt="Review us on Trustpilot" 
                  width={140} 
                  height={36}
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Image src={SITE_INFO.logo} alt={SITE_INFO.name} width={110} height={36} />
            </div>
            <p>Your trusted partner for premium travel experiences in Sri Lanka since 2010.</p>
            <div className="social-links">
              {SOCIAL_MEDIA.facebook && (
                <a href={SOCIAL_MEDIA.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
                  <Image src="/social/facebook.svg" alt="Facebook" width={28} height={28} />
                </a>
              )}
              {SOCIAL_MEDIA.instagram && (
                <a href={SOCIAL_MEDIA.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                  <Image src="/social/instagram.svg" alt="Instagram" width={28} height={28} />
                </a>
              )}
            </div>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul className="services-list">
              <li><Link href="/self-drive">Self-Drive Rentals</Link></li>
              <li><Link href="/tours">Guided Tours</Link></li>
              <li><Link href="/transfers">Airport & All-Island Transfers</Link></li>
              <li><Link href="/hotels">Hotel Booking</Link></li>
              <li><Link href="/activities">Activities</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link href="/contact#locations">Contact Us</Link></li>
              <li><Link href="/contact#faq">FAQ</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Contact Info</h3>
            <ul className="contact-info">
              <li><span className="contact-icon">📍</span><span className="contact-text">{CONTACT_INFO.address}</span></li>
              <li><span className="contact-icon">📞</span><span className="contact-text">{CONTACT_INFO.phone}</span></li>
              <li><span className="contact-icon">📧</span><span className="contact-text">{CONTACT_INFO.email}</span></li>
              <li><span className="contact-icon">🕒</span><span className="contact-text">Open 24/7</span></li>
            </ul>
          </div>
        </div>

        {/* Trustpilot Logo */}
        <div style={{ textAlign: 'center', padding: '30px 0 20px 0', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <a 
            href="https://www.trustpilot.com/review/zamzamlankatours.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-block' }}
          >
            <Image 
              src="https://cdn.trustpilot.net/brand-assets/4.1.0/logo-white.svg" 
              alt="Trustpilot" 
              width={120} 
              height={30}
            />
          </a>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Zamzam Lanka Tours. All rights reserved.</p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
        <div className="whatsapp-float">
          <button
            onClick={() => window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent('Hello Zamzam Lanka Tours! I need assistance')}`, '_blank')}
            aria-label="Contact via WhatsApp"
          >
            <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={30} height={30} />
          </button>
        </div>

      <style jsx>{`
        .footer-content { display: flex; flex-wrap: wrap; gap: 1.5rem; }
        .footer-section { flex: 1 1 200px; min-width: 180px; }

        .footer-logo { display: flex; align-items: center; gap: 0.75rem; }

        /* Contact list - keep icon + text on one line and remove implicit width limits */
        .contact-info { list-style: none; padding: 0; margin: 0; border: none; }
        .contact-info li { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; white-space: nowrap; }
        .contact-icon { line-height: 1; font-size: 1.05rem; flex: 0 0 auto; }
        .contact-text { display: inline-block; white-space: nowrap; overflow: visible; text-overflow: clip; max-width: none; }

        /* On very small screens allow some wrapping to avoid overflow off-screen */
        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
            text-align: center;
          }

          .footer-section {
            flex: 1 1 100%;
          }

          .contact-info li {
            justify-content: center;
          }

          .footer-logo {
            justify-content: center;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 420px) {
          .contact-info li { white-space: normal; }
          .footer-section { flex: 1 1 100%; }
        }
      `}</style>
      </footer>
    </>
  );
}