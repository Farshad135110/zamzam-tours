// Dashboard Stats API - Real-time metrics and insights
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { authMiddleware, AuthRequest } from '../../../src/lib/auth';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

interface DashboardStats {
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

async function getDashboardStats(req: AuthRequest, res: NextApiResponse) {
  try {
    const client = await pool.connect();

    try {
      // Get quotation statistics
      const quotationStats = await client.query(`
        SELECT 
          COUNT(*) as total,
          COALESCE(SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END), 0) as draft,
          COALESCE(SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END), 0) as sent,
          COALESCE(SUM(CASE WHEN status = 'viewed' THEN 1 ELSE 0 END), 0) as viewed,
          COALESCE(SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END), 0) as accepted,
          COALESCE(SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END), 0) as rejected,
          COALESCE(SUM(CASE WHEN status IN ('sent', 'viewed') THEN 1 ELSE 0 END), 0) as pending
        FROM quotations
      `);

      // Get revenue statistics
      const revenueStats = await client.query(`
        SELECT 
          COALESCE(SUM(CASE WHEN status = 'accepted' THEN total_amount ELSE 0 END), 0) as total_revenue,
          COALESCE(SUM(CASE WHEN status = 'accepted' AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW()) THEN total_amount ELSE 0 END), 0) as month_revenue,
          COALESCE(SUM(CASE WHEN status = 'accepted' AND DATE(created_at) = DATE(NOW()) THEN total_amount ELSE 0 END), 0) as today_revenue,
          COALESCE(AVG(CASE WHEN status = 'accepted' THEN total_amount ELSE NULL END), 0) as avg_deal_value,
          COUNT(*) as total_quotes,
          COALESCE(SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END), 0) as accepted_quotes
        FROM quotations
      `);

      // Get booking statistics
      const bookingStats = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM tour_booking) as tour_bookings,
          (SELECT COUNT(*) FROM vehicle_booking) as vehicle_bookings,
          (SELECT COUNT(*) FROM hotel_booking) as hotel_bookings,
          (SELECT COUNT(*) FROM airport_pickup) as airport_pickups
      `);

      // Get recent activity (quotations + bookings)
      const recentActivity = await client.query(`
        SELECT 'quotation' as type, quotation_id as id, customer_name, customer_email, status, total_amount as amount, currency, created_at
        FROM quotations
        ORDER BY created_at DESC
        LIMIT 15
      `);

      // Get top packages by quotations
      const topPackages = await client.query(`
        SELECT 
          package_id,
          tour_name,
          COUNT(*) as quotation_count,
          COALESCE(SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END), 0) as accepted_count,
          COALESCE(SUM(CASE WHEN status = 'accepted' THEN total_amount ELSE 0 END), 0) as revenue
        FROM quotations
        WHERE package_id IS NOT NULL AND package_id != ''
        GROUP BY package_id, tour_name
        ORDER BY quotation_count DESC
        LIMIT 5
      `);

      // Get pending quotations (awaiting response)
      const pendingQuotations = await client.query(`
        SELECT 
          quotation_id,
          quotation_number,
          customer_name,
          customer_email,
          tour_name,
          total_amount,
          currency,
          status,
          sent_at,
          created_at,
          CASE 
            WHEN valid_until IS NOT NULL THEN 
              EXTRACT(DAY FROM valid_until - NOW())::INT
            ELSE NULL 
          END as days_until_expired
        FROM quotations
        WHERE status IN ('sent', 'viewed')
        ORDER BY sent_at ASC
        LIMIT 10
      `);

      // Get quotations created today
      const todayQuotations = await client.query(`
        SELECT COUNT(*) as count FROM quotations WHERE DATE(created_at) = DATE(NOW())
      `);

      // Get conversion metrics
      const conversionData = await client.query(`
        SELECT 
          COUNT(*) as total,
          COALESCE(SUM(CASE WHEN status = 'accepted' THEN 1 ELSE 0 END), 0) as converted
        FROM quotations
        WHERE created_at >= NOW() - INTERVAL '30 days'
      `);

      const stats = quotationStats.rows[0];
      const revenue = revenueStats.rows[0];
      const bookings = bookingStats.rows[0];
      const conversion = conversionData.rows[0];

      const conversionRate = conversion.total > 0 
        ? (parseFloat(conversion.converted) / parseFloat(conversion.total) * 100).toFixed(2)
        : '0.00';

      const dashboardStats: DashboardStats = {
        quotations: {
          total: parseInt(stats.total),
          draft: parseInt(stats.draft),
          sent: parseInt(stats.sent),
          viewed: parseInt(stats.viewed),
          accepted: parseInt(stats.accepted),
          rejected: parseInt(stats.rejected),
          pending: parseInt(stats.pending)
        },
        revenue: {
          total: parseFloat(revenue.total_revenue),
          thisMonth: parseFloat(revenue.month_revenue),
          today: parseFloat(revenue.today_revenue),
          averagePerQuotation: parseFloat(revenue.avg_deal_value),
          conversionRate: parseFloat(conversionRate)
        },
        bookings: {
          tourBookings: parseInt(bookingStats.rows[0].tour_bookings),
          vehicleBookings: parseInt(bookingStats.rows[0].vehicle_bookings),
          hotelBookings: parseInt(bookingStats.rows[0].hotel_bookings),
          airportPickups: parseInt(bookingStats.rows[0].airport_pickups)
        },
        recentActivity: recentActivity.rows,
        topPackages: topPackages.rows,
        pendingQuotations: pendingQuotations.rows,
        lastUpdated: new Date().toISOString()
      };

      return res.status(200).json(dashboardStats);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return authMiddleware(getDashboardStats)(req, res);
}
