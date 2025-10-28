import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

interface HotelBooking {
  booking_id: number;
  hotel_id: number;
  name: string;
  email: string;
  phone_no: string;
  checkin: string;
  checkout: string;
  no_of_days: number;
  no_of_rooms: number;
  no_of_people: number;
  special_requests: string;
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled';
  total_price: number;
  created_at: string;
}

export default function AdminHotelBookings() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBooking, setEditingBooking] = useState<HotelBooking | null>(null);

  const [bookings, setBookings] = useState<HotelBooking[]>([
    {
      booking_id: 1,
      hotel_id: 1,
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone_no: '+966 50 123 4567',
      checkin: '2024-02-01',
      checkout: '2024-02-05',
      no_of_days: 4,
      no_of_rooms: 2,
      no_of_people: 4,
      special_requests: 'Connecting rooms preferred, early check-in requested',
      status: 'confirmed',
      total_price: 1200,
      created_at: '2024-01-15'
    },
    {
      booking_id: 2,
      hotel_id: 2,
      name: 'Sarah Johnson - ABC Corp',
      email: 'sarah.johnson@abccorp.com',
      phone_no: '+966 55 987 6543',
      checkin: '2024-02-10',
      checkout: '2024-02-12',
      no_of_days: 2,
      no_of_rooms: 1,
      no_of_people: 1,
      special_requests: 'Executive floor, business center access needed',
      status: 'pending',
      total_price: 600,
      created_at: '2024-01-16'
    },
    {
      booking_id: 3,
      hotel_id: 3,
      name: 'Mohammed Ali Family',
      email: 'mohammed.ali@example.com',
      phone_no: '+966 54 555 8888',
      checkin: '2024-02-08',
      checkout: '2024-02-15',
      no_of_days: 7,
      no_of_rooms: 3,
      no_of_people: 8,
      special_requests: 'Family suite, extra beds for children, halal breakfast',
      status: 'checked_in',
      total_price: 3150,
      created_at: '2024-01-10'
    },
    {
      booking_id: 4,
      hotel_id: 4,
      name: 'Fatima Rahman',
      email: 'fatima@example.com',
      phone_no: '+966 53 111 2222',
      checkin: '2024-02-15',
      checkout: '2024-02-20',
      no_of_days: 5,
      no_of_rooms: 1,
      no_of_people: 2,
      special_requests: 'Honeymoon package, sea view room',
      status: 'checked_out',
      total_price: 1000,
      created_at: '2024-01-18'
    }
  ]);

  const [hotels] = useState([
    { hotel_id: 1, name: 'Makkah Royal Clock Tower', location: 'Makkah', price_per_night: 300 },
    { hotel_id: 2, name: 'Madinah Hilton', location: 'Madinah', price_per_night: 200 },
    { hotel_id: 3, name: 'Swissotel Makkah', location: 'Makkah', price_per_night: 250 },
    { hotel_id: 4, name: 'Intercontinental Madinah', location: 'Madinah', price_per_night: 180 },
    { hotel_id: 5, name: 'Raffles Makkah Palace', location: 'Makkah', price_per_night: 400 }
  ]);

  const [formData, setFormData] = useState({
    hotel_id: 0,
    name: '',
    email: '',
    phone_no: '',
    checkin: '',
    checkout: '',
    no_of_days: 1,
    no_of_rooms: 1,
    no_of_people: 1,
    special_requests: '',
    status: 'pending' as 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled',
    total_price: 0
  });

  const filteredBookings = bookings.filter(booking =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotels.find(h => h.hotel_id === booking.hotel_id)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#0ea5e9';
      case 'checked_in': return '#10b981';
      case 'checked_out': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'checked_in': return 'Checked In';
      case 'checked_out': return 'Checked Out';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const calculateDays = (checkin: string, checkout: string): number => {
    if (!checkin || !checkout) return 1;
    const start = new Date(checkin);
    const end = new Date(checkout);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  const calculatePrice = (hotelId: number, days: number, rooms: number): number => {
    const hotel = hotels.find(h => h.hotel_id === hotelId);
    if (!hotel) return 0;

    return hotel.price_per_night * days * rooms;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const days = calculateDays(formData.checkin, formData.checkout);
    const price = calculatePrice(formData.hotel_id, days, formData.no_of_rooms);

    const submissionData = {
      ...formData,
      no_of_days: days,
      total_price: price
    };

    if (editingBooking) {
      // Update existing booking
      setBookings(bookings.map(booking => 
        booking.booking_id === editingBooking.booking_id 
          ? { ...submissionData, booking_id: editingBooking.booking_id, created_at: editingBooking.created_at }
          : booking
      ));
    } else {
      // Add new booking
      const newBooking: HotelBooking = {
        ...submissionData,
        booking_id: Math.max(...bookings.map(b => b.booking_id)) + 1,
        created_at: new Date().toISOString().split('T')[0]
      };
      setBookings([...bookings, newBooking]);
    }
    
    setShowModal(false);
    resetForm();
    setEditingBooking(null);
  };

  const handleEdit = (booking: HotelBooking) => {
    setFormData({
      hotel_id: booking.hotel_id,
      name: booking.name,
      email: booking.email,
      phone_no: booking.phone_no,
      checkin: booking.checkin,
      checkout: booking.checkout,
      no_of_days: booking.no_of_days,
      no_of_rooms: booking.no_of_rooms,
      no_of_people: booking.no_of_people,
      special_requests: booking.special_requests,
      status: booking.status,
      total_price: booking.total_price
    });
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleDelete = (bookingId: number) => {
    if (confirm('Are you sure you want to delete this hotel booking?')) {
      setBookings(bookings.filter(booking => booking.booking_id !== bookingId));
    }
  };

  const updateStatus = (bookingId: number, newStatus: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled') => {
    setBookings(bookings.map(booking => 
      booking.booking_id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  const resetForm = () => {
    setFormData({
      hotel_id: 0,
      name: '',
      email: '',
      phone_no: '',
      checkin: '',
      checkout: '',
      no_of_days: 1,
      no_of_rooms: 1,
      no_of_people: 1,
      special_requests: '',
      status: 'pending',
      total_price: 0
    });
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate days when both dates are set
      if (newData.checkin && newData.checkout) {
        newData.no_of_days = calculateDays(newData.checkin, newData.checkout);
        
        // Auto-calculate price when hotel is selected
        if (newData.hotel_id > 0) {
          newData.total_price = calculatePrice(newData.hotel_id, newData.no_of_days, newData.no_of_rooms);
        }
      }
      
      return newData;
    });
  };

  const handleHotelChange = (hotelId: number) => {
    setFormData(prev => ({
      ...prev,
      hotel_id: hotelId,
      total_price: calculatePrice(hotelId, prev.no_of_days, prev.no_of_rooms)
    }));
  };

  const handleRoomsChange = (rooms: number) => {
    setFormData(prev => ({
      ...prev,
      no_of_rooms: rooms,
      total_price: calculatePrice(prev.hotel_id, prev.no_of_days, rooms)
    }));
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'checked_in', label: 'Checked In' },
    { value: 'checked_out', label: 'Checked Out' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex' }}>
      <AdminSidebar active="hotel-bookings" />

      <div style={{ flex: 1, padding: '30px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#053b3c', margin: 0 }}>Hotel Bookings</h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage hotel reservations and room allocations</p>
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
                  e.target.style.borderColor = '#053b3c';
                  e.target.style.boxShadow = '0 0 0 3px rgba(5, 59, 60, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
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
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#10b981',
                fontSize: '18px'
              }}>✅</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {bookings.filter(b => b.status === 'checked_in').length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Checked In</p>
              </div>
            </div>
          </div>

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
                backgroundColor: '#fef3c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#d97706',
                fontSize: '18px'
              }}>⏳</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {bookings.filter(b => b.status === 'pending').length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Pending</p>
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
            <div>Guest</div>
            <div>Hotel</div>
            <div>Stay Duration</div>
            <div>Rooms & Guests</div>
            <div>Check-in/out</div>
            <div>Price</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {filteredBookings.map((booking, index) => (
            <div
              key={booking.booking_id}
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
              {/* Guest */}
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
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c', marginBottom: '4px' }}>
                  {hotels.find(h => h.hotel_id === booking.hotel_id)?.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {hotels.find(h => h.hotel_id === booking.hotel_id)?.location}
                </div>
              </div>

              {/* Stay Duration */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#053b3c' }}>
                  {booking.no_of_days}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  nights
                </div>
              </div>

              {/* Rooms & Guests */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c', marginBottom: '4px' }}>
                  {booking.no_of_rooms} rooms
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {booking.no_of_people} guests
                </div>
              </div>

              {/* Check-in/out */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#053b3c', marginBottom: '2px' }}>
                  {new Date(booking.checkin).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                  Check-in
                </div>
                <div style={{ fontSize: '12px', fontWeight: '600', color: '#053b3c' }}>
                  {new Date(booking.checkout).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>
                  Check-out
                </div>
              </div>

              {/* Price */}
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                  ${booking.total_price}
                </div>
                <div style={{
                  backgroundColor: getStatusColor(booking.status) + '15',
                  color: getStatusColor(booking.status),
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginTop: '4px'
                }}>
                  {getStatusText(booking.status)}
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
                  onClick={() => handleDelete(booking.booking_id)}
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
              {editingBooking ? 'Edit Hotel Booking' : 'New Hotel Booking'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Hotel
                  </label>
                  <select
                    required
                    value={formData.hotel_id}
                    onChange={(e) => handleHotelChange(parseInt(e.target.value))}
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
                    <option value={0}>Select hotel</option>
                    {hotels.map(hotel => (
                      <option key={hotel.hotel_id} value={hotel.hotel_id}>
                        {hotel.name} ({hotel.location}) - ${hotel.price_per_night}/night
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Status
                  </label>
                  <select
                    required
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value as any})}
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
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Guest Name
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
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkin}
                    onChange={(e) => handleDateChange('checkin', e.target.value)}
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
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.checkout}
                    onChange={(e) => handleDateChange('checkout', e.target.value)}
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
                    Number of Rooms
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={formData.no_of_rooms}
                    onChange={(e) => handleRoomsChange(parseInt(e.target.value))}
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
                    Number of People
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.no_of_people}
                    onChange={(e) => setFormData({...formData, no_of_people: parseInt(e.target.value)})}
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
                    Number of Days
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.no_of_days}
                    readOnly
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Total Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.total_price}
                    onChange={(e) => setFormData({...formData, total_price: parseFloat(e.target.value)})}
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

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Special Requests
                </label>
                <textarea
                  rows={3}
                  value={formData.special_requests}
                  onChange={(e) => setFormData({...formData, special_requests: e.target.value})}
                  placeholder="Any special requirements, room preferences, dietary restrictions, etc."
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
                    padding: '10px 20px',
                    backgroundColor: '#053b3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
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