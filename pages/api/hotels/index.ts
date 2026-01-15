import { NextApiRequest, NextApiResponse } from 'next';
import { listHotels, addHotel } from '../../../lib/controllers/hotelController';
import { authMiddleware, AuthRequest } from '../../../src/lib/auth';

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
    // Protect POST with authentication
    return authMiddleware(async (authReq: AuthRequest) => {
      try {
        console.log('Received hotel data:', authReq.body);
        const hotel = await addHotel(authReq.body);
        console.log('Hotel created successfully:', hotel);
        res.status(201).json(hotel);
      } catch (error: any) {
        console.error('Error creating hotel:', error);
        console.error('Error stack:', error.stack);
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          meta: error.meta
        });
        res.status(400).json({ 
          error: error.message || 'Failed to create hotel',
          details: error.code || 'Unknown error'
        });
      }
    })(req, res);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
