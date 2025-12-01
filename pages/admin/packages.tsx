import React, { useState, useEffect, FormEvent, MouseEvent } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import Link from 'next/link';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import useTranslation from '../../src/i18n/useTranslation';

interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string;
  image?: string;
}

interface Package {
  package_id: string;
  package_name: string;
  description: string;
  price: number | null;
  image: string;
  highlights: string;
  includings: string;
  days?: number;
  itinerary?: string;
}

interface FormData {
  package_name: string;
  description: string;
  price: string;
  image: string;
  highlights: string;
  includings: string;
  days: number;
}

export default function AdminPackages() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    package_name: '',
    description: '',
    price: '',
    image: '',
    highlights: '',
    includings: '',
    days: 1
  });

  const [dayItineraries, setDayItineraries] = useState<DayItinerary[]>([{
    day: 1,
    title: '',
    description: '',
    activities: '',
    image: ''
  }]);

  // Fetch packages from backend on mount
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/packages');
      if (!res.ok) throw new Error('Failed to fetch packages');
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error('Error fetching packages:', err);
      alert('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse highlights/includings string to array
  const parseList = (str: string): string[] => {
    if (!str) return [];
    return str.split('\n').map(s => s.trim()).filter(Boolean);
  };

  // Helper to convert array to string for DB
  const stringifyList = (arr: string[]): string => {
    return arr.join('\n');
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const submitData = {
        package_name: formData.package_name,
        description: formData.description,
        price: formData.price ? parseFloat(formData.price) : null,
        image: formData.image,
        highlights: formData.highlights,
        includings: formData.includings,
        days: formData.days,
        itinerary: JSON.stringify(dayItineraries)
      };

      if (editingPackage) {
        // Update existing package
        const res = await fetch(`/api/packages/${editingPackage.package_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
        if (!res.ok) throw new Error('Failed to update package');
        const updated = await res.json();
        setPackages(packages.map(pkg => pkg.package_id === updated.package_id ? updated : pkg));
      } else {
        // Add new package
        const res = await fetch('/api/packages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(submitData)
        });
        if (!res.ok) throw new Error('Failed to create package');
        const created = await res.json();
        setPackages([...packages, created]);
      }
      
      setShowModal(false);
      resetForm();
      setEditingPackage(null);
    } catch (err) {
      console.error('Error saving package:', err);
      alert('Failed to save package');
    }
  };

  const resetForm = () => {
    setFormData({
      package_name: '',
      description: '',
      price: '',
      image: '',
      highlights: '',
      includings: '',
      days: 1
    });
    setDayItineraries([{
      day: 1,
      title: '',
      description: '',
      activities: '',
      image: ''
    }]);
  };

  const handleEdit = (pkg: Package) => {
    setFormData({
      package_name: pkg.package_name,
      description: pkg.description,
      price: pkg.price ? String(pkg.price) : '',
      image: pkg.image,
      highlights: pkg.highlights,
      includings: pkg.includings,
      days: pkg.days || 1
    });
    
    // Parse itinerary if exists
    if (pkg.itinerary) {
      try {
        const parsedItinerary = JSON.parse(pkg.itinerary);
        setDayItineraries(parsedItinerary);
      } catch (e) {
        setDayItineraries([{ day: 1, title: '', description: '', activities: '' }]);
      }
    } else {
      setDayItineraries([{ day: 1, title: '', description: '', activities: '', image: '' }]);
    }
    
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDelete = async (packageId: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      const res = await fetch(`/api/packages/${packageId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete package');
      setPackages(packages.filter(pkg => pkg.package_id !== packageId));
    } catch (err) {
      console.error('Error deleting package:', err);
      alert('Failed to delete package');
    }
  };

  const handleDaysChange = (days: number) => {
    setFormData({ ...formData, days });
    
    // Adjust itinerary array based on days
    const currentLength = dayItineraries.length;
    if (days > currentLength) {
      // Add new days
      const newDays = Array.from({ length: days - currentLength }, (_, i) => ({
        day: currentLength + i + 1,
        title: '',
        description: '',
        activities: '',
        image: ''
      }));
      setDayItineraries([...dayItineraries, ...newDays]);
    } else if (days < currentLength) {
      // Remove extra days
      setDayItineraries(dayItineraries.slice(0, days));
    }
  };

  const updateDayItinerary = (dayIndex: number, field: keyof DayItinerary, value: string | number) => {
    const updated = [...dayItineraries];
    updated[dayIndex] = { ...updated[dayIndex], [field]: value };
    setDayItineraries(updated);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <AdminSidebar />
        <div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>
          <h2>Loading packages...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'Poppins, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <Head>
        <title>Tour Packages - Admin Panel</title>
      </Head>
      <AdminSidebar active="packages" />

      {/* Main Content */}
      <div style={{ marginLeft: '280px', padding: '30px', minHeight: '100vh' }}>
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
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#053b3c', margin: 0 }}>Tour Packages</h1>
            <p style={{ color: '#64748b', margin: '5px 0 0 0' }}>Manage and create amazing tour packages for your customers</p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search packages..."
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
              <span>+</span> Add New Package
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
              }}>📦</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {packages.length}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Total Packages</p>
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
              }}>💰</div>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#053b3c', margin: 0 }}>
                  {packages.length > 0 ? `$${Math.min(...packages.map(p => p.price || 0))}` : '$0'}
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Starting From</p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '25px'
        }}>
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.package_id}
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
              {/* Package Image */}
              <div style={{
                height: '200px',
                backgroundColor: '#e2e8f0',
                backgroundImage: `url(${pkg.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#053b3c',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {pkg.price ? `$${pkg.price}` : 'Price TBD'}
                </div>
              </div>

              {/* Package Content */}
              <div style={{ padding: '20px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#053b3c',
                  margin: '0 0 8px 0',
                  lineHeight: '1.3'
                }}>
                  {pkg.package_name}
                </h3>
                
                <p style={{
                  color: '#64748b',
                  fontSize: '14px',
                  lineHeight: '1.5',
                  margin: '0 0 16px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {pkg.description}
                </p>

                {/* Highlights Section */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#053b3c', 
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '16px' }}>✨</span> Highlights
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '6px',
                    marginBottom: '12px'
                  }}>
                    {parseList(pkg.highlights).map((highlight, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: 'rgba(5, 59, 60, 0.05)',
                          color: '#053b3c',
                          padding: '4px 10px',
                          borderRadius: '16px',
                          fontSize: '12px',
                          fontWeight: '500'
                        }}
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Inclusions Section */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#053b3c', 
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ fontSize: '16px' }}>✓</span> Package Includes
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '6px',
                    fontSize: '13px',
                    color: '#64748b'
                  }}>
                    {parseList(pkg.includings).map((inclusion, index) => (
                      <div
                        key={index}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span style={{ 
                          color: '#10b981', 
                          fontSize: '12px' 
                        }}>•</span>
                        {inclusion}
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
                    onClick={() => handleEdit(pkg)}
                    className="admin-button-outline primary"
                    style={{ flex: 1 }}
                  >
                    Edit
                  </button>
                  
                  <button
                    onClick={() => handleDelete(pkg.package_id)}
                    className="admin-button-outline danger"
                    style={{ flex: 1 }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPackages.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: '#64748b',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#475569', margin: '0 0 8px 0' }}>
              {searchTerm ? 'No packages found' : 'No packages yet'}
            </h3>
            <p style={{ margin: '0 0 20px 0' }}>
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first tour package to get started'}
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
                Create First Package
              </button>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit Package Modal */}
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
            maxHeight: '85vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#053b3c', margin: '0 0 20px 0' }}>
              {editingPackage ? 'Edit Package' : 'Add New Package'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Package Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.package_name}
                  onChange={(e) => setFormData({...formData, package_name: e.target.value})}
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
                  Description
                </label>
                <textarea
                  required
                  rows={4}
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
                  Price ($)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
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
                  Number of Days
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={formData.days}
                  onChange={(e) => handleDaysChange(parseInt(e.target.value) || 1)}
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

              <CloudinaryUpload
                currentImageUrl={formData.image}
                onUploadSuccess={(url) => setFormData({...formData, image: url})}
                folder="zamzam-tours/packages"
                label="Package Image"
              />

              {/* Day-by-Day Itinerary */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#053b3c', marginBottom: '12px' }}>
                  Day-by-Day Itinerary
                </label>
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '15px' }}>
                  {dayItineraries.map((dayData, index) => (
                    <div key={index} style={{ 
                      marginBottom: index < dayItineraries.length - 1 ? '20px' : '0',
                      paddingBottom: index < dayItineraries.length - 1 ? '20px' : '0',
                      borderBottom: index < dayItineraries.length - 1 ? '1px solid #e5e7eb' : 'none'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px',
                        marginBottom: '10px',
                        backgroundColor: '#f0fdfa',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        border: '1px solid #99f6e4'
                      }}>
                        <span style={{ fontWeight: '600', color: '#0d9488', fontSize: '14px' }}>Day {dayData.day}</span>
                      </div>
                      
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                          Day Title
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g., Arrival in Colombo"
                          value={dayData.title}
                          onChange={(e) => updateDayItinerary(index, 'title', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '13px',
                            outline: 'none'
                          }}
                        />
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                          Description
                        </label>
                        <textarea
                          required
                          rows={2}
                          placeholder="Brief overview of the day"
                          value={dayData.description}
                          onChange={(e) => updateDayItinerary(index, 'description', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '13px',
                            outline: 'none',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
                          Activities (one per line)
                        </label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Visit temple\nCity tour\nBeach relaxation"
                          value={dayData.activities}
                          onChange={(e) => updateDayItinerary(index, 'activities', e.target.value)}
                          style={{
                            width: '100%',
                            padding: '8px 10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '4px',
                            fontSize: '13px',
                            outline: 'none',
                            resize: 'vertical'
                          }}
                        />
                      </div>

                      <div style={{ marginTop: '10px' }}>
                        <CloudinaryUpload
                          currentImageUrl={dayData.image || ''}
                          onUploadSuccess={(url) => updateDayItinerary(index, 'image', url)}
                          folder="zamzam-tours/itinerary"
                          label={`Day ${dayData.day} Image (Optional)`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Highlights (places visited - one per line)
                </label>
                <textarea
                  required
                  value={formData.highlights}
                  onChange={(e) => setFormData({...formData, highlights: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '100px',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder="Enter each highlight on a new line"
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

              <div style={{ marginBottom: '30px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Inclusions (one per line)
                </label>
                <textarea
                  required
                  value={formData.includings}
                  onChange={(e) => setFormData({...formData, includings: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    minHeight: '100px',
                    transition: 'all 0.2s ease'
                  }}
                  placeholder="Enter each inclusion on a new line"
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
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}