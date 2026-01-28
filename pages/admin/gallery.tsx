import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import AdminSidebar from '../../components/AdminSidebar';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import useTranslation from '../../src/i18n/useTranslation';

interface GalleryImage {
  image_id: number;
  title: string;
  location: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BulkImageData {
  image_url: string;
  title?: string;
  location?: string;
  alt_text?: string;
  display_order?: number;
  is_active?: boolean;
}

export default function AdminGallery() {
  const { t } = useTranslation();
  const router = useRouter();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploadMode, setUploadMode] = useState<'single' | 'bulk'>('single');
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [bulkImages, setBulkImages] = useState<BulkImageData[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [bulkDetailsApply, setBulkDetailsApply] = useState({
    title: '',
    location: '',
    alt_text: '',
    display_order: 0,
    is_active: true
  });
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    image_url: '',
    alt_text: '',
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/gallery', {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching gallery images:', error);
      alert('Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = (urls: string | string[]) => {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    const newImages = urlArray.map(url => ({
      image_url: url,
      title: '',
      location: '',
      alt_text: '',
      display_order: 0,
      is_active: true
    }));
    setBulkImages([...bulkImages, ...newImages]);
  };

  const handleBulkImageChange = (index: number, field: string, value: any) => {
    const updatedImages = [...bulkImages];
    updatedImages[index] = { ...updatedImages[index], [field]: value };
    setBulkImages(updatedImages);
  };

  const removeBulkImage = (index: number) => {
    setBulkImages(bulkImages.filter((_, i) => i !== index));
  };

  const submitBulkImages = async () => {
    if (bulkImages.length === 0) {
      alert('Please upload at least one image');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const imgData of bulkImages) {
        // Use provided details, or use bulk apply details, or use defaults
        const imageToSubmit = {
          image_url: imgData.image_url,
          title: imgData.title || bulkDetailsApply.title || 'Untitled',
          location: imgData.location || bulkDetailsApply.location || 'Location',
          alt_text: imgData.alt_text || bulkDetailsApply.alt_text || '',
          display_order: imgData.display_order ?? bulkDetailsApply.display_order ?? 0,
          is_active: imgData.is_active ?? bulkDetailsApply.is_active ?? true
        };

        try {
          const response = await fetch('/api/gallery', {
            method: 'POST',
            headers,
            credentials: 'include',
            body: JSON.stringify(imageToSubmit)
          });

          if (response.ok) {
            successCount++;
          } else {
            failureCount++;
          }
        } catch (err) {
          failureCount++;
        }
      }

      alert(`Upload complete: ${successCount} successful, ${failureCount} failed`);
      
      if (successCount > 0) {
        setBulkImages([]);
        setBulkDetailsApply({
          title: '',
          location: '',
          alt_text: '',
          display_order: 0,
          is_active: true
        });
        setShowForm(false);
        setUploadMode('single');
        fetchImages();
      }
    } catch (error) {
      console.error('Error in bulk upload:', error);
      alert('Failed to upload images');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.image_url) {
      alert('Please upload an image');
      return;
    }

    // For single upload, title and location are now optional
    // Only require them if explicitly needed

    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      
      console.log('Submitting with token:', token ? 'Token exists' : 'No token');
      console.log('User data:', userStr);
      
      const url = editingImage 
        ? `/api/gallery/${editingImage.image_id}`
        : '/api/gallery';
      
      const method = editingImage ? 'PUT' : 'POST';
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization header added');
      } else {
        console.warn('No token available in localStorage');
      }
      
      const dataToSubmit = {
        ...formData,
        title: formData.title || 'Untitled',
        location: formData.location || 'Location'
      };

      const response = await fetch(url, {
        method,
        headers,
        credentials: 'include',
        body: JSON.stringify(dataToSubmit)
      });

      if (response.ok) {
        alert(editingImage ? 'Image updated successfully!' : 'Image added successfully!');
        setShowForm(false);
        setEditingImage(null);
        resetForm();
        fetchImages();
      } else {
        const error = await response.json();
        console.error('API Error:', error);
        alert(`${error.error || 'Failed to save image'}${error.details ? '\nDetails: ' + error.details : ''}${error.hint ? '\n\n' + error.hint : ''}`);
      }
    } catch (error) {
      console.error('Error saving image:', error);
      alert('Failed to save image');
    }
  };

  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      location: image.location,
      image_url: image.image_url,
      alt_text: image.alt_text || '',
      display_order: image.display_order,
      is_active: image.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      // Get token from localStorage as backup
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/gallery/${imageId}`, {
        method: 'DELETE',
        headers,
        credentials: 'include'
      });

      if (response.ok) {
        alert('Image deleted successfully!');
        fetchImages();
      } else {
        alert('Failed to delete image');
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      location: '',
      image_url: '',
      alt_text: '',
      display_order: 0,
      is_active: true
    });
    setEditingImage(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    resetForm();
  };

  const toggleImageSelection = (imageId: number) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedImages.length === images.length) {
      setSelectedImages([]);
    } else {
      setSelectedImages(images.map(img => img.image_id));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedImages.length === 0) {
      alert('Please select images to delete');
      return;
    }

    if (!confirm(`Are you sure you want to delete ${selectedImages.length} selected image(s)?`)) {
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;

      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      let successCount = 0;
      let failureCount = 0;

      for (const imageId of selectedImages) {
        try {
          const response = await fetch(`/api/gallery/${imageId}`, {
            method: 'DELETE',
            headers,
            credentials: 'include'
          });

          if (response.ok) {
            successCount++;
          } else {
            failureCount++;
          }
        } catch (err) {
          failureCount++;
        }
      }

      alert(`Deletion complete: ${successCount} deleted successfully${failureCount > 0 ? `, ${failureCount} failed` : ''}`);
      
      setSelectedImages([]);
      fetchImages();
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('Failed to delete images');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', position: 'fixed', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Head>
        <title>Gallery - Admin Panel</title>
      </Head>
      <AdminSidebar active="gallery" />
      
      <div style={{ 
        flex: 1, 
        marginLeft: '280px', 
        padding: '2rem',
        height: '100vh',
        overflowY: 'auto'
      }}>
        <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <h1 style={{ 
                fontSize: '2rem', 
                fontWeight: '700', 
                color: '#053b3c',
                marginBottom: '0.5rem'
              }}>
                🖼️ Gallery Management
              </h1>
              <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                Manage your gallery images - add, edit, and organize
              </p>
            </div>
            <button
              onClick={() => {
                setShowForm(!showForm);
                if (showForm) {
                  resetForm();
                  setBulkImages([]);
                  setUploadMode('single');
                }
              }}
              style={{
                padding: '0.875rem 1.75rem',
                background: showForm ? '#64748b' : 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: showForm ? 'none' : '0 4px 12px rgba(5, 59, 60, 0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!showForm) {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 59, 60, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = showForm ? 'none' : '0 4px 12px rgba(5, 59, 60, 0.3)';
              }}
            >
              {showForm ? '✕ Cancel' : '+ Add Images'}
            </button>
          </div>

          {/* Add/Edit Form */}
          {showForm && (
            <div style={{
              background: 'white',
              padding: '2.5rem',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              marginBottom: '2rem',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                marginBottom: '1.5rem', 
                color: '#053b3c',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}>
                {editingImage ? '✏️ Edit Image' : '📤 Upload Images'}
              </h2>

              {!editingImage && (
                <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setUploadMode('single')}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: uploadMode === 'single' ? '#053b3c' : '#f0f0f0',
                      color: uploadMode === 'single' ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    📷 Single Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('bulk')}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: uploadMode === 'bulk' ? '#053b3c' : '#f0f0f0',
                      color: uploadMode === 'bulk' ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    📦 Bulk Upload ({bulkImages.length})
                  </button>
                </div>
              )}

              {uploadMode === 'single' && !editingImage ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <CloudinaryUpload
                        folder="zamzam-tours/gallery"
                        onUploadSuccess={(url) => setFormData({ ...formData, image_url: url })}
                        currentImageUrl={formData.image_url}
                        label="Gallery Image *"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600', 
                        color: '#334155',
                        fontSize: '0.875rem'
                      }}>
                        Title (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#053b3c'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="e.g., Sigiriya Sunrise"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600', 
                        color: '#334155',
                        fontSize: '0.875rem'
                      }}>
                        Location (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#053b3c'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="e.g., Central Province"
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600', 
                        color: '#334155',
                        fontSize: '0.875rem'
                      }}>
                        Alt Text (for SEO)
                      </label>
                      <input
                        type="text"
                        value={formData.alt_text}
                        onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#053b3c'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="Describe the image for search engines"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600', 
                        color: '#334155',
                        fontSize: '0.875rem'
                      }}>
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#053b3c'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem', 
                          fontWeight: '600', 
                          color: '#334155', 
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          padding: '0.875rem',
                          background: '#f8fafc',
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#053b3c'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      >
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          style={{ 
                            width: '20px', 
                            height: '20px',
                            cursor: 'pointer',
                            accentColor: '#053b3c'
                          }}
                        />
                        Active (visible on website)
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
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
                      + Add Image
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      style={{
                        padding: '1rem 2rem',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : uploadMode === 'bulk' && !editingImage ? (
                <div>
                  <div style={{ marginBottom: '2rem' }}>
                    <CloudinaryUpload
                      folder="zamzam-tours/gallery"
                      onUploadSuccess={handleBulkUpload}
                      label="📦 Upload Multiple Images"
                      multiple={true}
                    />
                  </div>

                  {bulkImages.length > 0 && (
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                      <h3 style={{ marginBottom: '1.5rem', color: '#053b3c', fontWeight: '600' }}>
                        ℹ️ Apply Details to All Images (Optional)
                      </h3>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                        Leave empty to use image-specific details or defaults. These will be overridden if you set details for individual images below.
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <input
                          type="text"
                          placeholder="Common Title (optional)"
                          value={bulkDetailsApply.title}
                          onChange={(e) => setBulkDetailsApply({ ...bulkDetailsApply, title: e.target.value })}
                          style={{
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Common Location (optional)"
                          value={bulkDetailsApply.location}
                          onChange={(e) => setBulkDetailsApply({ ...bulkDetailsApply, location: e.target.value })}
                          style={{
                            padding: '0.75rem',
                            border: '2px solid #e2e8f0',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            outline: 'none'
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {bulkImages.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={{ marginBottom: '1rem', color: '#053b3c', fontWeight: '600' }}>
                        📋 Uploaded Images ({bulkImages.length})
                      </h3>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                        gap: '1rem'
                      }}>
                        {bulkImages.map((img, idx) => (
                          <div
                            key={idx}
                            style={{
                              border: '1px solid #e2e8f0',
                              borderRadius: '10px',
                              overflow: 'hidden',
                              background: 'white'
                            }}
                          >
                            <div style={{ position: 'relative', width: '100%', height: '150px', overflow: 'hidden', background: '#f0f0f0' }}>
                              <Image
                                src={img.image_url}
                                alt={`bulk-${idx}`}
                                fill
                                style={{ objectFit: 'cover' }}
                              />
                            </div>
                            <div style={{ padding: '0.75rem' }}>
                              <div style={{ marginBottom: '0.5rem' }}>
                                <input
                                  type="text"
                                  placeholder="Title (optional)"
                                  value={img.title || ''}
                                  onChange={(e) => handleBulkImageChange(idx, 'title', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '0.4rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '5px',
                                    fontSize: '0.8rem',
                                    marginBottom: '0.3rem'
                                  }}
                                />
                              </div>
                              <div style={{ marginBottom: '0.5rem' }}>
                                <input
                                  type="text"
                                  placeholder="Location (optional)"
                                  value={img.location || ''}
                                  onChange={(e) => handleBulkImageChange(idx, 'location', e.target.value)}
                                  style={{
                                    width: '100%',
                                    padding: '0.4rem',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '5px',
                                    fontSize: '0.8rem',
                                    marginBottom: '0.3rem'
                                  }}
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => removeBulkImage(idx)}
                                style={{
                                  width: '100%',
                                  padding: '0.4rem',
                                  background: '#dc2626',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '5px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  fontWeight: '600'
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
                    <button
                      type="button"
                      onClick={submitBulkImages}
                      disabled={bulkImages.length === 0}
                      style={{
                        padding: '1rem 2rem',
                        background: bulkImages.length === 0 ? '#cbd5e1' : 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: bulkImages.length === 0 ? 'not-allowed' : 'pointer',
                        boxShadow: bulkImages.length === 0 ? 'none' : '0 4px 12px rgba(5, 59, 60, 0.3)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (bulkImages.length > 0) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 59, 60, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = bulkImages.length === 0 ? 'none' : '0 4px 12px rgba(5, 59, 60, 0.3)';
                      }}
                    >
                      ✓ Upload All ({bulkImages.length})
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      style={{
                        padding: '1rem 2rem',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : editingImage ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600', 
                        color: '#334155',
                        fontSize: '0.875rem'
                      }}>
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#053b3c'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="e.g., Sigiriya Sunrise"
                        required
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600', 
                        color: '#334155',
                        fontSize: '0.875rem'
                      }}>
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#053b3c'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="e.g., Central Province"
                        required
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <CloudinaryUpload
                        folder="zamzam-tours/gallery"
                        onUploadSuccess={(url) => setFormData({ ...formData, image_url: url })}
                        currentImageUrl={formData.image_url}
                        label="Gallery Image *"
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600', 
                        color: '#334155',
                        fontSize: '0.875rem'
                      }}>
                        Alt Text (for SEO)
                      </label>
                      <input
                        type="text"
                        value={formData.alt_text}
                        onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#053b3c'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="Describe the image for search engines"
                      />
                    </div>

                    <div>
                      <label style={{ 
                        display: 'block', 
                        marginBottom: '0.5rem', 
                        fontWeight: '600', 
                        color: '#334155',
                        fontSize: '0.875rem'
                      }}>
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: '0.875rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '10px',
                          fontSize: '1rem',
                          transition: 'all 0.2s ease',
                          outline: 'none'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#053b3c'}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.75rem', 
                          fontWeight: '600', 
                          color: '#334155', 
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          padding: '0.875rem',
                          background: '#f8fafc',
                          borderRadius: '10px',
                          border: '2px solid #e2e8f0',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#053b3c'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      >
                        <input
                          type="checkbox"
                          checked={formData.is_active}
                          onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                          style={{ 
                            width: '20px', 
                            height: '20px',
                            cursor: 'pointer',
                            accentColor: '#053b3c'
                          }}
                        />
                        Active (visible on website)
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
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
                      ✓ Update Image
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      style={{
                        padding: '1rem 2rem',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#e2e8f0';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f1f5f9';
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : null}
            </div>
          )}

          {/* Gallery Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
              Loading gallery images...
            </div>
          ) : (
            <>
              {images.length > 0 && (
                <div style={{ 
                  marginBottom: '1.5rem',
                  padding: '1rem 1.5rem',
                  background: 'white',
                  borderRadius: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}>
                  <label style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#334155'
                  }}>
                    <input
                      type="checkbox"
                      checked={selectedImages.length === images.length && images.length > 0}
                      onChange={toggleSelectAll}
                      style={{ 
                        width: '20px', 
                        height: '20px',
                        cursor: 'pointer',
                        accentColor: '#053b3c'
                      }}
                    />
                    {selectedImages.length > 0 ? `${selectedImages.length} Selected` : 'Select All'}
                  </label>

                  {selectedImages.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(220, 38, 38, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(220, 38, 38, 0.3)';
                      }}
                    >
                      🗑️ Delete Selected ({selectedImages.length})
                    </button>
                  )}
                </div>
              )}

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {images.map((image) => (
                  <div
                    key={image.image_id}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: selectedImages.includes(image.image_id) 
                        ? '0 0 0 3px #053b3c' 
                        : '0 2px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => {
                      if (!selectedImages.includes(image.image_id)) {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!selectedImages.includes(image.image_id)) {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                      }
                    }}
                  >
                    <div style={{ position: 'relative', width: '100%', height: '250px', overflow: 'hidden', background: '#f0f0f0' }}>
                      <Image
                        src={image.image_url}
                        alt={image.alt_text || image.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      
                      {/* Selection checkbox */}
                      <div style={{ 
                        position: 'absolute', 
                        top: '10px', 
                        left: '10px',
                        zIndex: 10
                      }}>
                        <label
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            background: selectedImages.includes(image.image_id) 
                              ? '#053b3c' 
                              : 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={selectedImages.includes(image.image_id)}
                            onChange={() => toggleImageSelection(image.image_id)}
                            style={{ 
                              width: '20px', 
                              height: '20px',
                              cursor: 'pointer',
                              accentColor: '#053b3c'
                            }}
                          />
                        </label>
                      </div>
                      
                      {/* Hover overlay with title and location */}
                      <div 
                        className="admin-image-overlay"
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(5, 59, 60, 0.95), rgba(5, 59, 60, 0.7), transparent)',
                          color: 'white',
                          padding: '3rem 1rem 1rem',
                          transform: 'translateY(100%)',
                          transition: 'transform 0.3s ease',
                          pointerEvents: 'none'
                        }}
                      >
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.3rem' }}>
                          {image.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', opacity: 0.95 }}>
                          📍 {image.location}
                        </p>
                      </div>

                      {/* Status badges */}
                      <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }}>
                      {!image.is_active && (
                        <div style={{
                          background: 'rgba(220, 38, 38, 0.95)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}>
                          Inactive
                        </div>
                      )}
                      {image.display_order > 0 && (
                        <div style={{
                          background: 'rgba(5, 59, 60, 0.95)',
                          color: 'white',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                        }}>
                          #{image.display_order}
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEdit(image)}
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
                        onClick={() => handleDelete(image.image_id)}
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
            </>
          )}

          {!loading && images.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: 'white',
              borderRadius: '12px',
              color: '#6c757d'
            }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No gallery images yet</p>
              <p>Click "Add New Image" to get started</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .admin-image-overlay {
          transform: translateY(100%);
          transition: transform 0.3s ease;
        }
        
        div:hover .admin-image-overlay {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
