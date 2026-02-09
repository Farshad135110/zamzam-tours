// API endpoint for fetching all one-time tours
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const query = `
      SELECT 
        tour_id,
        tour_name,
        description,
        price,
        image,
        highlights,
        includings,
        itinerary,
        days,
        nights,
        quotation_id,
        created_by,
        created_at
      FROM one_time_tours
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);

    const tours = result.rows.map(tour => ({
      tour_id: tour.tour_id,
      tour_name: tour.tour_name,
      description: tour.description,
      price: tour.price,
      image: tour.image,
      highlights: tour.highlights,
      includings: tour.includings,
      itinerary: tour.itinerary ? JSON.parse(tour.itinerary) : null,
      days: tour.days,
      nights: tour.nights,
      quotation_id: tour.quotation_id,
      created_by: tour.created_by,
      created_at: tour.created_at
    }));

    return res.status(200).json(tours);
  } catch (error) {
    console.error('Error fetching one-time tours:', error);
    return res.status(500).json({ error: 'Failed to fetch one-time tours' });
  }
}
