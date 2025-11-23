import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

// This endpoint generates a Cloudinary signature for signed uploads.
// The upload widget will POST `paramsToSign` and expect a JSON response { signature }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { paramsToSign } = req.body || {};
  if (!paramsToSign || typeof paramsToSign !== 'object') {
    return res.status(400).json({ error: 'Missing paramsToSign in request body' });
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!apiSecret) {
    return res.status(500).json({ error: 'CLOUDINARY_API_SECRET not configured on server' });
  }

  try {
    // Build the string to sign by sorting keys alphabetically
    const toSign = Object.keys(paramsToSign)
      .sort()
      .map((k) => `${k}=${paramsToSign[k]}`)
      .join('&');

    const signature = crypto.createHash('sha1').update(toSign + apiSecret).digest('hex');

    return res.status(200).json({ signature });
  } catch (err: any) {
    console.error('Failed to generate Cloudinary signature', err);
    return res.status(500).json({ error: 'Failed to generate signature' });
  }
}
