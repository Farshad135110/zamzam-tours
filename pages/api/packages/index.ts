import { NextApiRequest, NextApiResponse } from 'next';
import { PackageController } from '../../../lib/controllers/packageController';
import { authMiddleware, AuthRequest } from '../../../src/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET is public (for website display)
    if (req.method === 'GET') {
      const packages = await PackageController.getAll();
      return res.status(200).json(packages);
    }

    // POST requires authentication (admin only)
    if (req.method === 'POST') {
      return authMiddleware(async (authReq: AuthRequest) => {
        const pkg = await PackageController.create(authReq.body);
        return res.status(201).json(pkg);
      })(req, res);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in packages API:', error);
    return res.status(error.message.includes('required') ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
}
