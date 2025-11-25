// API route to get current authenticated user
import type { NextApiResponse } from 'next';
import { AuthRequest, authMiddleware } from '../../../src/lib/auth';

async function handler(req: AuthRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  return res.status(200).json({
    success: true,
    user: req.user
  });
}

export default authMiddleware(handler);
