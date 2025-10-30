import { NextApiRequest, NextApiResponse } from 'next';
import { listHotels, addHotel } from '../../../lib/controllers/hotelController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const hotels = await listHotels();
      res.status(200).json(hotels);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      res.status(500).json({ error: 'Failed to fetch hotels' });
    }
  } else if (req.method === 'POST') {
    try {
      const hotel = await addHotel(req.body);
      res.status(201).json(hotel);
    } catch (error: any) {
      console.error('Error creating hotel:', error);
      res.status(400).json({ error: error.message || 'Failed to create hotel' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
