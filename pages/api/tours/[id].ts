// API endpoint for updating/deleting one-time tours
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { logServerAction, logServerError } from '../../../src/lib/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Tour ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await getTour(id, res);
      case 'PUT':
        return await updateTour(id, req, res);
      case 'DELETE':
        return await deleteTour(id, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Tour API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/tours/[id] - Get single one-time tour
async function getTour(id: string, res: NextApiResponse) {
  logServerAction('TOUR_API', 'GET /api/tours/:id', { tourId: id });
  try {
    const query = `
      SELECT * FROM one_time_tours WHERE tour_id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      logServerError('TOUR_API', 'Tour not found', 'No rows returned', { tourId: id });
      return res.status(404).json({ error: 'Tour not found' });
    }

    const tour = result.rows[0];
    logServerAction('TOUR_API', 'Tour fetched successfully', {
      tourId: tour.tour_id,
      tourName: tour.tour_name
    });
    return res.status(200).json({
      success: true,
      tour: {
        tourId: tour.tour_id,
        tourName: tour.tour_name,
        description: tour.description,
        price: tour.price,
        image: tour.image,
        highlights: tour.highlights,
        includings: tour.includings,
        itinerary: tour.itinerary ? JSON.parse(tour.itinerary) : null,
        days: tour.days,
        nights: tour.nights,
        quotationId: tour.quotation_id,
        createdBy: tour.created_by,
        createdAt: tour.created_at
      }
    });
  } catch (error) {
    logServerError('TOUR_API', 'Error fetching tour', error instanceof Error ? error : new Error(String(error)), { tourId: id });
    return res.status(500).json({ error: 'Failed to fetch tour' });
  }
}

// PUT /api/tours/[id] - Update one-time tour
async function updateTour(id: string, req: NextApiRequest, res: NextApiResponse) {
  const {
    tourName,
    description,
    price,
    image,
    highlights,
    includings,
    itinerary,
    days,
    nights
  } = req.body;

  logServerAction('TOUR_API', 'PUT /api/tours/:id', {
    tourId: id,
    updatingFields: [tourName && 'tourName', description && 'description', price && 'price', days && 'days'].filter(Boolean)
  });

  try {
    const query = `
      UPDATE one_time_tours
      SET
        tour_name = COALESCE($1, tour_name),
        description = COALESCE($2, description),
        price = COALESCE($3, price),
        image = COALESCE($4, image),
        highlights = COALESCE($5, highlights),
        includings = COALESCE($6, includings),
        itinerary = COALESCE($7, itinerary),
        days = COALESCE($8, days),
        nights = COALESCE($9, nights),
        updated_at = NOW()
      WHERE tour_id = $10
      RETURNING *
    `;

    const values = [
      tourName || null,
      description || null,
      price || null,
      image || null,
      highlights || null,
      includings || null,
      itinerary ? JSON.stringify(itinerary) : null,
      days || null,
      nights || null,
      id
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      logServerError('TOUR_API', 'Tour not found during update', 'No rows updated', { tourId: id });
      return res.status(404).json({ error: 'Tour not found' });
    }

    const tour = result.rows[0];
    logServerAction('TOUR_API', 'Tour updated successfully', {
      tourId: tour.tour_id,
      tourName: tour.tour_name,
      days: tour.days
    });
    return res.status(200).json({
      success: true,
      message: 'Tour updated successfully',
      tour: {
        tourId: tour.tour_id,
        tourName: tour.tour_name,
        description: tour.description,
        price: tour.price,
        image: tour.image,
        highlights: tour.highlights,
        includings: tour.includings,
        itinerary: tour.itinerary ? JSON.parse(tour.itinerary) : null,
        days: tour.days,
        nights: tour.nights
      }
    });
  } catch (error) {
    logServerError('TOUR_API', 'Error updating tour', error instanceof Error ? error : new Error(String(error)), { tourId: id });
    return res.status(500).json({ error: 'Failed to update tour' });
  }
}

// DELETE /api/tours/[id] - Delete one-time tour
async function deleteTour(id: string, res: NextApiResponse) {
  logServerAction('TOUR_API', 'DELETE /api/tours/:id', { tourId: id });
  try {
    const query = `
      DELETE FROM one_time_tours WHERE tour_id = $1 RETURNING tour_id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      logServerError('TOUR_API', 'Tour not found during delete', 'No rows deleted', { tourId: id });
      return res.status(404).json({ error: 'Tour not found' });
    }

    logServerAction('TOUR_API', 'Tour deleted successfully', { tourId: id });
    return res.status(200).json({
      success: true,
      message: 'Tour deleted successfully'
    });
  } catch (error) {
    logServerError('TOUR_API', 'Error deleting tour', error instanceof Error ? error : new Error(String(error)), { tourId: id });
    return res.status(500).json({ error: 'Failed to delete tour' });
  }
}
