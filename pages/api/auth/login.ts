// API route for user login
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../../../src/lib/auth';

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Query user from database using raw SQL
    const users = await prisma.$queryRaw<any[]>`
      SELECT user_id, username, email, password_hash, full_name, role, is_active
      FROM admin_users
      WHERE username = ${username} AND is_active = true
      LIMIT 1
    `;

    if (!users || users.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Update last login
    await prisma.$executeRaw`
      UPDATE admin_users
      SET last_login = CURRENT_TIMESTAMP
      WHERE user_id = ${user.user_id}
    `;

    // Generate JWT token
    const token = generateToken({
      userId: user.user_id,
      username: user.username,
      email: user.email,
      fullName: user.full_name,
      role: user.role
    });

    // Set HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    );

    return res.status(200).json({
      success: true,
      user: {
        userId: user.user_id,
        username: user.username,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Login failed' });
  }
}
