// pages/api/sitemap.xml.ts
import { NextApiRequest, NextApiResponse } from 'next';

const WEBSITE_URL = 'https://www.zamzamlankatours.com';

// Static pages
const staticPages = [
  '',
  '/about',
  '/contact',
  '/tours',
  '/activities',
  '/destinations',
  '/car-rental',
  '/fleet',
  '/airport-transfer',
  '/hotels',
  '/gallery',
];

// Activity pages
const activities = [
  'wildlife-safaris',
  'hiking-trekking',
  'cultural-tours',
  'beach-activities',
  'tea-plantation-tours',
  'whale-watching',
  'surfing',
  'scuba-diving',
  'train-journeys',
  'bird-watching',
  'white-water-rafting',
  'ayurvedic-spa',
  'cooking-classes',
  'photography-tours',
  'cycling-tours',
  'rock-climbing',
  'snorkeling',
  'temple-visits',
  'camping',
  'zip-lining',
];

// Destination pages
const destinations = [
  'colombo',
  'kandy',
  'ella',
  'sigiriya',
  'galle',
  'nuwara-eliya',
  'yala',
  'mirissa',
  'trincomalee',
  'arugam-bay',
];

function generateSiteMap() {
  const currentDate = new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  
  ${staticPages
    .map((page) => {
      return `
    <url>
      <loc>${WEBSITE_URL}${page}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
      <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>`;
    })
    .join('')}
  
  ${activities
    .map((activity) => {
      return `
    <url>
      <loc>${WEBSITE_URL}/activities/${activity}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`;
    })
    .join('')}
  
  ${destinations
    .map((destination) => {
      return `
    <url>
      <loc>${WEBSITE_URL}/destinations/${destination}</loc>
      <lastmod>${currentDate}</lastmod>
      <changefreq>monthly</changefreq>
      <priority>0.7</priority>
    </url>`;
    })
    .join('')}
</urlset>`;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Content-Type', 'text/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate');
  
  const sitemap = generateSiteMap();
  res.status(200).send(sitemap);
}
