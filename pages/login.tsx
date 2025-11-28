import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { SITE_INFO } from '../src/constants/config';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Simple client-side check (for demo purposes)
      if (username === 'admin' && password === 'Admin@123') {
        // Store simple auth flag
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify({ 
          username: 'admin', 
          email: 'admin@zamzamtours.com',
          full_name: 'Administrator'
        }));
        // Redirect to admin dashboard
        router.push('/admin');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      fontFamily: 'Poppins, sans-serif',
      background: 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)'
    }}>
      {/* Left Side - Branding */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        color: 'white'
      }}>
        <div style={{
          maxWidth: '500px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            margin: '0 auto 30px',
            background: 'white',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <Image 
              src={SITE_INFO.logo}
              alt={SITE_INFO.name}
              width={100}
              height={100}
              style={{ objectFit: 'contain' }}
            />
          </div>
          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '20px',
            lineHeight: 1.2
          }}>
            {SITE_INFO.name}
          </h1>
          <p style={{
            fontSize: '18px',
            opacity: 0.9,
            lineHeight: 1.6
          }}>
            {SITE_INFO.tagline}
          </p>
          <div style={{
            marginTop: '40px',
            padding: '24px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)'
          }}>
            <p style={{
              fontSize: '14px',
              margin: 0,
              opacity: 0.8
            }}>
              Secure admin portal for managing bookings, packages, and customer data
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        background: '#f8fafc'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'white',
          padding: '48px',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#053b3c',
              marginBottom: '12px'
            }}>
              Welcome Back
            </h2>
            <p style={{
              fontSize: '15px',
              color: '#64748b'
            }}>
              Sign in to access your admin dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                padding: '14px',
                background: '#fee2e2',
                border: '1px solid #fecaca',
                borderRadius: '10px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '18px' }}>⚠️</span>
                <span style={{
                  fontSize: '14px',
                  color: '#dc2626',
                  fontWeight: '500'
                }}>
                  {error}
                </span>
              </div>
            )}

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#053b3c',
                marginBottom: '8px'
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  fontSize: '15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  fontFamily: 'Poppins, sans-serif'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#053b3c';
                  e.target.style.boxShadow = '0 0 0 4px rgba(5, 59, 60, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#053b3c',
                marginBottom: '8px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  style={{
                    width: '100%',
                    padding: '14px 48px 14px 16px',
                    fontSize: '15px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    outline: 'none',
                    transition: 'all 0.2s ease',
                    fontFamily: 'Poppins, sans-serif'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#053b3c';
                    e.target.style.boxShadow = '0 0 0 4px rgba(5, 59, 60, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '20px',
                    padding: '4px'
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                fontWeight: '600',
                color: 'white',
                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)',
                border: 'none',
                borderRadius: '10px',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'Poppins, sans-serif',
                boxShadow: '0 4px 12px rgba(5, 59, 60, 0.3)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                  (e.target as HTMLElement).style.boxShadow = '0 8px 20px rgba(5, 59, 60, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                  (e.target as HTMLElement).style.boxShadow = '0 4px 12px rgba(5, 59, 60, 0.3)';
                }
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <span style={{ 
                    width: '20px', 
                    height: '20px', 
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 900px) {
          div:first-child > div:first-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
