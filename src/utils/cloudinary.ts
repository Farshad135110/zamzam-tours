// Cloudinary utility for image optimization and delivery
// Using next-cloudinary package

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dhfqwxyb4';

/**
 * Get optimized Cloudinary image URL
 * @param publicId - The Cloudinary public ID of the image
 * @param width - Optional width for responsive images
 * @param transformations - Additional transformations
 */
export const getCloudinaryImageUrl = (
  publicId: string,
  width?: number,
  transformations?: string[]
) => {
  const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;
  const params = ['f_auto', 'q_auto'];
  
  if (width) {
    params.push(`w_${width}`);
  }
  
  if (transformations) {
    params.push(...transformations);
  }
  
  return `${baseUrl}/${params.join(',')}/${publicId}`;
};

/**
 * Get Cloudinary video URL
 * @param publicId - The Cloudinary public ID of the video
 */
export const getCloudinaryVideoUrl = (publicId: string) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/${publicId}`;
};

/**
 * Generate placeholder blur URL for images
 * @param publicId - The Cloudinary public ID
 */
export const getCloudinaryBlurUrl = (publicId: string) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_20,q_auto,f_auto,e_blur:1000/${publicId}`;
};

/**
 * Cloudinary image loader for Next.js Image component
 */
export const cloudinaryLoader = ({ src, width, quality }: {
  src: string;
  width: number;
  quality?: number;
}) => {
  const params = [
    'f_auto',
    'c_limit',
    `w_${width}`,
    `q_${quality || 'auto'}`
  ];
  
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${params.join(',')}/${src}`;
};
