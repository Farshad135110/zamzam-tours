import { NextApiRequest, NextApiResponse } from 'next';
import { AdminUserController } from '../../../lib/controllers/adminUserController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const userId = parseInt(id as string);

  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    if (req.method === 'GET') {
      const user = await AdminUserController.getById(userId);
      return res.status(200).json(user);
    }

    if (req.method === 'PUT') {
      const { name, email, password, role, status } = req.body;
      
      const user = await AdminUserController.update(userId, {
        name,
        email,
        password,
        role,
        status
      });
      
      return res.status(200).json(user);
    }

    if (req.method === 'DELETE') {
      await AdminUserController.delete(userId);
      return res.status(200).json({ success: true, message: 'User deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in admin-users API:', error);
    
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
