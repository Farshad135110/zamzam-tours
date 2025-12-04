import { NextApiRequest, NextApiResponse } from 'next';
import { SettingsController } from '../../lib/controllers/settingsController';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const settings = await SettingsController.getAll();
      return res.status(200).json(settings);
    }

    if (req.method === 'PUT') {
      const settings = await SettingsController.update(req.body);
      return res.status(200).json({ 
        success: true, 
        message: 'Settings updated successfully',
        settings 
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Error in settings API:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error'
    });
  }
}
