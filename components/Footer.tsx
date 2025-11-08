import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const handleWhatsAppBooking = (service = 'assistance') => {
    const message = `Hello Zamzam Tours! I need ${service}`;
    const encoded = encodeURIComponent(message);
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/94766135110?text=${encoded}`, '_blank');
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <Image src="/logo.png" alt="Zamzam Tours" width={150} height={60} />
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
              <li>📍 123 Galle Road, Colombo, Sri Lanka</li>
              <li>📞 +94 77 123 4567</li>
              <li>📧 info@zamzamtours.com</li>
              <li>🕒 Open 24/7</li>
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
          onClick={() => handleWhatsAppBooking('assistance')}
          aria-label="Contact via WhatsApp"
        >
          <Image src="/whatsapp-icon.svg" alt="WhatsApp" width={30} height={30} />
        </button>
      </div>
    </footer>
  );
}