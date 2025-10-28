import React, { useState } from 'react';
import Link from 'next/link';

interface Hotel {
  hotel_id: number;
  hotel_name: string;
  location: string;
  price_range: string;
  image: string;
}

export default function AdminHotels() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);

  const [hotels, setHotels] = useState<Hotel[]>([
    {
      hotel_id: 1,
      hotel_name: 'Makkah Royal Clock Tower',
      location: 'Makkah, Saudi Arabia',
      price_range: '$$$$',
      image: '/api/placeholder/300/200'
    },
    {
      hotel_id: 2,
      hotel_name: 'Madinah Hilton',
      location: 'Madinah, Saudi Arabia',
      price_range: '$$$',
      image: '/api/placeholder/300/200'
    },
    {
      hotel_id: 3,
      hotel_name: 'Swissotel Makkah',
      location: 'Makkah, Saudi Arabia',
      price_range: '$$$$',
      image: '/api/placeholder/300/200'
    },
    {
      hotel_id: 4,
      hotel_name: 'Intercontinental Madinah',
      location: 'Madinah, Saudi Arabia',
      price_range: '$$$',
      image: '/api/placeholder/300/200'
    },
    {
      hotel_id: 5,
      hotel_name: 'Raffles Makkah Palace',
      location: 'Makkah, Saudi Arabia',
      price_range: '$$$$$',
      image: '/api/placeholder/300/200'
    }
  ]);

  const [formData, setFormData] = useState({
    hotel_name: '',
    location: '',
    price_range: '$$',
    image: ''
  });

  const filteredHotels = hotels.filter(hotel =>
    hotel.hotel_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPriceRangeColor = (priceRange: string): string => {
    switch (priceRange) {
      case '$': return '#10b981';
      case '$$': return '#0ea5e9';
      case '$$$': return '#f59e0b';
      case '$$$$': return '#ef4444';
      case '$$$$$': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getPriceRangeText = (priceRange: string): string => {
    switch (priceRange) {
      case '$': return 'Budget';
      case '$$': return 'Economy';
      case '$$$': return 'Premium';
      case '$$$$': return 'Luxury';
      case '$$$$$': return 'Ultra Luxury';
      default: return 'Unknown';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingHotel) {
      // Update existing hotel
      setHotels(hotels.map(hotel => 
        hotel.hotel_id === editingHotel.hotel_id 
          ? { ...formData, hotel_id: editingHotel.hotel_id }
          : hotel
      ));
    } else {
      // Add new hotel
      const newHotel: Hotel = {
        ...formData,
        hotel_id: Math.max(...hotels.map(h => h.hotel_id)) + 1
      };
      setHotels([...hotels, newHotel]);
    }
    setShowModal(false);
    setFormData({ hotel_name: '', location: '', price_range: '$$', image: '' });
    setEditingHotel(null);
  };

  const handleEdit = (hotel: Hotel) => {
    setFormData({
      hotel_name: hotel.hotel_name,
      location: hotel.location,
      price_range: hotel.price_range,
      image: hotel.image
    });
    setEditingHotel(hotel);
    setShowModal(true);
  };

  const handleDelete = (hotelId: number) => {
    if (confirm('Are you sure you want to delete this hotel?')) {
      setHotels(hotels.filter(hotel => hotel.hotel_id !== hotelId));
    }
  };

  const priceRanges = [
    { value: '$', label: '$ - Budget' },
    { value: '$$', label: '$$ - Economy' },
    { value: '$$$', label: '$$$ - Premium' },
    { value: '$$$$', label: '$$$$ - Luxury' },
    { value: '$$$$$', label: '$$$$$ - Ultra Luxury' }
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
                color: item.id === 'hotels' ? 'white' : 'rgba(255,255,255,0.9)',
                backgroundColor: item.id === 'hotels' ? '#0a4a4b' : 'transparent',
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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#053b3c', margin: 0 }}>Hotels Management</h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage hotel partnerships and accommodations</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search hotels..."
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
              <span>+</span> Add New Hotel
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
                  {hotels.length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Total Hotels</p>
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
              }}>⭐</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {hotels.filter(h => h.price_range.includes('$$$')).length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Premium Hotels</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hotels Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.hotel_id}
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
              {/* Hotel Image */}
              <div style={{
                height: '200px',
                backgroundColor: '#e2e8f0',
                backgroundImage: `url(${hotel.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: getPriceRangeColor(hotel.price_range),
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {hotel.price_range} • {getPriceRangeText(hotel.price_range)}
                </div>
              </div>

              {/* Hotel Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#053b3c',
                  margin: '0 0 8px 0',
                  lineHeight: '1.3'
                }}>
                  {hotel.hotel_name}
                </h3>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <span style={{ color: '#6b7280', fontSize: '16px' }}>📍</span>
                  <span style={{
                    color: '#64748b',
                    fontSize: '14px'
                  }}>
                    {hotel.location}
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => handleEdit(hotel)}
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
                    onClick={() => handleDelete(hotel.hotel_id)}
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
        {filteredHotels.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏨</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#475569', margin: '0 0 8px 0' }}>
              {searchTerm ? 'No hotels found' : 'No hotels yet'}
            </h3>
            <p style={{ margin: '0 0 20px 0' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Add your first hotel to get started'}
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
                Add First Hotel
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Hotel Modal */}
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
              {editingHotel ? 'Edit Hotel' : 'Add New Hotel'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Hotel Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.hotel_name}
                  onChange={(e) => setFormData({...formData, hotel_name: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#053b3c';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 59, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#053b3c';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 59, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Price Range
                </label>
                <select
                  required
                  value={formData.price_range}
                  onChange={(e) => setFormData({...formData, price_range: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#053b3c';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 59, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {priceRanges.map(range => (
                    <option key={range.value} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
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
                  onFocus={(e) => {
                    e.target.style.borderColor = '#053b3c';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 59, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
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
                  {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}