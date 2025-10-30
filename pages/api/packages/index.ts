import { NextApiRequest, NextApiResponse } from 'next';
import { PackageController } from '../../../lib/controllers/packageController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const packages = await PackageController.getAll();
      return res.status(200).json(packages);
    }

    if (req.method === 'POST') {
      const pkg = await PackageController.create(req.body);
      return res.status(201).json(pkg);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in packages API:', error);
    return res.status(error.message.includes('required') ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
}
