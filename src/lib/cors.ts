// CORS configuration for API routes
import { NextApiRequest, NextApiResponse } from 'next';

const allowedOrigins = [
  'https://www.zamzamlankatours.com',
  'https://zamzamlankatours.com',
  process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
];

// Development: allow localhost
if (process.env.NODE_ENV === 'development') {
  allowedOrigins.push('http://localhost:3000');
  allowedOrigins.push('http://localhost:3001');
}

export function cors(req: NextApiRequest, res: NextApiResponse): boolean {
  const origin = req.headers.origin;

  // Check if origin is allowed
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  // Allow credentials (cookies)
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Allowed methods
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // Allowed headers
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, Content-Type, Authorization, Cookie'
  );

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }

  return false;
}

// Middleware wrapper to apply CORS
export function withCors(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Apply CORS headers
    const isPreflight = cors(req, res);
    
    // If preflight, we already sent response
    if (isPreflight) {
      return;
    }

    // Continue to actual handler
    return handler(req, res);
  };
}
