// pages/gallery/index.js - Simple Creative Gallery
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CONTACT_INFO } from '../../src/constants/config';
import useTranslation from '../../src/i18n/useTranslation'

export default function SimpleGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const galleryRef = useRef(null);
  const { t } = useTranslation()
  
  // Gallery images state, initially empty, will be filled from database
  const [galleryImages, setGalleryImages] = useState<any[]>([]);



  const get = (key: string, fallback: string) => {
    const val = t(key)
    return val === key ? fallback : val
  }

  // Fetch gallery images from database (added by admin)
  useEffect(() => {
    const fetchGalleryImages = async () => {
      try {
        const response = await fetch('/api/gallery?active=true');
        if (response.ok) {
          const data = await response.json();
          const transformedImages = data.map((img: any) => ({
            id: `db-${img.image_id}`,
            src: img.image_url,
            alt: img.alt_text || img.title,
            title: img.title,
            location: img.location
          }));
          setGalleryImages(transformedImages);
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error);
      }
    };
    fetchGalleryImages();
  }, []);

  // Open lightbox with selected image
  const openLightbox = (image, index) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Navigate to next/previous image
  const navigateImage = (direction) => {
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % galleryImages.length;
    } else {
      newIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
    }
    setCurrentIndex(newIndex);
    setSelectedImage(galleryImages[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      switch(e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentIndex]);

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    
    if (Math.abs(diff) > 50) { // Swipe threshold
      if (diff > 0) {
        navigateImage('next');
      } else {
        navigateImage('prev');
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <>
      <Head>
        <title>{t('gallery.pageTitle')}</title>
        <meta name="description" content={t('gallery.metaDescription')} />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="gallery-hero" style={{ marginTop: '0' }}>
        <div className="hero-content">
          <h1>{t('gallery.hero.title')}</h1>
          <p>{t('gallery.hero.subtitle')}</p>
          
          <div className="hero-stats-preview">
            <div className="stat-preview">
              <div className="stat-number">25</div>
              <div className="stat-label">Stunning Photos</div>
            </div>
            <div className="stat-preview">
              <div className="stat-number">12</div>
              <div className="stat-label">Unique Locations</div>
            </div>
            <div className="stat-preview">
              <div className="stat-number">100+</div>
              <div className="stat-label">Happy Travelers</div>
            </div>
          </div>
          
          <div className="scroll-indicator">
            <span>{t('gallery.hero.scroll')}</span>
            <div className="arrow">↓</div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="container">


          <div className="gallery-grid" ref={galleryRef}>
            {galleryImages.map((image, index) => (
              <div 
                key={image.id}
                className="gallery-item"
                onClick={() => openLightbox(image, index)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="image-container">
                  <Image 
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                    quality={65}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    onLoadingComplete={() => setImagesLoaded(prev => prev + 1)}
                  />
                  <div className="image-overlay">
                    <div className="image-info">
                      <h3>{image.title}</h3>
                      <p>{image.location}</p>
                    </div>
                    <div className="view-button">
                      <span>{t('gallery.view')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="gallery-cta">
        <div className="container">
          <div className="cta-content">
            <h2>{t('gallery.cta.title')}</h2>
            <p>{t('gallery.cta.subtitle')}</p>
            <button 
              className="cta-button"
              onClick={() => {
                  const message = get('gallery.cta.waMessage', "Hello Zamzam Lanka Tours! I saw your beautiful gallery and would like to plan a trip to Sri Lanka.");
                  window.open(`${CONTACT_INFO.whatsappUrl}?text=${encodeURIComponent(message)}`, '_blank');
                }}
            >
              {t('gallery.cta.button')}
            </button>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <div 
          className="lightbox-overlay" 
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              ×
            </button>

            <button 
              className="nav-button prev"
              onClick={() => navigateImage('prev')}
            >
              ‹
            </button>

            <div className="lightbox-image-container">
              <Image 
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={800}
                height={600}
                quality={70}
                sizes="90vw"
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                style={{ objectFit: 'contain', maxWidth: '100%', height: 'auto' }}
              />
              <div className="lightbox-info">
                <h2>{selectedImage.title}</h2>
                <p>{selectedImage.location}</p>
              </div>
            </div>

            <button 
              className="nav-button next"
              onClick={() => navigateImage('next')}
            >
              ›
            </button>

            <div className="lightbox-counter">
              <span>{currentIndex + 1} / {galleryImages.length}</span>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <style jsx>{`
        /* Simple Gallery Styles */
        .gallery-hero {
          position: relative;
          height: 72vh;
          min-height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: #053b3c;
          color: white;
          overflow: hidden;
          padding-top: 130px;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
          width: 100%;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          margin-bottom: 1.5rem;
          font-weight: 700;
          line-height: 1.2;
        }

        .hero-content p {
          font-size: 1.5rem;
          opacity: 0.95;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .hero-stats-preview {
          display: flex;
          flex-direction: row;
          gap: 2rem;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 2rem;
          margin-bottom: 2rem;
        }

        .stat-preview {
          text-align: center;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          min-width: 140px;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: #f8b500;
          margin-bottom: 0.5rem;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        .scroll-indicator {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.7;
          animation: bounce 2s infinite;
        }

        .arrow {
          font-size: 1.5rem;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Gallery Grid Section */
        .gallery-grid-section {
          padding: 4rem 0;
        }

        .gallery-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .stat {
          text-align: center;
        }

        .stat .number {
          display: block;
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .stat .label {
          color: var(--text-light);
          font-size: 0.9rem;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          padding: 0 1rem;
        }

        .gallery-item {
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .gallery-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .image-container {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
        }

        .image-container img {
          transition: transform 0.5s ease;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .gallery-item:hover .image-container img {
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(5, 59, 60, 0.8) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .image-overlay {
          opacity: 1;
        }

        .image-info h3 {
          color: white;
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
        }

        .image-info p {
          color: var(--secondary-color);
          font-size: 0.9rem;
        }

        .view-button {
          align-self: flex-end;
          background: var(--primary-color);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .gallery-item:hover .view-button {
          transform: scale(1.05);
        }

        /* CTA Section */
        .gallery-cta {
          padding: 4rem 0;
          background: var(--section-bg);
          text-align: center;
        }

        .cta-content h2 {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.2rem;
          color: var(--text-light);
          margin-bottom: 2rem;
        }

        .cta-button {
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 50px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .cta-button:hover {
          background: var(--primary-light);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(5, 59, 60, 0.3);
        }

        /* Lightbox Styles */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 90vh;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .lightbox-close {
          position: absolute;
          top: -50px;
          right: 0;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.5rem;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .lightbox-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: scale(1.1);
        }

        .nav-button {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.5rem;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .nav-button:hover {
          background: var(--primary-color);
          color: white;
          transform: scale(1.1);
        }

        .lightbox-image-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 90vw;
          height: 85vh;
          max-width: 90vw;
          max-height: 85vh;
          padding: 2rem;
        }

        .lightbox-image-container img {
          max-width: 85vw !important;
          max-height: 75vh !important;
          width: auto !important;
          height: auto !important;
          object-fit: contain !important;
          border-radius: 10px;
          display: block;
          margin: 0 auto;
        }

        .lightbox-info {
          color: white;
          text-align: center;
          margin-top: 1rem;
        }

        .lightbox-info h2 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .lightbox-info p {
          opacity: 0.8;
        }

        .lightbox-counter {
          position: absolute;
          bottom: -50px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          background: rgba(255, 255, 255, 0.2);
          padding: 5px 15px;
          border-radius: 15px;
          font-size: 0.9rem;
        }

        /* Animations */
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Stagger animations */
        .gallery-item:nth-child(3n+1) { animation-delay: 0.1s; }
        .gallery-item:nth-child(3n+2) { animation-delay: 0.2s; }
        .gallery-item:nth-child(3n+3) { animation-delay: 0.3s; }

        /* Responsive Design */
        /* Large Screen Galleries */
        @media (min-width: 2560px) {
          .gallery-grid {
            grid-template-columns: repeat(5, 1fr);
            gap: 2rem;
          }

          .hero-content h1 {
            font-size: 4.5rem;
          }

          .hero-content p {
            font-size: 1.8rem;
          }
        }

        @media (min-width: 1920px) and (max-width: 2559px) {
          .gallery-grid {
            grid-template-columns: repeat(4, 1fr);
          }

          .hero-content h1 {
            font-size: 4rem;
          }
        }

        @media (min-width: 1440px) and (max-width: 1919px) {
          .gallery-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (min-width: 1024px) and (max-width: 1279px) {
          .gallery-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .gallery-hero {
            height: 50vh;
            min-height: 400px;
            padding-top: 300px;
          }

          .hero-content h1 {
            font-size: 2.2rem;
          }

          .hero-content p {
            font-size: 1.1rem;
          }
          .hero-content h1 {
            font-size: 2.2rem;
          }

          .gallery-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            padding: 0;
          }

          .gallery-stats {
            gap: 2rem;
          }

          .stat .number {
            font-size: 2rem;
          }

          .lightbox-content {
            flex-direction: column;
            gap: 0.5rem;
          }

          .nav-button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
          }

          .nav-button.prev {
            left: 10px;
          }

          .nav-button.next {
            right: 10px;
          }

          .lightbox-close {
            top: 10px;
            right: 10px;
          }
        }

        @media (max-width: 576px) {
          .gallery-hero {
            min-height: 250px;
            padding-top: 300px;
          }

          .hero-content h1 {
            font-size: 1.8rem;
          }

          .hero-content p {
            font-size: 1rem;
          }
          .hero-content h1 {
            font-size: 1.8rem;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .gallery-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .cta-content h2 {
            font-size: 2rem;
          }
        }

        /* Touch device optimizations */
        @media (hover: none) {
          .image-overlay {
            opacity: 1;
            background: linear-gradient(
              to bottom,
              transparent 0%,
              rgba(5, 59, 60, 0.6) 100%
            );
          }

          .gallery-item:hover {
            transform: none;
          }
        }
      `}</style>
    </>
  );
}