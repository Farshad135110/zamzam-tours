import { NextApiRequest, NextApiResponse } from 'next';
import { getPickup, editPickup, removePickup } from '../../../lib/controllers/airportPickupController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const pickup = await getPickup(String(id));
      if (pickup) {
        res.status(200).json(pickup);
      } else {
        res.status(404).json({ error: 'Pickup not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch pickup' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updated = await editPickup(String(id), req.body);
      if (updated) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ error: 'Pickup not found' });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message || 'Failed to update pickup' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const removed = await removePickup(String(id));
      if (removed) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Pickup not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete pickup' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
