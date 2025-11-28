// Script to create admin_users table and initial admin user
const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const connectionString = 'postgresql://neondb_owner:npg_CA8F0ZVzxgsj@ep-dry-cake-a1u1pa4b-pooler.ap-southeast-1.aws.neon.tech/zamzamtours?sslmode=require';

async function setupAuth() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('Connected to database');

    // Create admin_users table
    console.log('Creating admin_users table...');
    await client.query(`
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
      )
    `);
    console.log('✅ admin_users table created');

    // Create indexes
    console.log('Creating indexes...');
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email)
    `);
    console.log('✅ Indexes created');

    // Hash password
    const password = 'Admin@123';
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert default admin user
    console.log('Creating default admin user...');
    const result = await client.query(`
      INSERT INTO admin_users (username, email, password_hash, full_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (username) DO NOTHING
      RETURNING user_id, username, email, full_name, role
    `, ['admin', 'admin@zamzamtours.com', passwordHash, 'System Administrator', 'admin']);

    if (result.rows.length > 0) {
      console.log('✅ Default admin user created:');
      console.log('   Username: admin');
      console.log('   Password: Admin@123');
      console.log('   Email: admin@zamzamtours.com');
      console.log('   Role: admin');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    console.log('\n🎉 Authentication setup completed successfully!');
    console.log('\n📝 You can now login at: http://localhost:3000/login');
    console.log('   Username: admin');
    console.log('   Password: Admin@123');

  } catch (error) {
    console.error('❌ Error during setup:', error);
    throw error;
  } finally {
    await client.end();
    console.log('Database connection closed');
  }
}

setupAuth().catch(console.error);
