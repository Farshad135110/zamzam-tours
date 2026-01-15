// Script to create admin user with hashed password
const bcrypt = require('bcryptjs');

const userData = {
  username: 'mohamedfarveez77@gmail.com',
  email: 'mohamedfarveez77@gmail.com',
  password: '0766924615@F',
  fullName: 'Mohamed Farveez',
  role: 'admin'
};

async function createAdminUser() {
  console.log('Creating admin user...\n');
  
  // Hash password with bcrypt (10 salt rounds)
  const passwordHash = await bcrypt.hash(userData.password, 10);
  
  console.log('User Details:');
  console.log('=============');
  console.log(`Username: ${userData.username}`);
  console.log(`Email: ${userData.email}`);
  console.log(`Password: ${userData.password}`);
  console.log(`Password Hash: ${passwordHash}`);
  console.log(`Full Name: ${userData.fullName}`);
  console.log(`Role: ${userData.role}`);
  console.log('\n');
  
  // Generate SQL for insertion
  const sql = `
-- Insert admin user into database
INSERT INTO admin_users (username, email, password_hash, full_name, role, is_active, created_at)
VALUES (
  '${userData.username}',
  '${userData.email}',
  '${passwordHash}',
  '${userData.fullName}',
  '${userData.role}',
  true,
  CURRENT_TIMESTAMP
)
ON CONFLICT (username) 
DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  is_active = true;
`;
  
  console.log('SQL Query to Execute:');
  console.log('=====================');
  console.log(sql);
  console.log('\n');
  
  console.log('Instructions:');
  console.log('=============');
  console.log('1. Copy the SQL query above');
  console.log('2. Connect to your PostgreSQL database');
  console.log('3. Execute the SQL query');
  console.log('4. You can now login with:');
  console.log(`   Username: ${userData.username}`);
  console.log(`   Password: ${userData.password}`);
}

createAdminUser().catch(console.error);
