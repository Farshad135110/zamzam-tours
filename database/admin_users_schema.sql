-- Admin Users Table for Authentication

CREATE TABLE IF NOT EXISTS admin_users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'manager', 'staff')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Insert default admin user (password: Admin@123)
-- Password is hashed using bcrypt
INSERT INTO admin_users (username, email, password_hash, full_name, role)
VALUES (
    'admin',
    'admin@zamzamtours.com',
    '$2a$10$rZJ5kYxGfOhUqYvKJjvX9.FWvXZQqJWHLGOJHHVYYqWxLvXN5L3Aq',
    'System Administrator',
    'admin'
)
ON CONFLICT (username) DO NOTHING;
