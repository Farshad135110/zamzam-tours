import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import useTranslation from '../../src/i18n/useTranslation';

interface Hotel {
  hotel_id: string;
  hotel_name: string;
  location: string;
  price_range: string;
  image: string;
  facilities: string;
}

interface HotelBooking {
  hotel_booking_id: string;
  hotel_id: string;
  name: string;
  email: string;
  phone_no: string;
  check_in: string;
  check_out: string;
  no_of_rooms: number;
  no_of_people: number;
  no_of_dates: number;
  hotel?: Hotel;
}

const HotelBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<HotelBooking[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<HotelBooking | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    hotel_id: '',
    name: '',
    email: '',
    phone_no: '',
    check_in: '',
    check_out: '',
    no_of_rooms: 1,
    no_of_people: 1
  });

  // Fetch bookings and hotels from backend on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const [bookingsRes, hotelsRes] = await Promise.all([
          fetch('/api/hotel-bookings'),
          fetch('/api/hotels')
        ]);
        if (!bookingsRes.ok || !hotelsRes.ok) throw new Error('Failed to fetch data');
        const [bookingsData, hotelsData] = await Promise.all([
          bookingsRes.json(),
          hotelsRes.json()
        ]);
        if (mounted) {
          setBookings(bookingsData);
          setHotels(hotelsData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    (async () => {
      try {
        if (editingBooking) {
          const res = await fetch(`/api/hotel-bookings/${editingBooking.hotel_booking_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          if (!res.ok) throw new Error('Failed to update');
          const updated = await res.json();
          setBookings(prev => prev.map(b => b.hotel_booking_id === updated.hotel_booking_id ? updated : b));
        } else {
          const res = await fetch('/api/hotel-bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          if (!res.ok) throw new Error('Failed to create');
          const created = await res.json();
          setBookings(prev => [...prev, created]);
        }
      } catch (err) {
        console.error(err);
        alert('Error saving booking');
      } finally {
        setShowModal(false);
        resetForm();
        setEditingBooking(null);
      }
    })();
  };

  const resetForm = () => {
    setFormData({
      hotel_id: '',
      name: '',
      email: '',
      phone_no: '',
      check_in: '',
      check_out: '',
      no_of_rooms: 1,
      no_of_people: 1
    });
  };

  const handleEdit = (booking: HotelBooking) => {
    setFormData({
      hotel_id: booking.hotel_id,
      name: booking.name,
      email: booking.email,
      phone_no: booking.phone_no,
      check_in: booking.check_in,
      check_out: booking.check_out,
      no_of_rooms: booking.no_of_rooms,
      no_of_people: booking.no_of_people
    });
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleDelete = (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this hotel booking?')) return;
    (async () => {
      try {
        const res = await fetch(`/api/hotel-bookings/${bookingId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        setBookings(prev => prev.filter(b => b.hotel_booking_id !== bookingId));
      } catch (err) {
        console.error(err);
        alert('Delete failed');
      }
    })();
  };

  if (loading) {
    return (
      <div style={{display: 'flex', minHeight: '100vh'}}>
        <AdminSidebar active="hotel-bookings" />
        <div style={{flex: 1, padding: '40px', textAlign: 'center'}}>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Head>
        <title>Hotel Bookings - Admin Panel</title>
      </Head>
      <AdminSidebar active="hotel-bookings" />

      <div style={{ marginLeft: '280px', padding: '30px' }}>
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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#053b3c', margin: 0 }}>Hotel Bookings</h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage hotel reservations and guest details</p>
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
              onClick={() => { setShowModal(true); setEditingBooking(null); resetForm(); }}
              style={{
                padding: '12px 24px',
                backgroundColor: '#053b3c',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.backgroundColor = '#0a4a4b';
                btn.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                const btn = e.target as HTMLButtonElement;
                btn.style.backgroundColor = '#053b3c';
                btn.style.transform = 'translateY(0)';
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
              }}>🏨</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {bookings.length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Total Bookings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings List (grid) */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {/* List Header */}
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
            <div>Hotel</div>
            <div>Rooms</div>
            <div>People</div>
            <div>Check-in</div>
            <div>Check-out</div>
            <div>Actions</div>
          </div>

          {/* Rows */}
          {bookings
            .filter(b => {
              const hotelName = hotels.find(h => h.hotel_id === b.hotel_id)?.hotel_name?.toLowerCase() || '';
              const term = searchTerm.toLowerCase();
              return (
                b.name.toLowerCase().includes(term) ||
                b.email.toLowerCase().includes(term) ||
                hotelName.includes(term)
              );
            })
            .map((booking, index) => (
            <div
              key={booking.hotel_booking_id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                gap: '12px',
                padding: '20px',
                borderBottom: index < bookings.length - 1 ? '1px solid #f1f5f9' : 'none',
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

              {/* Hotel */}
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#053b3c' }}>
                {hotels.find(h => h.hotel_id === booking.hotel_id)?.hotel_name || 'N/A'}
              </div>

              {/* Rooms */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#053b3c' }}>
                  {booking.no_of_rooms}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  rooms
                </div>
              </div>

              {/* People */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#053b3c' }}>
                  {booking.no_of_people}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  people
                </div>
              </div>

              {/* Check-in */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#059669', marginBottom: '4px' }}>
                  {new Date(booking.check_in).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Check-in
                </div>
              </div>

              {/* Check-out */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#dc2626', marginBottom: '4px' }}>
                  {new Date(booking.check_out).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Check-out
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
                  onClick={() => handleDelete(booking.hotel_booking_id)}
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
        {bookings.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏨</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#475569', margin: '0 0 8px 0' }}>
              {searchTerm ? 'No bookings found' : 'No hotel bookings yet'}
            </h3>
            <p style={{ margin: '0 0 20px 0' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first hotel booking'}
            </p>
            {!searchTerm && (
              <button 
                onClick={() => setShowModal(true)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#053b3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Create First Booking
              </button>
            )}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={styles.modalOverlay} onClick={() => {setShowModal(false); setEditingBooking(null); resetForm();}}>
            <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h2 style={{margin: 0, fontSize: '24px', color: '#1f2937'}}>
                  {editingBooking ? '✏️ Edit Booking' : '➕ Add New Booking'}
                </h2>
                <button 
                  onClick={() => {setShowModal(false); setEditingBooking(null); resetForm();}}
                  style={styles.closeButton}
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Hotel *</label>
                  <select
                    style={styles.input}
                    value={formData.hotel_id}
                    onChange={(e) => setFormData({...formData, hotel_id: e.target.value})}
                    required
                  >
                    <option value="">Select Hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.hotel_id} value={hotel.hotel_id}>
                        {hotel.hotel_name} ({hotel.location})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Guest Name *</label>
                  <input
                    type="text"
                    style={styles.input}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter guest name"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Email *</label>
                  <input
                    type="email"
                    style={styles.input}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="guest@example.com"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Phone Number *</label>
                  <input
                    type="tel"
                    style={styles.input}
                    value={formData.phone_no}
                    onChange={(e) => setFormData({...formData, phone_no: e.target.value})}
                    placeholder="+1234567890"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Check-in Date *</label>
                  <input
                    type="date"
                    style={styles.input}
                    value={formData.check_in}
                    onChange={(e) => setFormData({...formData, check_in: e.target.value})}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Check-out Date *</label>
                  <input
                    type="date"
                    style={styles.input}
                    value={formData.check_out}
                    onChange={(e) => setFormData({...formData, check_out: e.target.value})}
                    min={formData.check_in || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Number of Rooms *</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.no_of_rooms}
                    onChange={(e) => setFormData({...formData, no_of_rooms: parseInt(e.target.value) || 1})}
                    onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                    min="1"
                    step="1"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Number of People *</label>
                  <input
                    type="number"
                    style={styles.input}
                    value={formData.no_of_people}
                    onChange={(e) => setFormData({...formData, no_of_people: parseInt(e.target.value) || 1})}
                    onKeyPress={(e) => { if (!/[0-9]/.test(e.key)) e.preventDefault(); }}
                    min="1"
                    step="1"
                    required
                  />
                </div>

                <div style={styles.formActions}>
                  <button 
                    type="button" 
                    onClick={() => {setShowModal(false); setEditingBooking(null); resetForm();}}
                    style={{...styles.button, backgroundColor: '#6b7280'}}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    style={{...styles.button, backgroundColor: '#10b981'}}
                  >
                    {editingBooking ? 'Update Booking' : 'Create Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles: {[key: string]: React.CSSProperties} = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f5f7fa'
  },
  content: {
    flex: 1,
    padding: '32px',
    overflow: 'auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '32px',
    borderRadius: '16px',
    marginBottom: '32px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.07)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '24px',
    borderRadius: '12px',
    borderLeft: '4px solid',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    transition: 'all 0.3s'
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '8px'
  },
  statLabel: {
    fontSize: '14px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    padding: '16px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableCell: {
    padding: '16px',
    fontSize: '14px',
    color: '#374151'
  },
  button: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    color: 'white'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px'
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px',
    borderBottom: '1px solid #e5e7eb'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#6b7280',
    padding: '4px 8px',
    borderRadius: '4px',
    transition: 'all 0.2s'
  },
  form: {
    padding: '24px',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    transition: 'all 0.2s'
  },
  formActions: {
    gridColumn: '1 / -1',
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb'
  }
};

export default HotelBookingsPage;
