// API endpoint for creating new tour packages or one-time tours
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import { logServerAction, logServerError } from '../../../src/lib/logger';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'POST':
        return await createTour(req, res);
      default:
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Tour creation API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function createTour(req: NextApiRequest, res: NextApiResponse) {
  const {
    tourName,
    description,
    price,
    image,
    highlights,
    includings,
    itinerary,
    days,
    nights,
    saveType, // 'package' or 'one-time'
    quotationId, // for one-time tours
    createdBy
  } = req.body;

  logServerAction('TOUR_API', 'POST /api/tours/create', {
    tourName,
    saveType,
    quotationId,
    days,
    hasItinerary: !!itinerary
  });

  // Validation
  if (!tourName || !saveType) {
    logServerError('TOUR_API', 'Validation failed in tour creation', 'Missing required fields', {
      hasName: !!tourName,
      hasSaveType: !!saveType
    });
    return res.status(400).json({
      error: 'Missing required fields: tourName, saveType'
    });
  }

  try {
    if (saveType === 'package') {
      logServerAction('TOUR_API', 'Creating package tour', { tourName });
      
      // Save as a reusable tour package
      // Generate package_id
      const idResult = await pool.query(
        "SELECT COALESCE(MAX(CAST(SUBSTRING(package_id, 4) AS INTEGER)), 0) + 1 as next_id FROM package WHERE package_id LIKE 'PKG%'"
      );
      const nextId = idResult.rows[0].next_id;
      const packageId = `PKG${String(nextId).padStart(3, '0')}`;

      const query = `
        INSERT INTO package (
          package_id,
          package_name,
          description,
          price,
          image,
          highlights,
          includings,
          days,
          itinerary
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *
      `;

      const values = [
        packageId,
        tourName,
        description || null,
        price || null,
        image || null,
        highlights || null,
        includings || null,
        days || null,
        itinerary ? JSON.stringify(itinerary) : null
      ];

      const result = await pool.query(query, values);

      logServerAction('TOUR_API', 'Package tour created successfully', {
        packageId: result.rows[0].package_id,
        tourName: result.rows[0].package_name,
        price: result.rows[0].price
      });

      return res.status(201).json({
        success: true,
        message: 'Tour package created successfully',
        package: {
          packageId: result.rows[0].package_id,
          packageName: result.rows[0].package_name,
          price: result.rows[0].price
        }
      });

    } else if (saveType === 'one-time') {
      // Save as a one-time tour linked to quotation
      if (!quotationId) {
        logServerError('TOUR_API', 'Validation failed for one-time tour', 'quotationId is required', {
          saveType,
          tourName
        });
        return res.status(400).json({
          error: 'quotationId is required for one-time tours'
        });
      }

      logServerAction('TOUR_API', 'Creating one-time tour', {
        tourName,
        quotationId,
        days
      });

      // Generate tour_id
      const idResult = await pool.query(
        "SELECT COALESCE(MAX(CAST(SUBSTRING(tour_id, 3) AS INTEGER)), 0) + 1 as next_id FROM one_time_tours WHERE tour_id LIKE 'OT%'"
      );
      const nextId = idResult.rows[0].next_id;
      const tourId = `OT${String(nextId).padStart(5, '0')}`;

      const query = `
        INSERT INTO one_time_tours (
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
          created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;

      const values = [
        tourId,
        tourName,
        description || null,
        price || null,
        image || null,
        highlights || null,
        includings || null,
        itinerary ? JSON.stringify(itinerary) : null,
        days || null,
        nights || null,
        quotationId,
        createdBy || 'admin'
      ];

      const result = await pool.query(query, values);

      logServerAction('TOUR_API', 'One-time tour created successfully', {
        tourId: result.rows[0].tour_id,
        tourName: result.rows[0].tour_name,
        quotationId: result.rows[0].quotation_id
      });

      return res.status(201).json({
        success: true,
        message: 'One-time tour created successfully',
        tour: {
          tourId: result.rows[0].tour_id,
          tourName: result.rows[0].tour_name,
          quotationId: result.rows[0].quotation_id
        }
      });

    } else {
      logServerError('TOUR_API', 'Invalid saveType provided', `Invalid saveType: ${saveType}`, {
        tourName,
        quotationId
      });
      return res.status(400).json({
        error: 'Invalid saveType. Must be "package" or "one-time"'
      });
    }

  } catch (error) {
    logServerError('TOUR_API', 'Error creating tour', error instanceof Error ? error : new Error(String(error)), {
      tourName,
      saveType,
      quotationId
    });
    return res.status(500).json({
      error: 'Failed to create tour',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
