// Direct database update script - Execute admin user creation
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const userData = {
  username: 'mohamedfarveez77@gmail.com',
  email: 'mohamedfarveez77@gmail.com',
  password: '0766924615@F',
  fullName: 'Mohamed Farveez',
  role: 'admin'
};

async function createOrUpdateAdmin() {
  try {
    console.log('Connecting to database...\n');
    
    // Hash password
    const passwordHash = await bcrypt.hash(userData.password, 10);
    console.log('Password hashed successfully\n');
    
    // Insert or update user
    const query = `
      INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active, created_at)
      VALUES ($1, $2, $3, $4, $5, true, CURRENT_TIMESTAMP)
      ON CONFLICT (username) 
      DO UPDATE SET 
        password_hash = EXCLUDED.password_hash,
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        is_active = true,
        updated_at = CURRENT_TIMESTAMP
      RETURNING user_id, username, email, full_name, role, created_at;
    `;
    
    const result = await pool.query(query, [
      userData.username,
      userData.email,
      passwordHash,
      userData.fullName,
      userData.role
    ]);
    
    console.log('✅ Admin user created/updated successfully!\n');
    console.log('User Details:');
    console.log('=============');
    console.log('User ID:', result.rows[0].user_id);
    console.log('Username:', result.rows[0].username);
    console.log('Email:', result.rows[0].email);
    console.log('Full Name:', result.rows[0].full_name);
    console.log('Role:', result.rows[0].role);
    console.log('Created At:', result.rows[0].created_at);
    console.log('\n');
    
    console.log('Login Credentials:');
    console.log('==================');
    console.log('Username/Email:', userData.username);
    console.log('Password:', userData.password);
    console.log('\n');
    console.log('🎉 You can now login at: http://localhost:3000/login');
    console.log('   or: https://www.zamzamlankatours.com/login');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('\nDatabase connection failed. Please check:');
      console.error('1. DATABASE_URL is correct in .env.local');
      console.error('2. Database server is running');
      console.error('3. Network connection is available');
    }
  } finally {
    await pool.end();
  }
}

createOrUpdateAdmin();
