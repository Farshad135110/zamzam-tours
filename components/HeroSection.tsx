import { ReactNode } from 'react';
import Image from 'next/image';

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  gradient?: boolean;
  children?: ReactNode;
  height?: 'small' | 'medium' | 'large';
  overlay?: boolean;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  gradient = true,
  children,
  height = 'medium',
  overlay = true
}: HeroSectionProps) {
  const heightClass = {
    small: 'h-[40vh] min-h-[300px]',
    medium: 'h-[60vh] min-h-[400px]',
    large: 'h-[80vh] min-h-[500px]'
  }[height];

  return (
    <section className={`relative ${heightClass} flex items-center justify-center overflow-hidden`}>
      {/* Background */}
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImage}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
      )}
      
      {/* Gradient Background */}
      {gradient && !backgroundImage && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#053b3c] via-[#0a5c5e] to-[#032626]" />
      )}
      
      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 z-10 bg-black/40" />
      )}
      
      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            {subtitle}
          </p>
        )}
        {children && (
          <div className="mt-8">
            {children}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
      `}</style>
    </section>
  );
}
