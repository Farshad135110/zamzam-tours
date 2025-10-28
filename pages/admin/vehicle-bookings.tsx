import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

interface VehicleBooking {
  booking_id: number;
  rental_type: 'self_drive' | 'with_driver' | 'tour';
  customer_type: 'individual' | 'corporate' | 'family';
  name: string;
  email: string;
  phone_no: string;
  pickup_location: string;
  pickup_date: string;
  return_date: string;
  no_of_days: number;
  special_request: string;
  vehicle_id: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  total_price: number;
  created_at: string;
}

export default function AdminVehicleBookings() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBooking, setEditingBooking] = useState<VehicleBooking | null>(null);

  const [bookings, setBookings] = useState<VehicleBooking[]>([
    {
      booking_id: 1,
      rental_type: 'self_drive',
      customer_type: 'individual',
      name: 'Ahmed Hassan',
      email: 'ahmed@example.com',
      phone_no: '+966 50 123 4567',
      pickup_location: 'Makkah Royal Clock Tower Hotel',
      pickup_date: '2024-02-01T10:00',
      return_date: '2024-02-05T18:00',
      no_of_days: 5,
      special_request: 'Need child seat for 3 year old',
      vehicle_id: 4,
      status: 'confirmed',
      total_price: 400,
      created_at: '2024-01-15'
    },
    {
      booking_id: 2,
      rental_type: 'with_driver',
      customer_type: 'corporate',
      name: 'Sarah Johnson - ABC Corp',
      email: 'sarah.johnson@abccorp.com',
      phone_no: '+966 55 987 6543',
      pickup_location: 'King Abdulaziz International Airport',
      pickup_date: '2024-02-10T14:30',
      return_date: '2024-02-12T16:00',
      no_of_days: 3,
      special_request: 'Executive transfer for business meeting',
      vehicle_id: 5,
      status: 'pending',
      total_price: 360,
      created_at: '2024-01-16'
    },
    {
      booking_id: 3,
      rental_type: 'tour',
      customer_type: 'family',
      name: 'Mohammed Ali Family',
      email: 'mohammed.ali@example.com',
      phone_no: '+966 54 555 8888',
      pickup_location: 'Madinah Hilton Hotel',
      pickup_date: '2024-02-08T08:00',
      return_date: '2024-02-08T20:00',
      no_of_days: 1,
      special_request: 'Full day tour to historical sites, need English speaking guide',
      vehicle_id: 2,
      status: 'completed',
      total_price: 250,
      created_at: '2024-01-10'
    },
    {
      booking_id: 4,
      rental_type: 'self_drive',
      customer_type: 'individual',
      name: 'Fatima Rahman',
      email: 'fatima@example.com',
      phone_no: '+966 53 111 2222',
      pickup_location: 'Riyadh Marriott Hotel',
      pickup_date: '2024-02-15T09:00',
      return_date: '2024-02-20T17:00',
      no_of_days: 6,
      special_request: 'Prefer automatic transmission',
      vehicle_id: 1,
      status: 'active',
      total_price: 720,
      created_at: '2024-01-18'
    }
  ]);

  const [vehicles] = useState([
    { vehicle_id: 1, name: 'Toyota Hiace', type: 'Van', price_per_day: 120 },
    { vehicle_id: 2, name: 'Mercedes Sprinter', type: 'Mini Bus', price_per_day: 200 },
    { vehicle_id: 3, name: 'Toyota Coaster', type: 'Bus', price_per_day: 300 },
    { vehicle_id: 4, name: 'Hyundai Staria', type: 'MPV', price_per_day: 80 },
    { vehicle_id: 5, name: 'Toyota Camry', type: 'Sedan', price_per_day: 60 }
  ]);

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
    vehicle_id: 0,
    status: 'pending' as 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled',
    total_price: 0
  });

  const filteredBookings = bookings.filter(booking =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.rental_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#0ea5e9';
      case 'active': return '#10b981';
      case 'completed': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'active': return 'Active';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

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

  const calculatePrice = (vehicleId: number, days: number, rentalType: string): number => {
    const vehicle = vehicles.find(v => v.vehicle_id === vehicleId);
    if (!vehicle) return 0;

    let basePrice = vehicle.price_per_day * days;

    // Adjust price based on rental type
    if (rentalType === 'with_driver') basePrice *= 1.5; // 50% more for driver
    if (rentalType === 'tour') basePrice *= 2; // Double for tours

    return Math.round(basePrice);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const days = calculateDays(formData.pickup_date, formData.return_date);
    const price = calculatePrice(formData.vehicle_id, days, formData.rental_type);

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
      const newBooking: VehicleBooking = {
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

  const handleEdit = (booking: VehicleBooking) => {
    setFormData({
      rental_type: booking.rental_type,
      customer_type: booking.customer_type,
      name: booking.name,
      email: booking.email,
      phone_no: booking.phone_no,
      pickup_location: booking.pickup_location,
      pickup_date: booking.pickup_date,
      return_date: booking.return_date,
      no_of_days: booking.no_of_days,
      special_request: booking.special_request,
      vehicle_id: booking.vehicle_id,
      status: booking.status,
      total_price: booking.total_price
    });
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleDelete = (bookingId: number) => {
    if (confirm('Are you sure you want to delete this vehicle booking?')) {
      setBookings(bookings.filter(booking => booking.booking_id !== bookingId));
    }
  };

  const updateStatus = (bookingId: number, newStatus: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled') => {
    setBookings(bookings.map(booking => 
      booking.booking_id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

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
      vehicle_id: 0,
      status: 'pending',
      total_price: 0
    });
  };

  const handleDateChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-calculate days when both dates are set
      if (newData.pickup_date && newData.return_date) {
        newData.no_of_days = calculateDays(newData.pickup_date, newData.return_date);
        
        // Auto-calculate price when vehicle is selected
        if (newData.vehicle_id > 0) {
          newData.total_price = calculatePrice(newData.vehicle_id, newData.no_of_days, newData.rental_type);
        }
      }
      
      return newData;
    });
  };

  const handleVehicleChange = (vehicleId: number) => {
    setFormData(prev => ({
      ...prev,
      vehicle_id: vehicleId,
      total_price: calculatePrice(vehicleId, prev.no_of_days, prev.rental_type)
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

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex' }}>
      <AdminSidebar active="vehicle-bookings" />

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px' }}>
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
              }}>📅</div>
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
                  {bookings.filter(b => b.status === 'active').length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Active Now</p>
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
            <div>Customer</div>
            <div>Rental Type</div>
            <div>Dates</div>
            <div>Vehicle</div>
            <div>Location</div>
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
                {vehicles.find(v => v.vehicle_id === booking.vehicle_id)?.name || 'Unknown'}
              </div>

              {/* Location */}
              <div style={{ fontSize: '14px', color: '#374151' }}>
                {booking.pickup_location}
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
                    onChange={(e) => handleVehicleChange(parseInt(e.target.value))}
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
                    <option value={0}>Select vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.vehicle_id} value={vehicle.vehicle_id}>
                        {vehicle.name} ({vehicle.type}) - ${vehicle.price_per_day}/day
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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