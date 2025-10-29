import { NextApiRequest, NextApiResponse } from 'next';
import { getHotelBooking, editHotelBooking, removeHotelBooking } from '../../../lib/controllers/hotelBookingController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid booking ID' });
  }

  if (req.method === 'GET') {
    try {
      const booking = await getHotelBooking(id);
      if (booking) {
        res.status(200).json(booking);
      } else {
        res.status(404).json({ error: 'Booking not found' });
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      res.status(500).json({ error: 'Failed to fetch booking' });
    }
  } else if (req.method === 'PUT') {
    try {
      const updated = await editHotelBooking(id, req.body);
      if (updated) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ error: 'Booking not found' });
      }
    } catch (error: any) {
      console.error('Error updating booking:', error);
      res.status(400).json({ error: error.message || 'Failed to update booking' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const removed = await removeHotelBooking(id);
      if (removed) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Booking not found' });
      }
    } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ error: 'Failed to delete booking' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
