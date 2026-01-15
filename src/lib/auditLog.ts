// Audit logging for security-critical actions
import { AuthUser } from './auth';

export interface AuditLogEntry {
  timestamp: Date;
  userId: number;
  username: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  details?: any;
}

// In-memory store (in production, save to database)
const auditLogs: AuditLogEntry[] = [];
const MAX_LOGS = 10000;

export async function logAuditEvent(
  user: AuthUser | null,
  action: string,
  resourceType: string,
  options: {
    resourceId?: string;
    ipAddress?: string;
    userAgent?: string;
    success?: boolean;
    details?: any;
  } = {}
): Promise<void> {
  const entry: AuditLogEntry = {
    timestamp: new Date(),
    userId: user?.userId || 0,
    username: user?.username || 'anonymous',
    action,
    resourceType,
    resourceId: options.resourceId,
    ipAddress: options.ipAddress,
    userAgent: options.userAgent,
    success: options.success ?? true,
    details: options.details,
  };

  // Add to in-memory log
  auditLogs.push(entry);
  
  // Keep only recent logs
  if (auditLogs.length > MAX_LOGS) {
    auditLogs.shift();
  }

  // Log to console in development
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[AUDIT] ${entry.username} - ${action} ${resourceType}${entry.resourceId ? ` #${entry.resourceId}` : ''} - ${entry.success ? 'SUCCESS' : 'FAILED'}`);
  }

  // In production, you should save to database:
  // await prisma.auditLog.create({ data: entry });
}

export function getAuditLogs(limit: number = 100): AuditLogEntry[] {
  return auditLogs.slice(-limit).reverse();
}

export function getAuditLogsByUser(userId: number, limit: number = 100): AuditLogEntry[] {
  return auditLogs
    .filter(log => log.userId === userId)
    .slice(-limit)
    .reverse();
}

// Common audit actions
export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  LOGOUT: 'LOGOUT',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
  
  // Packages
  CREATE_PACKAGE: 'CREATE_PACKAGE',
  UPDATE_PACKAGE: 'UPDATE_PACKAGE',
  DELETE_PACKAGE: 'DELETE_PACKAGE',
  
  // Hotels
  CREATE_HOTEL: 'CREATE_HOTEL',
  UPDATE_HOTEL: 'UPDATE_HOTEL',
  DELETE_HOTEL: 'DELETE_HOTEL',
  
  // Vehicles
  CREATE_VEHICLE: 'CREATE_VEHICLE',
  UPDATE_VEHICLE: 'UPDATE_VEHICLE',
  DELETE_VEHICLE: 'DELETE_VEHICLE',
  
  // Quotations
  VIEW_QUOTATIONS: 'VIEW_QUOTATIONS',
  UPDATE_QUOTATION: 'UPDATE_QUOTATION',
  DELETE_QUOTATION: 'DELETE_QUOTATION',
  
  // Users
  CREATE_USER: 'CREATE_USER',
  UPDATE_USER: 'UPDATE_USER',
  DELETE_USER: 'DELETE_USER',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
  
  // Settings
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // Security
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
} as const;

// Resource types
export const RESOURCE_TYPES = {
  PACKAGE: 'package',
  HOTEL: 'hotel',
  VEHICLE: 'vehicle',
  QUOTATION: 'quotation',
  USER: 'user',
  SETTINGS: 'settings',
  AUTH: 'authentication',
} as const;
