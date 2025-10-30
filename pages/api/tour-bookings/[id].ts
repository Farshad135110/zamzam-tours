import type { NextApiRequest, NextApiResponse } from 'next';
import { getTourBooking, editTourBooking, removeTourBooking } from '../../../lib/controllers/tourBookingController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }

  if (req.method === 'GET') {
    try {
      const row = await getTourBooking(id);
      if (!row) return res.status(404).json({ error: 'Booking not found' });
      res.status(200).json(row);
    } catch (error) {
      console.error('Error fetching tour booking:', error);
      res.status(500).json({ error: 'Failed to fetch tour booking' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updated = await editTourBooking(id, req.body);
      if (!updated) return res.status(404).json({ error: 'Booking not found' });
      res.status(200).json(updated);
    } catch (error: any) {
      console.error('Error updating tour booking:', error);
      res.status(400).json({ error: error?.message || 'Failed to update tour booking' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const removed = await removeTourBooking(id);
      if (!removed) return res.status(404).json({ error: 'Booking not found' });
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting tour booking:', error);
      res.status(500).json({ error: 'Failed to delete tour booking' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
