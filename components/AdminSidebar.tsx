import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

interface Props {
  active?: string;
}

export default function AdminSidebar({ active }: Props) {
  const router = useRouter();
  const [userName, setUserName] = useState('Admin User');
  const [userEmail, setUserEmail] = useState('admin@zamzam.com');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.fullName || user.username);
        setUserEmail(user.email);
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }

    // Handle browser back button - logout when leaving admin panel
    const handlePopState = () => {
      if (router.pathname.startsWith('/admin')) {
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        router.push('/login');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.pathname]);

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      // Simple logout - just clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isLoggedIn');
      router.push('/login');
    }
  };

  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      href: '/admin',
      icon: '📊',
      badge: null
    },
    { 
      id: 'packages', 
      label: 'Tour Packages', 
      href: '/admin/packages',
      icon: '🎯',
      badge: null
    },
    { 
      id: 'quotations', 
      label: 'Quotations', 
      href: '/admin/quotations',
      icon: '💰',
      badge: null
    },
    { 
      id: 'vehicles', 
      label: 'Fleet', 
      href: '/admin/vehicles',
      icon: '🚗',
      badge: null
    },
    { 
      id: 'hotels', 
      label: 'Hotels', 
      href: '/admin/hotels',
      icon: '🏨',
      badge: null
    },
    { 
      id: 'gallery', 
      label: 'Gallery', 
      href: '/admin/gallery',
      icon: '🖼️',
      badge: null
    },
    { 
      id: 'users', 
      label: 'Users', 
      href: '/admin/users',
      icon: '👥',
      badge: null
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      href: '/admin/settings',
      icon: '⚙️',
      badge: null
    }
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
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
    <div 
      className="admin-sidebar"
      style={{ 
        width: '280px', 
        background: 'linear-gradient(180deg, #053b3c 0%, #0a5c5e 100%)',
        color: 'white', 
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.12)',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {/* Logo Section */}
      <div style={{ 
        padding: '20px 20px 16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        flexShrink: 0
      }}>
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: 'white',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            boxShadow: '0 4px 12px rgba(255, 108, 0, 0.3)'
          }}>
            <Image 
              src="https://res.cloudinary.com/dhqhxma30/image/upload/v1767556814/Project_Luvi_-_Gemstones_j2ipqf.png" 
              alt="Zamzam Lanka Tours"
              width={32}
              height={32}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          <div>
            <h2 style={{ 
              fontSize: '15px', 
              fontWeight: 700, 
              margin: 0,
              lineHeight: 1.2
            }}>
              Zamzam Lanka Tours
            </h2>
            <p style={{ 
              fontSize: '10px', 
              color: 'rgba(255, 255, 255, 0.7)', 
              margin: 0,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontWeight: 600
            }}>
              Admin Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ 
        flex: 1, 
        padding: '16px 12px',
        overflowY: 'auto'
      }}>
        <div style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '8px',
          paddingLeft: '12px'
        }}>
          Main Menu
        </div>
        {menuItems.slice(0, 6).map(item => (
          <Link key={item.id} href={item.href} legacyBehavior>
            <a style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              marginBottom: '3px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: item.id === active ? 'white' : 'rgba(255, 255, 255, 0.85)',
              backgroundColor: item.id === active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              fontSize: '14px',
              fontWeight: item.id === active ? 600 : 500,
              transition: 'all 0.2s ease',
              position: 'relative',
              border: item.id === active ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (item.id !== active) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }
            }}
            onMouseLeave={(e) => {
              if (item.id !== active) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}>
              <span style={{ fontSize: '18px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: 'linear-gradient(135deg, #ff6c00 0%, #ff8c00 100%)',
                  color: 'white',
                  fontSize: '9px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {item.badge}
                </span>
              )}
              {item.id === active && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '60%',
                  background: 'linear-gradient(180deg, #ff6c00 0%, #ff8c00 100%)',
                  borderRadius: '0 4px 4px 0'
                }} />
              )}
            </a>
          </Link>
        ))}

        <div style={{
          fontSize: '10px',
          color: 'rgba(255, 255, 255, 0.5)',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginTop: '16px',
          marginBottom: '8px',
          paddingLeft: '12px'
        }}>
          Bookings
        </div>
        {menuItems.slice(6, 9).map(item => (
          <Link key={item.id} href={item.href} legacyBehavior>
            <a style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              marginBottom: '3px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: item.id === active ? 'white' : 'rgba(255, 255, 255, 0.85)',
              backgroundColor: item.id === active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              fontSize: '13px',
              fontWeight: item.id === active ? 600 : 500,
              transition: 'all 0.2s ease',
              position: 'relative',
              border: item.id === active ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (item.id !== active) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }
            }}
            onMouseLeave={(e) => {
              if (item.id !== active) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}>
              <span style={{ fontSize: '16px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  background: 'linear-gradient(135deg, #ff6c00 0%, #ff8c00 100%)',
                  color: 'white',
                  fontSize: '9px',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase'
                }}>
                  {item.badge}
                </span>
              )}
              {item.id === active && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '60%',
                  background: 'linear-gradient(180deg, #ff6c00 0%, #ff8c00 100%)',
                  borderRadius: '0 4px 4px 0'
                }} />
              )}
            </a>
          </Link>
        ))}

        {menuItems.slice(9).map(item => (
          <Link key={item.id} href={item.href} legacyBehavior>
            <a style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              marginBottom: '3px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: item.id === active ? 'white' : 'rgba(255, 255, 255, 0.85)',
              backgroundColor: item.id === active ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
              fontSize: '13px',
              fontWeight: item.id === active ? 600 : 500,
              transition: 'all 0.2s ease',
              position: 'relative',
              border: item.id === active ? '1px solid rgba(255, 255, 255, 0.2)' : '1px solid transparent'
            }}
            onMouseEnter={(e) => {
              if (item.id !== active) {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateX(4px)';
              }
            }}
            onMouseLeave={(e) => {
              if (item.id !== active) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
              }
            }}>
              <span style={{ fontSize: '16px', width: '18px', textAlign: 'center' }}>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.id === active && (
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '4px',
                  height: '60%',
                  background: 'linear-gradient(180deg, #ff6c00 0%, #ff8c00 100%)',
                  borderRadius: '0 4px 4px 0'
                }} />
              )}
            </a>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: 'rgba(0, 0, 0, 0.1)',
        flexShrink: 0
      }}>
        {/* User icon and info removed, only logout button remains */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '8px 12px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            color: 'white',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
          }}
        >
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );

  // Mobile styles
  const toggleBtnStyle: React.CSSProperties = {
    position: 'fixed',
    left: 20,
    top: 20,
    zIndex: 1200,
    background: 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)',
    color: 'white',
    border: 'none',
    padding: '12px 16px',
    borderRadius: 12,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(5, 59, 60, 0.3)',
    fontSize: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: 600
  };

  const mobileOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 1100,
    display: isOpen ? 'block' : 'none',
    backdropFilter: 'blur(4px)'
  };

  const mobileSidebarWrapper: React.CSSProperties = {
    position: 'fixed',
    left: isOpen ? 0 : -320,
    top: 0,
    bottom: 0,
    width: 280,
    zIndex: 1200,
    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: isOpen ? '8px 0 32px rgba(0, 0, 0, 0.3)' : 'none'
  };

  return (
    <>
      {isMobile && (
        <>
          <button 
            aria-label="Open admin menu" 
            onClick={() => setIsOpen(true)} 
            style={toggleBtnStyle}
          >
            ☰ <span style={{ fontSize: '14px' }}>Menu</span>
          </button>

          <div style={mobileOverlayStyle} onClick={() => setIsOpen(false)} />

          <div style={mobileSidebarWrapper}>
            <div style={{ 
              padding: '20px', 
              display: 'flex', 
              justifyContent: 'flex-end',
              background: 'linear-gradient(180deg, #053b3c 0%, #0a5c5e 100%)'
            }}>
              <button 
                aria-label="Close admin menu" 
                onClick={() => setIsOpen(false)} 
                style={{ 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: 'none', 
                  color: 'white', 
                  fontSize: 24, 
                  cursor: 'pointer',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>
            {sidebarContent}
          </div>
        </>
      )}

      {!isMobile && sidebarContent}
    </>
  );
}
