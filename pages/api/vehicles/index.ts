import { NextApiRequest, NextApiResponse } from 'next';
import { VehicleController } from '../../../lib/controllers/vehicleController';
import { authMiddleware, AuthRequest } from '../../../src/lib/auth';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET is public
    if (req.method === 'GET') {
      const vehicles = await VehicleController.getAll();
      return res.status(200).json(vehicles);
    }

    // POST requires authentication
    if (req.method === 'POST') {
      return authMiddleware(async (authReq: AuthRequest) => {
        const { images, ...vehicleData } = authReq.body;
        
        // Create vehicle
        const vehicle = await VehicleController.create(vehicleData);
        
        // Add images if provided
        if (images && Array.isArray(images) && images.length > 0) {
          const insertPromises = images.map((img: any, index: number) => {
            const query = `
              INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, display_order)
              VALUES ($1, $2, $3, $4)
            `;
            return pool.query(query, [
              vehicle.vehicle_id,
              img.image_url,
              img.is_primary || false,
              img.display_order || index + 1
            ]);
          });
          await Promise.all(insertPromises);
        }
        
        // Fetch created vehicle with images
        const createdVehicle = await VehicleController.getById(vehicle.vehicle_id);
        return res.status(201).json(createdVehicle);
      })(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in vehicles API:', error);
    return res.status(error.message.includes('required') || error.message.includes('Valid') ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
}
