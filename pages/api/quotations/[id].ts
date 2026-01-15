// API endpoint for individual quotation operations
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { id } } = req;

  if (!id) {
    return res.status(400).json({ error: 'Quotation ID is required' });
  }

  try {
    switch (method) {
      case 'GET':
        return await getQuotation(id as string, req, res);
      case 'PUT':
        return await updateQuotation(id as string, req, res);
      case 'DELETE':
        return await deleteQuotation(id as string, res);
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Quotation API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// GET /api/quotations/[id] - Get single quotation
async function getQuotation(id: string, req: NextApiRequest, res: NextApiResponse) {
  try {
    // Support both numeric ID and quotation number
    // Check if id is numeric or a quotation number format
    const isNumeric = /^\d+$/.test(id);
    
    const query = isNumeric
      ? `SELECT * FROM quotations WHERE quotation_id = $1`
      : `SELECT * FROM quotations WHERE quotation_number = $1`;

    const result = await pool.query(query, [isNumeric ? parseInt(id) : id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    const quotation = result.rows[0];

    // Track view if not from admin
    const { trackView } = req.query;
    if (trackView === 'true' && quotation.status === 'sent') {
      const updateViewQuery = `
        UPDATE quotations
        SET 
          viewed_at = CURRENT_TIMESTAMP,
          first_viewed_at = COALESCE(first_viewed_at, CURRENT_TIMESTAMP),
          view_count = view_count + 1,
          status = CASE WHEN status = 'sent' THEN 'viewed' ELSE status END
        WHERE quotation_id = $1
      `;
      await pool.query(updateViewQuery, [quotation.quotation_id]);
    }

    return res.status(200).json({ quotation });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    return res.status(500).json({ error: 'Failed to fetch quotation' });
  }
}

// PUT /api/quotations/[id] - Update quotation
async function updateQuotation(id: string, req: NextApiRequest, res: NextApiResponse) {
  const updates = req.body;

  try {
    // Build dynamic update query
    const allowedFields = [
      'customer_name', 'customer_email', 'customer_phone', 'customer_country',
      'tour_name', 'start_date', 'end_date', 'duration_days',
      'num_adults', 'num_children', 'num_infants',
      'base_price', 'accommodation_type', 'accommodation_upgrade',
      'discount_amount', 'discount_percentage', 'discount_reason',
      'subtotal', 'total_amount', 'currency',
      'deposit_amount', 'balance_amount',
      'status', 'valid_until',
      'included_services', 'excluded_services',
      'custom_itinerary', 'special_requests', 'admin_notes',
      'last_modified_by'
    ];

    const updateFields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key} = $${paramCount}`);
        values.push(updates[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    // Support both numeric ID and quotation number
    const isNumeric = /^\d+$/.test(id);
    values.push(isNumeric ? parseInt(id) : id);

    const whereClause = isNumeric
      ? `quotation_id = $${paramCount}`
      : `quotation_number = $${paramCount}`;

    const query = `
      UPDATE quotations
      SET ${updateFields.join(', ')}
      WHERE ${whereClause}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    return res.status(200).json({
      success: true,
      quotation: result.rows[0],
      message: 'Quotation updated successfully'
    });
  } catch (error) {
    console.error('Error updating quotation:', error);
    return res.status(500).json({ error: 'Failed to update quotation' });
  }
}

// DELETE /api/quotations/[id] - Delete quotation
async function deleteQuotation(id: string, res: NextApiResponse) {
  try {
    // Support both numeric ID and quotation number
    const isNumeric = /^\d+$/.test(id);
    
    const query = isNumeric
      ? `DELETE FROM quotations WHERE quotation_id = $1 RETURNING quotation_number`
      : `DELETE FROM quotations WHERE quotation_number = $1 RETURNING quotation_number`;

    const result = await pool.query(query, [isNumeric ? parseInt(id) : id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quotation not found' });
    }

    return res.status(200).json({
      success: true,
      deletedQuotationNumber: result.rows[0].quotation_number,
      message: 'Quotation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return res.status(500).json({ error: 'Failed to delete quotation' });
  }
}
