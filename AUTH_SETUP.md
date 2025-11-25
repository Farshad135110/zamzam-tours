# Authentication System

## Setup Complete! ✅

The authentication system has been successfully set up for ZamZam Tours admin panel.

### Default Admin Login
- **URL**: http://localhost:3000/login
- **Username**: `admin`
- **Password**: `Admin@123`

### Features Implemented
- ✅ Secure password hashing with bcrypt
- ✅ JWT token-based authentication
- ✅ HTTP-only cookies for security
- ✅ Protected admin routes
- ✅ Login/logout functionality
- ✅ User session management
- ✅ Role-based access control ready

### Database Table
The `admin_users` table has been created with the following fields:
- user_id (Primary Key)
- username (Unique)
- email (Unique)
- password_hash
- full_name
- role (admin/manager/staff)
- is_active
- created_at
- last_login
- updated_at

### Security Features
1. **Password Hashing**: All passwords are hashed using bcrypt with 10 salt rounds
2. **JWT Tokens**: Secure token-based authentication with 7-day expiry
3. **HTTP-Only Cookies**: Tokens stored in secure cookies to prevent XSS
4. **Protected Routes**: Admin pages require authentication
5. **Session Validation**: Automatic token verification on each request

### API Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info (protected)

### Usage

#### Protecting Admin Pages
All admin pages should be protected. The authentication check is automatic when using the admin panel.

#### Adding New Users
To add more users, you can:
1. Create an admin page for user management
2. Use the database directly with hashed passwords
3. Extend the `setup-auth.js` script

Example to hash a password:
```javascript
const bcrypt = require('bcryptjs');
const password = 'YourPassword123';
const hash = await bcrypt.hash(password, 10);
console.log(hash); // Use this hash in the database
```

### Environment Variables (Optional)
For production, set:
```
JWT_SECRET=your-super-secret-key-here
NODE_ENV=production
```

### Next Steps
1. Test the login at `/login`
2. Access admin dashboard at `/admin`
3. Logout functionality is in the sidebar
4. Change the default admin password after first login

### Important Security Notes
⚠️ **Change the default password immediately in production!**
⚠️ **Set a strong JWT_SECRET in production environment**
⚠️ **Enable HTTPS in production for secure cookie transmission**

### Troubleshooting
- If login fails, check browser console for errors
- Verify the database table was created successfully
- Make sure cookies are enabled in your browser
- Check that the JWT_SECRET is consistent across restarts
