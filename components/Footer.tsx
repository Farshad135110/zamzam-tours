import React from 'react';
import Image from 'next/image';
import { SITE_INFO, CONTACT_INFO } from '../src/constants/config';
import Link from 'next/link';

export default function Footer() {
  const handleWhatsAppBooking = (service = 'assistance') => {
    const message = `Hello Zamzam Tours! I need ${service}`;
    const encoded = encodeURIComponent(message);
    if (typeof window !== 'undefined') {
      window.open(`${CONTACT_INFO.whatsappUrl}?text=${encoded}`, '_blank');
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Image src={SITE_INFO.logo} alt={SITE_INFO.name} width={110} height={36} />
            </div>
            <p>Your trusted partner for premium travel experiences in Sri Lanka since 2010.</p>
            <div className="social-links">
              <a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Instagram">IG</a>
              <a href="#" aria-label="Twitter">TW</a>
              <a href="#" aria-label="YouTube">YT</a>
            </div>
          </div>

          <div className="footer-section">
            <h3>Services</h3>
            <ul>
              <li><Link href="/self-drive">Self-Drive Rentals</Link></li>
              <li><Link href="/tours">Guided Tours</Link></li>
              <li><Link href="/airport-transfer">Airport Transfers</Link></li>
              <li><Link href="/hotels">Hotel Booking</Link></li>
              <li><Link href="/activities">Activities</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Company</h3>
            <ul>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/testimonials">Testimonials</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/careers">Careers</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Support</h3>
            <ul>
              <li><Link href="/contact">Contact Us</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/cancellation">Cancellation Policy</Link></li>
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

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Zamzam Tours. All rights reserved.</p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
        <div className="whatsapp-float">
          <button
            onClick={() => window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent('Hello ZamZam Tours! I need assistance')}`, '_blank')}
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
        @media (max-width: 420px) {
          .contact-info li { white-space: normal; }
          .footer-section { flex: 1 1 100%; }
        }
      `}</style>
    </footer>
  );
}