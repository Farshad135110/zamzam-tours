import { NextApiRequest, NextApiResponse } from 'next';
import { listPickups, addPickup } from '../../../lib/controllers/airportPickupController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const pickups = await listPickups();
      res.status(200).json(pickups);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch airport pickups' });
    }
  } else if (req.method === 'POST') {
    try {
      const pickup = await addPickup(req.body);
      res.status(201).json(pickup);
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to create airport pickup' });
    }
  }
}
