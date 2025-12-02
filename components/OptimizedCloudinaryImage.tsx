// Optimized Cloudinary Image component with lazy loading and performance optimizations
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface OptimizedCloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  className?: string;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
}

export const OptimizedCloudinaryImage: React.FC<OptimizedCloudinaryImageProps> = ({
  src,
  alt,
  width,
  height,
  quality = 80,
  priority = false,
  className = '',
  loading = 'lazy',
  objectFit = 'cover',
  onLoad,
}) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Optimize Cloudinary URL
    if (src.includes('cloudinary.com')) {
      const transformations = [
        `q_${quality}`,
        'f_auto',
        'c_limit',
        width ? `w_${width}` : '',
        height ? `h_${height}` : '',
      ].filter(Boolean).join(',');

      // Insert transformations into Cloudinary URL
      const optimizedSrc = src.replace('/upload/', `/upload/${transformations}/`);
      setImageSrc(optimizedSrc);
    } else {
      setImageSrc(src);
    }
  }, [src, width, height, quality]);

  const handleLoad = () => {
    setIsLoading(false);
    setError(false);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
    setIsLoading(false);
  };

  if (!imageSrc) {
    return (
      <div className={`${className} bg-gray-200 animate-pulse`} style={{ width, height }} />
    );
  }

  if (error) {
    return (
      <div className={`${className} bg-gray-300 flex items-center justify-center`} style={{ width, height }}>
        <span className="text-gray-500 text-sm">Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width || 800}
        height={height || 600}
        quality={quality}
        priority={priority}
        loading={loading}
        objectFit={objectFit}
        onLoad={handleLoad}
        onError={handleError}
        className={className}
      />
    </div>
  );
};

export default OptimizedCloudinaryImage;
