import { NextApiRequest, NextApiResponse } from 'next';
import { VehicleController } from '../../../lib/controllers/vehicleController';
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
    if (req.method === 'GET') {
      const vehicle = await VehicleController.getById(id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      return res.status(200).json(vehicle);
    }

    if (req.method === 'PUT') {
      const { images, ...vehicleData } = req.body;
      
      // Update vehicle data
      const vehicle = await VehicleController.update(id, vehicleData);
      
      // Update images if provided
      if (images && Array.isArray(images)) {
        // Delete existing images
        await pool.query('DELETE FROM vehicle_images WHERE vehicle_id = $1', [id]);
        
        // Insert new images
        if (images.length > 0) {
          const insertPromises = images.map((img: any, index: number) => {
            const query = `
              INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order)
              VALUES ($1, $2, $3, $4)
            `;
            return pool.query(query, [
              id,
              img.image_url,
              img.is_primary || false,
              img.display_order || index + 1
            ]);
          });
          await Promise.all(insertPromises);
        }
      }
      
      // Fetch updated vehicle with images
      const updatedVehicle = await VehicleController.getById(id);
      return res.status(200).json(updatedVehicle);
    }

    if (req.method === 'DELETE') {
      // Delete vehicle images first
      await pool.query('DELETE FROM vehicle_images WHERE vehicle_id = $1', [id]);
      // Then delete vehicle
      await VehicleController.delete(id);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in vehicle API:', error);
    
    if (error.message === 'Vehicle not found') {
      return res.status(404).json({ error: error.message });
    }
    
    return res.status(error.message.includes('required') || error.message.includes('Valid') ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
}
