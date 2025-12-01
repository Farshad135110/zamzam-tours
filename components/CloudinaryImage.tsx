import Image from 'next/image';
import { cloudinaryLoader } from '../src/utils/cloudinary';

interface CloudinaryImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
}

export default function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fill = false,
  sizes,
  quality = 80,
  loading = 'lazy'
}: CloudinaryImageProps) {
  const commonProps = {
    loader: cloudinaryLoader,
    src,
    alt,
    className,
    priority,
    quality,
    loading: priority ? 'eager' : loading,
    placeholder: 'blur' as const,
    blurDataURL: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMwNTNiM2MiLz48L3N2Zz4='
  };

  if (fill) {
    return (
      <Image
        {...commonProps}
        fill
        sizes={sizes}
      />
    );
  }

  return (
    <Image
      {...commonProps}
      width={width || 800}
      height={height || 600}
    />
  );
}
