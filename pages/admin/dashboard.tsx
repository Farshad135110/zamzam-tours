// Admin Dashboard - Real-time overview with actual working data
import { useState, useEffect } from 'react';
import Head from 'next/head';
import AdminSidebar from '../../components/AdminSidebar';
import Link from 'next/link';

interface DashboardData {
  quotations: {
    total: number;
    draft: number;
    sent: number;
    viewed: number;
    accepted: number;
    rejected: number;
    pending: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    today: number;
    averagePerQuotation: number;
    conversionRate: number;
  };
  bookings: {
    tourBookings: number;
    vehicleBookings: number;
    hotelBookings: number;
    airportPickups: number;
  };
  recentActivity: any[];
  topPackages: any[];
  pendingQuotations: any[];
  lastUpdated: string;
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30000); // 30 seconds

  useEffect(() => {
    fetchDashboardStats();
    
    if (!autoRefreshEnabled) return;

    const interval = setInterval(() => {
      fetchDashboardStats();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshEnabled, autoRefreshInterval]);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/dashboard/stats');
      if (!res.ok) {
        const errorBody = await res.json().catch(() => ({}));
        throw new Error(errorBody.error || `Request failed: ${res.status}`);
      }
      const data = await res.json();
      if (data?.error) {
        throw new Error(data.error);
      }
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to fetch dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  const getTimeDiff = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diff = now.getTime() - then.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;
    return then.toLocaleDateString();
  };

  const StatCard = ({ icon, label, value, subtext, color, trend }: any) => (
    <div className={`bg-white rounded-lg shadow p-6 border-l-4 ${color} hover:shadow-lg transition`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
          {trend && <p className="text-xs text-green-600 font-semibold mt-1">{trend}</p>}
        </div>
        <div className={`text-4xl opacity-80`}>{icon}</div>
      </div>
    </div>
  );

  return (
    <>
      <Head>
        <title>Dashboard - ZamZam Lanka Tours Admin</title>
      </Head>

      <div className="admin-dashboard" style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', position: 'fixed', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <AdminSidebar />

        <div
          className="p-4 lg:p-6 dashboard-content"
          style={{ marginLeft: '280px', width: 'calc(100% - 280px)', overflowY: 'auto', height: '100vh' }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">Welcome back! Here's your business overview.</p>
          </div>
          {/* Last Updated & Auto Refresh */}
          <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-lg p-3 shadow">
            <div className="flex items-center gap-4">
              <div className="text-xs text-gray-600">
                Last updated: <span className="font-semibold text-gray-900">
                  {dashboardData && new Date(dashboardData.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <label className="flex items-center gap-2 text-xs text-gray-700 whitespace-nowrap">
                <input 
                  type="checkbox" 
                  checked={autoRefreshEnabled}
                  onChange={(e) => setAutoRefreshEnabled(e.target.checked)}
                  className="rounded"
                />
                Auto Refresh
              </label>
              <select 
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(parseInt(e.target.value))}
                className="text-xs border border-gray-300 rounded px-2 py-1"
              >
                <option value={10000}>10s</option>
                <option value={30000}>30s</option>
                <option value={60000}>1m</option>
                <option value={300000}>5m</option>
              </select>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
              Failed to load real-time data: {errorMessage}
            </div>
          )}

          {/* Primary Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {loading ? (
              <>
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
              </>
            ) : dashboardData ? (
              <>
                <StatCard 
                  icon="📋" 
                  label="Total Quotations" 
                  value={dashboardData.quotations.total}
                  color="border-blue-500"
                  subtext={`${dashboardData.quotations.draft} drafts, ${dashboardData.quotations.sent} sent`}
                />
                <StatCard 
                  icon="⏳" 
                  label="Pending Responses" 
                  value={dashboardData.quotations.pending}
                  color="border-orange-500"
                  subtext={`${dashboardData.quotations.pending} awaiting action`}
                />
                <StatCard 
                  icon="✅" 
                  label="Accepted Quotations" 
                  value={dashboardData.quotations.accepted}
                  color="border-green-500"
                  subtext={`${dashboardData.revenue.conversionRate}% conversion rate`}
                />
                <StatCard 
                  icon="💰" 
                  label="Total Revenue" 
                  value={`USD ${dashboardData.revenue.total.toFixed(0)}`}
                  color="border-emerald-600"
                  subtext={`Avg: USD ${dashboardData.revenue.averagePerQuotation.toFixed(0)} per deal`}
                />
              </>
            ) : null}
          </div>

          {/* Revenue Breakdown */}
          {dashboardData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {/* Monthly Revenue */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow p-6 border-l-4 border-blue-600">
              <div>
                <p className="text-gray-600 text-sm font-medium">This Month Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">USD {dashboardData.revenue.thisMonth.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Month-to-date earnings</p>
              </div>
            </div>

            {/* Today Revenue */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow p-6 border-l-4 border-emerald-600">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">USD {dashboardData.revenue.today.toFixed(2)}</p>
                <p className="text-xs text-gray-500 mt-1">Today's accepted quotations</p>
              </div>
            </div>

            {/* Conversion Metrics */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow p-6 border-l-4 border-purple-600">
              <div>
                <p className="text-gray-600 text-sm font-medium">Avg Deal Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">USD {dashboardData.revenue.averagePerQuotation.toFixed(0)}</p>
                <p className="text-xs text-gray-500 mt-1">Average per accepted quotation</p>
              </div>
            </div>
          </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <Link href="/admin/quotations">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition">
                <div className="text-4xl mb-3">📊</div>
                <h3 className="text-lg font-bold text-gray-900">Manage Quotations</h3>
                <p className="text-gray-600 text-sm mt-1">Create, view, and manage all quotations</p>
                <div className="mt-4 text-emerald-600 font-semibold">Open →</div>
              </div>
          </Link>

          <Link href="/admin/quotations?showCreateModal=true">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition">
                <div className="text-4xl mb-3">➕</div>
                <h3 className="text-lg font-bold text-gray-900">Create Quotation</h3>
                <p className="text-gray-600 text-sm mt-1">Generate new quotation for customers</p>
                <div className="mt-4 text-blue-600 font-semibold">Open →</div>
              </div>
          </Link>

          <Link href="/admin/vehicles">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition">
                <div className="text-4xl mb-3">🚗</div>
                <h3 className="text-lg font-bold text-gray-900">Vehicle Fleet</h3>
                <p className="text-gray-600 text-sm mt-1">Manage vehicles and car rentals</p>
                <div className="mt-4 text-purple-600 font-semibold">Open →</div>
              </div>
          </Link>
          </div>

          {/* Bookings Overview */}
          {dashboardData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
              <p className="text-gray-600 text-sm font-medium">Tour Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.bookings.tourBookings}</p>
              <p className="text-xs text-blue-600 mt-1 font-semibold">Active bookings</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
              <p className="text-gray-600 text-sm font-medium">Vehicle Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.bookings.vehicleBookings}</p>
              <p className="text-xs text-purple-600 mt-1 font-semibold">Car rentals</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500">
              <p className="text-gray-600 text-sm font-medium">Hotel Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.bookings.hotelBookings}</p>
              <p className="text-xs text-pink-600 mt-1 font-semibold">Room reservations</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
              <p className="text-gray-600 text-sm font-medium">Airport Pickups</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{dashboardData.bookings.airportPickups}</p>
              <p className="text-xs text-green-600 mt-1 font-semibold">Transfers</p>
            </div>
          </div>
          )}

          {/* Top Performing Packages */}
          {dashboardData && dashboardData.topPackages.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">🏆 Top Performing Packages</h2>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                <thead className="bg-gray-50 border-t border-b border-gray-200">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Package</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Quotes</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700 hidden sm:table-cell">Accepted</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700 hidden md:table-cell">Revenue</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Conv.</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.topPackages.map((pkg: any) => {
                    const conversion = pkg.quotation_count > 0 
                      ? ((pkg.accepted_count / pkg.quotation_count) * 100).toFixed(0)
                      : '0';
                    return (
                      <tr key={pkg.package_id} className="hover:bg-gray-50 transition">
                        <td className="px-2 sm:px-4 py-3">
                          <span className="font-medium text-emerald-600 text-xs sm:text-sm">{pkg.tour_name}</span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <span className="text-gray-900 font-semibold text-xs sm:text-sm">{pkg.quotation_count}</span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">
                          <span className="text-green-600 font-semibold text-xs sm:text-sm">{pkg.accepted_count}</span>
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap font-semibold text-xs sm:text-sm hidden md:table-cell">
                          USD {parseFloat(pkg.revenue).toFixed(0)}
                        </td>
                        <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                          <span className="inline-block bg-emerald-100 text-emerald-800 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                            {conversion}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>              </div>            </div>
          </div>
          )}

          {/* Pending Quotations - Action Required */}
          {dashboardData && dashboardData.pendingQuotations.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6 border-l-4 border-orange-500">
            <div className="p-4 border-b border-gray-200 bg-orange-50">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">⏰ Pending Responses ({dashboardData.pendingQuotations.length})</h2>
              <p className="text-xs text-orange-700 mt-1">Quotations awaiting customer response</p>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <table className="min-w-full">
                <thead className="bg-gray-50 border-t border-b border-gray-200">
                  <tr>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Quotation</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700 hidden md:table-cell">Customer</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Amount</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Status</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700 hidden sm:table-cell">Sent</th>
                    <th className="px-2 sm:px-4 py-2 text-left text-xs font-semibold text-gray-700">Days</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.pendingQuotations.map((q: any) => (
                    <tr key={q.quotation_id} className="hover:bg-gray-50 transition">
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-emerald-600 text-xs sm:text-sm">{q.quotation_number}</span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 hidden md:table-cell">
                        <div className="font-medium text-gray-900 text-xs sm:text-sm">{q.customer_name}</div>
                        <div className="text-xs text-gray-500">{q.customer_email}</div>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap font-semibold text-xs sm:text-sm">
                        {q.currency} {parseFloat(q.total_amount).toFixed(0)}
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold text-white ${
                          q.status === 'sent' ? 'bg-blue-500' : 'bg-purple-500'
                        }`}>
                          {q.status === 'sent' ? 'SENT' : 'VIEW'}
                        </span>
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs text-gray-600 hidden sm:table-cell">
                        {q.sent_at ? getTimeDiff(q.sent_at) : 'N/A'}
                      </td>
                      <td className="px-2 sm:px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                        {q.days_until_expired !== null ? (
                          <span className={q.days_until_expired <= 2 ? 'text-red-600 font-bold' : 'text-gray-600'}>
                            {q.days_until_expired}d
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          </div>
          )}

          {/* Recent Activity */}
          {dashboardData && dashboardData.recentActivity.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">📰 Recent Activity</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {dashboardData.recentActivity.slice(0, 10).map((activity: any, idx: number) => (
                <div key={idx} className="p-3 hover:bg-gray-50 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{activity.customer_name}</p>
                    <p className="text-xs text-gray-600 truncate">{activity.customer_email}</p>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 w-full sm:w-auto">
                    <div className="flex-1 sm:flex-none">
                      <p className="text-xs font-semibold text-gray-900 text-left sm:text-right">
                        {activity.currency} {parseFloat(activity.amount).toFixed(0)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 text-left sm:text-right">{getTimeDiff(activity.created_at)}</p>
                    </div>
                    <span className={`inline-block text-xs font-semibold px-2 py-1 rounded text-white whitespace-nowrap ${
                      activity.status === 'draft' ? 'bg-gray-500' :
                      activity.status === 'sent' ? 'bg-blue-500' :
                      activity.status === 'viewed' ? 'bg-purple-500' :
                      activity.status === 'accepted' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}>
                      {activity.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {dashboardData.recentActivity.length > 10 && (
              <div className="p-4 bg-gray-50 text-center border-t">
                <Link href="/admin/quotations">
                  <span className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer text-sm">
                    View All Activity →
                  </span>
                </Link>
              </div>
            )}
          </div>
          )}
        </div>
      </div>

      <style jsx>{`
                @keyframes pulse {
                  0%, 100% {
                    opacity: 1;
                  }
                  50% {
                    opacity: 0.5;
                  }
                }

                .animate-pulse {
                  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                }

        @media (max-width: 900px) {
          .admin-dashboard .dashboard-content {
            margin-left: 0 !important;
            width: 100% !important;
          }
        }

        @media (max-width: 768px) {
          .admin-dashboard {
            padding: 0.5rem;
          }
          
          .dashboard-content {
            padding: 0.75rem !important;
          }
        }
      `}</style>
    </>
  );
}
