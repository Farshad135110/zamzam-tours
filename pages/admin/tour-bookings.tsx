import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

interface TourBooking {
  booking_id: number;
  package_id: number;
  name: string;
  email: string;
  phone_no: string;
  no_of_travellers: number;
  starting_date: string;
  special_requirements: string;
  pickup_location: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_price: number;
  created_at: string;
}

export default function AdminTourBookings() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBooking, setEditingBooking] = useState<TourBooking | null>(null);

  const [bookings, setBookings] = useState<TourBooking[]>([
    {
      booking_id: 1,
      package_id: 1,
      name: 'Ahmed Hassan Family',
      email: 'ahmed@example.com',
      phone_no: '+966 50 123 4567',
      no_of_travellers: 6,
      starting_date: '2024-02-15',
      special_requirements: 'Need vegetarian meals, elderly-friendly transportation',
      pickup_location: 'Makkah Royal Clock Tower Hotel',
      status: 'confirmed',
      total_price: 4500,
      created_at: '2024-01-10'
    },
    {
      booking_id: 2,
      package_id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone_no: '+966 55 987 6543',
      no_of_travellers: 2,
      starting_date: '2024-02-20',
      special_requirements: 'Private guide for historical sites, photography assistance',
      pickup_location: 'Madinah Hilton Hotel',
      status: 'pending',
      total_price: 1200,
      created_at: '2024-01-12'
    },
    {
      booking_id: 3,
      package_id: 3,
      name: 'Mohammed Ali Group',
      email: 'mohammed.ali@example.com',
      phone_no: '+966 54 555 8888',
      no_of_travellers: 15,
      starting_date: '2024-02-08',
      special_requirements: 'Corporate group, need meeting facilities, English speaking guide',
      pickup_location: 'Jeddah City Center',
      status: 'in_progress',
      total_price: 11250,
      created_at: '2024-01-05'
    },
    {
      booking_id: 4,
      package_id: 4,
      name: 'Fatima Rahman',
      email: 'fatima@example.com',
      phone_no: '+966 53 111 2222',
      no_of_travellers: 4,
      starting_date: '2024-02-25',
      special_requirements: 'Family with young children, need child-friendly activities',
      pickup_location: 'Riyadh Marriott Hotel',
      status: 'completed',
      total_price: 2000,
      created_at: '2024-01-08'
    }
  ]);

  const [packages] = useState([
    { package_id: 1, name: 'Makkah & Madinah Spiritual Journey', duration: '10 Days', price_per_person: 750 },
    { package_id: 2, name: 'Umrah Premium Package', duration: '7 Days', price_per_person: 600 },
    { package_id: 3, name: 'Family Hajj Package', duration: '15 Days', price_per_person: 750 },
    { package_id: 4, name: 'Budget Umrah Experience', duration: '5 Days', price_per_person: 500 },
    { package_id: 5, name: 'Luxury Spiritual Retreat', duration: '12 Days', price_per_person: 1200 }
  ]);

  const [formData, setFormData] = useState({
    package_id: 0,
    name: '',
    email: '',
    phone_no: '',
    no_of_travellers: 1,
    starting_date: '',
    special_requirements: '',
    pickup_location: '',
    status: 'pending' as 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled',
    total_price: 0
  });

  const filteredBookings = bookings.filter(booking =>
    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    packages.find(p => p.package_id === booking.package_id)?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#0ea5e9';
      case 'in_progress': return '#10b981';
      case 'completed': return '#059669';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const calculatePrice = (packageId: number, travellers: number): number => {
    const tourPackage = packages.find(p => p.package_id === packageId);
    if (!tourPackage) return 0;

    return tourPackage.price_per_person * travellers;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const price = calculatePrice(formData.package_id, formData.no_of_travellers);

    const submissionData = {
      ...formData,
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
      const newBooking: TourBooking = {
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

  const handleEdit = (booking: TourBooking) => {
    setFormData({
      package_id: booking.package_id,
      name: booking.name,
      email: booking.email,
      phone_no: booking.phone_no,
      no_of_travellers: booking.no_of_travellers,
      starting_date: booking.starting_date,
      special_requirements: booking.special_requirements,
      pickup_location: booking.pickup_location,
      status: booking.status,
      total_price: booking.total_price
    });
    setEditingBooking(booking);
    setShowModal(true);
  };

  const handleDelete = (bookingId: number) => {
    if (confirm('Are you sure you want to delete this tour booking?')) {
      setBookings(bookings.filter(booking => booking.booking_id !== bookingId));
    }
  };

  const updateStatus = (bookingId: number, newStatus: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled') => {
    setBookings(bookings.map(booking => 
      booking.booking_id === bookingId 
        ? { ...booking, status: newStatus }
        : booking
    ));
  };

  const resetForm = () => {
    setFormData({
      package_id: 0,
      name: '',
      email: '',
      phone_no: '',
      no_of_travellers: 1,
      starting_date: '',
      special_requirements: '',
      pickup_location: '',
      status: 'pending',
      total_price: 0
    });
  };

  const handlePackageChange = (packageId: number) => {
    setFormData(prev => ({
      ...prev,
      package_id: packageId,
      total_price: calculatePrice(packageId, prev.no_of_travellers)
    }));
  };

  const handleTravellersChange = (travellers: number) => {
    setFormData(prev => ({
      ...prev,
      no_of_travellers: travellers,
      total_price: calculatePrice(prev.package_id, travellers)
    }));
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

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
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex' }}>
      <AdminSidebar active="tour-bookings" />

      <div style={{ flex: 1, padding: '30px' }}>
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
              }}>🗺️</div>
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
                  {bookings.filter(b => b.status === 'in_progress').length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>In Progress</p>
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
            <div>Tour Package</div>
            <div>Travellers</div>
            <div>Start Date</div>
            <div>Pickup Location</div>
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
                  {booking.phone_no}
                </div>
              </div>

              {/* Tour Package */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c', marginBottom: '4px' }}>
                  {packages.find(p => p.package_id === booking.package_id)?.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {packages.find(p => p.package_id === booking.package_id)?.duration}
                </div>
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
              {editingBooking ? 'Edit Tour Booking' : 'New Tour Booking'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Tour Package
                  </label>
                  <select
                    required
                    value={formData.package_id}
                    onChange={(e) => handlePackageChange(parseInt(e.target.value))}
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
                    <option value={0}>Select tour package</option>
                    {packages.map(pkg => (
                      <option key={pkg.package_id} value={pkg.package_id}>
                        {pkg.name} ({pkg.duration}) - ${pkg.price_per_person}/person
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
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