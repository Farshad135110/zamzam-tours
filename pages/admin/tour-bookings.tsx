import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import useTranslation from '../../src/i18n/useTranslation';

interface TourBooking {
  tour_booking_id: string;
  package_id: string;
  name: string;
  email: string;
  phone_no: string;
  no_of_travellers: number;
  starting_date: string; // yyyy-mm-dd
  pickup_location: string;
  special_requirements?: string;
}

interface PackageItem {
  package_id: string;
  package_name: string;
  price: number | null;
}

export default function AdminTourBookings() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBooking, setEditingBooking] = useState<TourBooking | null>(null);

  const [bookings, setBookings] = useState<TourBooking[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    package_id: '',
    name: '',
    email: '',
    phone_no: '',
    no_of_travellers: 1,
    starting_date: '',
    special_requirements: '',
    pickup_location: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      // Load bookings first; always show bookings even if packages fail
      try {
        const bRes = await fetch('/api/tour-bookings');
        if (!bRes.ok) throw new Error('Failed to fetch bookings');
        const bookingsData: TourBooking[] = await bRes.json();
        setBookings(bookingsData);
      } catch (err) {
        console.error('Error loading tour bookings:', err);
        alert('Failed to load tour bookings');
      }

      // Load packages separately but don't block the page if it fails
      try {
        const pRes = await fetch('/api/packages');
        if (pRes.ok) {
          const packagesData: PackageItem[] = await pRes.json();
          setPackages(packagesData);
        } else {
          console.warn('Failed to fetch packages for tour bookings view');
        }
      } catch (err) {
        console.warn('Packages fetch failed, continuing without package list:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const pkg = packages.find(p => p.package_id === booking.package_id);
    const pkgName = pkg?.package_name?.toLowerCase() || '';
    const term = searchTerm.toLowerCase();
    return (
      booking.name.toLowerCase().includes(term) ||
      booking.email.toLowerCase().includes(term) ||
      pkgName.includes(term)
    );
  });
  
  const getPackageName = (package_id: string) => packages.find(p => p.package_id === package_id)?.package_name || package_id;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBooking) {
        const res = await fetch(`/api/tour-bookings/${editingBooking.tour_booking_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to update booking');
        const updated: TourBooking = await res.json();
        setBookings(prev => prev.map(b => b.tour_booking_id === updated.tour_booking_id ? updated : b));
      } else {
        const res = await fetch('/api/tour-bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Failed to create booking');
        const created: TourBooking = await res.json();
        setBookings(prev => [...prev, created]);
      }
      setShowModal(false);
      resetForm();
      setEditingBooking(null);
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Failed to save booking');
    }
  };

  const handleEdit = (booking: TourBooking) => {
    setFormData({
      package_id: booking.package_id,
      name: booking.name,
      email: booking.email,
      phone_no: booking.phone_no,
      no_of_travellers: booking.no_of_travellers,
      starting_date: booking.starting_date,
      special_requirements: booking.special_requirements || '',
      pickup_location: booking.pickup_location
    });
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this tour booking?')) return;
    try {
      const res = await fetch(`/api/tour-bookings/${bookingId}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete booking');
      setBookings(prev => prev.filter(booking => booking.tour_booking_id !== bookingId));
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking');
    }
  };

  // Status handling removed – not part of DB schema

  const resetForm = () => {
    setFormData({
      package_id: '',
      name: '',
      email: '',
      phone_no: '',
      no_of_travellers: 1,
      starting_date: '',
      special_requirements: '',
      pickup_location: ''
    });
  };

  const handlePackageChange = (packageId: string) => {
    setFormData(prev => ({
      ...prev,
      package_id: packageId
    }));
  };

  const handleTravellersChange = (travellers: number) => {
    setFormData(prev => ({
      ...prev,
      no_of_travellers: travellers
    }));
  };

  // Removed status options – not stored in DB

  const pickupLocations = [
    'Makkah Royal Clock Tower Hotel',
    'Madinah Hilton Hotel',
    'Jeddah City Center',
    'Riyadh Marriott Hotel',
    'King Abdulaziz International Airport',
    'Prince Mohammad Bin Abdulaziz Airport',
    'Custom Location'
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', position: 'fixed', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Head>
        <title>Tour Bookings - Admin Panel</title>
      </Head>
      <AdminSidebar active="tour-bookings" />

      <div style={{ marginLeft: '280px', padding: '30px', flex: 1, overflowY: 'auto', height: '100vh' }}>
        <style jsx global>{`
          @media (max-width: 900px) {
            body > div > div:last-child {
              margin-left: 0 !important;
            }
          }
        `}</style>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#053b3c', margin: 0 }}>Tour Bookings</h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage tour package bookings and itineraries</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '10px 15px 10px 40px',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  width: '300px',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.style.borderColor = '#053b3c';
                  input.style.boxShadow = '0 0 0 3px rgba(5, 59, 60, 0.1)';
                }}
                onBlur={(e) => {
                  const input = e.target as HTMLInputElement;
                  input.style.borderColor = '#e2e8f0';
                  input.style.boxShadow = 'none';
                }}
              />
              <span style={{
                position: 'absolute',
                left: '15px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#64748b'
              }}>🔍</span>
            </div>
            
            <button 
              onClick={() => setShowModal(true)}
              style={{
                padding: '0.875rem 1.75rem',
                background: 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(5, 59, 60, 0.3)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 6px 16px rgba(5, 59, 60, 0.4)';
              }}
              onMouseLeave={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 12px rgba(5, 59, 60, 0.3)';
              }}
            >
              <span>+</span> New Booking
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                backgroundColor: '#f0f9ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0ea5e9',
                fontSize: '18px'
              }}>🗺️</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {bookings.length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Total Bookings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
            gap: '12px',
            padding: '16px 20px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151'
          }}>
            <div>Customer</div>
            <div>Tour Package</div>
            <div>Travellers</div>
            <div>Start Date</div>
            <div>Pickup Location</div>
            <div>Package Price</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {filteredBookings.map((booking, index) => (
            <div
              key={booking.tour_booking_id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                gap: '12px',
                padding: '20px',
                borderBottom: index < filteredBookings.length - 1 ? '1px solid #f1f5f9' : 'none',
                alignItems: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'white';
              }}
            >
              {/* Customer */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c', marginBottom: '4px' }}>
                  {booking.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px' }}>
                  {booking.email}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {booking.phone_no}
                </div>
              </div>

              {/* Tour Package */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c', marginBottom: '4px' }}>
                  {getPackageName(booking.package_id)}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>&nbsp;</div>
              </div>

              {/* Travellers */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#053b3c' }}>
                  {booking.no_of_travellers}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  travellers
                </div>
              </div>

              {/* Start Date */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c', marginBottom: '4px' }}>
                  {new Date(booking.starting_date).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Starting date
                </div>
              </div>

              {/* Pickup Location */}
              <div style={{ fontSize: '14px', color: '#374151' }}>
                {booking.pickup_location}
              </div>

              {/* Package Price */}
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                  {(() => {
                    const pkg = packages.find(p => p.package_id === booking.package_id);
                    return pkg?.price ? `$${pkg.price}` : '—';
                  })()}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleEdit(booking)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    color: '#0ea5e9',
                    border: '1px solid #0ea5e9',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = '#0ea5e9';
                    btn.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = '#0ea5e9';
                  }}
                >
                  Edit
                </button>
                
                <button
                  onClick={() => handleDelete(booking.tour_booking_id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: 'transparent',
                    color: '#ef4444',
                    border: '1px solid #ef4444',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = '#ef4444';
                    btn.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.target as HTMLButtonElement;
                    btn.style.backgroundColor = 'transparent';
                    btn.style.color = '#ef4444';
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#475569', margin: '0 0 8px 0' }}>
              {searchTerm ? 'No bookings found' : 'No tour bookings yet'}
            </h3>
            <p style={{ margin: '0 0 20px 0' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first tour booking'}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowModal(true)}
                style={{
                  padding: '0.875rem 1.75rem',
                  background: 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(5, 59, 60, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 59, 60, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 59, 60, 0.3)';
                }}
              >
                Create First Booking
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Booking Modal */}
      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }} onClick={() => setShowModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '700px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#053b3c', margin: '0 0 20px 0' }}>
              {editingBooking ? 'Edit Tour Booking' : 'New Tour Booking'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Tour Package
                  </label>
                  <select
                    required
                    value={formData.package_id}
                    onChange={(e) => handlePackageChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <option value="">Select tour package</option>
                    {packages.map(pkg => (
                      <option key={pkg.package_id} value={pkg.package_id}>
                        {pkg.package_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone_no}
                    onChange={(e) => setFormData({...formData, phone_no: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Number of Travellers
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.no_of_travellers}
                    onChange={(e) => handleTravellersChange(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Starting Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.starting_date}
                    onChange={(e) => setFormData({...formData, starting_date: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Pickup Location
                  </label>
                  <select
                    required
                    value={formData.pickup_location}
                    onChange={(e) => setFormData({...formData, pickup_location: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <option value="">Select pickup location</option>
                    {pickupLocations.map(location => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price is not part of tour_booking schema; omitted in form */}

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Special Requirements
                </label>
                <textarea
                  rows={3}
                  value={formData.special_requirements}
                  onChange={(e) => setFormData({...formData, special_requirements: e.target.value})}
                  placeholder="Dietary restrictions, accessibility needs, special accommodations, etc."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    transition: 'all 0.2s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: 'transparent',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(5, 59, 60, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 59, 60, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 59, 60, 0.3)';
                  }}
                >
                  {editingBooking ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}