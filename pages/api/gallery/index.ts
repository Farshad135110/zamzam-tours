// API route for gallery images management
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../../../src/lib/auth';

const prisma = new PrismaClient();

// GET all gallery images (public) or POST new image (protected)
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { active } = req.query;
    
    let images;
    
    if (active === 'true') {
      images = await prisma.$queryRaw<any[]>`
        SELECT * FROM gallery_images 
        WHERE is_active = true 
        ORDER BY display_order ASC, created_at DESC
      `;
    } else {
      images = await prisma.$queryRaw<any[]>`
        SELECT * FROM gallery_images 
        ORDER BY display_order ASC, created_at DESC
      `;
    }
    
    return res.status(200).json(images);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return res.status(500).json({ error: 'Failed to fetch gallery images' });
  }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, location, image_url, alt_text, display_order, is_active } = req.body;
    
    console.log('Received POST data:', { title, location, image_url, alt_text, display_order, is_active });
    
    if (!title || !location || !image_url) {
      return res.status(400).json({ error: 'Title, location, and image URL are required' });
    }
    
    const result = await prisma.$queryRaw<any[]>`
      INSERT INTO gallery_images (title, location, image_url, alt_text, display_order, is_active)
      VALUES (${title}, ${location}, ${image_url}, ${alt_text || ''}, ${display_order || 0}, ${is_active !== false})
      RETURNING *
    `;
    
    console.log('Image created successfully:', result[0]);
    return res.status(201).json(result[0]);
  } catch (error: any) {
    console.error('Error creating gallery image:', error);
    console.error('Error details:', error.message);
    return res.status(500).json({ 
      error: 'Failed to create gallery image',
      details: error.message,
      hint: 'Make sure the gallery_images table exists in the database'
    });
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return authMiddleware(handlePost)(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
