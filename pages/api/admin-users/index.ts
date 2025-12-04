import { NextApiRequest, NextApiResponse } from 'next';
import { AdminUserController } from '../../../lib/controllers/adminUserController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const users = await AdminUserController.getAll();
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const { name, email, password, role, status } = req.body;
      
      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Name, email, password, and role are required' });
      }

      const user = await AdminUserController.create({
        name,
        email,
        password,
        role,
        status: status || 'active'
      });
      
      return res.status(201).json(user);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in admin-users API:', error);
    return res.status(error.message.includes('required') || error.message.includes('already exists') ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
}
