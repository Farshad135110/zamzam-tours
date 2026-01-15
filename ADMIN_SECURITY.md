# Admin Panel Security Guide

## 🔒 Security Measures Implemented

### 1. Authentication & Authorization

#### JWT-Based Authentication
- **Token Storage**: HTTP-only cookies + localStorage (for client state)
- **Token Expiry**: 7 days
- **Cookie Settings**: 
  - `HttpOnly`: Prevents XSS attacks
  - `SameSite=Lax`: Prevents CSRF attacks
  - `Secure`: HTTPS only in production

#### Protected Routes
- All admin API routes require valid JWT token
- Client-side route protection with `useAuth` hook
- Server-side token verification on every request

### 2. Rate Limiting

**Login Endpoint Protection:**
- Maximum 5 failed attempts per 15 minutes
- Tracked by IP address + username
- Automatic reset on successful login
- Clear error messages with retry time

### 3. Password Security

- Passwords hashed using `bcrypt` (10 salt rounds)
- Password hash stored in database (never plain text)
- Password validation during login
- Failed attempts don't reveal if username exists

### 4. API Route Protection

**Protected Endpoints:**
- `POST /api/packages` - Create package (admin only)
- `PUT /api/packages/[id]` - Update package (admin only)
- `DELETE /api/packages/[id]` - Delete package (admin only)
- `POST /api/hotels` - Create hotel (admin only)
- `POST /api/vehicles` - Create vehicle (admin only)
- `GET /api/quotations` - View all quotations (admin only)

**Public Endpoints:**
- `GET /api/packages` - List packages (website display)
- `GET /api/hotels` - List hotels (website display)
- `POST /api/quotations` - Create quotation (customer request)
- `GET /api/quotations/[id]` - View single quotation (customer link)

### 5. Database Security

- SQL injection prevention using parameterized queries
- No raw SQL with user input concatenation
- PostgreSQL SSL connection in production
- Connection pooling for performance

---

## 🚀 Required Actions for Production

### CRITICAL: Change JWT Secret

**Current Status:** Using default secret (INSECURE for production)

**Action Required:**
1. Open `.env.local` file
2. Add a strong JWT secret:

```env
JWT_SECRET=your-super-secure-random-string-at-least-32-characters-long
```

**Generate a strong secret:**
```bash
# On Windows PowerShell:
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use online generator:
# https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
```

### Environment Variables Checklist

Ensure these are set in production:

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/database?ssl=true

# JWT Authentication
JWT_SECRET=your-secure-random-secret-32-chars-minimum

# Email (Resend)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM=reservation@zamzamlankatours.com
EMAIL_PROVIDER=resend

# Contact
NEXT_PUBLIC_EMAIL=reservation@zamzamlankatours.com
NEXT_PUBLIC_WHATSAPP_NUMBER=94701888993

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dhqhxma30
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default

# Site Config
NEXT_PUBLIC_SITE_URL=https://www.zamzamlankatours.com
NODE_ENV=production
```

### Deployment Security Checklist

- [ ] Update `JWT_SECRET` to strong random value
- [ ] Enable HTTPS (SSL/TLS certificate)
- [ ] Set `NODE_ENV=production`
- [ ] Enable database SSL connection
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable security headers (Helmet.js)
- [ ] Configure rate limiting
- [ ] Set up monitoring/logging
- [ ] Regular security updates

---

## 🛡️ Additional Security Recommendations

### 1. Add Security Headers

Install `helmet` for Next.js:
```bash
npm install helmet
```

Add to `next.config.js`:
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
]

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}
```

### 2. Enable CSRF Protection

For forms, add CSRF tokens:
```typescript
// lib/csrf.ts
import csrf from 'csrf';
const tokens = new csrf();

export function generateCsrfToken() {
  return tokens.create(process.env.CSRF_SECRET!);
}

export function verifyCsrfToken(token: string) {
  return tokens.verify(process.env.CSRF_SECRET!, token);
}
```

### 3. Session Management

Consider adding:
- Session timeout after inactivity
- Force re-authentication for sensitive actions
- Logout on password change
- Device management (track logged-in devices)

### 4. Audit Logging

Log important admin actions:
```typescript
// Log to database or external service
await logAdminAction({
  userId: req.user.userId,
  action: 'DELETE_PACKAGE',
  resourceId: packageId,
  timestamp: new Date(),
  ipAddress: req.headers['x-forwarded-for']
});
```

### 5. Two-Factor Authentication (2FA)

For enhanced security, implement 2FA:
- Use `speakeasy` for TOTP generation
- QR code generation with `qrcode`
- Store 2FA secret encrypted in database

### 6. Regular Security Audits

```bash
# Check for vulnerable dependencies
npm audit

# Fix automatically (if possible)
npm audit fix

# Update dependencies
npm update

# Check for outdated packages
npm outdated
```

---

## 🔐 User Management Best Practices

### Creating Admin Users

Never create users via SQL manually. Use the admin panel or:

```sql
-- Create user with hashed password
INSERT INTO admin_users (username, email, password_hash, full_name, role)
VALUES (
  'newadmin',
  'admin@example.com',
  '$2a$10$hashedPasswordHere',  -- Use bcrypt to hash
  'Admin Name',
  'admin'
);
```

### Password Requirements

Enforce strong passwords:
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers
- Special characters recommended
- No common passwords (password123, admin, etc.)

### User Roles

Current role system:
- `admin`: Full access to all features
- `editor`: Can edit content (future implementation)
- `viewer`: Read-only access (future implementation)

---

## 📊 Monitoring & Alerts

### What to Monitor

1. **Failed Login Attempts**
   - Alert on >10 failed attempts from same IP
   - Track unusual login patterns

2. **API Rate Limits**
   - Monitor 429 errors
   - Alert on sudden spikes

3. **Database Queries**
   - Slow query logging
   - Unusual query patterns

4. **Error Rates**
   - 5xx server errors
   - Authentication failures

### Recommended Tools

- **Monitoring**: Sentry, LogRocket, DataDog
- **Uptime**: UptimeRobot, Pingdom
- **Security**: Snyk, OWASP ZAP

---

## 🚨 Incident Response

### If You Suspect a Security Breach:

1. **Immediately:**
   - Disable affected accounts
   - Rotate JWT secret
   - Force logout all users
   - Review access logs

2. **Investigate:**
   - Check database for unauthorized changes
   - Review server logs
   - Identify entry point

3. **Remediate:**
   - Patch vulnerability
   - Update passwords/secrets
   - Notify affected users
   - Document incident

4. **Prevent:**
   - Apply lessons learned
   - Update security policies
   - Additional monitoring

---

## 📞 Support & Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

**Last Updated:** January 15, 2026
