import { useState } from 'react';

interface CloudinaryUploadProps {
  currentImageUrl?: string;
  onUploadSuccess: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function CloudinaryUpload({ 
  currentImageUrl, 
  onUploadSuccess, 
  folder = 'zamzam-tours',
  label = 'Image'
}: CloudinaryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl || '');
  const [error, setError] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Upload to our API endpoint
      const response = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Set preview and notify parent
      setPreviewUrl(data.url);
      onUploadSuccess(data.url);
      
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl('');
    onUploadSuccess('');
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ 
        display: 'block', 
        marginBottom: '0.5rem', 
        fontWeight: 600,
        color: '#334155'
      }}>
        {label}
      </label>
      
      {previewUrl ? (
        <div style={{ 
          position: 'relative', 
          display: 'inline-block',
          border: '2px solid #e2e8f0',
          borderRadius: '8px',
          padding: '0.5rem',
          background: '#f8fafc'
        }}>
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ 
              maxWidth: '300px', 
              maxHeight: '200px', 
              display: 'block',
              borderRadius: '4px'
            }} 
          />
          <button
            type="button"
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: '0.75rem',
              right: '0.75rem',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer',
              fontSize: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            ×
          </button>
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.75rem', 
            color: '#64748b',
            wordBreak: 'break-all'
          }}>
            {previewUrl}
          </div>
        </div>
      ) : (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            style={{
              display: 'block',
              width: '100%',
              padding: '0.75rem',
              border: '2px dashed #cbd5e1',
              borderRadius: '8px',
              background: '#f8fafc',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          />
          {uploading && (
            <div style={{ 
              marginTop: '0.5rem', 
              color: '#3b82f6',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <span style={{
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid #3b82f6',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite'
              }} />
              Uploading...
            </div>
          )}
        </div>
      )}

      {error && (
        <div style={{ 
          marginTop: '0.5rem', 
          padding: '0.5rem', 
          background: '#fee2e2', 
          color: '#dc2626',
          borderRadius: '4px',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
