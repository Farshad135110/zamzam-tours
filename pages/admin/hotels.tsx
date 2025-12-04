import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import useTranslation from '../../src/i18n/useTranslation';

interface Hotel {
  hotel_id: string;
  hotel_name: string;
  location: string;
  price_range: string;
  image?: string;
  facilities?: string;
}

export default function AdminHotels() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [selectedHotelForGallery, setSelectedHotelForGallery] = useState<Hotel | null>(null);
  const [galleryImages, setGalleryImages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingHotel, setEditingHotel] = useState<Hotel | null>(null);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [formData, setFormData] = useState({
    hotel_name: '',
    location: '',
    price_range: '$$',
    image: '',
    facilities: ''
  });

  const [galleryFormData, setGalleryFormData] = useState({
    image_url: '',
    caption: '',
    display_order: 0
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
    
    (async () => {
      try {
        if (editingHotel) {
          const res = await fetch(`/api/hotels/${editingHotel.hotel_id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to update');
          }
          const updated = await res.json();
          setHotels(prev => prev.map(h => h.hotel_id === updated.hotel_id ? updated : h));
        } else {
          const res = await fetch('/api/hotels', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
          });
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Failed to create');
          }
          const created = await res.json();
          setHotels(prev => [...prev, created]);
        }
      } catch (err: any) {
        console.error('Error saving hotel:', err);
        const errorMessage = err.response?.data?.error || err.message || 'Failed to save hotel';
        const errorDetails = err.response?.data?.details || '';
        alert(`Error saving hotel: ${errorMessage}${errorDetails ? '\n' + errorDetails : ''}`);
      } finally {
        setShowModal(false);
        resetForm();
        setEditingHotel(null);
      }
    })();
  };

  const resetForm = () => {
    setFormData({
      hotel_name: '',
      location: '',
      price_range: '$$',
      image: '',
      facilities: ''
    });
  };

  const handleEdit = (hotel: Hotel) => {
    setFormData({
      hotel_name: hotel.hotel_name,
      location: hotel.location,
      price_range: hotel.price_range,
      image: hotel.image || '',
      facilities: hotel.facilities || ''
    });
    setEditingHotel(hotel);
    setShowModal(true);
  };

  const handleDelete = (hotelId: string) => {
    if (!confirm('Are you sure you want to delete this hotel?')) return;
    (async () => {
      try {
        const res = await fetch(`/api/hotels/${hotelId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete');
        setHotels(prev => prev.filter(h => h.hotel_id !== hotelId));
      } catch (err) {
        console.error(err);
        alert('Delete failed');
      }
    })();
  };

  // Gallery Management Functions
  const handleOpenGallery = async (hotel: Hotel) => {
    setSelectedHotelForGallery(hotel);
    setShowGalleryModal(true);
    // Fetch gallery images
    try {
      const res = await fetch(`/api/hotel-gallery?hotel_id=${hotel.hotel_id}`);
      if (res.ok) {
        const data = await res.json();
        setGalleryImages(data);
      }
    } catch (err) {
      console.error('Failed to fetch gallery images:', err);
    }
  };

  const handleAddGalleryImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHotelForGallery) return;

    try {
      const res = await fetch('/api/hotel-gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotel_id: selectedHotelForGallery.hotel_id,
          ...galleryFormData
        })
      });
      
      if (res.ok) {
        const newImage = await res.json();
        setGalleryImages(prev => [...prev, newImage]);
        setGalleryFormData({ image_url: '', caption: '', display_order: 0 });
      }
    } catch (err) {
      console.error('Failed to add gallery image:', err);
      alert('Failed to add image');
    }
  };

  const handleDeleteGalleryImage = async (galleryId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    
    try {
      const res = await fetch(`/api/hotel-gallery?gallery_id=${galleryId}`, {
        method: 'DELETE'
      });
      
      if (res.ok) {
        setGalleryImages(prev => prev.filter(img => img.gallery_id !== galleryId));
      }
    } catch (err) {
      console.error('Failed to delete gallery image:', err);
      alert('Failed to delete image');
    }
  };

  const priceRanges = [
    { value: '$', label: '$ - Budget' },
    { value: '$$', label: '$$ - Economy' },
    { value: '$$$', label: '$$$ - Premium' },
    { value: '$$$$', label: '$$$$ - Luxury' },
    { value: '$$$$$', label: '$$$$$ - Ultra Luxury' }
  ];

  // Fetch hotels from backend on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/hotels');
        if (!res.ok) throw new Error('Failed to fetch hotels');
        const data = await res.json();
        if (mounted) setHotels(data);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  // Helper to parse facilities string to array
  const getFacilitiesArray = (facilities?: string): string[] => {
    if (!facilities) return [];
    return facilities.split(',').map(f => f.trim()).filter(f => f.length > 0);
  };

    return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', position: 'fixed', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Head>
        <title>Hotels - Admin Panel</title>
      </Head>
      <AdminSidebar active="hotels" />

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
                  flexWrap: 'wrap', 
                  gap: '6px',
                  marginBottom: '16px'
                }}>
                  {getFacilitiesArray(hotel.facilities).map((facility, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: '#f1f5f9',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: '#64748b'
                      }}
                    >
                      {facility}
                    </span>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => handleOpenGallery(hotel)}
                    style={{
                      flex: '1 1 auto',
                      minWidth: '70px',
                      padding: '10px 16px',
                      backgroundColor: '#f8b500',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      const btn = e.target as HTMLButtonElement;
                      btn.style.backgroundColor = '#d99d00';
                      btn.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      const btn = e.target as HTMLButtonElement;
                      btn.style.backgroundColor = '#f8b500';
                      btn.style.transform = 'translateY(0)';
                    }}
                  >
                    📸 Gallery
                  </button>
                  
                  <button
                    onClick={() => handleEdit(hotel)}
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
                    onClick={() => handleDelete(hotel.hotel_id)}
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

              <CloudinaryUpload
                currentImageUrl={formData.image}
                onUploadSuccess={(url) => setFormData({...formData, image: url})}
                folder="zamzam-tours/hotels"
                label="Hotel Image"
              />

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Facilities (comma-separated)
                </label>
                <textarea
                  rows={3}
                  value={formData.facilities}
                  onChange={(e) => setFormData({...formData, facilities: e.target.value})}
                  placeholder="Free WiFi, Prayer Room, Restaurant, Room Service"
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
                  onFocus={(e) => {
                    e.target.style.borderColor = '#053b3c';
                    e.target.style.boxShadow = '0 0 0 3px rgba(5, 59, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                  Enter facilities separated by commas
                </p>
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
                  {editingHotel ? 'Update Hotel' : 'Create Hotel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && selectedHotelForGallery && (
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
        }} onClick={() => setShowGalleryModal(false)}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#053b3c', margin: '0 0 10px 0' }}>
              Gallery: {selectedHotelForGallery.hotel_name}
            </h2>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>Manage hotel photos</p>

            {/* Add New Image Form */}
            <form onSubmit={handleAddGalleryImage} style={{
              backgroundColor: '#f8fafc',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '30px'
            }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#053b3c', marginBottom: '15px' }}>
                Add New Image
              </h3>
              
              <CloudinaryUpload
                currentImageUrl={galleryFormData.image_url}
                onUploadSuccess={(url) => setGalleryFormData({...galleryFormData, image_url: url})}
                folder={`zamzam-tours/hotels/${selectedHotelForGallery.hotel_id}/gallery`}
                label="Gallery Image"
              />

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={galleryFormData.caption}
                  onChange={(e) => setGalleryFormData({...galleryFormData, caption: e.target.value})}
                  placeholder="Beautiful view from the room..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Display Order
                </label>
                <input
                  type="number"
                  value={galleryFormData.display_order}
                  onChange={(e) => setGalleryFormData({...galleryFormData, display_order: parseInt(e.target.value)})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={!galleryFormData.image_url}
                style={{
                  padding: '1rem 2rem',
                  background: galleryFormData.image_url ? 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)' : '#9ca3af',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: galleryFormData.image_url ? 'pointer' : 'not-allowed',
                  boxShadow: galleryFormData.image_url ? '0 4px 12px rgba(5, 59, 60, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (galleryFormData.image_url) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 59, 60, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (galleryFormData.image_url) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 59, 60, 0.3)';
                  }
                }}
              >
                + Add Image to Gallery
              </button>
            </form>

            {/* Gallery Images Grid */}
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#053b3c', marginBottom: '15px' }}>
                Current Gallery ({galleryImages.length} images)
              </h3>
              
              {galleryImages.length === 0 ? (
                <p style={{ color: '#64748b', textAlign: 'center', padding: '40px' }}>
                  No images in gallery yet. Add your first image above.
                </p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: '15px'
                }}>
                  {galleryImages.map((image) => (
                    <div key={image.gallery_id} style={{
                      position: 'relative',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #e2e8f0'
                    }}>
                      <img 
                        src={image.image_url} 
                        alt={image.caption || 'Gallery image'}
                        style={{
                          width: '100%',
                          height: '200px',
                          objectFit: 'cover'
                        }}
                      />
                      <div style={{
                        padding: '10px',
                        backgroundColor: 'white'
                      }}>
                        {image.caption && (
                          <p style={{
                            fontSize: '12px',
                            color: '#64748b',
                            margin: '0 0 8px 0',
                            lineHeight: '1.4'
                          }}>
                            {image.caption}
                          </p>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                            Order: {image.display_order}
                          </span>
                          <button
                            onClick={() => handleDeleteGalleryImage(image.gallery_id)}
                            style={{
                              padding: '4px 10px',
                              backgroundColor: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              fontSize: '12px',
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
              )}
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowGalleryModal(false)}
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
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}