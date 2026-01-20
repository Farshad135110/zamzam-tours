// API endpoint for vehicle images
import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Vehicle ID is required' });
  }

  try {
    switch (req.method) {
      case 'GET':
        // Get all images for a vehicle
        const getQuery = `
          SELECT * FROM vehicle_images 
          WHERE vehicle_id = $1 
          ORDER BY is_primary DESC, display_order ASC
        `;
        const getResult = await pool.query(getQuery, [id]);
        return res.status(200).json(getResult.rows);

      case 'POST':
        // Add new images for a vehicle
        const { images } = req.body;
        
        if (!Array.isArray(images) || images.length === 0) {
          return res.status(400).json({ error: 'Images array is required' });
        }

        // Delete existing images
        await pool.query('DELETE FROM vehicle_images WHERE vehicle_id = $1', [id]);

        // Insert new images
        const insertPromises = images.map((img: any, index: number) => {
          const query = `
            INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order)
            VALUES ($1, $2, $3, $4)
            RETURNING *
          `;
          return pool.query(query, [
            id,
            img.image_url,
            img.is_primary || false,
            img.display_order || index + 1
          ]);
        });

        const insertResults = await Promise.all(insertPromises);
        const insertedImages = insertResults.map(r => r.rows[0]);

        return res.status(201).json(insertedImages);

      case 'DELETE':
        // Delete all images for a vehicle
        const deleteQuery = 'DELETE FROM vehicle_images WHERE vehicle_id = $1';
        await pool.query(deleteQuery, [id]);
        return res.status(200).json({ message: 'Images deleted successfully' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error: any) {
    console.error('Error managing vehicle images:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
