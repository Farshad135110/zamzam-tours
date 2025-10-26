import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useI18n } from '../src/i18n/I18nContext';
import { CONTACT_INFO, SITE_INFO } from '../src/constants/config';
import { openWhatsApp } from '../src/utils/helpers';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { locale, setLocale, t } = useI18n();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppContact = () => {
    openWhatsApp('Hello ZamZam Tours! I would like to inquire about your services.');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/tours', label: 'Tours' },
    { href: '/self-drive', label: 'Car Rental' },
    { href: '/airport-transfer', label: 'Airport Transfer' },
    { href: '/hotels', label: 'Hotels' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  const isActive = (path: string) => router.pathname === path;


  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link href="/" className="logo">
            <Image src={SITE_INFO.logo} alt={SITE_INFO.name} width={120} height={48} priority />
          </Link>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
          
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
            {navLinks.map((link) => (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsMenuOpen(false)}
                className={isActive(link.href) ? 'active' : ''}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="nav-actions">
            <select 
              className="language-select" 
              value={locale} 
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
            </select>
            
            <button 
              className="whatsapp-btn"
              onClick={handleWhatsAppContact}
              aria-label="Contact via WhatsApp"
            >
              <span className="whatsapp-icon">💬</span>
              <span className="whatsapp-text">WhatsApp</span>
            </button>
          </div>
        </div>
      </nav>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: transparent;
          padding: 1rem 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .navbar.scrolled {
          background: white;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .logo {
          display: flex;
          align-items: center;
          transition: all 0.3s;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #333;
          padding: 0.5rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          flex: 1;
          justify-content: center;
        }

        .nav-links a {
          color: #333;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s;
          position: relative;
          padding: 0.5rem 0;
        }

        .nav-links a.active {
          color: #053b3c;
        }

        .nav-links a:hover {
          color: #053b3c;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #053b3c;
          transition: width 0.3s;
        }

        .nav-links a:hover::after,
        .nav-links a.active::after {
          width: 100%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .language-select {
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          background: white;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .whatsapp-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #25D366;
          color: white;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 25px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }

        .whatsapp-btn:hover {
          background: #20BA5A;
          transform: translateY(-2px);
        }

        .whatsapp-icon {
          font-size: 1.2rem;
        }

        @media (max-width: 992px) {
          .mobile-menu-btn {
            display: block;
          }

          .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: white;
            flex-direction: column;
            gap: 0;
            padding: 2rem;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
          }

          .nav-links.active {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
          }

          .nav-links a {
            width: 100%;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
          }

          .nav-actions {
            gap: 0.5rem;
          }

          .whatsapp-text {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 1rem;
          }

          .language-select {
            font-size: 0.8rem;
            padding: 0.4rem;
          }
        }
      `}</style>
    </>
  );
}
