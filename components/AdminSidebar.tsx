import React from 'react';
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

  return (
    <div style={{ width: '280px', backgroundColor: '#053b3c', color: 'white', padding: '30px 20px', minHeight: '100vh' }}>
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ backgroundColor: '#0a4a4b', padding: '8px', borderRadius: '8px', fontSize: '18px' }}>⚡</span>
          ZamZam<br/>Tours
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
              transition: 'all 0.2s ease'
            }}>
              {item.label}
            </a>
          </Link>
        ))}
      </nav>
    </div>
  );
}
