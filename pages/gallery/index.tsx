// pages/gallery/index.js - Simple Creative Gallery
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function SimpleGallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const galleryRef = useRef(null);

  // Simple gallery images data
  // Use Cloudinary-hosted images (these assets exist in the repo's sample data)
  const galleryImages = [
    { id: 1, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453704/dylan-shaw-smUAKwMT8XA-unsplash_qhenhx.jpg', alt: 'Sigiriya Rock at sunrise', title: 'Sigiriya Sunrise', location: 'Central Province' },
    { id: 2, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454466/chathura-anuradha-subasinghe-40uQmE9Zq8g-unsplash_tvflxt.jpg', alt: 'Kandy Temple', title: 'Sacred Temple', location: 'Kandy' },
    { id: 3, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453781/adam-vandermeer-Dw9dWTzzsUE-unsplash_l49hhe.jpg', alt: 'Nine Arch Bridge in Ella', title: 'Nine Arch Bridge', location: 'Ella' },
    { id: 4, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453796/chathura-indika-LAj-XlHP6Rs-unsplash_o7mzbc.jpg', alt: 'Galle Fort during sunset', title: 'Galle Fort Sunset', location: 'Galle' },
    { id: 5, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454382/siarhei-palishchuk-hgiby6qxvpc-unsplash_prnosl.jpg', alt: 'Mirissa Beach coastline', title: 'Mirissa Beach', location: 'Southern Coast' },
    { id: 6, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453757/gemmmm-FRTpkBIi-1Y-unsplash_iggwsm.jpg', alt: 'Leopard in Yala National Park', title: 'Yala Wildlife', location: 'Yala National Park' },
    { id: 7, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453797/anton-lecock-TPtaNsBOW9Q-unsplash_g0htag.jpg', alt: 'Tea plantations in hill country', title: 'Tea Country', location: 'Nuwara Eliya' },
    { id: 8, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453785/udara-karunarathna-LfUJO4whcSU-unsplash_xnxl7h.jpg', alt: 'Surfing at Arugam Bay', title: 'Arugam Bay Waves', location: 'East Coast' },
    { id: 9, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453771/claus-giering-YmcSXWcmh6w-unsplash_zw66ck.jpg', alt: 'Pristine beach in Trincomalee', title: 'Trincomalee Beaches', location: 'East Coast' },
    { id: 10, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762453710/train-journey.jpg', alt: 'Scenic train journey', title: 'Mountain Railway', location: 'Hill Country' },
    { id: 11, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1762454341/birendra-padmaperuma-jB7TbGrC1xM-unsplash_qcpkau.jpg', alt: 'Polonnaruwa ruins', title: 'Polonnaruwa', location: 'Cultural' },
    { id: 12, src: 'https://res.cloudinary.com/dhfqwxyb4/image/upload/v1761861700/agnieszka-stankiewicz-OMgi4DfiO3c-unsplash_dfa3pd.jpg', alt: 'Dambulla cave temples', title: 'Dambulla Golden Temple', location: 'Dambulla' }
  ];

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
        <title>Photo Gallery | Beautiful Sri Lanka | Zamzam Tours</title>
        <meta name="description" content="Explore stunning photos of Sri Lanka's landscapes, wildlife, and cultural heritage through Zamzam Tours' visual journey." />
      </Head>

  <Navbar />

      {/* Hero Section */}
      <section className="gallery-hero">
        <div className="hero-content">
          <h1>Visual Journey Through Sri Lanka</h1>
          <p>Discover the beauty of paradise island through our lens</p>
          <div className="scroll-indicator">
            <span>Scroll to Explore</span>
            <div className="arrow">↓</div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="container">
          <div className="gallery-stats">
            <div className="stat">
              <span className="number">{galleryImages.length}</span>
              <span className="label">Stunning Photos</span>
            </div>
            <div className="stat">
              <span className="number">12</span>
              <span className="label">Unique Locations</span>
            </div>
            <div className="stat">
              <span className="number">100+</span>
              <span className="label">Happy Travelers</span>
            </div>
          </div>

          <div className="gallery-grid" ref={galleryRef}>
            {galleryImages.map((image, index) => (
              <div 
                key={image.id}
                className="gallery-item"
                onClick={() => openLightbox(image, index)}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="image-container">
                  <Image 
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={300}
                    placeholder="blur"
                    blurDataURL="/placeholder.jpg"
                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                  />
                  <div className="image-overlay">
                    <div className="image-info">
                      <h3>{image.title}</h3>
                      <p>{image.location}</p>
                    </div>
                    <div className="view-button">
                      <span>👁️ View</span>
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
            <h2>Ready to Create Your Own Memories?</h2>
            <p>Let us help you experience these beautiful locations firsthand</p>
            <button 
              className="cta-button"
              onClick={() => {
                const message = "Hello Zamzam Tours! I saw your beautiful gallery and would like to plan a trip to Sri Lanka.";
                window.open(`https://wa.me/94771234567?text=${encodeURIComponent(message)}`, '_blank');
              }}
            >
              Start Your Journey
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
                width={1200}
                height={800}
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
          height: 60vh;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          color: white;
          position: relative;
          overflow: hidden;
        }

        .gallery-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('/gallery/hero-pattern.svg') center/cover;
          opacity: 0.1;
        }

        .hero-content h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .hero-content p {
          font-size: 1.3rem;
          opacity: 0.9;
          margin-bottom: 2rem;
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
          background: var(--secondary-color);
          color: var(--text-color);
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
          background: var(--secondary-color);
          color: var(--text-color);
          transform: scale(1.1);
        }

        .lightbox-image-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          max-height: 80vh;
        }

        .lightbox-image-container img {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 10px;
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
        @media (max-width: 768px) {
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