import { NextApiRequest, NextApiResponse } from 'next';
import { PackageController } from '../../../lib/controllers/packageController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Package ID is required' });
  }

  try {
    if (req.method === 'GET') {
      const pkg = await PackageController.getById(id);
      if (!pkg) {
        return res.status(404).json({ error: 'Package not found' });
      }
      return res.status(200).json(pkg);
    }

    if (req.method === 'PUT') {
      const pkg = await PackageController.update(id, req.body);
      return res.status(200).json(pkg);
    }

    if (req.method === 'DELETE') {
      await PackageController.delete(id);
      return res.status(204).end();
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in package API:', error);
    
    if (error.message === 'Package not found') {
      return res.status(404).json({ error: error.message });
    }
    
    return res.status(error.message.includes('required') ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
}
