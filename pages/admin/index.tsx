import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const router = useRouter();
  // derive active from current pathname so links highlight correctly
  const derivedActive = router.pathname === '/admin' ? 'overview' : router.pathname.replace('/admin/', '') || 'overview';

  const statsData = [
    { title: "Total Bookings", value: "1,248", change: "+12%", icon: "📦", color: "#0a4a4b" },
    { title: "Revenue", value: "$42.8K", change: "+8%", icon: "💰", color: "#0a4a4b" },
    { title: "Users", value: "3,842", change: "+5%", icon: "👥", color: "#0a4a4b" },
    { title: "Packages", value: "156", change: "+3%", icon: "🎯", color: "#0a4a4b" }
  ];

  const recentActivities = [
    { action: "New booking received", time: "2 min ago", user: "John Doe" },
    { action: "Package updated", time: "1 hour ago", user: "Admin" },
    { action: "Payment completed", time: "3 hours ago", user: "Sarah Wilson" },
    { action: "Hotel added", time: "5 hours ago", user: "Admin" }
  ];

  return (
    <div style={{
      fontFamily: "Poppins, sans-serif",
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      display: "flex"
    }}>
      {/* Sidebar */}
      <div style={{
        width: "280px",
        backgroundColor: "#053b3c",
        color: "white",
        padding: "30px 20px",
        minHeight: "100vh"
      }}>
        <div style={{ marginBottom: "40px" }}>
          <h2 style={{ 
            fontSize: "24px", 
            fontWeight: "700", 
            marginBottom: "5px",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{ 
              backgroundColor: "#0a4a4b", 
              padding: "8px", 
              borderRadius: "8px",
              fontSize: "18px"
            }}>⚡</span>
            ZamZam<br/>Tours
          </h2>
          <p style={{ 
            fontSize: "12px", 
            color: "#81c8c9", 
            margin: 0 
          }}>
            Admin Dashboard
          </p>
        </div>

        <nav>
          {[
            { id: 'overview', label: 'Overview', href: '/admin' },
            { id: 'packages', label: 'Packages', href: '/admin/packages' },
            { id: 'vehicles', label: 'Vehicles', href: '/admin/vehicles' },
            { id: 'hotels', label: 'Hotels', href: '/admin/hotels' },
            { id: 'feedback', label: 'Feedback', href: '/admin/feedback' },
            { id: 'users', label: 'Users', href: '/admin/users' },
            { id: 'settings', label: 'Settings', href: '/admin/settings' }
          ].map(item => (
            <Link key={item.id} href={item.href} legacyBehavior>
              <a style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '12px 16px',
                marginBottom: '8px',
                borderRadius: '8px',
                textDecoration: 'none',
                color: derivedActive === item.id ? 'white' : 'rgba(255,255,255,0.9)',
                backgroundColor: derivedActive === item.id ? '#0a4a4b' : 'transparent',
                fontSize: '14px',
                fontWeight: 500,
                transition: 'all 0.2s ease'
              }}>
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px"
        }}>
          <div>
            <h1 style={{ 
              fontSize: "28px", 
              fontWeight: "700", 
              color: "#053b3c",
              margin: 0 
            }}>
              Welcome back, Admin! 👋
            </h1>
            <p style={{ 
              color: "#64748b", 
              margin: "5px 0 0 0" 
            }}>
              Here's what's happening with your travel business today.
            </p>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "15px"
          }}>
            <div style={{
              position: "relative"
            }}>
              <input
                type="text"
                placeholder="Search..."
                style={{
                  padding: "10px 15px 10px 40px",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  fontSize: "14px",
                  width: "250px",
                  outline: "none",
                  transition: "all 0.2s ease"
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#053b3c";
                  e.target.style.boxShadow = "0 0 0 3px rgba(5, 59, 60, 0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#e2e8f0";
                  e.target.style.boxShadow = "none";
                }}
              />
              <span style={{
                position: "absolute",
                left: "15px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b"
              }}>🔍</span>
            </div>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: "#053b3c",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "600",
              cursor: "pointer"
            }}>
              A
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}>
          {statsData.map((stat, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "white",
                padding: "25px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
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
                marginBottom: "15px"
              }}>
                <div style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "10px",
                  backgroundColor: stat.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px"
                }}>
                  {stat.icon}
                </div>
                <span style={{
                  backgroundColor: stat.change.startsWith("+") ? "#dcfce7" : "#fee2e2",
                  color: stat.change.startsWith("+") ? "#166534" : "#dc2626",
                  padding: "4px 8px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: "600"
                }}>
                  {stat.change}
                </span>
              </div>
              <h3 style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#053b3c",
                margin: "0 0 5px 0"
              }}>
                {stat.value}
              </h3>
              <p style={{
                color: "#64748b",
                fontSize: "14px",
                margin: 0
              }}>
                {stat.title}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px"
        }}>
          {/* Recent Activities */}
          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h3 style={{
                fontSize: "18px",
                fontWeight: "600",
                color: "#053b3c",
                margin: 0
              }}>
                Recent Activities
              </h3>
              <button style={{
                color: "#053b3c",
                fontSize: "14px",
                fontWeight: "500",
                border: "none",
                background: "none",
                cursor: "pointer"
              }}>
                View All
              </button>
            </div>
            <div>
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "15px 0",
                    borderBottom: index < recentActivities.length - 1 ? "1px solid #f1f5f9" : "none"
                  }}
                >
                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    backgroundColor: "#f1f5f9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "15px",
                    fontSize: "14px"
                  }}>
                    📝
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      margin: "0 0 4px 0",
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#053b3c"
                    }}>
                      {activity.action}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: "12px",
                      color: "#64748b"
                    }}>
                      By {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{
            backgroundColor: "white",
            padding: "25px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0"
          }}>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#053b3c",
              margin: "0 0 20px 0"
            }}>
              Quick Actions
            </h3>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}>
              {[
                { label: "Add New Package", icon: "➕", color: "#053b3c" },
                { label: "Manage Bookings", icon: "📋", color: "#0a4a4b" },
                { label: "View Reports", icon: "📈", color: "#0a4a4b" },
                { label: "Customer Support", icon: "💬", color: "#0a4a4b" }
              ].map((action, index) => (
                <button
                  key={index}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
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
                    e.target.style.backgroundColor = "#053b3c";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "white";
                    e.target.style.color = "#053b3c";
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