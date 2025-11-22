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
    { href: '/car-rental', label: 'Car Rental' },
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
            <Image src={SITE_INFO.logo} alt={SITE_INFO.name} width={90} height={36} priority />
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
                style={{
                  color: isScrolled ? '#333' : '#f8b500',
                  textShadow: isScrolled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}
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
              <svg className="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
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
          backdrop-filter: none;
          padding: 1rem 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .navbar.scrolled {
          background: white;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
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
          color: #f8b500 !important;
          padding: 0.5rem;
          transition: color 0.3s ease;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .navbar.scrolled .mobile-menu-btn {
          color: #333 !important;
          text-shadow: none;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1;
          justify-content: center;
          flex-wrap: nowrap;
        }

        .nav-links a {
          color: #f8b500 !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
          transition: all 0.3s;
          position: relative;
          padding: 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          white-space: nowrap;
        }

        .navbar:not(.scrolled) .nav-links a {
          color: #f8b500 !important;
        }

        .navbar.scrolled .nav-links a {
          color: #333 !important;
          text-shadow: none;
        }

        .navbar:not(.scrolled) .nav-links a.active {
          color: #f8b500 !important;
        }

        .nav-links a.active {
          color: #f8b500 !important;
        }

        .navbar.scrolled .nav-links a.active {
          color: #053b3c !important;
        }

        .navbar:not(.scrolled) .nav-links a:hover {
          color: #ffd700 !important;
        }

        .nav-links a:hover {
          color: #ffd700 !important;
        }

        .navbar.scrolled .nav-links a:hover {
          color: #053b3c !important;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #f8b500;
          transition: width 0.3s;
        }

        .navbar.scrolled .nav-links a::after {
          background: #053b3c;
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
          border: 1px solid rgba(248, 181, 0, 0.5);
          border-radius: 5px;
          background: rgba(248, 181, 0, 0.15);
          color: #f8b500 !important;
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.3s ease;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .navbar.scrolled .language-select {
          border: 1px solid #ddd;
          background: white;
          color: #333 !important;
          text-shadow: none;
        }

        .language-select option {
          background: #053b3c;
          color: white;
        }

        .navbar.scrolled .language-select option {
          background: white;
          color: #333;
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
