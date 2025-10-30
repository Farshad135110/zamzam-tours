import { NextApiRequest, NextApiResponse } from 'next';
import { getHotel, editHotel, removeHotel } from '../../../lib/controllers/hotelController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid hotel ID' });
  }

  if (req.method === 'GET') {
    try {
      const hotel = await getHotel(id);
      if (hotel) {
        res.status(200).json(hotel);
      } else {
        res.status(404).json({ error: 'Hotel not found' });
      }
    } catch (error) {
      console.error('Error fetching hotel:', error);
      res.status(500).json({ error: 'Failed to fetch hotel' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updated = await editHotel(id, req.body);
      if (updated) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ error: 'Hotel not found' });
      }
    } catch (error: any) {
      console.error('Error updating hotel:', error);
      res.status(400).json({ error: error.message || 'Failed to update hotel' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const removed = await removeHotel(id);
      if (removed) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Hotel not found' });
      }
    } catch (error) {
      console.error('Error deleting hotel:', error);
      res.status(500).json({ error: 'Failed to delete hotel' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
