// pages/gallery/index.js - Ultimate Animated Gallery
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const galleryRef = useRef(null);

  // Gallery categories
  const categories = [
    { id: 'all', name: 'All Photos', count: 48 },
    { id: 'destinations', name: 'Destinations', count: 18 },
    { id: 'tours', name: 'Tours', count: 12 },
    { id: 'hotels', name: 'Hotels', count: 8 },
    { id: 'vehicles', name: 'Vehicles', count: 6 },
    { id: 'experiences', name: 'Experiences', count: 4 }
  ];

  // Sample gallery images with enhanced data
  const galleryImages = [
    // Destinations (18 images)
    {
      id: 1,
      category: 'destinations',
      src: '/gallery/sigiriya-pano.jpg',
      title: 'Sigiriya Rock Fortress',
      description: 'Ancient rock fortress with stunning panoramic views',
      location: 'Central Province',
      tags: ['historical', 'unesco', 'sunrise'],
      featured: true,
      aspect: 'landscape'
    },
    {
      id: 2,
      category: 'destinations',
      src: '/gallery/ella-nine-arch.jpg',
      title: 'Nine Arch Bridge',
      description: 'Iconic railway bridge amidst tea plantations',
      location: 'Ella',
      tags: ['architecture', 'train', 'tea country'],
      featured: true,
      aspect: 'landscape'
    },
    {
      id: 3,
      category: 'destinations',
      src: '/gallery/galle-fort-sunset.jpg',
      title: 'Galle Fort Sunset',
      description: 'Historic Dutch fort with golden hour views',
      location: 'Galle',
      tags: ['sunset', 'historical', 'coastal'],
      featured: false,
      aspect: 'landscape'
    },
    {
      id: 4,
      category: 'destinations',
      src: '/gallery/kandy-temple.jpg',
      title: 'Temple of the Sacred Tooth',
      description: 'Most sacred Buddhist temple in Sri Lanka',
      location: 'Kandy',
      tags: ['cultural', 'religious', 'unesco'],
      featured: true,
      aspect: 'portrait'
    },
    {
      id: 5,
      category: 'destinations',
      src: '/gallery/yala-leopard.jpg',
      title: 'Yala National Park',
      description: 'Leopard spotting in the wild',
      location: 'Yala',
      tags: ['wildlife', 'safari', 'leopard'],
      featured: false,
      aspect: 'landscape'
    },
    {
      id: 6,
      category: 'destinations',
      src: '/gallery/mirissa-whales.jpg',
      title: 'Mirissa Whale Watching',
      description: 'Blue whales in their natural habitat',
      location: 'Mirissa',
      tags: ['whales', 'ocean', 'wildlife'],
      featured: true,
      aspect: 'landscape'
    },

    // Tours (12 images)
    {
      id: 7,
      category: 'tours',
      src: '/gallery/cultural-tour-group.jpg',
      title: 'Cultural Triangle Tour',
      description: 'Exploring ancient kingdoms with expert guides',
      location: 'Cultural Triangle',
      tags: ['historical', 'guided', 'group'],
      featured: true,
      aspect: 'landscape'
    },
    {
      id: 8,
      category: 'tours',
      src: '/gallery/adventure-hiking.jpg',
      title: 'Adams Peak Hike',
      description: 'Sunrise pilgrimage to sacred mountain',
      location: 'Adams Peak',
      tags: ['hiking', 'sunrise', 'adventure'],
      featured: false,
      aspect: 'portrait'
    },

    // Hotels (8 images)
    {
      id: 9,
      category: 'hotels',
      src: '/gallery/cinnamon-grand-pool.jpg',
      title: 'Cinnamon Grand Colombo',
      description: 'Luxury poolside experience',
      location: 'Colombo',
      tags: ['luxury', 'pool', '5-star'],
      featured: true,
      aspect: 'landscape'
    },
    {
      id: 10,
      category: 'hotels',
      src: '/gallery/tea-trails-bungalow.jpg',
      title: 'Ceylon Tea Trails',
      description: 'Luxury bungalows in tea country',
      location: 'Hatton',
      tags: ['luxury', 'tea', 'mountains'],
      featured: true,
      aspect: 'landscape'
    },

    // Vehicles (6 images)
    {
      id: 11,
      category: 'vehicles',
      src: '/gallery/toyota-prius-fleet.jpg',
      title: 'Toyota Prius Fleet',
      description: 'Eco-friendly hybrid vehicles for comfortable travel',
      location: 'Colombo',
      tags: ['hybrid', 'comfort', 'reliable'],
      featured: false,
      aspect: 'landscape'
    },
    {
      id: 12,
      category: 'vehicles',
      src: '/gallery/luxury-van-interior.jpg',
      title: 'Luxury Tour Van',
      description: 'Spacious and comfortable group transportation',
      location: 'Nationwide',
      tags: ['spacious', 'comfort', 'group'],
      featured: true,
      aspect: 'landscape'
    },

    // Experiences (4 images)
    {
      id: 13,
      category: 'experiences',
      src: '/gallery/tea-plucking-experience.jpg',
      title: 'Tea Plucking Experience',
      description: 'Hands-on tea plantation tour and tasting',
      location: 'Nuwara Eliya',
      tags: ['cultural', 'hands-on', 'tea'],
      featured: true,
      aspect: 'portrait'
    },
    {
      id: 14,
      category: 'experiences',
      src: '/gallery/cooking-class.jpg',
      title: 'Traditional Cooking Class',
      description: 'Learn authentic Sri Lankan cuisine',
      location: 'Various Locations',
      tags: ['cultural', 'food', 'interactive'],
      featured: false,
      aspect: 'landscape'
    }
  ];

  // Filter images based on active category
  const filteredImages = activeCategory === 'all' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  // Featured images for hero section
  const featuredImages = galleryImages.filter(img => img.featured);

  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
      setParallaxOffset(scrollTop * 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      } else if (e.key === 'ArrowRight') {
        navigateLightbox('next');
      } else if (e.key === 'ArrowLeft') {
        navigateLightbox('prev');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, selectedImage]);

  const navigateLightbox = (direction) => {
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  const openLightbox = (image) => {
    setSelectedImage(image);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Masonry layout columns
  const getMasonryColumns = () => {
    const columns = [[], [], []];
    filteredImages.forEach((image, index) => {
      columns[index % 3].push(image);
    });
    return columns;
  };

  const masonryColumns = getMasonryColumns();

  return (
    <>
      <Head>
        <title>Photo Gallery | Stunning Sri Lanka Travel Experiences | Zamzam Tours</title>
        <meta name="description" content="Explore breathtaking photos of Sri Lanka destinations, tours, hotels, and experiences through Zamzam Tours' animated gallery." />
      </Head>

      <Navbar />

      {/* Loading Animation */}
      {loading && (
        <div className="loading-screen">
          <div className="loading-content">
            <div className="loading-logo">
              <div className="logo-spinner"></div>
              <span>Zamzam Tours</span>
            </div>
            <div className="loading-progress">
              <div className="progress-bar">
                <div className="progress-fill"></div>
              </div>
              <span>Loading Amazing Experiences...</span>
            </div>
          </div>
        </div>
      )}

      {/* Animated Hero Section */}
      <section className="gallery-hero" style={{ marginTop: '80px' }}>
        <div 
          className="hero-background"
          style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
        >
          <div className="hero-slideshow">
            {featuredImages.map((image, index) => (
              <div
                key={image.id}
                className={`hero-slide ${index === 0 ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image.src})` }}
              />
            ))}
          </div>
          <div className="hero-overlay"></div>
        </div>

        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="title-line">Discover Sri Lanka</span>
              <span className="title-line highlight">Through Our Lens</span>
            </h1>
            <p className="hero-subtitle">
              Immerse yourself in the beauty of paradise island through our curated collection of stunning moments
            </p>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Travelers</span>
            </div>
            <div className="stat">
              <span className="stat-number">48</span>
              <span className="stat-label">Stunning Locations</span>
            </div>
            <div className="stat">
              <span className="stat-number">12</span>
              <span className="stat-label">Years Experience</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <div className="scroll-arrow">
            <div className="arrow"></div>
          </div>
          <span>Scroll to Explore</span>
        </div>
      </section>

      {/* Progress Bar */}
      <div className="gallery-progress">
        <div 
          className="progress-fill" 
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      {/* Gallery Navigation */}
      <section className="gallery-nav">
        <div className="container">
          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="category-name">{category.name}</span>
                <span className="category-count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Masonry Gallery */}
      <section className="masonry-gallery" ref={galleryRef}>
        <div className="container">
          <div className="masonry-grid">
            {masonryColumns.map((column, columnIndex) => (
              <div key={columnIndex} className="masonry-column">
                {column.map((image, imageIndex) => (
                  <div
                    key={image.id}
                    className={`masonry-item ${image.aspect} ${image.featured ? 'featured' : ''}`}
                    onMouseEnter={() => setHoveredImage(image.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                    onClick={() => openLightbox(image)}
                  >
                    <div className="image-container">
                      <Image
                        src={image.src}
                        alt={image.title}
                        width={400}
                        height={image.aspect === 'portrait' ? 600 : 300}
                        objectFit="cover"
                        className="gallery-image"
                      />
                      
                      {/* Hover Overlay */}
                      <div className={`image-overlay ${hoveredImage === image.id ? 'hovered' : ''}`}>
                        <div className="overlay-content">
                          <h3 className="image-title">{image.title}</h3>
                          <p className="image-location">{image.location}</p>
                          <div className="image-tags">
                            {image.tags.map(tag => (
                              <span key={tag} className="tag">{tag}</span>
                            ))}
                          </div>
                          <button className="view-btn">
                            <span>👁️</span>
                            View
                          </button>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {image.featured && (
                        <div className="featured-badge">
                          <span>⭐</span>
                          Featured
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Gallery Section */}
      <section className="video-gallery">
        <div className="container">
          <div className="section-header">
            <h2>Experience Sri Lanka in Motion</h2>
            <p>Watch our curated videos showcasing the beauty and culture of paradise island</p>
          </div>

          <div className="video-grid">
            <div className="video-card featured">
              <div className="video-thumbnail">
                <div className="play-button">▶</div>
                <Image
                  src="/gallery/cultural-tour-video.jpg"
                  alt="Cultural Tour Experience"
                  width={600}
                  height={400}
                  objectFit="cover"
                />
                <div className="video-duration">4:32</div>
              </div>
              <div className="video-info">
                <h3>Cultural Triangle Expedition</h3>
                <p>Join us on a journey through ancient kingdoms</p>
              </div>
            </div>

            <div className="video-card">
              <div className="video-thumbnail">
                <div className="play-button">▶</div>
                <Image
                  src="/gallery/beach-paradise-video.jpg"
                  alt="Beach Paradise"
                  width={400}
                  height={300}
                  objectFit="cover"
                />
                <div className="video-duration">2:15</div>
              </div>
              <div className="video-info">
                <h3>Southern Beach Paradise</h3>
                <p>Pristine beaches and crystal clear waters</p>
              </div>
            </div>

            <div className="video-card">
              <div className="video-thumbnail">
                <div className="play-button">▶</div>
                <Image
                  src="/gallery/wildlife-safari-video.jpg"
                  alt="Wildlife Safari"
                  width={400}
                  height={300}
                  objectFit="cover"
                />
                <div className="video-duration">3:45</div>
              </div>
              <div className="video-info">
                <h3>Wildlife Safari Adventure</h3>
                <p>Leopards, elephants and exotic birds</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 360° Experience Section */}
      <section className="vr-experience">
        <div className="container">
          <div className="vr-content">
            <div className="vr-text">
              <h2>360° Virtual Experience</h2>
              <p>Explore Sri Lanka's most iconic locations through immersive 360° virtual tours</p>
              <div className="vr-features">
                <div className="vr-feature">
                  <span className="vr-icon">🔄</span>
                  <span>Interactive 360° Views</span>
                </div>
                <div className="vr-feature">
                  <span className="vr-icon">🎧</span>
                  <span>Audio Guided Tours</span>
                </div>
                <div className="vr-feature">
                  <span className="vr-icon">📱</span>
                  <span>Mobile Optimized</span>
                </div>
              </div>
              <button className="btn-primary">
                <span>🚀</span>
                Launch Virtual Tour
              </button>
            </div>
            <div className="vr-preview">
              <div className="vr-container">
                <div className="vr-image">
                  <Image
                    src="/gallery/360-sigiriya.jpg"
                    alt="360° Sigiriya View"
                    width={500}
                    height={300}
                    objectFit="cover"
                  />
                  <div className="vr-controls">
                    <button className="vr-btn">←</button>
                    <button className="vr-btn">→</button>
                    <button className="vr-btn">↑</button>
                    <button className="vr-btn">↓</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <span>×</span>
            </button>

            <button className="lightbox-nav prev" onClick={() => navigateLightbox('prev')}>
              ‹
            </button>

            <div className="lightbox-image-container">
              <Image
                src={selectedImage.src}
                alt={selectedImage.title}
                width={1200}
                height={800}
                objectFit="contain"
                className="lightbox-image"
              />
              
              <div className="lightbox-info">
                <h2>{selectedImage.title}</h2>
                <p className="lightbox-description">{selectedImage.description}</p>
                <div className="lightbox-meta">
                  <span className="location">📍 {selectedImage.location}</span>
                  <div className="tags">
                    {selectedImage.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button className="lightbox-nav next" onClick={() => navigateLightbox('next')}>
              ›
            </button>

            <div className="lightbox-thumbnails">
              {filteredImages.map(image => (
                <div
                  key={image.id}
                  className={`thumbnail ${selectedImage.id === image.id ? 'active' : ''}`}
                  onClick={() => setSelectedImage(image)}
                >
                  <Image
                    src={image.src}
                    alt={image.title}
                    width={80}
                    height={60}
                    objectFit="cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Ultimate Gallery Styles with Advanced Animations */
        .loading-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          color: white;
        }

        .loading-content {
          text-align: center;
        }

        .loading-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          font-size: 2rem;
          font-weight: 700;
        }

        .logo-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .loading-progress {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .progress-bar {
          width: 300px;
          height: 4px;
          background: rgba(255,255,255,0.2);
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: white;
          animation: loading 2s ease-in-out infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes loading {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }

        /* Hero Section with Parallax */
        .gallery-hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          color: white;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 120%;
          z-index: -1;
        }

        .hero-slideshow {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          animation: heroSlideshow 20s infinite;
        }

        .hero-slide:nth-child(1) { animation-delay: 0s; }
        .hero-slide:nth-child(2) { animation-delay: 5s; }
        .hero-slide:nth-child(3) { animation-delay: 10s; }
        .hero-slide:nth-child(4) { animation-delay: 15s; }

        @keyframes heroSlideshow {
          0%, 20% { opacity: 1; }
          25%, 100% { opacity: 0; }
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            135deg,
            #053b3c 0%,
            #0a5c5e 50%,
            #053b3c 100%
          );
        }

        .hero-content {
          text-align: center;
          z-index: 2;
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          line-height: 1.1;
        }

        .title-line {
          display: block;
        }

        .title-line.highlight {
          color: var(--secondary-color);
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          margin-bottom: 3rem;
          opacity: 0.9;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          gap: 3rem;
          margin-top: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--secondary-color);
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0.7;
          animation: bounce 2s infinite;
        }

        .scroll-arrow {
          width: 30px;
          height: 30px;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .arrow {
          width: 8px;
          height: 8px;
          border-right: 2px solid white;
          border-bottom: 2px solid white;
          transform: rotate(45deg);
          margin-top: -4px;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0) translateX(-50%);
          }
          40% {
            transform: translateY(-10px) translateX(-50%);
          }
          60% {
            transform: translateY(-5px) translateX(-50%);
          }
        }

        /* Progress Bar */
        .gallery-progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 3px;
          background: rgba(255,255,255,0.1);
          z-index: 1000;
        }

        .gallery-progress .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--secondary-color), #ffd700);
          transition: width 0.1s ease;
          box-shadow: 0 0 10px var(--secondary-color);
        }

        /* Gallery Navigation */
        .gallery-nav {
          position: sticky;
          top: 0;
          background: rgba(255,255,255,0.95);
          backdrop-filter: blur(10px);
          z-index: 100;
          padding: 1rem 0;
          border-bottom: 1px solid var(--border-color);
        }

        .category-filters {
          display: flex;
          justify-content: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 0.8rem 1.5rem;
          border: 2px solid transparent;
          background: white;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .category-btn.active {
          background: var(--primary-color);
          color: white;
          border-color: var(--primary-color);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(5, 59, 60, 0.3);
        }

        .category-btn:hover:not(.active) {
          border-color: var(--primary-color);
          transform: translateY(-1px);
        }

        .category-count {
          background: rgba(255,255,255,0.2);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
        }

        /* Masonry Gallery */
        .masonry-gallery {
          padding: 4rem 0;
        }

        .masonry-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          align-items: start;
        }

        .masonry-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .masonry-item {
          position: relative;
          border-radius: 15px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s ease;
          animation: fadeInUp 0.6s ease forwards;
          opacity: 0;
          transform: translateY(30px);
        }

        .masonry-item.landscape {
          aspect-ratio: 4/3;
        }

        .masonry-item.portrait {
          aspect-ratio: 3/4;
        }

        .masonry-item.featured {
          grid-column: span 2;
        }

        .masonry-item:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .gallery-image {
          width: 100%;
          height: 100%;
          transition: transform 0.4s ease;
        }

        .masonry-item:hover .gallery-image {
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
            rgba(5, 59, 60, 0.9) 100%
          );
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
          opacity: 0;
          transition: all 0.3s ease;
        }

        .image-overlay.hovered {
          opacity: 1;
        }

        .overlay-content {
          transform: translateY(20px);
          transition: transform 0.3s ease;
        }

        .image-overlay.hovered .overlay-content {
          transform: translateY(0);
        }

        .image-title {
          color: white;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .image-location {
          color: var(--secondary-color);
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .image-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          margin-bottom: 1rem;
        }

        .tag {
          background: rgba(255,255,255,0.2);
          color: white;
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
        }

        .view-btn {
          background: var(--secondary-color);
          color: var(--text-color);
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .view-btn:hover {
          background: #ffd700;
          transform: scale(1.05);
        }

        .featured-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--secondary-color);
          color: var(--text-color);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        /* Video Gallery */
        .video-gallery {
          padding: 4rem 0;
          background: var(--section-bg);
        }

        .video-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr;
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .video-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }

        .video-card.featured {
          grid-row: span 2;
        }

        .video-card:hover {
          transform: translateY(-5px);
        }

        .video-thumbnail {
          position: relative;
          cursor: pointer;
        }

        .video-card.featured .video-thumbnail {
          aspect-ratio: 3/2;
        }

        .video-card:not(.featured) .video-thumbnail {
          aspect-ratio: 4/3;
        }

        .play-button {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 60px;
          height: 60px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: all 0.3s ease;
        }

        .video-thumbnail:hover .play-button {
          background: var(--secondary-color);
          transform: translate(-50%, -50%) scale(1.1);
        }

        .video-duration {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 3px 8px;
          border-radius: 10px;
          font-size: 0.8rem;
        }

        .video-info {
          padding: 1.5rem;
        }

        .video-info h3 {
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .video-info p {
          color: var(--text-light);
          font-size: 0.9rem;
        }

        /* VR Experience */
        .vr-experience {
          padding: 4rem 0;
        }

        .vr-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
        }

        .vr-text h2 {
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }

        .vr-text p {
          color: var(--text-light);
          margin-bottom: 2rem;
          font-size: 1.1rem;
        }

        .vr-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .vr-feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 600;
        }

        .vr-icon {
          font-size: 1.5rem;
        }

        .vr-preview {
          display: flex;
          justify-content: center;
        }

        .vr-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.2);
        }

        .vr-image {
          position: relative;
          aspect-ratio: 5/3;
        }

        .vr-controls {
          position: absolute;
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
        }

        .vr-btn {
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.9);
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: bold;
        }

        .vr-btn:hover {
          background: var(--secondary-color);
          transform: scale(1.1);
        }

        /* Lightbox */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
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
          background: none;
          border: none;
          color: white;
          font-size: 2rem;
          cursor: pointer;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .lightbox-close:hover {
          color: var(--secondary-color);
          transform: scale(1.1);
        }

        .lightbox-nav {
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 1.5rem;
          transition: all 0.3s ease;
          z-index: 1;
        }

        .lightbox-nav:hover {
          background: var(--secondary-color);
          color: var(--text-color);
          transform: scale(1.1);
        }

        .lightbox-image-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .lightbox-image {
          max-width: 100%;
          max-height: 70vh;
          object-fit: contain;
          border-radius: 10px;
        }

        .lightbox-info {
          color: white;
          text-align: center;
        }

        .lightbox-info h2 {
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }

        .lightbox-description {
          margin-bottom: 1rem;
          opacity: 0.9;
        }

        .lightbox-meta {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: center;
        }

        .location {
          font-weight: 600;
          color: var(--secondary-color);
        }

        .lightbox-thumbnails {
          position: absolute;
          bottom: -80px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 0.5rem;
          max-width: 80vw;
          overflow-x: auto;
          padding: 1rem;
        }

        .thumbnail {
          width: 60px;
          height: 60px;
          border-radius: 5px;
          overflow: hidden;
          cursor: pointer;
          opacity: 0.6;
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .thumbnail:hover,
        .thumbnail.active {
          opacity: 1;
          border-color: var(--secondary-color);
          transform: scale(1.1);
        }

        /* Animations */
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Stagger animations for masonry items */
        .masonry-item:nth-child(3n+1) { animation-delay: 0.1s; }
        .masonry-item:nth-child(3n+2) { animation-delay: 0.2s; }
        .masonry-item:nth-child(3n+3) { animation-delay: 0.3s; }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .video-grid {
            grid-template-columns: 1fr 1fr;
          }
          
          .video-card.featured {
            grid-column: span 2;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            gap: 1.5rem;
          }

          .masonry-grid {
            grid-template-columns: 1fr;
          }

          .video-grid {
            grid-template-columns: 1fr;
          }

          .video-card.featured {
            grid-column: span 1;
          }

          .vr-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .lightbox-content {
            flex-direction: column;
          }

          .lightbox-nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }

          .lightbox-nav.prev {
            left: 10px;
          }

          .lightbox-nav.next {
            right: 10px;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }

          .category-filters {
            gap: 0.5rem;
          }

          .category-btn {
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
          }

          .lightbox-overlay {
            padding: 1rem;
          }
        }
      `}</style>

      <Footer />
    </>
  );
}