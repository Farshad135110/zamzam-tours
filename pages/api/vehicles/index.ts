import { NextApiRequest, NextApiResponse } from 'next';
import { VehicleController } from '../../../lib/controllers/vehicleController';
import { authMiddleware, AuthRequest } from '../../../src/lib/auth';

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
        const vehicle = await VehicleController.create(authReq.body);
        return res.status(201).json(vehicle);
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
