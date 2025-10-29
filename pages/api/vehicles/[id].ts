import { NextApiRequest, NextApiResponse } from 'next';
import { VehicleController } from '../../../lib/controllers/vehicleController';

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
      const vehicle = await VehicleController.update(id, req.body);
      return res.status(200).json(vehicle);
    }

    if (req.method === 'DELETE') {
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
