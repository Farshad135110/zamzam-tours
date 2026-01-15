# 🔒 Admin Panel Security - Quick Reference

## ✅ Security Features Implemented

### 1. **API Route Protection**
- ✓ All POST/PUT/DELETE operations require JWT authentication
- ✓ GET requests are public (for website) or protected (for admin data)
- ✓ Token verification on every protected request
- ✓ Automatic 401 Unauthorized response for invalid tokens

### 2. **Login Security**
- ✓ Rate limiting: 5 attempts per 15 minutes
- ✓ Bcrypt password hashing (10 salt rounds)
- ✓ HTTP-only cookies (prevents XSS)
- ✓ SameSite=Lax cookies (prevents CSRF)
- ✓ Secure cookies in production (HTTPS only)
- ✓ 7-day token expiry

### 3. **Client-Side Protection**
- ✓ useAuth hook verifies token with backend
- ✓ Automatic redirect to login if unauthenticated
- ✓ Token validation on every page load
- ✓ Loading state during authentication check

### 4. **Database Security**
- ✓ Parameterized queries (no SQL injection)
- ✓ SSL connection in production
- ✓ Connection pooling
- ✓ Password never stored in plain text

### 5. **JWT Token Security**
- ✓ Strong 48-character random secret
- ✓ Signed tokens with user data
- ✓ 7-day expiration
- ✓ Automatic renewal on login

---

## 🚨 CRITICAL: Before Production Deployment

### Required Actions:

1. **Update JWT Secret in Vercel**
   ```
   Go to Vercel Dashboard → Settings → Environment Variables
   Add: JWT_SECRET = [your-secure-random-string]
   ```

2. **Verify Environment Variables**
   - DATABASE_URL (with SSL)
   - JWT_SECRET (strong random)
   - RESEND_API_KEY
   - NODE_ENV=production

3. **Enable HTTPS**
   - Vercel does this automatically
   - Ensure cookies use Secure flag

4. **Test Security**
   - Try accessing /api/packages without login → Should fail
   - Try 6 failed logins → Should be rate limited
   - Verify admin pages redirect when not logged in

---

## 🔑 Protected API Routes

| Method | Endpoint | Auth Required | Purpose |
|--------|----------|---------------|---------|
| POST | /api/packages | ✅ Yes | Create package |
| PUT | /api/packages/[id] | ✅ Yes | Update package |
| DELETE | /api/packages/[id] | ✅ Yes | Delete package |
| POST | /api/hotels | ✅ Yes | Create hotel |
| POST | /api/vehicles | ✅ Yes | Create vehicle |
| GET | /api/quotations | ✅ Yes | View all quotations |
| GET | /api/packages | ❌ No | Public list |
| POST | /api/quotations | ❌ No | Customer request |

---

## 🛡️ What's Protected

### Admin Panel Pages
- `/admin` - Dashboard
- `/admin/packages` - Tour packages
- `/admin/quotations` - View quotations
- `/admin/vehicles` - Fleet management
- `/admin/hotels` - Hotel management
- `/admin/gallery` - Gallery management
- `/admin/users` - User management
- `/admin/settings` - Settings

**Protection Method:** Client-side useAuth hook + server-side API protection

### Customer-Facing Pages
- `/quotation/[number]` - View quotation (public with unique link)
- All other pages - Public

---

## 🔧 How Authentication Works

1. **Login Flow:**
   ```
   User enters credentials
   → Rate limit check (5 attempts/15 min)
   → Password verification (bcrypt)
   → JWT token generated
   → HTTP-only cookie set
   → Token also sent in response
   → Redirect to /admin
   ```

2. **Protected Request Flow:**
   ```
   Request to /api/packages (POST)
   → authMiddleware checks cookie/header
   → Token extracted
   → Token verified with JWT_SECRET
   → If valid: req.user populated, continue
   → If invalid: 401 Unauthorized
   ```

3. **Page Load Flow:**
   ```
   User visits /admin
   → useAuth hook runs
   → Checks localStorage
   → Calls /api/auth/me with token
   → If valid: Show page
   → If invalid: Redirect to /login
   ```

---

## 📝 Files Modified for Security

| File | Purpose |
|------|---------|
| `src/lib/auth.ts` | JWT generation, verification, middleware |
| `src/lib/rateLimit.ts` | Login rate limiting |
| `src/hooks/useAuth.ts` | Client-side auth hook |
| `pages/api/auth/login.ts` | Login with rate limiting |
| `pages/api/packages/*.ts` | Protected with authMiddleware |
| `pages/api/hotels/*.ts` | Protected with authMiddleware |
| `pages/api/vehicles/*.ts` | Protected with authMiddleware |
| `pages/api/quotations/index.ts` | GET protected, POST public |
| `pages/admin/index.tsx` | Uses useAuth hook |
| `.env.local` | Updated JWT_SECRET |

---

## 🧪 Testing Security

### Test 1: Unauthorized API Access
```bash
curl -X POST http://localhost:3000/api/packages \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Package"}'
  
# Expected: 401 Unauthorized
```

### Test 2: Rate Limiting
```bash
# Try 6 failed logins in a row
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"username":"wrong","password":"wrong"}'
done

# Expected: 6th attempt returns 429 Too Many Requests
```

### Test 3: Token Validation
```bash
# Login and save token
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"correct"}' \
  | jq -r '.token')

# Use token to access protected route
curl -X GET http://localhost:3000/api/quotations \
  -H "Authorization: Bearer $TOKEN"
  
# Expected: Returns quotations data
```

---

## 💡 Security Best Practices

1. **Never Share JWT_SECRET** - It's like the master key
2. **Use HTTPS in Production** - Automatic with Vercel
3. **Strong Passwords** - Minimum 8 characters, mixed case, numbers
4. **Regular Updates** - Run `npm audit` monthly
5. **Monitor Logs** - Check for unusual activity
6. **Backup Database** - Regular automated backups
7. **Limit Admin Users** - Only create necessary accounts
8. **Rotate Secrets** - Change JWT_SECRET if compromised

---

## 📞 Emergency Actions

### If Admin Account Compromised:
1. Change password immediately in database
2. Rotate JWT_SECRET
3. Force logout all users (clears cookies)
4. Review audit logs
5. Check for unauthorized changes

### If JWT_SECRET Leaked:
1. Generate new secret immediately
2. Update in .env.local and Vercel
3. Redeploy application
4. All users will be logged out
5. They'll need to login again

---

**Security Level:** 🔒🔒🔒🔒 (Production Ready)

**Last Updated:** January 15, 2026
