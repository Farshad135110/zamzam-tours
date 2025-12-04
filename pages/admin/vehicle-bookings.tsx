import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import useTranslation from '../../src/i18n/useTranslation';

interface VehicleBookingRec {
  vehicle_booking_id: string;
  rental_type: string;
  customer_type: string;
  name: string;
  email: string;
  phone_no: string;
  pickup_location: string;
  pickup_date: string;
  return_date: string;
  no_of_days: number;
  special_request?: string;
  vehicle_id: string | null;
}

interface VehicleItem {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_type: string;
  price_per_day: number;
}

export default function AdminVehicleBookings() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBooking, setEditingBooking] = useState<VehicleBookingRec | null>(null);

  const [bookings, setBookings] = useState<VehicleBookingRec[]>([]);
  const [vehicles, setVehicles] = useState<VehicleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    rental_type: 'self_drive' as 'self_drive' | 'with_driver' | 'tour',
    customer_type: 'individual' as 'individual' | 'corporate' | 'family',
    name: '',
    email: '',
    phone_no: '',
    pickup_location: '',
    pickup_date: '',
    return_date: '',
    no_of_days: 1,
    special_request: '',
    vehicle_id: ''
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [bRes, vRes] = await Promise.all([
          fetch('/api/vehicle-bookings'),
          fetch('/api/vehicles')
        ]);
        if (!bRes.ok) throw new Error('Failed to fetch bookings');
        if (!vRes.ok) throw new Error('Failed to fetch vehicles');
        const bookingsData: VehicleBookingRec[] = await bRes.json();
        const vehiclesData: VehicleItem[] = await vRes.json();
        setBookings(bookingsData);
        setVehicles(vehiclesData);
      } catch (err) {
        console.error('Error loading vehicle bookings:', err);
        alert('Failed to load vehicle bookings');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredBookings = bookings.filter(booking =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.rental_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Status removed – not in DB schema

  const getRentalTypeIcon = (type: string): string => {
    switch (type) {
      case 'self_drive': return '👤';
      case 'with_driver': return '👨‍💼';
      case 'tour': return '🗺️';
      default: return '🚗';
    }
  };

  const getRentalTypeText = (type: string): string => {
    switch (type) {
      case 'self_drive': return 'Self Drive';
      case 'with_driver': return 'With Driver';
      case 'tour': return 'Tour';
      default: return type;
    }
  };

  const getCustomerTypeText = (type: string): string => {
    switch (type) {
      case 'individual': return 'Individual';
      case 'corporate': return 'Corporate';
      case 'family': return 'Family';
      default: return type;
    }
  };

  const calculateDays = (pickupDate: string, returnDate: string): number => {
    if (!pickupDate || !returnDate) return 1;
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  };

  // Price calculation removed – not stored

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...formData, no_of_days: calculateDays(formData.pickup_date, formData.return_date) };
      if (editingBooking) {
        const res = await fetch(`/api/vehicle-bookings/${editingBooking.vehicle_booking_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to update booking');
        const updated: VehicleBookingRec = await res.json();
        setBookings(prev => prev.map(b => b.vehicle_booking_id === updated.vehicle_booking_id ? updated : b));
      } else {
        const res = await fetch('/api/vehicle-bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to create booking');
        const created: VehicleBookingRec = await res.json();
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

  const handleEdit = (booking: VehicleBookingRec) => {
    setFormData({
      rental_type: booking.rental_type as 'self_drive' | 'with_driver' | 'tour',
      customer_type: booking.customer_type as 'individual' | 'corporate' | 'family',
      name: booking.name,
      email: booking.email,
      phone_no: booking.phone_no,
      pickup_location: booking.pickup_location,
      pickup_date: booking.pickup_date,
      return_date: booking.return_date,
      no_of_days: booking.no_of_days,
      special_request: booking.special_request || '',
      vehicle_id: booking.vehicle_id || ''
    });
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle booking?')) return;
    try {
      const res = await fetch(`/api/vehicle-bookings/${bookingId}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete booking');
      setBookings(prev => prev.filter(booking => booking.vehicle_booking_id !== bookingId));
    } catch (err) {
      console.error('Error deleting booking:', err);
      alert('Failed to delete booking');
    }
  };

  // updateStatus removed – no status in DB

  const resetForm = () => {
    setFormData({
      rental_type: 'self_drive',
      customer_type: 'individual',
      name: '',
      email: '',
      phone_no: '',
      pickup_location: '',
      pickup_date: '',
      return_date: '',
      no_of_days: 1,
      special_request: '',
      vehicle_id: ''
    });
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate days when both dates are set
      if (newData.pickup_date && newData.return_date) {
        newData.no_of_days = calculateDays(newData.pickup_date, newData.return_date);
      }
      
      return newData;
    });
  };

  const handleVehicleChange = (vehicleId: string) => {
    setFormData(prev => ({
      ...prev,
      vehicle_id: vehicleId
    }));
  };

  const rentalTypes = [
    { value: 'self_drive', label: 'Self Drive', icon: '👤' },
    { value: 'with_driver', label: 'With Driver', icon: '👨‍💼' },
    { value: 'tour', label: 'Tour Package', icon: '🗺️' }
  ];

  const customerTypes = [
    { value: 'individual', label: 'Individual' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'family', label: 'Family' }
  ];

  // statusOptions removed

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', position: 'fixed', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Head>
        <title>Vehicle Bookings - Admin Panel</title>
      </Head>
      <AdminSidebar active="vehicle-bookings" />

      {/* Main Content */}
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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#053b3c', margin: 0 }}>Vehicle Bookings</h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage vehicle rental bookings and reservations</p>
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
              }}>📅</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {bookings.length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Total Bookings</p>
              </div>
            </div>
          </div>

          {/* Removed cards dependent on status */}
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
            <div>Rental Type</div>
            <div>Dates</div>
            <div>Vehicle</div>
            <div>Location</div>
            <div>Days</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {filteredBookings.map((booking, index) => (
            <div
              key={booking.vehicle_booking_id}
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
                  {getCustomerTypeText(booking.customer_type)}
                </div>
              </div>

              {/* Rental Type */}
              <div>
                <div style={{
                  backgroundColor: '#f1f5f9',
                  color: '#374151',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  width: 'fit-content'
                }}>
                  {getRentalTypeIcon(booking.rental_type)} {getRentalTypeText(booking.rental_type)}
                </div>
              </div>

              {/* Dates */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c', marginBottom: '4px' }}>
                  {new Date(booking.pickup_date).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {booking.no_of_days} days
                </div>
              </div>

              {/* Vehicle */}
              <div style={{ fontSize: '14px', color: '#374151' }}>
                {vehicles.find(v => v.vehicle_id === (booking.vehicle_id || ''))?.vehicle_name || 'Unknown'}
              </div>

              {/* Location */}
              <div style={{ fontSize: '14px', color: '#374151' }}>
                {booking.pickup_location}
              </div>

              {/* Days */}
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                  {booking.no_of_days}
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
                  onClick={() => handleDelete(booking.vehicle_booking_id)}
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
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#475569', margin: '0 0 8px 0' }}>
              {searchTerm ? 'No bookings found' : 'No vehicle bookings yet'}
            </h3>
            <p style={{ margin: '0 0 20px 0' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first vehicle booking'}
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
              {editingBooking ? 'Edit Vehicle Booking' : 'New Vehicle Booking'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Rental Type
                  </label>
                  <select
                    required
                    value={formData.rental_type}
                    onChange={(e) => setFormData({...formData, rental_type: e.target.value as any})}
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
                    {rentalTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Customer Type
                  </label>
                  <select
                    required
                    value={formData.customer_type}
                    onChange={(e) => setFormData({...formData, customer_type: e.target.value as any})}
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
                    {customerTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Full Name
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
                    Vehicle
                  </label>
                  <select
                    required
                    value={formData.vehicle_id}
                    onChange={(e) => handleVehicleChange(e.target.value)}
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
                    <option value="">Select vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                        {vehicle.vehicle_name} ({vehicle.vehicle_type})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Pickup Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.pickup_location}
                  onChange={(e) => setFormData({...formData, pickup_location: e.target.value})}
                  placeholder="Hotel, airport, or specific address"
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Pickup Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.pickup_date}
                    onChange={(e) => handleDateChange('pickup_date', e.target.value)}
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
                    Return Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.return_date}
                    onChange={(e) => handleDateChange('return_date', e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
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
              </div>

              {/* Status field removed – not stored in DB */}

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Special Requests
                </label>
                <textarea
                  rows={3}
                  value={formData.special_request}
                  onChange={(e) => setFormData({...formData, special_request: e.target.value})}
                  placeholder="Any special requirements, child seats, GPS, etc."
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