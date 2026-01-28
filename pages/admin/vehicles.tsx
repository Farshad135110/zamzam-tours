import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import useTranslation from '../../src/i18n/useTranslation';

interface VehicleImage {
  image_id?: number;
  vehicle_id?: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
}

interface Vehicle {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_type: string;
  description: string;
  km_per_day: number;
  price_per_day: number;
  extra_charge_per_km: number;
  image: string;
  images?: VehicleImage[];
  capacity: number;
  available_for: string;
}

export default function AdminVehicles() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    vehicle_name: '',
    vehicle_type: '',
    description: '',
    km_per_day: 300,
    price_per_day: 50,
    extra_charge_per_km: 0.3,
    image: '',
    images: [] as VehicleImage[],
    capacity: 4,
    available_for: ''
  });

  // Fetch vehicles from backend on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/vehicles');
      if (!res.ok) throw new Error('Failed to fetch vehicles');
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error('Error fetching vehicles:', err);
      alert('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse available_for string to array
  const parseAvailableFor = (availableForStr: string): string[] => {
    if (!availableForStr) return [];
    return availableForStr.split(',').map(s => s.trim()).filter(Boolean);
  };

  // Helper to convert array to string for DB
  const stringifyAvailableFor = (availableForArr: string | string[]): string => {
    if (typeof availableForArr === 'string') return availableForArr;
    return availableForArr.join(',');
  };

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
      default: return '';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVehicle) {
        // Update existing vehicle
        const res = await fetch(`/api/vehicles/${editingVehicle.vehicle_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to update vehicle');
        }
        const updated = await res.json();
        setVehicles(vehicles.map(v => v.vehicle_id === updated.vehicle_id ? updated : v));
      } else {
        // Add new vehicle
        const res = await fetch('/api/vehicles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to create vehicle');
        }
        const created = await res.json();
        setVehicles([...vehicles, created]);
      }
      setShowModal(false);
      resetForm();
      setEditingVehicle(null);
    } catch (err: any) {
      console.error('Error saving vehicle:', err);
      alert(err.message || 'Failed to save vehicle');
    }
  };

  const resetForm = () => {
    setFormData({ 
      vehicle_name: '', 
      vehicle_type: '', 
      description: '',
      km_per_day: 300,
      price_per_day: 50,
      extra_charge_per_km: 0.3,
      image: '', 
      images: [] as VehicleImage[],
      capacity: 4,
      available_for: ''
    });
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
      images: vehicle.images || [],
      capacity: vehicle.capacity,
      available_for: vehicle.available_for
    });
    setEditingVehicle(vehicle);
    setShowModal(true);
  };

  const handleDelete = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, { method: 'DELETE' });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to delete vehicle');
      }
      setVehicles(vehicles.filter(v => v.vehicle_id !== vehicleId));
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      alert(err.message || 'Failed to delete vehicle');
    }
  };

  const toggleAvailableFor = (type: string) => {
    const currentTypes = formData.available_for.split(',').filter(Boolean);
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFormData(prev => ({
      ...prev,
      available_for: newTypes.join(',')
    }));
  };

  const vehicleTypes = ['Van', 'MPV', 'Bus', 'Mini Bus', 'Sedan', 'SUV', 'Luxury Car'];
  const usageTypes = [
    { value: 'self_drive', label: 'Self Drive', icon: '👤' },
    { value: 'with_driver', label: 'With Driver', icon: '👨‍💼' },
    { value: 'tour', label: 'Tour Package', icon: '🗺️' }
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
          <h2>Loading vehicles...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', position: 'fixed', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Head>
        <title>Fleet Management - Admin Panel</title>
      </Head>
      <AdminSidebar active="vehicles" />

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
                  {vehicles.filter(v => parseAvailableFor(v.available_for).includes('self_drive')).length}
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
                  {vehicles.filter(v => parseAvailableFor(v.available_for).includes('with_driver')).length}
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
                  {vehicle.price_per_day > 0 ? `$${vehicle.price_per_day}/day` : t('home.tours.priceOnRequest', 'Price on Request')}
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
                      {vehicle.extra_charge_per_km > 0 ? `$${vehicle.extra_charge_per_km}/extra km` : t('home.tours.priceOnRequest', 'Price on Request')}
                    </span>
                  </div>
                </div>

                {/* Available For */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '500', marginBottom: '8px' }}>
                    Available For:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {parseAvailableFor(vehicle.available_for).map(type => {
                      if (["self-drive", "with-driver"].includes(type)) return null;
                      return (
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
                      );
                    })}
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
                      padding: '0.5rem',
                      background: '#053b3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(vehicle.vehicle_id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      fontWeight: '600',
                      cursor: 'pointer'
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
                    min="0"
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
                    min="0"
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
                  {usageTypes.map(usage => {
                    const currentTypes = formData.available_for.split(',').filter(Boolean);
                    const isChecked = currentTypes.includes(usage.value);
                    return (
                      <label
                        key={usage.value}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          padding: '8px 12px',
                          border: `1px solid ${isChecked ? '#053b3c' : '#d1d5db'}`,
                          borderRadius: '6px',
                          backgroundColor: isChecked ? '#053b3c' : 'transparent',
                          color: isChecked ? 'white' : '#374151',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleAvailableFor(usage.value)}
                          style={{ display: 'none' }}
                        />
                        <span>{usage.icon}</span>
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>{usage.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <CloudinaryUpload
                currentImageUrl={formData.image}
                onUploadSuccess={(url) => setFormData({...formData, image: url})}
                folder="zamzam-tours/vehicles"
                label="Primary Vehicle Image"
              />

              {/* Vehicle Gallery - Multiple Images */}
              <div style={{ marginTop: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '12px', color: '#374151' }}>
                  Vehicle Gallery (Multiple Images)
                </label>
                
                {/* Display current images */}
                {formData.images.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                    {formData.images.map((img, index) => (
                      <div key={index} style={{ position: 'relative', aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                        <img 
                          src={img.image_url} 
                          alt={`Vehicle ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{ position: 'absolute', top: '4px', right: '4px', display: 'flex', gap: '4px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = [...formData.images];
                              newImages[index].is_primary = true;
                              newImages.forEach((img, i) => {
                                if (i !== index) img.is_primary = false;
                              });
                              setFormData({...formData, images: newImages});
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: img.is_primary ? '#10b981' : '#6b7280',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                            title={img.is_primary ? 'Primary image' : 'Set as primary'}
                          >
                            {img.is_primary ? '⭐' : '☆'}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== index);
                              setFormData({...formData, images: newImages});
                            }}
                            style={{
                              padding: '4px 8px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            ×
                          </button>
                        </div>
                        {img.is_primary && (
                          <div style={{
                            position: 'absolute',
                            bottom: '4px',
                            left: '4px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: '600'
                          }}>
                            Primary
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Add new images - Support both single and multiple */}
                <CloudinaryUpload
                  currentImageUrl=""
                  onUploadSuccess={(urls) => {
                    const urlArray = Array.isArray(urls) ? urls : [urls];
                    const newImages: VehicleImage[] = urlArray.map((url, idx) => ({
                      image_url: url,
                      is_primary: formData.images.length === 0 && idx === 0,
                      display_order: formData.images.length + idx + 1
                    }));
                    setFormData({...formData, images: [...formData.images, ...newImages]});
                  }}
                  folder="zamzam-tours/vehicles"
                  label="Upload Images (Single or Multiple)"
                  multiple={true}
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