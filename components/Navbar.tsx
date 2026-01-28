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

  // Check if we're on a quotation page
  const isQuotationPage = router.pathname === '/quotation/[number]';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWhatsAppContact = () => {
    openWhatsApp('Hello Zamzam Lanka Tours! I would like to inquire about your services.');
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/tours', label: 'Tours' },
    { href: '/activities', label: 'Things To Do' },
    { href: '/car-rental', label: 'Car Rental' },
    { href: '/transfers', label: 'Airport & All-Island Transfers' },
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
            <Image src={SITE_INFO.logo} alt={SITE_INFO.name} width={150} height={60} priority quality={100} />
          </Link>
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
          <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}> 
            {navLinks.map((link) => {
              // Mobile: always gold when scrolled
              const isMobile = typeof window !== 'undefined' && window.innerWidth <= 992;
              let linkColor = '#f8b500';
              if (isScrolled && !isMobile) linkColor = '#333';
              // On mobile, keep gold even when scrolled
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className={isActive(link.href) ? 'active' : ''}
                  style={{
                    color: linkColor,
                    textShadow: isScrolled && !isMobile ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="nav-actions">
            <select 
              className="language-select" 
              value={locale} 
              onChange={(e) => setLocale(e.target.value)}
            >
              <option value="en">English</option>
              <option value="de">Deutsch</option>
              <option value="ru">Русский</option>
              <option value="he">עברית</option>
            </select>
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
          padding: 0.5rem 0;
          z-index: 1000;
          transition: all 0.3s ease;
          box-shadow: ${isQuotationPage ? 'none !important' : 'none'};
        }

        .navbar.scrolled {
          background: white;
          padding: 0.15rem 0;
          box-shadow: ${isQuotationPage ? 'none !important' : '0 4px 15px rgba(0, 0, 0, 0.1)'};
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }

        .navbar.scrolled .container {
          padding: 0 0.5rem;
          gap: 0.75rem;
        }

        .logo {
          display: flex;
          align-items: center;
          transition: all 0.3s;
          z-index: 2;
          margin: 0;
        }

        .navbar.scrolled .logo {
          margin: 0;
        }

        @media (max-width: 992px) {
          .container {
            flex-direction: row;
            align-items: center;
          }
          .logo {
            margin-right: auto;
            justify-content: flex-start;
            position: relative;
            margin: 0;
          }
          .navbar.scrolled .logo {
            margin-right: auto;
            margin: 0;
          }
          .navbar.scrolled {
            background: white !important;
            box-shadow: ${isQuotationPage ? 'none !important' : '0 4px 15px rgba(0, 0, 0, 0.1)'};
          }
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
          margin: 0;
          transition: color 0.3s ease;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }

        .navbar.scrolled .mobile-menu-btn {
          color: #333 !important;
          text-shadow: none;
          padding: 0.25rem;
          margin: 0;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex: 1 1 auto;
          justify-content: center;
          flex-wrap: nowrap;
          overflow: visible;
        }

        .nav-links a {
          color: #f8b500 !important;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s;
          position: relative;
          padding: 0.45rem 0.8rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          white-space: nowrap;
          display: inline-block;
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
          .navbar {
            height: 70px;
            padding: 0.5rem 0;
          }

          .mobile-menu-btn {
            display: block;
            padding: 0.75rem;
            min-width: 44px;
            min-height: 44px;
          }

          .nav-links {
            position: fixed;
            top: 70px;
            left: 0;
            right: 0;
            background: #053b3c;
            flex-direction: column;
            gap: 0;
            padding: 2rem;
            box-shadow: ${isQuotationPage ? 'none !important' : '0 10px 30px rgba(0, 0, 0, 0.1)'};
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
