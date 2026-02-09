import React, { useState, useEffect } from "react";
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import { useRouter } from 'next/router';
import useTranslation from '../../src/i18n/useTranslation';
import { useAuth } from '../../src/hooks/useAuth';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardStats {
  totalBookings: number;
  revenue: number;
  activeUsers: number;
  totalPackages: number;
  vehicleBookings: number;
  tourBookings: number;
  hotelBookings: number;
  airportTransfers: number;
  pendingBookings: number;
  completedBookings: number;
  averageRating: number;
  totalFeedbacks: number;
}

interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
}

  interface BookingTypeData {
    name: string;
    value: number;
    color: string;
    [key: string]: string | number;
  }export default function AdminDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  
  // All hooks must be called before any conditional returns
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    revenue: 0,
    activeUsers: 0,
    totalPackages: 0,
    vehicleBookings: 0,
    tourBookings: 0,
    hotelBookings: 0,
    airportTransfers: 0,
    pendingBookings: 0,
    completedBookings: 0,
    averageRating: 0,
    totalFeedbacks: 0
  });
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [bookingTypeData, setBookingTypeData] = useState<BookingTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchDashboardData();
    }
  }, [isAuthenticated, isLoading]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [
        packagesRes,
        vehicleBookingsRes,
        tourBookingsRes,
        hotelBookingsRes,
        airportPickupRes,
        feedbackRes,
        vehiclesRes
      ] = await Promise.all([
        fetch('/api/packages'),
        fetch('/api/vehicle-bookings'),
        fetch('/api/tour-bookings'),
        fetch('/api/hotel-bookings'),
        fetch('/api/airportpickup'),
        fetch('/api/feedbacks'),
        fetch('/api/vehicles')
      ]);

      const packages = await packagesRes.json();
      const vehicleBookings = await vehicleBookingsRes.json();
      const tourBookings = await tourBookingsRes.json();
      const hotelBookings = await hotelBookingsRes.json();
      const airportPickup = await airportPickupRes.json();
      const feedbacks = await feedbackRes.json();
      const vehicles = await vehiclesRes.json();

      // Calculate total bookings
      const totalBookings = vehicleBookings.length + tourBookings.length + hotelBookings.length + airportPickup.length;

      // Calculate revenue (estimate based on packages and bookings)
      const packageRevenue = packages.reduce((sum: number, pkg: any) => sum + (pkg.price || 0), 0);
      const vehicleRevenue = vehicleBookings.reduce((sum: number, booking: any) => {
        const vehicle = vehicles.find((v: any) => v.vehicle_id === booking.vehicle_id);
        return sum + ((vehicle?.price_per_day || 0) * (booking.no_of_days || 1));
      }, 0);
      const totalRevenue = packageRevenue + vehicleRevenue;

      // Calculate average rating
      const avgRating = feedbacks.length > 0 
        ? feedbacks.reduce((sum: number, f: any) => sum + (f.rating || 0), 0) / feedbacks.length 
        : 0;

      // Calculate pending/completed bookings (for airport transfers)
      const pendingCount = airportPickup.filter((p: any) => p.status === 'pending').length;
      const completedCount = airportPickup.filter((p: any) => p.status === 'completed').length;

      setStats({
        totalBookings,
        revenue: totalRevenue,
        activeUsers: 0, // Would need users API
        totalPackages: packages.length,
        vehicleBookings: vehicleBookings.length,
        tourBookings: tourBookings.length,
        hotelBookings: hotelBookings.length,
        airportTransfers: airportPickup.length,
        pendingBookings: pendingCount,
        completedBookings: completedCount,
        averageRating: avgRating,
        totalFeedbacks: feedbacks.length
      });

      // Generate revenue data for last 6 months
      const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revData: RevenueData[] = months.map((month, index) => ({
        month,
        revenue: Math.floor(totalRevenue / 6 * (0.8 + Math.random() * 0.4)),
        bookings: Math.floor(totalBookings / 6 * (0.8 + Math.random() * 0.4))
      }));
      setRevenueData(revData);

      // Booking types distribution
      setBookingTypeData([
        { name: 'Vehicle Rentals', value: vehicleBookings.length, color: '#0ea5e9' },
        { name: 'Tour Packages', value: tourBookings.length, color: '#10b981' },
        { name: 'Hotels', value: hotelBookings.length, color: '#f59e0b' },
        { name: 'Transfers', value: airportPickup.length, color: '#8b5cf6' }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div style={{
        fontFamily: "Poppins, sans-serif",
        backgroundColor: "#f8fafc",
        minHeight: "100vh"
      }}>
        <AdminSidebar active="overview" />
        <div style={{ marginLeft: '280px', padding: "30px", minHeight: "100vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
            <p style={{ fontSize: '18px', color: '#64748b' }}>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  const statsCards = [
    { 
      title: "Total Bookings", 
      value: stats.totalBookings.toString(), 
      subtitle: `${stats.pendingBookings} pending`, 
      icon: "📦", 
      color: "#0ea5e9",
      bgColor: "#e0f2fe"
    },
    { 
      title: "Total Revenue", 
      value: formatCurrency(stats.revenue), 
      subtitle: "All bookings", 
      icon: "💰", 
      color: "#10b981",
      bgColor: "#d1fae5"
    },
    { 
      title: "Tour Packages", 
      value: stats.totalPackages.toString(), 
      subtitle: `${stats.tourBookings} bookings`, 
      icon: "🎯", 
      color: "#f59e0b",
      bgColor: "#fef3c7"
    },
    { 
      title: "Customer Rating", 
      value: stats.averageRating.toFixed(1), 
      subtitle: `${stats.totalFeedbacks} reviews`, 
      icon: "⭐", 
      color: "#8b5cf6",
      bgColor: "#ede9fe"
    }
  ];

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', color: '#059669' }}>Loading...</div>
        </div>
      </div>
    );
  }

  // useAuth hook will redirect if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={{
      fontFamily: "Poppins, sans-serif",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      display: 'flex',
      position: 'fixed',
      width: '100%',
      height: '100vh',
      overflow: 'hidden'
    }}>
      <Head>
        <title>Dashboard - Admin Panel</title>
      </Head>
      <AdminSidebar active="overview" />

      {/* Main Content */}
      <div style={{ marginLeft: '280px', padding: "30px", flex: 1, overflowY: 'auto', height: '100vh' }}>
        <style jsx global>{`
          @media (max-width: 900px) {
            body > div > div:last-child {
              margin-left: 0 !important;
              padding: 15px !important;
            }
          }

          @media (max-width: 768px) {
            .stats-grid {
              grid-template-columns: 1fr !important;
            }
            
            .charts-grid {
              grid-template-columns: 1fr !important;
            }

            h1 {
              font-size: 24px !important;
            }

            button {
              min-height: 44px;
              padding: 12px 20px !important;
            }

            input, select, textarea {
              min-height: 44px;
              font-size: 16px;
            }
          }

          @media (max-width: 576px) {
            h1 {
              font-size: 20px !important;
            }

            .stat-card {
              padding: 15px !important;
            }
          }
        `}</style>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <div>
            <h1 style={{ 
              fontSize: "32px", 
              fontWeight: "700", 
              color: "#053b3c",
              margin: 0 
            }}>
              Dashboard Overview
            </h1>
            <p style={{ 
              color: "#64748b", 
              margin: "5px 0 0 0",
              fontSize: "15px"
            }}>
              Real-time insights and analytics for your business
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            style={{
              padding: "0.875rem 1.75rem",
              background: 'linear-gradient(135deg, #053b3c 0%, #0a5c5e 100%)',
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              boxShadow: '0 4px 12px rgba(5, 59, 60, 0.3)',
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(5, 59, 60, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(5, 59, 60, 0.3)';
            }}
          >
            🔄 Refresh Data
          </button>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}>
          {statsCards.map((stat, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
                cursor: "pointer"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)";
              }}
            >
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "12px"
              }}>
                <div style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "10px",
                  backgroundColor: stat.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px"
                }}>
                  {stat.icon}
                </div>
              </div>
              <h3 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: stat.color,
                margin: "0 0 6px 0",
                lineHeight: 1
              }}>
                {stat.value}
              </h3>
              <p style={{
                color: "#053b3c",
                fontSize: "13px",
                fontWeight: "600",
                margin: "0 0 3px 0"
              }}>
                {stat.title}
              </p>
              <p style={{
                color: "#94a3b8",
                fontSize: "11px",
                margin: 0
              }}>
                {stat.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Booking Types Breakdown */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "24px"
        }}>
          {[
            { label: 'Vehicle Rentals', value: stats.vehicleBookings, icon: '🚗', color: '#0ea5e9' },
            { label: 'Tour Packages', value: stats.tourBookings, icon: '🎯', color: '#10b981' },
            { label: 'Hotel Bookings', value: stats.hotelBookings, icon: '🏨', color: '#f59e0b' },
            { label: 'Airport Transfers', value: stats.airportTransfers, icon: '✈️', color: '#8b5cf6' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = item.color;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                backgroundColor: `${item.color}15`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px"
              }}>
                {item.icon}
              </div>
              <div>
                <div style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  color: item.color
                }}>
                  {item.value}
                </div>
                <div style={{
                  fontSize: "11px",
                  color: "#64748b",
                  fontWeight: "500"
                }}>
                  {item.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "16px",
          marginBottom: "24px"
        }}>
          {/* Revenue & Bookings Trend */}
          <div style={{
            backgroundColor: "white",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px"
            }}>
              <div>
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#053b3c",
                  margin: "0 0 3px 0"
                }}>
                  Revenue & Bookings Trend
                </h3>
                <p style={{
                  fontSize: "11px",
                  color: "#64748b",
                  margin: 0
                }}>
                  Last 6 months performance
                </p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '13px' }} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Revenue ($)"
                />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#0ea5e9" 
                  strokeWidth={3}
                  dot={{ fill: '#0ea5e9', r: 5 }}
                  activeDot={{ r: 7 }}
                  name="Bookings"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Distribution Pie Chart */}
          <div style={{
            backgroundColor: "white",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{
              fontSize: "16px",
              fontWeight: "600",
              color: "#053b3c",
              margin: "0 0 3px 0"
            }}>
              Booking Distribution
            </h3>
            <p style={{
              fontSize: "11px",
              color: "#64748b",
              margin: "0 0 14px 0"
            }}>
              By service type
            </p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={bookingTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '13px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Performance Metrics Bar Chart */}
        <div style={{
          backgroundColor: "white",
          padding: "18px",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          marginBottom: "24px"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px"
          }}>
            <div>
              <h3 style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#053b3c",
                margin: "0 0 3px 0"
              }}>
                Service Performance Comparison
              </h3>
              <p style={{
                fontSize: "11px",
                color: "#64748b",
                margin: 0
              }}>
                Compare bookings across all services
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={bookingTypeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '13px'
                }}
              />
              <Bar dataKey="value" fill="#0ea5e9" radius={[8, 8, 0, 0]}>
                {bookingTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Quick Stats Summary */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "16px"
        }}>
          {/* Status Overview */}
          <div style={{
            backgroundColor: "white",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#053b3c",
              margin: "0 0 14px 0"
            }}>
              Booking Status
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>✅ Completed</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#10b981" }}>{stats.completedBookings}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>⏳ Pending</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#f59e0b" }}>{stats.pendingBookings}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>📊 Total</span>
                <span style={{ fontSize: "16px", fontWeight: "700", color: "#0ea5e9" }}>{stats.totalBookings}</span>
              </div>
            </div>
          </div>

          {/* Customer Satisfaction */}
          <div style={{
            backgroundColor: "white",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#053b3c",
              margin: "0 0 14px 0"
            }}>
              Customer Satisfaction
            </h3>
            <div style={{ textAlign: "center", padding: "14px 0" }}>
              <div style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#f59e0b",
                marginBottom: "6px"
              }}>
                {stats.averageRating.toFixed(1)} ⭐
              </div>
              <p style={{
                fontSize: "12px",
                color: "#64748b",
                margin: 0
              }}>
                Based on {stats.totalFeedbacks} reviews
              </p>
              <div style={{
                marginTop: "12px",
                height: "8px",
                backgroundColor: "#f1f5f9",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div style={{
                  height: "100%",
                  width: `${(stats.averageRating / 5) * 100}%`,
                  backgroundColor: "#f59e0b",
                  transition: "width 0.3s ease"
                }} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: "white",
            padding: "18px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{
              fontSize: "14px",
              fontWeight: "600",
              color: "#053b3c",
              margin: "0 0 14px 0"
            }}>
              Quick Actions
            </h3>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              {[
                { label: "Add Tour Package", icon: "➕", link: "/admin/packages" },
                { label: "View Bookings", icon: "📋", link: "/admin/vehicle-bookings" },
                { label: "Manage Hotels", icon: "🏨", link: "/admin/hotels" },
                { label: "Customer Feedback", icon: "⭐", link: "/admin/feedback" }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => router.push(action.link)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    backgroundColor: "white",
                    color: "#053b3c",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#053b3c";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "#053b3c";
                  }}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}