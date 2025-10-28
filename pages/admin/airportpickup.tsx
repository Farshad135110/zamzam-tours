import React, { useState } from 'react';
import AdminSidebar from '../../components/AdminSidebar';

interface AirportPickup {
  pickup_id: number;
  pickup_type: 'one_way' | 'two_way';
  pickup_from: string;
  dropoff: string;
  airport?: string;
  passengers: number;
  pickup_time: string;
  vehicle: string;
  note: string;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export default function AdminAirportPickup() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPickup, setEditingPickup] = useState<AirportPickup | null>(null);

  const [pickups, setPickups] = useState<AirportPickup[]>([
    {
      pickup_id: 1,
      pickup_type: 'one_way',
      pickup_from: 'King Abdulaziz International Airport',
      dropoff: 'Makkah Royal Clock Tower Hotel',
      airport: 'JED',
      passengers: 3,
      pickup_time: '2024-01-20T14:30',
      vehicle: 'Toyota Hiace',
      note: 'Flight number SV1234, delayed by 30 minutes',
      price: 120,
      status: 'confirmed',
      created_at: '2024-01-15'
    },
    {
      pickup_id: 2,
      pickup_type: 'two_way',
      pickup_from: 'Madinah Hotel',
      dropoff: 'Prince Mohammad Bin Abdulaziz Airport',
      airport: 'MED',
      passengers: 2,
      pickup_time: '2024-01-22T08:00',
      vehicle: 'Hyundai Staria',
      note: 'Return pickup needed on 2024-01-25 at 16:00',
      price: 200,
      status: 'pending',
      created_at: '2024-01-16'
    },
    {
      pickup_id: 3,
      pickup_type: 'one_way',
      pickup_from: 'King Khalid International Airport',
      dropoff: 'Riyadh Marriott Hotel',
      airport: 'RUH',
      passengers: 1,
      pickup_time: '2024-01-18T20:15',
      vehicle: 'Toyota Camry',
      note: 'Business class passenger with extra luggage',
      price: 80,
      status: 'completed',
      created_at: '2024-01-10'
    },
    {
      pickup_id: 4,
      pickup_type: 'two_way',
      pickup_from: 'Jeddah City Hotel',
      dropoff: 'King Abdulaziz International Airport',
      airport: 'JED',
      passengers: 4,
      pickup_time: '2024-01-25T10:00',
      vehicle: 'Mercedes Sprinter',
      note: 'Family with children, need child seats',
      price: 180,
      status: 'confirmed',
      created_at: '2024-01-17'
    }
  ]);

  const [formData, setFormData] = useState({
    pickup_type: 'one_way' as 'one_way' | 'two_way',
    pickup_from: '',
    dropoff: '',
    airport: '',
    passengers: 1,
    pickup_time: '',
    vehicle: '',
    note: '',
    price: 0,
    status: 'pending' as 'pending' | 'confirmed' | 'completed' | 'cancelled'
  });

  const availableVehicles = [
    'Toyota Hiace (12 seats)',
    'Mercedes Sprinter (20 seats)',
    'Toyota Coaster (30 seats)',
    'Hyundai Staria (7 seats)',
    'Toyota Camry (4 seats)',
    'Ford Transit (15 seats)'
  ];

  const airports = [
    { code: 'JED', name: 'King Abdulaziz International Airport (Jeddah)' },
    { code: 'MED', name: 'Prince Mohammad Bin Abdulaziz Airport (Madinah)' },
    { code: 'RUH', name: 'King Khalid International Airport (Riyadh)' },
    { code: 'DMM', name: 'King Fahd International Airport (Dammam)' },
    { code: 'AHB', name: 'Abha International Airport' },
    { code: 'TIF', name: 'Taif International Airport' }
  ];

  const filteredPickups = pickups.filter(pickup =>
    pickup.pickup_from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pickup.dropoff.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pickup.vehicle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pickup.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#0ea5e9';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status;
    }
  };

  const getPickupTypeIcon = (type: string): string => {
    return type === 'one_way' ? '➡️' : '🔄';
  };

  const getPickupTypeText = (type: string): string => {
    return type === 'one_way' ? 'One Way' : 'Two Way';
  };

  const calculatePrice = (type: string, vehicle: string, passengers: number): number => {
    // Base pricing logic
    let basePrice = 0;
    
    // Vehicle base prices
    if (vehicle.includes('Hiace')) basePrice = 100;
    else if (vehicle.includes('Sprinter')) basePrice = 150;
    else if (vehicle.includes('Coaster')) basePrice = 200;
    else if (vehicle.includes('Staria')) basePrice = 80;
    else if (vehicle.includes('Camry')) basePrice = 60;
    else if (vehicle.includes('Transit')) basePrice = 120;
    else basePrice = 80;

    // Double price for two-way trips
    if (type === 'two_way') basePrice *= 2;

    // Small surcharge for more passengers
    if (passengers > 4) basePrice += (passengers - 4) * 10;

    return basePrice;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-calculate price if not set manually
    const finalPrice = formData.price || calculatePrice(
      formData.pickup_type,
      formData.vehicle,
      formData.passengers
    );

    const submissionData = {
      ...formData,
      price: finalPrice
    };

    if (editingPickup) {
      // Update existing pickup
      setPickups(pickups.map(pickup => 
        pickup.pickup_id === editingPickup.pickup_id 
          ? { ...submissionData, pickup_id: editingPickup.pickup_id, created_at: editingPickup.created_at }
          : pickup
      ));
    } else {
      // Add new pickup
      const newPickup: AirportPickup = {
        ...submissionData,
        pickup_id: Math.max(...pickups.map(p => p.pickup_id)) + 1,
        created_at: new Date().toISOString().split('T')[0]
      };
      setPickups([...pickups, newPickup]);
    }
    
    setShowModal(false);
    resetForm();
    setEditingPickup(null);
  };

  const handleEdit = (pickup: AirportPickup) => {
    setFormData({
      pickup_type: pickup.pickup_type,
      pickup_from: pickup.pickup_from,
      dropoff: pickup.dropoff,
      airport: pickup.airport || '',
      passengers: pickup.passengers,
      pickup_time: pickup.pickup_time,
      vehicle: pickup.vehicle,
      note: pickup.note,
      price: pickup.price,
      status: pickup.status
    });
    setEditingPickup(pickup);
    setShowModal(true);
  };

  const handleDelete = (pickupId: number) => {
    if (confirm('Are you sure you want to delete this airport pickup booking?')) {
      setPickups(pickups.filter(pickup => pickup.pickup_id !== pickupId));
    }
  };

  const updateStatus = (pickupId: number, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    setPickups(pickups.map(pickup => 
      pickup.pickup_id === pickupId 
        ? { ...pickup, status: newStatus }
        : pickup
    ));
  };

  const resetForm = () => {
    setFormData({
      pickup_type: 'one_way',
      pickup_from: '',
      dropoff: '',
      airport: '',
      passengers: 1,
      pickup_time: '',
      vehicle: '',
      note: '',
      price: 0,
      status: 'pending'
    });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex' }}>
  <AdminSidebar active="airportpickup" />

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#053b3c', margin: 0 }}>Airport Pickup Management</h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage airport transfer bookings and schedules</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search pickups..."
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
              <span>+</span> New Pickup Booking
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
              }}>✈️</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {pickups.length}
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
                  {pickups.filter(p => p.status === 'confirmed').length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Confirmed</p>
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
                  {pickups.filter(p => p.status === 'pending').length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Pending</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pickups Table */}
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
            <div>Type</div>
            <div>Route</div>
            <div>Passengers</div>
            <div>Pickup Time</div>
            <div>Vehicle</div>
            <div>Price</div>
            <div>Actions</div>
          </div>

          {/* Table Rows */}
          {filteredPickups.map((pickup, index) => (
            <div
              key={pickup.pickup_id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr 1fr 1fr',
                gap: '12px',
                padding: '20px',
                borderBottom: index < filteredPickups.length - 1 ? '1px solid #f1f5f9' : 'none',
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
              {/* Type */}
              <div>
                <div style={{
                  backgroundColor: pickup.pickup_type === 'one_way' ? '#dbeafe' : '#f3e8ff',
                  color: pickup.pickup_type === 'one_way' ? '#1e40af' : '#7e22ce',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  width: 'fit-content'
                }}>
                  {getPickupTypeIcon(pickup.pickup_type)} {getPickupTypeText(pickup.pickup_type)}
                </div>
              </div>

              {/* Route */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c', marginBottom: '4px' }}>
                  {pickup.pickup_from}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  to {pickup.dropoff}
                </div>
                {pickup.airport && (
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
                    Airport: {pickup.airport}
                  </div>
                )}
              </div>

              {/* Passengers */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#053b3c' }}>
                  {pickup.passengers}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  passengers
                </div>
              </div>

              {/* Pickup Time */}
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#053b3c' }}>
                  {new Date(pickup.pickup_time).toLocaleDateString()}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {new Date(pickup.pickup_time).toLocaleTimeString()}
                </div>
              </div>

              {/* Vehicle */}
              <div style={{ fontSize: '14px', color: '#374151' }}>
                {pickup.vehicle}
              </div>

              {/* Price */}
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#059669' }}>
                  ${pickup.price}
                </div>
                <div style={{
                  backgroundColor: getStatusColor(pickup.status) + '15',
                  color: getStatusColor(pickup.status),
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '11px',
                  fontWeight: '600',
                  display: 'inline-block',
                  marginTop: '4px'
                }}>
                  {getStatusText(pickup.status)}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleEdit(pickup)}
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
                  onClick={() => handleDelete(pickup.pickup_id)}
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
        {filteredPickups.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginTop: '20px'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✈️</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#475569', margin: '0 0 8px 0' }}>
              {searchTerm ? 'No pickup bookings found' : 'No airport pickup bookings yet'}
            </h3>
            <p style={{ margin: '0 0 20px 0' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first airport pickup booking'}
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

      {/* Add/Edit Pickup Modal */}
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
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#053b3c', margin: '0 0 20px 0' }}>
              {editingPickup ? 'Edit Airport Pickup' : 'New Airport Pickup Booking'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Pickup Type
                  </label>
                  <select
                    required
                    value={formData.pickup_type}
                    onChange={(e) => setFormData({...formData, pickup_type: e.target.value as any})}
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
                    <option value="one_way">➡️ One Way</option>
                    <option value="two_way">🔄 Two Way</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Number of Passengers
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="50"
                    value={formData.passengers}
                    onChange={(e) => setFormData({...formData, passengers: parseInt(e.target.value)})}
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Pickup From
                </label>
                <input
                  type="text"
                  required
                  value={formData.pickup_from}
                  onChange={(e) => setFormData({...formData, pickup_from: e.target.value})}
                  placeholder="Airport name or address"
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Dropoff Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.dropoff}
                  onChange={(e) => setFormData({...formData, dropoff: e.target.value})}
                  placeholder="Hotel name or address"
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

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Airport (Optional)
                </label>
                <select
                  value={formData.airport}
                  onChange={(e) => setFormData({...formData, airport: e.target.value})}
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
                  <option value="">Select airport (optional)</option>
                  {airports.map(airport => (
                    <option key={airport.code} value={airport.code}>
                      {airport.name} ({airport.code})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Pickup Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.pickup_time}
                    onChange={(e) => setFormData({...formData, pickup_time: e.target.value})}
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
                    value={formData.vehicle}
                    onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
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
                    {availableVehicles.map(vehicle => (
                      <option key={vehicle} value={vehicle}>
                        {vehicle}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Price ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
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
                  Notes
                </label>
                <textarea
                  rows={3}
                  value={formData.note}
                  onChange={(e) => setFormData({...formData, note: e.target.value})}
                  placeholder="Special instructions, flight details, etc."
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
                  {editingPickup ? 'Update Booking' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}