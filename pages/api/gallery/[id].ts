// API route for individual gallery image operations
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../../src/lib/auth';

const prisma = new PrismaClient();

// GET single image (public)
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const imageId = parseInt(id as string);
    
    const result = await prisma.$queryRaw<any[]>`
      SELECT * FROM gallery_images WHERE image_id = ${imageId}
    `;
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error fetching gallery image:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery image' });
  }
}

// UPDATE image (protected)
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const imageId = parseInt(id as string);
    const { title, location, image_url, alt_text, display_order, is_active } = req.body;
    
    const result = await prisma.$queryRaw<any[]>`
      UPDATE gallery_images 
      SET title = ${title}, location = ${location}, image_url = ${image_url}, alt_text = ${alt_text}, 
          display_order = ${display_order}, is_active = ${is_active}, updated_at = CURRENT_TIMESTAMP
      WHERE image_id = ${imageId}
      RETURNING *
    `;
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Gallery image not found' });
    }
    
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Error updating gallery image:', error);
    return res.status(500).json({ error: 'Failed to update gallery image' });
  }
}

// DELETE image (protected)
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const imageId = parseInt(id as string);
    
    const result = await prisma.$queryRaw<any[]>`
      DELETE FROM gallery_images WHERE image_id = ${imageId} RETURNING *
    `;
    
    if (result.length === 0) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery image:', error);
    return res.status(500).json({ error: 'Failed to delete gallery image' });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'PUT') {
    return authMiddleware(handlePut)(req, res);
  } else if (req.method === 'DELETE') {
    return authMiddleware(handleDelete)(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
