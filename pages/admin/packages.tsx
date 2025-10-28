import React, { useState } from 'react';
import Link from 'next/link';

export default function AdminPackages() {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPackage, setEditingPackage] = useState(null);

  const [packages, setPackages] = useState([
    {
      package_id: 1,
      package_name: 'Makkah & Madinah Spiritual Journey',
      description: 'A comprehensive 10-day spiritual journey visiting the holy cities of Makkah and Madinah. Includes guided tours, accommodation, and transportation.',
      price: 2499,
      image: '/api/placeholder/300/200'
    },
    {
      package_id: 2,
      package_name: 'Umrah Premium Package',
      description: 'Luxury Umrah experience with 5-star hotels, private transportation, and expert spiritual guides. Perfect for families and groups.',
      price: 1899,
      image: '/api/placeholder/300/200'
    },
    {
      package_id: 3,
      package_name: 'Family Hajj Package',
      description: 'Specialized package for families with children. Includes family-friendly accommodations, educational activities, and dedicated support.',
      price: 4299,
      image: '/api/placeholder/300/200'
    },
    {
      package_id: 4,
      package_name: 'Budget Umrah Experience',
      description: 'Affordable Umrah package with comfortable 3-star hotels, group transportation, and essential services for a blessed journey.',
      price: 1299,
      image: '/api/placeholder/300/200'
    }
  ]);

  const [formData, setFormData] = useState({
    package_name: '',
    description: '',
    price: '',
    image: ''
  });

  const filteredPackages = packages.filter(pkg =>
    pkg.package_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPackage) {
      // Update existing package
      setPackages(packages.map(pkg => 
        pkg.package_id === editingPackage.package_id 
          ? { ...formData, package_id: editingPackage.package_id }
          : pkg
      ));
    } else {
      // Add new package
      const newPackage = {
        ...formData,
        package_id: Math.max(...packages.map(p => p.package_id)) + 1
      };
      setPackages([...packages, newPackage]);
    }
    setShowModal(false);
    setFormData({ package_name: '', description: '', price: '', image: '' });
    setEditingPackage(null);
  };

  const handleEdit = (pkg) => {
    setFormData({
      package_name: pkg.package_name,
      description: pkg.description,
      price: pkg.price,
      image: pkg.image
    });
    setEditingPackage(pkg);
    setShowModal(true);
  };

  const handleDelete = (packageId) => {
    if (confirm('Are you sure you want to delete this package?')) {
      setPackages(packages.filter(pkg => pkg.package_id !== packageId));
    }
  };

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
                color: item.id === 'packages' ? 'white' : 'rgba(255,255,255,0.9)',
                backgroundColor: item.id === 'packages' ? '#0a4a4b' : 'transparent',
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
                e.target.style.backgroundColor = '#0a4a4b';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#053b3c';
                e.target.style.transform = 'translateY(0)';
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
                  ${Math.min(...packages.map(p => p.price))}
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
                  ${pkg.price}
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
                  margin: '0 0 20px 0',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {pkg.description}
                </p>

                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'space-between'
                }}>
                  <button
                    onClick={() => handleEdit(pkg)}
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
                    onClick={() => handleDelete(pkg.package_id)}
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
            maxWidth: '500px',
            width: '100%',
            maxHeight: '80vh',
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
                  rows="4"
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