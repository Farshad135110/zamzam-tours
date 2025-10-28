import React, { useState } from 'react';
import Link from 'next/link';

interface Vehicle {
  vehicle_id: number;
  vehicle_name: string;
  vehicle_type: string;
  description: string;
  km_per_day: number;
  price_per_day: number;
  extra_charge_per_km: number;
  image: string;
  capacity: number;
  available_for: string[];
}

export default function AdminVehicles() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      vehicle_id: 1,
      vehicle_name: 'Toyota Hiace',
      vehicle_type: 'Van',
      description: 'Comfortable 12-seater van perfect for group transfers and family trips. Features air conditioning and ample luggage space.',
      km_per_day: 300,
      price_per_day: 120,
      extra_charge_per_km: 0.5,
      image: '/api/placeholder/300/200',
      capacity: 12,
      available_for: ['with_driver', 'tour']
    },
    {
      vehicle_id: 2,
      vehicle_name: 'Mercedes Sprinter',
      vehicle_type: 'Mini Bus',
      description: 'Luxury mini bus with 20 comfortable seats, perfect for corporate transfers and large family groups.',
      km_per_day: 250,
      price_per_day: 200,
      extra_charge_per_km: 0.8,
      image: '/api/placeholder/300/200',
      capacity: 20,
      available_for: ['with_driver', 'tour']
    },
    {
      vehicle_id: 3,
      vehicle_name: 'Toyota Coaster',
      vehicle_type: 'Bus',
      description: 'Large capacity bus ideal for tour groups and pilgrim transport. Equipped with comfortable seating and storage.',
      km_per_day: 200,
      price_per_day: 300,
      extra_charge_per_km: 1.0,
      image: '/api/placeholder/300/200',
      capacity: 30,
      available_for: ['with_driver', 'tour']
    },
    {
      vehicle_id: 4,
      vehicle_name: 'Hyundai Staria',
      vehicle_type: 'MPV',
      description: 'Premium MPV with 7 luxury seats, perfect for family trips and executive transport.',
      km_per_day: 350,
      price_per_day: 80,
      extra_charge_per_km: 0.3,
      image: '/api/placeholder/300/200',
      capacity: 7,
      available_for: ['self_drive', 'with_driver', 'tour']
    },
    {
      vehicle_id: 5,
      vehicle_name: 'Toyota Camry',
      vehicle_type: 'Sedan',
      description: 'Comfortable sedan for city transfers and individual travel. Fuel efficient and reliable.',
      km_per_day: 400,
      price_per_day: 60,
      extra_charge_per_km: 0.2,
      image: '/api/placeholder/300/200',
      capacity: 4,
      available_for: ['self_drive', 'with_driver']
    }
  ]);

  const [formData, setFormData] = useState({
    vehicle_name: '',
    vehicle_type: '',
    description: '',
    km_per_day: 300,
    price_per_day: 50,
    extra_charge_per_km: 0.3,
    image: '',
    capacity: 4,
    available_for: [] as string[]
  });

  const filteredVehicles = vehicles.filter(vehicle =>
    vehicle.vehicle_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicle_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getVehicleIcon = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'van': return '🚐';
      case 'mpv': return '🚙';
      case 'bus': return '🚌';
      case 'mini bus': return '🚍';
      case 'sedan': return '🚗';
      case 'suv': return '🚙';
      default: return '🚗';
    }
  };

  const getUsageTypeIcon = (type: string): string => {
    switch (type) {
      case 'self_drive': return '👤';
      case 'with_driver': return '👨‍💼';
      case 'tour': return '🗺️';
      default: return '⚡';
    }
  };

  const getUsageTypeText = (type: string): string => {
    switch (type) {
      case 'self_drive': return 'Self Drive';
      case 'with_driver': return 'With Driver';
      case 'tour': return 'Tour Package';
      default: return type;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      // Update existing vehicle
      setVehicles(vehicles.map(vehicle => 
        vehicle.vehicle_id === editingVehicle.vehicle_id 
          ? { ...formData, vehicle_id: editingVehicle.vehicle_id }
          : vehicle
      ));
    } else {
      // Add new vehicle
      const newVehicle: Vehicle = {
        ...formData,
        vehicle_id: Math.max(...vehicles.map(v => v.vehicle_id)) + 1
      };
      setVehicles([...vehicles, newVehicle]);
    }
    setShowModal(false);
    setFormData({ 
      vehicle_name: '', 
      vehicle_type: '', 
      description: '',
      km_per_day: 300,
      price_per_day: 50,
      extra_charge_per_km: 0.3,
      image: '', 
      capacity: 4,
      available_for: []
    });
    setEditingVehicle(null);
  };

  const handleEdit = (vehicle: Vehicle) => {
    setFormData({
      vehicle_name: vehicle.vehicle_name,
      vehicle_type: vehicle.vehicle_type,
      description: vehicle.description,
      km_per_day: vehicle.km_per_day,
      price_per_day: vehicle.price_per_day,
      extra_charge_per_km: vehicle.extra_charge_per_km,
      image: vehicle.image,
      capacity: vehicle.capacity,
      available_for: vehicle.available_for
    });
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleDelete = (vehicleId: number) => {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(vehicle => vehicle.vehicle_id !== vehicleId));
    }
  };

  const toggleAvailableFor = (type: string) => {
    setFormData(prev => ({
      ...prev,
      available_for: prev.available_for.includes(type)
        ? prev.available_for.filter(t => t !== type)
        : [...prev.available_for, type]
    }));
  };

  const vehicleTypes = ['Van', 'MPV', 'Bus', 'Mini Bus', 'Sedan', 'SUV', 'Luxury Car'];
  const usageTypes = [
    { value: 'self_drive', label: 'Self Drive', icon: '👤' },
    { value: 'with_driver', label: 'With Driver', icon: '👨‍💼' },
    { value: 'tour', label: 'Tour Package', icon: '🗺️' }
  ];

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#053b3c', color: 'white', padding: '30px 20px', minHeight: '100vh' }}>
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ backgroundColor: '#0a4a4b', padding: '8px', borderRadius: '8px', fontSize: '18px' }}>⚡</span>
            ZamZam<br/>Tours
          </h2>
          <p style={{ fontSize: '12px', color: '#81c8c9', margin: 0 }}>Admin Dashboard</p>
        </div>

        <nav>
          {[
            { id: 'overview', label: 'Overview', href: '/admin' },
            { id: 'packages', label: 'Packages', href: '/admin/packages' },
            { id: 'vehicles', label: 'Vehicles', href: '/admin/vehicles' },
            { id: 'hotels', label: 'Hotels', href: '/admin/hotels' },
            { id: 'feedback', label: 'Feedback', href: '/admin/feedback' },
            { id: 'users', label: 'Users', href: '/admin/users' },
            { id: 'settings', label: 'Settings', href: '/admin/settings' }
          ].map(item => (
            <Link key={item.id} href={item.href} legacyBehavior>
              <a style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px 16px',
                marginBottom: '8px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: item.id === 'vehicles' ? 'white' : 'rgba(255,255,255,0.9)',
                backgroundColor: item.id === 'vehicles' ? '#0a4a4b' : 'transparent',
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

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#053b3c', margin: 0 }}>Fleet Management</h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage your vehicle fleet, pricing, and availability</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search vehicles..."
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
                e.target.style.backgroundColor = '#0a4a4b';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#053b3c';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span>+</span> Add New Vehicle
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
              }}>🚗</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {vehicles.length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Total Vehicles</p>
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
              }}>👤</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {vehicles.filter(v => v.available_for.includes('self_drive')).length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Self Drive</p>
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
              }}>👨‍💼</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {vehicles.filter(v => v.available_for.includes('with_driver')).length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>With Driver</p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '25px'
        }}>
          {filteredVehicles.map((vehicle) => (
            <div
              key={vehicle.vehicle_id}
              style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
              }}
            >
              {/* Vehicle Image */}
              <div style={{
                height: '200px',
                backgroundColor: '#e2e8f0',
                backgroundImage: `url(${vehicle.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(5, 59, 60, 0.9)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {getVehicleIcon(vehicle.vehicle_type)} {vehicle.vehicle_type}
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(239, 68, 68, 0.9)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  ${vehicle.price_per_day}/day
                </div>
              </div>

              {/* Vehicle Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#053b3c',
                  margin: '0 0 8px 0',
                  lineHeight: '1.3'
                }}>
                  {vehicle.vehicle_name}
                </h3>
                
                <p style={{
                  color: '#64748b',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  margin: '0 0 16px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {vehicle.description}
                </p>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6b7280', fontSize: '16px' }}>👥</span>
                    <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                      {vehicle.capacity} seats
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6b7280', fontSize: '16px' }}>📊</span>
                    <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                      {vehicle.km_per_day} km/day
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6b7280', fontSize: '16px' }}>💰</span>
                    <span style={{ color: '#374151', fontSize: '14px', fontWeight: '500' }}>
                      ${vehicle.extra_charge_per_km}/extra km
                    </span>
                  </div>
                </div>

                {/* Available For */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '8px' }}>
                    Available For:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {vehicle.available_for.map(type => (
                      <div
                        key={type}
                        style={{
                          backgroundColor: '#f1f5f9',
                          color: '#374151',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '500',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {getUsageTypeIcon(type)} {getUsageTypeText(type)}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => handleEdit(vehicle)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      backgroundColor: 'transparent',
                      color: '#053b3c',
                      border: '1px solid #053b3c',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#053b3c';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#053b3c';
                    }}
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(vehicle.vehicle_id)}
                    style={{
                      flex: 1,
                      padding: '10px 16px',
                      backgroundColor: 'transparent',
                      color: '#ef4444',
                      border: '1px solid #ef4444',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#ef4444';
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                      e.target.style.color = '#ef4444';
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredVehicles.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚗</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#475569', margin: '0 0 8px 0' }}>
              {searchTerm ? 'No vehicles found' : 'No vehicles yet'}
            </h3>
            <p style={{ margin: '0 0 20px 0' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first vehicle to get started'}
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
                Add First Vehicle
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Vehicle Modal */}
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
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#053b3c', margin: '0 0 20px 0' }}>
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Vehicle Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.vehicle_name}
                  onChange={(e) => setFormData({...formData, vehicle_name: e.target.value})}
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
                  Vehicle Type
                </label>
                <select
                  required
                  value={formData.vehicle_type}
                  onChange={(e) => setFormData({...formData, vehicle_type: e.target.value})}
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
                  <option value="">Select vehicle type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type}>
                      {getVehicleIcon(type)} {type}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                    Capacity (seats)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="100"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value)})}
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
                    KM per Day
                  </label>
                  <input
                    type="number"
                    required
                    min="50"
                    max="1000"
                    value={formData.km_per_day}
                    onChange={(e) => setFormData({...formData, km_per_day: parseInt(e.target.value)})}
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
                    Price per Day ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={formData.price_per_day}
                    onChange={(e) => setFormData({...formData, price_per_day: parseFloat(e.target.value)})}
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
                    Extra Charge per KM ($)
                  </label>
                  <input
                    type="number"
                    required
                    min="0.1"
                    step="0.01"
                    value={formData.extra_charge_per_km}
                    onChange={(e) => setFormData({...formData, extra_charge_per_km: parseFloat(e.target.value)})}
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
                  Available For
                </label>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {usageTypes.map(usage => (
                    <label
                      key={usage.value}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        border: `1px solid ${formData.available_for.includes(usage.value) ? '#053b3c' : '#d1d5db'}`,
                        borderRadius: '6px',
                        backgroundColor: formData.available_for.includes(usage.value) ? '#053b3c' : 'transparent',
                        color: formData.available_for.includes(usage.value) ? 'white' : '#374151',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={formData.available_for.includes(usage.value)}
                        onChange={() => toggleAvailableFor(usage.value)}
                        style={{ display: 'none' }}
                      />
                      <span>{usage.icon}</span>
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>{usage.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
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
                  {editingVehicle ? 'Update Vehicle' : 'Add Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}