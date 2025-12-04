import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class AdminUserController {
  static async getAll() {
    try {
      const users = await prisma.$queryRaw<any[]>`
        SELECT user_id, username, email, full_name, role, is_active, last_login, created_at
        FROM admin_users
        ORDER BY created_at DESC
      `;
      
      return users.map(user => ({
        user_id: user.user_id,
        name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.is_active ? 'active' : 'inactive',
        last_login: user.last_login ? new Date(user.last_login).toISOString().slice(0, 16).replace('T', ' ') : 'Never',
        created_at: user.created_at ? new Date(user.created_at).toISOString().slice(0, 10) : ''
      }));
    } catch (error: any) {
      console.error('Error fetching admin users:', error);
      throw new Error(`Failed to fetch admin users: ${error.message}`);
    }
  }

  static async getById(id: number) {
    try {
      const users = await prisma.$queryRaw<any[]>`
        SELECT user_id, username, email, full_name, role, is_active, last_login, created_at
        FROM admin_users
        WHERE user_id = ${id}
        LIMIT 1
      `;
      
      if (!users || users.length === 0) {
        throw new Error('User not found');
      }

      const user = users[0];
      return {
        user_id: user.user_id,
        name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.is_active ? 'active' : 'inactive',
        last_login: user.last_login ? new Date(user.last_login).toISOString().slice(0, 16).replace('T', ' ') : 'Never',
        created_at: user.created_at ? new Date(user.created_at).toISOString().slice(0, 10) : ''
      };
    } catch (error: any) {
      console.error('Error fetching admin user:', error);
      throw new Error(`Failed to fetch admin user: ${error.message}`);
    }
  }

  static async create(data: {
    name: string;
    username?: string;
    email: string;
    password: string;
    role: 'admin' | 'manager' | 'staff';
    status: 'active' | 'inactive';
  }) {
    try {
      // Generate username from name if not provided
      const username = data.username || data.name.toLowerCase().replace(/\s+/g, '.');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const isActive = data.status === 'active';

      // Check if username or email already exists
      const existing = await prisma.$queryRaw<any[]>`
        SELECT user_id FROM admin_users
        WHERE username = ${username} OR email = ${data.email}
        LIMIT 1
      `;

      if (existing && existing.length > 0) {
        throw new Error('Username or email already exists');
      }

      // Insert new user
      await prisma.$executeRaw`
        INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active, created_at)
        VALUES (${username}, ${data.email}, ${hashedPassword}, ${data.name}, ${data.role}, ${isActive}, CURRENT_TIMESTAMP)
      `;

      // Get the created user
      const users = await prisma.$queryRaw<any[]>`
        SELECT user_id, username, email, full_name, role, is_active, created_at
        FROM admin_users
        WHERE username = ${username}
        LIMIT 1
      `;

      if (!users || users.length === 0) {
        throw new Error('Failed to create user');
      }

      const user = users[0];
      return {
        user_id: user.user_id,
        name: user.full_name,
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.is_active ? 'active' : 'inactive',
        last_login: 'Never',
        created_at: user.created_at ? new Date(user.created_at).toISOString().slice(0, 10) : ''
      };
    } catch (error: any) {
      console.error('Error creating admin user:', error);
      throw new Error(`Failed to create admin user: ${error.message}`);
    }
  }

  static async update(id: number, data: {
    name?: string;
    email?: string;
    password?: string;
    role?: 'admin' | 'manager' | 'staff';
    status?: 'active' | 'inactive';
  }) {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      if (data.name !== undefined) {
        updates.push('full_name = $' + (values.length + 1));
        values.push(data.name);
      }
      if (data.email !== undefined) {
        updates.push('email = $' + (values.length + 1));
        values.push(data.email);
      }
      if (data.password !== undefined && data.password !== '') {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        updates.push('password_hash = $' + (values.length + 1));
        values.push(hashedPassword);
      }
      if (data.role !== undefined) {
        updates.push('role = $' + (values.length + 1));
        values.push(data.role);
      }
      if (data.status !== undefined) {
        const isActive = data.status === 'active';
        updates.push('is_active = $' + (values.length + 1));
        values.push(isActive);
      }

      if (updates.length === 0) {
        throw new Error('No fields to update');
      }

      updates.push('updated_at = CURRENT_TIMESTAMP');

      // Build and execute update query
      const query = `UPDATE admin_users SET ${updates.join(', ')} WHERE user_id = $${values.length + 1}`;
      values.push(id);

      await prisma.$executeRawUnsafe(query, ...values);

      // Get updated user
      return await this.getById(id);
    } catch (error: any) {
      console.error('Error updating admin user:', error);
      throw new Error(`Failed to update admin user: ${error.message}`);
    }
  }

  static async delete(id: number) {
    try {
      await prisma.$executeRaw`
        DELETE FROM admin_users
        WHERE user_id = ${id}
      `;
      return { success: true, message: 'User deleted successfully' };
    } catch (error: any) {
      console.error('Error deleting admin user:', error);
      throw new Error(`Failed to delete admin user: ${error.message}`);
    }
  }
}
