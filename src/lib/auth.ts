// Authentication middleware and utilities
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { logAuditEvent, AUDIT_ACTIONS, RESOURCE_TYPES } from './auditLog';

const JWT_SECRET = process.env.JWT_SECRET || 'zamzam-tours-secret-key-change-in-production';

export interface AuthUser {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthRequest extends NextApiRequest {
  user?: AuthUser;
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      userId: user.userId,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function authMiddleware(
  handler: (req: AuthRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthRequest, res: NextApiResponse) => {
    try {
      // Get token from cookie or Authorization header
      const token = req.cookies.auth_token || 
                   req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        await logAuditEvent(null, AUDIT_ACTIONS.UNAUTHORIZED_ACCESS, RESOURCE_TYPES.AUTH, {
          ipAddress: clientIp as string,
          success: false,
          details: { reason: 'No token provided', path: req.url }
        });
        console.error('No token found in cookies or headers');
        console.log('Cookies:', req.cookies);
        console.log('Headers:', req.headers.authorization);
        return res.status(401).json({ error: 'Authentication required - No token provided' });
      }

      const user = verifyToken(token);
      if (!user) {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        await logAuditEvent(null, AUDIT_ACTIONS.INVALID_TOKEN, RESOURCE_TYPES.AUTH, {
          ipAddress: clientIp as string,
          success: false,
          details: { path: req.url }
        });
        console.error('Invalid token');
        return res.status(401).json({ error: 'Invalid or expired token' });
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication failed' });
    }
  };
}

// Optional: Role-based access control
export function requireRole(roles: string[]) {
  return (handler: (req: AuthRequest, res: NextApiResponse) => Promise<void>) => {
    return authMiddleware(async (req: AuthRequest, res: NextApiResponse) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      return handler(req, res);
    });
  };
}
