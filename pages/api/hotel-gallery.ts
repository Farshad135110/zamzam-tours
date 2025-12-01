// API endpoint for hotel gallery management
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../src/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        return await handleGet(req, res);
      case 'POST':
        return await handlePost(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Hotel gallery API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Get gallery images for a hotel
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const { hotel_id } = req.query;

  if (!hotel_id) {
    return res.status(400).json({ error: 'hotel_id is required' });
  }

  try {
    const result: any = await prisma.$queryRaw`
      SELECT * FROM hotel_gallery 
      WHERE hotel_id = ${hotel_id as string} 
      ORDER BY display_order ASC, created_at DESC
    `;
    return res.status(200).json(result);
  } catch (error) {
    console.error('Get gallery error:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
}

// Add new gallery image
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const { hotel_id, image_url, caption, display_order } = req.body;

  if (!hotel_id || !image_url) {
    return res.status(400).json({ error: 'hotel_id and image_url are required' });
  }

  try {
    const result: any = await prisma.$queryRaw`
      INSERT INTO hotel_gallery (hotel_id, image_url, caption, display_order) 
      VALUES (${hotel_id}, ${image_url}, ${caption || null}, ${display_order || 0}) 
      RETURNING *
    `;
    return res.status(201).json(Array.isArray(result) ? result[0] : result);
  } catch (error) {
    console.error('Add gallery image error:', error);
    return res.status(500).json({ error: 'Failed to add gallery image' });
  }
}

// Delete gallery image
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const { gallery_id } = req.query;

  if (!gallery_id) {
    return res.status(400).json({ error: 'gallery_id is required' });
  }

  try {
    await prisma.$executeRaw`
      DELETE FROM hotel_gallery WHERE gallery_id = ${parseInt(gallery_id as string)}
    `;
    return res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete gallery image error:', error);
    return res.status(500).json({ error: 'Failed to delete gallery image' });
  }
}
