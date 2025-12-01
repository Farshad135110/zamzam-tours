import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslation from '../src/i18n/useTranslation';

const NotFoundPage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{t('404.title')}</title>
        <meta name="description" content={t('404.description')} />
      </Head>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #053b3c 0%, #0a5f61 50%, #f8b500 100%)',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background circles */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(248, 181, 0, 0.1)',
          animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(248, 181, 0, 0.1)',
          animation: 'float 8s ease-in-out infinite reverse'
        }} />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.03)',
          animation: 'pulse 4s ease-in-out infinite'
        }} />

        {/* Content */}
        <div style={{
          maxWidth: '600px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '3rem 2rem',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          position: 'relative',
          zIndex: 1
        }}>
          {/* 404 Number */}
          <div style={{
            fontSize: '8rem',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #053b3c 0%, #f8b500 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1',
            marginBottom: '1rem',
            textShadow: '0 4px 10px rgba(5, 59, 60, 0.2)'
          }}>
            404
          </div>

          {/* Icon */}
          <div style={{
            fontSize: '4rem',
            marginBottom: '1.5rem',
            animation: 'bounce 2s ease-in-out infinite'
          }}>
            🗺️
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: '2rem',
            color: '#053b3c',
            marginBottom: '1rem',
            fontWeight: '700'
          }}>
            {t('404.heading')}
          </h1>

          {/* Description */}
          <p style={{
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            {t('404.message')}
          </p>

          {/* Buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link 
              href="/"
              style={{
                padding: '0.9rem 2rem',
                background: '#f8b500',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '1rem',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(248, 181, 0, 0.3)',
                display: 'inline-block'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(248, 181, 0, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(248, 181, 0, 0.3)';
              }}
            >
              {t('404.goHome')}
            </Link>

            <button
              onClick={() => router.back()}
              style={{
                padding: '0.9rem 2rem',
                background: '#053b3c',
                color: '#fff',
                border: 'none',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(5, 59, 60, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(5, 59, 60, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(5, 59, 60, 0.3)';
              }}
            >
              {t('404.goBack')}
            </button>
          </div>

          {/* Quick Links */}
          <div style={{
            marginTop: '2.5rem',
            paddingTop: '2rem',
            borderTop: '1px solid #e0e0e0'
          }}>
            <p style={{
              fontSize: '0.9rem',
              color: '#888',
              marginBottom: '1rem'
            }}>
              {t('404.quickLinks')}
            </p>
            <div style={{
              display: 'flex',
              gap: '1.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Link href="/tours" style={{ color: '#053b3c', textDecoration: 'none', fontWeight: '600', transition: 'color 0.3s' }}>
                {t('404.toursLink')}
              </Link>
              <Link href="/destinations" style={{ color: '#053b3c', textDecoration: 'none', fontWeight: '600', transition: 'color 0.3s' }}>
                {t('404.destinationsLink')}
              </Link>
              <Link href="/activities" style={{ color: '#053b3c', textDecoration: 'none', fontWeight: '600', transition: 'color 0.3s' }}>
                {t('404.activitiesLink')}
              </Link>
              <Link href="/contact" style={{ color: '#053b3c', textDecoration: 'none', fontWeight: '600', transition: 'color 0.3s' }}>
                {t('404.contactLink')}
              </Link>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
            opacity: 0.1;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 768px) {
          div[style*="fontSize: '8rem'"] {
            font-size: 5rem !important;
          }
          
          div[style*="fontSize: '4rem'"] {
            font-size: 3rem !important;
          }
          
          h1 {
            font-size: 1.5rem !important;
          }
          
          p {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </>
  );
};

export default NotFoundPage;
