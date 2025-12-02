// Loading skeleton components for better UX
import React from 'react';

export const VehicleCardSkeleton = () => (
  <div className="vehicle-card skeleton-card">
    <div className="skeleton skeleton-image" style={{ height: '200px', marginBottom: '1rem' }} />
    <div className="skeleton skeleton-text" style={{ width: '70%', height: '24px', marginBottom: '0.5rem' }} />
    <div className="skeleton skeleton-text" style={{ width: '50%', height: '16px', marginBottom: '0.5rem' }} />
    <div className="skeleton skeleton-text" style={{ width: '60%', height: '16px', marginBottom: '1rem' }} />
    <div className="skeleton skeleton-button" style={{ width: '100%', height: '40px' }} />
    
    <style jsx>{`
      .skeleton-card {
        padding: 1.5rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
      
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 8px;
      }
      
      .skeleton-image {
        width: 100%;
      }
      
      .skeleton-text,
      .skeleton-button {
        display: block;
      }
      
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `}</style>
  </div>
);

export const TourCardSkeleton = () => (
  <div className="tour-card skeleton-card">
    <div className="skeleton skeleton-image" style={{ height: '220px', marginBottom: '1rem' }} />
    <div className="skeleton skeleton-text" style={{ width: '80%', height: '28px', marginBottom: '0.5rem' }} />
    <div className="skeleton skeleton-text" style={{ width: '90%', height: '16px', marginBottom: '0.5rem' }} />
    <div className="skeleton skeleton-text" style={{ width: '85%', height: '16px', marginBottom: '1rem' }} />
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
      <div className="skeleton skeleton-text" style={{ width: '30%', height: '20px' }} />
      <div className="skeleton skeleton-text" style={{ width: '30%', height: '20px' }} />
    </div>
    <div className="skeleton skeleton-button" style={{ width: '100%', height: '44px' }} />
    
    <style jsx>{`
      .skeleton-card {
        padding: 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }
      
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 6px;
      }
      
      .skeleton-image {
        width: 100%;
        border-radius: 0;
      }
      
      .skeleton-text,
      .skeleton-button {
        display: block;
        margin-left: 1rem;
        margin-right: 1rem;
      }
      
      .skeleton-button {
        margin: 1rem;
        margin-top: auto;
      }
      
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
    `}</style>
  </div>
);

export const GridSkeleton = ({ count = 6, type = 'vehicle' }: { count?: number; type?: 'vehicle' | 'tour' }) => {
  const SkeletonComponent = type === 'vehicle' ? VehicleCardSkeleton : TourCardSkeleton;
  
  return (
    <div className="skeleton-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonComponent key={index} />
      ))}
      
      <style jsx>{`
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin: 2rem 0;
        }
        
        @media (max-width: 768px) {
          .skeleton-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="list-skeleton">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="list-skeleton-item">
        <div className="skeleton skeleton-image" />
        <div className="skeleton-content">
          <div className="skeleton skeleton-text" style={{ width: '70%', height: '20px', marginBottom: '0.5rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '90%', height: '16px', marginBottom: '0.5rem' }} />
          <div className="skeleton skeleton-text" style={{ width: '40%', height: '16px' }} />
        </div>
      </div>
    ))}
    
    <style jsx>{`
      .list-skeleton {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .list-skeleton-item {
        display: flex;
        gap: 1rem;
        padding: 1rem;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
      }
      
      .skeleton-image {
        width: 100px;
        height: 100px;
        flex-shrink: 0;
        border-radius: 8px;
      }
      
      .skeleton-content {
        flex: 1;
      }
      
      .skeleton {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 1.5s infinite;
        border-radius: 6px;
        display: block;
      }
      
      @keyframes shimmer {
        0% {
          background-position: 200% 0;
        }
        100% {
          background-position: -200% 0;
        }
      }
      
      @media (max-width: 768px) {
        .list-skeleton-item {
          flex-direction: column;
        }
        
        .skeleton-image {
          width: 100%;
          height: 150px;
        }
      }
    `}</style>
  </div>
);

export const SpinnerLoader = () => (
  <div className="spinner-container">
    <div className="spinner" />
    
    <style jsx>{`
      .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 3rem;
      }
      
      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #053b3c;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

export default GridSkeleton;
