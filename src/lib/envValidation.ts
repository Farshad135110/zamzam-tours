// Environment variable validation - run at startup
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME',
  'NEXT_PUBLIC_WHATSAPP_NUMBER',
  'NEXT_PUBLIC_EMAIL',
] as const;

const optionalEnvVars = [
  'RESEND_API_KEY',
  'EMAIL_PROVIDER',
  'EMAIL_FROM',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
] as const;

export function validateEnvironment(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join('\n')}\n\n` +
      'Please check your .env.local file or Vercel environment settings.'
    );
  }

  // Check JWT secret strength
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret && jwtSecret.length < 32) {
    warnings.push('JWT_SECRET should be at least 32 characters long for security');
  }

  // Check if using default/weak secrets
  if (jwtSecret === 'your-secret-key' || jwtSecret === 'change-me') {
    throw new Error('JWT_SECRET is using a default value. Please generate a secure random secret.');
  }

  // Check database connection
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl && !dbUrl.includes('ssl') && process.env.NODE_ENV === 'production') {
    warnings.push('DATABASE_URL should use SSL in production (add ?ssl=true or ?sslmode=require)');
  }

  // Check email configuration
  if (!process.env.RESEND_API_KEY && !process.env.SMTP_HOST) {
    warnings.push('No email service configured. Email sending will fail.');
  }

  // Log warnings
  if (warnings.length > 0) {
    console.warn('⚠️  Environment Configuration Warnings:');
    warnings.forEach(warning => console.warn(`   - ${warning}`));
  }

  // Success message
  if (missing.length === 0 && warnings.length === 0) {
    console.log('✅ All required environment variables are configured correctly');
  }
}

// Run validation in development
if (process.env.NODE_ENV !== 'production') {
  try {
    validateEnvironment();
  } catch (error: any) {
    console.error('❌ Environment validation failed:', error.message);
  }
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function getOptionalEnv(key: string, defaultValue: string = ''): string {
  return process.env[key] || defaultValue;
}
