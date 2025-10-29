import type { NextApiRequest, NextApiResponse } from 'next';
import { listVehicleBookings, addVehicleBooking } from '../../../lib/controllers/vehicleBookingController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const rows = await listVehicleBookings();
      res.status(200).json(rows);
    } catch (error) {
      console.error('Error fetching vehicle bookings:', error);
      res.status(500).json({ error: 'Failed to fetch vehicle bookings' });
    }
  } else if (req.method === 'POST') {
    try {
      const created = await addVehicleBooking(req.body);
      res.status(201).json(created);
    } catch (error: any) {
      console.error('Error creating vehicle booking:', error);
      res.status(400).json({ error: error?.message || 'Failed to create vehicle booking' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
