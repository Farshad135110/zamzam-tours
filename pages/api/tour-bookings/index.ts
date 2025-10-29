import type { NextApiRequest, NextApiResponse } from 'next';
import { listTourBookings, addTourBooking } from '../../../lib/controllers/tourBookingController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const rows = await listTourBookings();
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching tour bookings:', error);
      res.status(500).json({ error: 'Failed to fetch tour bookings' });
    }
  } else if (req.method === 'POST') {
    try {
      const created = await addTourBooking(req.body);
      res.status(201).json(created);
    } catch (error: any) {
      console.error('Error creating tour booking:', error);
      res.status(400).json({ error: error?.message || 'Failed to create tour booking' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
