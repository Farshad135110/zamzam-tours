import { NextApiRequest, NextApiResponse } from 'next';
import { listHotelBookings, addHotelBooking } from '../../../lib/controllers/hotelBookingController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const bookings = await listHotelBookings();
      res.status(200).json(bookings);
    } catch (error) {
      console.error('Error fetching hotel bookings:', error);
      res.status(500).json({ error: 'Failed to fetch hotel bookings' });
    }
  } else if (req.method === 'POST') {
    try {
      const booking = await addHotelBooking(req.body);
      res.status(201).json(booking);
    } catch (error: any) {
      console.error('Error creating hotel booking:', error);
      res.status(400).json({ error: error.message || 'Failed to create hotel booking' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
