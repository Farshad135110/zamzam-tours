import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Props {
  active?: string;
}

export default function AdminSidebar({ active }: Props) {
  const items = [
    { id: 'overview', label: 'Overview', href: '/admin' },
    { id: 'packages', label: 'Packages', href: '/admin/packages' },
    { id: 'vehicles', label: 'Vehicles', href: '/admin/vehicles' },
    { id: 'hotels', label: 'Hotels', href: '/admin/hotels' },
    { id: 'airportpickup', label: 'Airport Pickup', href: '/admin/airportpickup' },
    { id: 'vehicle-bookings', label: 'Vehicle Bookings', href: '/admin/vehicle-bookings' },
    { id: 'tour-bookings', label: 'Tour Bookings', href: '/admin/tour-bookings' },
    { id: 'hotel-bookings', label: 'Hotel Bookings', href: '/admin/hotel-bookings' },
    { id: 'feedback', label: 'Feedback', href: '/admin/feedback' },
    { id: 'users', label: 'Users', href: '/admin/users' },
    { id: 'settings', label: 'Settings', href: '/admin/settings' }
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Determine mobile based on window width; guard for SSR
    const check = () => {
      if (typeof window === 'undefined') return;
      setIsMobile(window.innerWidth <= 900);
      if (window.innerWidth > 900) setIsOpen(false);
    };

    check();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', check);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', check);
      }
    };
  }, []);

  const sidebarContent = (
    <div style={{ width: '280px', backgroundColor: '#053b3c', color: 'white', padding: '30px 20px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ backgroundColor: '#0a4a4b', padding: '8px', borderRadius: '8px', fontSize: '16px' }}>⚡</span>
          <span style={{ lineHeight: 1 }}>
            ZamZam<br/>Tours
          </span>
        </h2>
        <p style={{ fontSize: '12px', color: '#81c8c9', margin: 0 }}>Admin Dashboard</p>
      </div>

      <nav>
        {items.map(item => (
          <Link key={item.id} href={item.href} legacyBehavior>
            <a style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: '12px 16px',
              marginBottom: '8px',
              borderRadius: '8px',
              textDecoration: 'none',
              color: item.id === active ? 'white' : 'rgba(255,255,255,0.9)',
              backgroundColor: item.id === active ? '#0a4a4b' : 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.15s ease'
            }}>
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );

  // Mobile toggle button styles
  const toggleBtnStyle: React.CSSProperties = {
    position: 'fixed',
    left: 12,
    top: 12,
    zIndex: 1200,
    backgroundColor: '#053b3c',
    color: 'white',
    border: 'none',
    padding: '8px 10px',
    borderRadius: 8,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)'
  };

  const mobileOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 1100,
    display: isOpen ? 'block' : 'none'
  };

  const mobileSidebarWrapper: React.CSSProperties = {
    position: 'fixed',
    left: isOpen ? 0 : -320,
    top: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#053b3c',
    zIndex: 1200,
    transition: 'left 0.2s ease'
  };

  return (
    <>
      {/* Mobile toggle visible only when screen is small */}
      {isMobile && (
        <>
          <button aria-label="Open admin menu" onClick={() => setIsOpen(true)} style={toggleBtnStyle}>
            ☰
          </button>

          <div style={mobileOverlayStyle} onClick={() => setIsOpen(false)} />

          <div style={mobileSidebarWrapper}>
            <div style={{ padding: '18px 14px', display: 'flex', justifyContent: 'flex-end' }}>
              <button aria-label="Close admin menu" onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            {sidebarContent}
          </div>
        </>
      )}

      {/* Desktop sidebar */}
      {!isMobile && sidebarContent}
    </>
  );
}
